import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api, ApiError } from '@/lib/api'
import { redirectAfterLogin } from '@/router/guards'
import type { User, AuthResponse, LoginCredentials, RegisterData } from '@/types'

interface MessageResponse {
  message: string
}

interface UserResponse {
  user: User
}

export function useAuth() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const token = computed(() => authStore.token)
  const userName = computed(() => authStore.userName)
  const userInitials = computed(() => authStore.userInitials)

  async function login(credentials: LoginCredentials): Promise<void> {
    const response = await api.post<AuthResponse>('/auth/login', credentials)

    authStore.setAuth(response.token, response.user)

    const redirect = route.query.redirect as string | undefined
    router.push(redirectAfterLogin(redirect))
  }

  async function register(data: RegisterData): Promise<void> {
    const response = await api.post<AuthResponse>('/auth/register', data)

    authStore.setAuth(response.token, response.user)

    router.push({ name: 'dashboard' })
  }

  async function logout(): Promise<void> {
    try {
      await api.post<MessageResponse>('/auth/logout')
    } catch {
      // Ignore errors, clear local state anyway
    }

    authStore.logout()
    router.push({ name: 'login' })
  }

  async function forgotPassword(email: string): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/forgot-password', { email })
    return response
  }

  async function resetPassword(data: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/reset-password', data)
    return response
  }

  async function resendVerification(): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/resend-verification')
    return response
  }

  async function fetchCurrentUser(): Promise<void> {
    if (!authStore.token) return

    try {
      const response = await api.get<UserResponse>('/user')
      authStore.setUser(response.user)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        authStore.logout()
      }
    }
  }

  async function updateProfile(updates: Partial<User>): Promise<void> {
    const response = await api.put<UserResponse>('/user/profile', updates)
    authStore.setUser(response.user)
  }

  async function updatePassword(data: {
    current_password: string
    password: string
    password_confirmation: string
  }): Promise<MessageResponse> {
    const response = await api.put<MessageResponse>('/user/password', data)
    return response
  }

  return {
    isAuthenticated,
    user,
    token,
    userName,
    userInitials,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    resendVerification,
    fetchCurrentUser,
    updateProfile,
    updatePassword,
  }
}
