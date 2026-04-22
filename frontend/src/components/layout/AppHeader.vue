<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Search } from 'lucide-vue-next'

const route = useRoute()

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Visao geral das suas financas' },
  '/transactions': { title: 'Extrato', subtitle: 'Historico de transacoes' },
  '/accounts': { title: 'Contas', subtitle: 'Gerencie suas contas' },
  '/credit-cards': { title: 'Cartoes', subtitle: 'Seus cartoes de credito' },
  '/categories': { title: 'Categorias', subtitle: 'Organize suas transacoes' },
  '/recurrences': { title: 'Recorrencias', subtitle: 'Transacoes recorrentes' },
  '/settings': { title: 'Configuracoes', subtitle: 'Preferencias da conta' },
}

const pageInfo = computed(() => {
  return pageTitles[route.path] || { title: 'FinAssistant' }
})
</script>

<template>
  <header class="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-surface-container-lowest border-b border-outline-variant z-40">
    <div class="h-full px-4 lg:px-6 flex items-center justify-between">
      <!-- Mobile Logo -->
      <div class="lg:hidden">
        <span class="text-xl font-bold text-primary">FinAssistant</span>
      </div>

      <!-- Page Title (Desktop) -->
      <div class="hidden lg:block">
        <h1 class="text-lg font-semibold text-on-surface">{{ pageInfo.title }}</h1>
        <p v-if="pageInfo.subtitle" class="text-sm text-on-surface-variant">{{ pageInfo.subtitle }}</p>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-2">
        <!-- Search button -->
        <button class="p-2 rounded-lg hover:bg-surface-container transition">
          <Search class="h-5 w-5 text-on-surface-variant" />
        </button>

        <!-- Notifications -->
        <button class="relative p-2 rounded-lg hover:bg-surface-container transition">
          <Bell class="h-5 w-5 text-on-surface-variant" />
          <!-- Notification badge -->
          <span class="absolute top-1 right-1 h-2 w-2 bg-tertiary rounded-full"></span>
        </button>
      </div>
    </div>
  </header>
</template>
