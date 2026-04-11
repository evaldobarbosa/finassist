<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DropdownMenuItem, type DropdownMenuItemProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props extends DropdownMenuItemProps {
  class?: HTMLAttributes['class']
  inset?: boolean
}

const props = defineProps<Props>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DropdownMenuItem
    v-bind="forwarded"
    :class="cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-surface-container data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      props.class
    )"
  >
    <slot />
  </DropdownMenuItem>
</template>
