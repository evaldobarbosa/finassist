import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthPage = to.name === 'login' || to.name === 'register'

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if trying to access protected route
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (isAuthPage && authStore.isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next({ name: 'dashboard' })
  } else {
    next()
  }
}

export function redirectAfterLogin(redirect?: string) {
  if (redirect && redirect !== '/login' && redirect !== '/register') {
    return redirect
  }
  return '/'
}
