<script setup lang="ts">
import { Bell, Search } from 'lucide-vue-next'
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
      </div>
    </div>
  </header>
</template>
