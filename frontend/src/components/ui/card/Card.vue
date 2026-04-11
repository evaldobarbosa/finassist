<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="cn(
      'rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface shadow-editorial',
      props.class
    )"
  >
    <slot />
  </div>
</template>
