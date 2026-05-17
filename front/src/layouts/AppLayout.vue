<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)

const menuItems = [
  { name: 'Dashboard', icon: 'dashboard', route: 'dashboard', path: '/' },
  { name: 'Transações', icon: 'receipt_long', route: 'transactions', path: '/transactions' },
  { name: 'Contas', icon: 'account_balance', route: 'accounts', path: '/accounts' },
  { name: 'Categorias', icon: 'label', route: 'categories', path: '/categories' },
  { name: 'Cartões de Crédito', icon: 'credit_card', route: 'credit-cards', path: '/credit-cards' },
  { name: 'Configurações', icon: 'settings', route: 'settings', path: '/settings' },
]

const currentPageTitle = computed(() => {
  const item = menuItems.find(item => item.route === route.name)
  return item?.name || 'Dashboard'
})

const isActive = (routeName: string) => route.name === routeName

const navigateTo = (path: string) => {
  router.push(path)
  sidebarOpen.value = false
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="bg-background text-on-background min-h-screen flex">
    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 h-screen bg-white z-50 flex flex-col py-6 space-y-2 border-r border-slate-100 w-[240px] transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="px-6 mb-8 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
        </div>
        <div>
          <h1 class="text-lg font-bold text-primary leading-none">FinAssistant</h1>
          <p class="text-[0.6875rem] font-medium text-slate-400 mt-1 uppercase tracking-wider">Gestão Financeira</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 space-y-1">
        <a
          v-for="item in menuItems"
          :key="item.route"
          :class="[
            'flex items-center px-4 py-3 cursor-pointer duration-200 ease-in-out rounded-lg',
            isActive(item.route)
              ? 'text-primary font-bold bg-primary/5 border-r-4 border-primary'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          ]"
          @click="navigateTo(item.path)"
        >
          <span class="material-symbols-outlined mr-3">{{ item.icon }}</span>
          <span class="text-sm">{{ item.name }}</span>
        </a>
      </nav>

      <!-- Plan Info -->
      <div class="px-6 mt-auto">
        <div class="p-4 bg-surface-container-low rounded-xl">
          <p class="text-[0.6875rem] font-bold text-slate-500 uppercase mb-2">Plano Atual</p>
          <p class="text-sm font-semibold text-primary">Premium</p>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 md:ml-[240px] flex flex-col min-h-screen">
      <!-- Header -->
      <header class="h-16 w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 md:px-8">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Button -->
          <button
            class="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-full"
            @click="sidebarOpen = true"
          >
            <span class="material-symbols-outlined">menu</span>
          </button>

          <h2 class="text-xl font-bold tracking-tight text-primary">{{ currentPageTitle }}</h2>
          <span class="hidden sm:inline text-slate-300">|</span>
          <p class="hidden sm:inline text-sm text-slate-500">Bem-vindo, {{ authStore.user?.name || 'Usuário' }}</p>
        </div>

        <div class="flex items-center space-x-2 md:space-x-4">
          <button class="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <button
            class="flex items-center gap-2 p-1 pr-3 text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
            @click="navigateTo('/settings')"
          >
            <span class="material-symbols-outlined text-3xl">account_circle</span>
            <span class="hidden sm:inline text-sm font-medium">Meu Perfil</span>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        <slot />
      </div>
    </main>

    <!-- FAB -->
    <div class="fixed bottom-8 right-8 z-50">
      <button class="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-200">
        <span class="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.editorial-shadow {
  box-shadow: 0px 24px 48px -12px rgba(20, 27, 43, 0.08);
}
</style>
