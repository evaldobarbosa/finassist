import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false, title: 'Entrar' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresAuth: false, title: 'Criar conta' }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { requiresAuth: false, title: 'Recuperar senha' }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { requiresAuth: false, title: 'Redefinir senha' }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, title: 'Dashboard' }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/TransactionsView.vue'),
      meta: { requiresAuth: true, title: 'Transacoes' }
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('@/views/AccountsView.vue'),
      meta: { requiresAuth: true, title: 'Contas' }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/CategoriesView.vue'),
      meta: { requiresAuth: true, title: 'Categorias' }
    },
    {
      path: '/credit-cards',
      name: 'credit-cards',
      component: () => import('@/views/CreditCardsView.vue'),
      meta: { requiresAuth: true, title: 'Cartoes de Credito' }
    },
    {
      path: '/recurrences',
      name: 'recurrences',
      component: () => import('@/views/RecurrencesView.vue'),
      meta: { requiresAuth: true, title: 'Recorrencias' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true, title: 'Configuracoes' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Navigation guard
router.beforeEach(authGuard)

// Update document title
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} | FinAssistant` : 'FinAssistant'
})

export default router
