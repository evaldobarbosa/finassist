<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { SelectIcon, SelectTrigger, type SelectTriggerProps } from 'radix-vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <SelectTrigger
    v-bind="props"
    :class="cn(
      'flex h-10 w-full items-center justify-between rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm ring-offset-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="h-4 w-4 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
