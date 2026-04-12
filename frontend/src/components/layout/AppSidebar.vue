<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Tags,
  CreditCard,
  Repeat,
  Settings,
  type LucideIcon,
} from 'lucide-vue-next'

const route = useRoute()

interface NavItem {
  name: string
  path: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transacoes', path: '/transactions', icon: Receipt },
  { name: 'Contas', path: '/accounts', icon: Wallet },
  { name: 'Categorias', path: '/categories', icon: Tags },
  { name: 'Cartoes', path: '/credit-cards', icon: CreditCard },
  { name: 'Recorrencias', path: '/recurrences', icon: Repeat },
  { name: 'Configuracoes', path: '/settings', icon: Settings },
]

const currentPath = computed(() => route.path)

function isActive(path: string): boolean {
  return currentPath.value === path
}
</script>

<template>
  <aside class="fixed left-0 top-0 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant z-50">
    <!-- Logo -->
    <div class="h-16 px-6 flex items-center border-b border-outline-variant">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">F</span>
        </div>
        <span class="text-xl font-bold text-primary">FinAssistant</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="p-4">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.path">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              isActive(item.path)
                ? 'bg-primary text-white shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            ]"
          >
            <component
              :is="item.icon"
              class="h-5 w-5"
              :class="isActive(item.path) ? '' : 'opacity-70'"
            />
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-outline-variant">
      <div class="text-xs text-on-surface-variant text-center">
        FinAssistant v1.0.0
      </div>
    </div>
  </aside>
</template>
