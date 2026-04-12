<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-vue-next'

const route = useRoute()

interface NavItem {
  name: string
  path: string
  icon: LucideIcon
  matchPaths?: string[]
}

const navItems: NavItem[] = [
  { name: 'Inicio', path: '/', icon: LayoutDashboard },
  { name: 'Transacoes', path: '/transactions', icon: Receipt },
  { name: 'Contas', path: '/accounts', icon: Wallet },
  { name: 'Mais', path: '/settings', icon: MoreHorizontal, matchPaths: ['/settings', '/categories', '/credit-cards', '/recurrences'] },
]

const currentPath = computed(() => route.path)

function isActive(item: NavItem): boolean {
  if (item.matchPaths) {
    return item.matchPaths.includes(currentPath.value)
  }
  return currentPath.value === item.path
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant z-50 safe-area-pb">
    <ul class="h-full flex items-center justify-around px-2">
      <li v-for="item in navItems" :key="item.path" class="flex-1">
        <router-link
          :to="item.path"
          :class="[
            'flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all duration-200',
            isActive(item)
              ? 'text-primary'
              : 'text-on-surface-variant'
          ]"
        >
          <div
            :class="[
              'p-1 rounded-full transition-all duration-200',
              isActive(item) ? 'bg-primary-fixed' : ''
            ]"
          >
            <component
              :is="item.icon"
              class="h-5 w-5"
            />
          </div>
          <span class="text-xs font-medium">{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
