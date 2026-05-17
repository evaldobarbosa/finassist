<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import LandingLayout from '@/layouts/LandingLayout.vue'

const route = useRoute()

const layout = computed(() => {
  const layoutType = route.meta.layout
  if (layoutType === 'auth') return AuthLayout
  if (layoutType === 'landing') return LandingLayout
  return AppLayout
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
