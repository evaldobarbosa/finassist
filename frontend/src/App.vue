<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { Toaster } from '@/components/ui/toast'

const route = useRoute()
</script>

<template>
  <RouterView :key="route.fullPath" />
  <Toaster />
</template>
