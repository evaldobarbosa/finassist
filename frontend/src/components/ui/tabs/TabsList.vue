<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsList, type TabsListProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <TabsList
    v-bind="props"
    :class="cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-surface-container p-1 text-on-surface-variant',
      props.class
    )"
  >
    <slot />
  </TabsList>
</template>
