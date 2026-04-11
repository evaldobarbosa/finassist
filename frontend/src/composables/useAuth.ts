import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api, ApiError } from '@/lib/api'
import { redirectAfterLogin } from '@/router/guards'
import type { User } from '@/types'

interface OtpRequestResponse {
  message: string
  phone: string
  expires_in: number
}

interface OtpVerifyResponse {
  message: string
  user: User & { is_new: boolean }
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

  async function requestVerificationCode(phoneNumber: string): Promise<OtpRequestResponse> {
    const normalizedPhone = phoneNumber.replace(/\D/g, '')
    const response = await api.post<OtpRequestResponse>('/auth/otp/request', {
      phone: normalizedPhone,
    })
    return response
  }

  async function verifyCode(phoneNumber: string, code: string): Promise<OtpVerifyResponse> {
    const normalizedPhone = phoneNumber.replace(/\D/g, '')
    const response = await api.post<OtpVerifyResponse>('/auth/otp/verify', {
      phone: normalizedPhone,
      code,
    })

    // Set auth state
    authStore.setPhone(normalizedPhone)
    authStore.setUser(response.user)

    return response
  }

  async function login(phoneNumber: string, code: string): Promise<void> {
    const response = await verifyCode(phoneNumber, code)

    const redirect = route.query.redirect as string | undefined
    router.push(redirectAfterLogin(redirect))
  }

  async function resendCode(phoneNumber: string): Promise<OtpRequestResponse> {
    const normalizedPhone = phoneNumber.replace(/\D/g, '')
    const response = await api.post<OtpRequestResponse>('/auth/otp/resend', {
      phone: normalizedPhone,
    })
    return response
  }

  async function register(data: {
    phone: string
    name: string
    email?: string
  }): Promise<void> {
    // In OTP flow, registration happens automatically on first login
    // Just redirect to dashboard after verify
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
    resendCode,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
  }
}
