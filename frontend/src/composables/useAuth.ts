import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api, ApiError } from '@/lib/api'
import { redirectAfterLogin } from '@/router/guards'
import type { User } from '@/types'

interface AuthResponse {
  user: User
  token?: string
}

interface VerifyCodeResponse {
  user?: User
  verified: boolean
}

export function useAuth() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const phone = computed(() => authStore.phone)
  const userName = computed(() => authStore.userName)
  const userInitials = computed(() => authStore.userInitials)

  async function requestVerificationCode(phoneNumber: string): Promise<void> {
    const normalizedPhone = phoneNumber.replace(/\D/g, '')
    await api.post('/auth/request-code', { phone: normalizedPhone })
  }

  async function verifyCode(phoneNumber: string, code: string): Promise<VerifyCodeResponse> {
    const normalizedPhone = phoneNumber.replace(/\D/g, '')
    const response = await api.post<VerifyCodeResponse>('/auth/verify-code', {
      phone: normalizedPhone,
      code,
    })
    return response
  }

  async function login(phoneNumber: string, code: string): Promise<void> {
    const normalizedPhone = phoneNumber.replace(/\D/g, '')

    const response = await api.post<AuthResponse>('/auth/login', {
      phone: normalizedPhone,
      code,
    })

    authStore.setPhone(normalizedPhone)
    if (response.user) {
      authStore.setUser(response.user)
    }

    const redirect = route.query.redirect as string | undefined
    router.push(redirectAfterLogin(redirect))
  }

  async function register(data: {
    phone: string
    name: string
    email?: string
  }): Promise<void> {
    const normalizedPhone = data.phone.replace(/\D/g, '')

    const response = await api.post<AuthResponse>('/auth/register', {
      phone: normalizedPhone,
      name: data.name,
      email: data.email,
    })

    authStore.setPhone(normalizedPhone)
    if (response.user) {
      authStore.setUser(response.user)
    }

    router.push({ name: 'dashboard' })
  }

  function logout(): void {
    authStore.logout()
    router.push({ name: 'login' })
  }

  async function fetchCurrentUser(): Promise<void> {
    if (!authStore.phone) return

    try {
      const userData = await api.get<User>('/users/me')
      authStore.setUser(userData)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        authStore.logout()
      }
    }
  }

  async function updateProfile(updates: Partial<User>): Promise<void> {
    const userData = await api.patch<User>('/users/me', updates)
    authStore.setUser(userData)
  }

  return {
    isAuthenticated,
    user,
    phone,
    userName,
    userInitials,
    requestVerificationCode,
    verifyCode,
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
  }
}
