<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import MobileNav from './MobileNav.vue'
</script>

<template>
  <div class="min-h-screen bg-surface">
    <!-- Desktop Layout -->
    <div class="hidden lg:flex">
      <AppSidebar />
      <div class="flex-1 ml-64">
        <AppHeader />
        <main class="pt-16">
          <slot />
        </main>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="lg:hidden">
      <AppHeader />
      <main class="pt-16 pb-20">
        <slot />
      </main>
      <MobileNav />
    </div>
  </div>
</template>
