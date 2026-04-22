<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Tags,
  CreditCard,
  Repeat,
  User,
  LogOut,
  ChevronUp,
  type LucideIcon,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

interface NavItem {
  name: string
  path: string
  icon: LucideIcon
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Extrato', path: '/transactions', icon: Receipt },
  { name: 'Recorrencias', path: '/recurrences', icon: Repeat },
]

const secondaryNavItems: NavItem[] = [
  { name: 'Contas', path: '/accounts', icon: Wallet },
  { name: 'Cartoes', path: '/credit-cards', icon: CreditCard },
  { name: 'Categorias', path: '/categories', icon: Tags },
]

const currentPath = computed(() => route.path)

function isActive(path: string): boolean {
  return currentPath.value === path
}

const userInitials = computed(() => {
  if (authStore.user?.name) {
    return authStore.user.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
  return 'U'
})

const userName = computed(() => authStore.user?.name || 'Usuario')
const userPhone = computed(() => {
  const phone = authStore.user?.phone || ''
  if (phone.length >= 11) {
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length === 13) {
      return `+${cleanPhone.slice(0, 2)} (${cleanPhone.slice(2, 4)}) ${cleanPhone.slice(4, 9)}-${cleanPhone.slice(9)}`
    }
    if (cleanPhone.length === 11) {
      return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`
    }
  }
  return phone
})

function goToProfile() {
  router.push({ name: 'settings' })
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <aside class="fixed left-0 top-0 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col">
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
    <nav class="flex-1 p-4 overflow-y-auto">
      <!-- Main Navigation -->
      <ul class="space-y-1">
        <li v-for="item in mainNavItems" :key="item.path">
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

      <!-- Divider -->
      <div class="my-4 border-t border-outline-variant"></div>

      <!-- Secondary Navigation -->
      <ul class="space-y-1">
        <li v-for="item in secondaryNavItems" :key="item.path">
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

    <!-- User Footer -->
    <div class="p-3 border-t border-outline-variant">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Avatar class="h-10 w-10 shrink-0">
              <AvatarFallback class="bg-primary text-white text-sm">{{ userInitials }}</AvatarFallback>
            </Avatar>
            <div class="flex-1 min-w-0 text-left">
              <p class="text-sm font-medium text-on-surface truncate">{{ userName }}</p>
              <p class="text-xs text-on-surface-variant truncate">{{ userPhone }}</p>
            </div>
            <ChevronUp class="h-4 w-4 text-on-surface-variant shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" :sideOffset="8" class="w-[232px]">
          <DropdownMenuItem @click="goToProfile" class="cursor-pointer">
            <User class="mr-2 h-4 w-4" />
            <span>Configuracoes</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout" class="cursor-pointer text-tertiary focus:text-tertiary">
            <LogOut class="mr-2 h-4 w-4" />
            <span>Sair da conta</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </aside>
</template>
