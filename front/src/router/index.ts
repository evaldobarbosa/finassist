import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // Landing page (public)
  {
    path: '/',
    name: 'landing',
    component: () => import('@/pages/landing/LandingPage.vue'),
    meta: { layout: 'landing', requiresAuth: false }
  },

  // Auth routes
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { layout: 'auth', requiresAuth: false }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/pages/auth/SignupPage.vue'),
    meta: { layout: 'auth', requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/pages/auth/ResetPasswordPage.vue'),
    meta: { layout: 'auth', requiresAuth: false }
  },

  // Billing routes
  {
    path: '/plans',
    name: 'plans',
    component: () => import('@/pages/billing/PlansPage.vue'),
    meta: { layout: 'auth', requiresAuth: true }
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import('@/pages/billing/PaymentPage.vue'),
    meta: { layout: 'auth', requiresAuth: true }
  },

  // App routes
  {
    path: '/app',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/DashboardPage.vue'),
    meta: { layout: 'app', requiresAuth: true }
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/pages/transactions/TransactionsPage.vue'),
    meta: { layout: 'app', requiresAuth: true }
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('@/pages/accounts/AccountsPage.vue'),
    meta: { layout: 'app', requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/pages/categories/CategoriesPage.vue'),
    meta: { layout: 'app', requiresAuth: true }
  },
  {
    path: '/credit-cards',
    name: 'credit-cards',
    component: () => import('@/pages/credit-cards/CreditCardsPage.vue'),
    meta: { layout: 'app', requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/settings/SettingsPage.vue'),
    meta: { layout: 'app', requiresAuth: true }
  },

  // Catch all - redirect to app if authenticated, landing otherwise
  {
    path: '/:pathMatch(.*)*',
    redirect: '/app'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (isAuthenticated && (to.name === 'login' || to.name === 'signup' || to.name === 'landing')) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
