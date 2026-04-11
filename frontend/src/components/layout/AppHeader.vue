<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Search, User, Settings, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const router = useRouter()
const authStore = useAuthStore()

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
  const phone = authStore.phone || ''
  if (phone.length === 11) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`
  }
  return phone
})

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}

function goToSettings() {
  router.push({ name: 'settings' })
}
</script>

<template>
  <header class="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-surface-container-lowest border-b border-outline-variant z-40">
    <div class="h-full px-4 lg:px-6 flex items-center justify-between">
      <!-- Mobile Logo -->
      <div class="lg:hidden">
        <span class="text-xl font-bold text-primary">FinAssistant</span>
      </div>

      <!-- Search (Desktop) -->
      <div class="hidden lg:block flex-1 max-w-md">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar transacoes..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-2">
        <!-- Search button (Mobile) -->
        <button class="lg:hidden p-2 rounded-lg hover:bg-surface-container transition">
          <Search class="h-5 w-5 text-on-surface-variant" />
        </button>

        <!-- Notifications -->
        <button class="relative p-2 rounded-lg hover:bg-surface-container transition">
          <Bell class="h-5 w-5 text-on-surface-variant" />
          <!-- Notification badge -->
          <span class="absolute top-1 right-1 h-2 w-2 bg-tertiary rounded-full"></span>
        </button>

        <!-- User Menu -->
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button class="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-container transition">
              <Avatar class="h-9 w-9">
                <AvatarFallback>{{ userInitials }}</AvatarFallback>
              </Avatar>
              <span class="hidden lg:block text-sm font-medium text-on-surface">
                {{ userName }}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel>
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium">{{ userName }}</p>
                <p class="text-xs text-on-surface-variant">{{ userPhone }}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="goToSettings" class="cursor-pointer">
              <User class="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="goToSettings" class="cursor-pointer">
              <Settings class="mr-2 h-4 w-4" />
              <span>Configuracoes</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleLogout" class="cursor-pointer text-tertiary">
              <LogOut class="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
