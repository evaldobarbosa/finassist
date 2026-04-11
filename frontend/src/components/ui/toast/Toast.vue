<script setup lang="ts">
import { computed } from 'vue'
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { Toast } from '@/composables/useToast'

const props = defineProps<{
  toast: Toast
}>()

const emit = defineEmits<{
  close: [id: string]
}>()

const variantClasses = computed(() => {
  switch (props.toast.variant) {
    case 'success':
      return 'border-primary bg-primary-fixed/10 text-primary'
    case 'error':
      return 'border-tertiary bg-tertiary/10 text-tertiary'
    case 'warning':
      return 'border-yellow-500 bg-yellow-50 text-yellow-800'
    default:
      return 'border-outline-variant bg-surface-container-lowest text-on-surface'
  }
})

const Icon = computed(() => {
  switch (props.toast.variant) {
    case 'success':
      return CheckCircle
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    default:
      return null
  }
})
</script>

<template>
  <div
    :class="cn(
      'pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all',
      variantClasses
    )"
  >
    <div class="flex items-center gap-3">
      <component :is="Icon" v-if="Icon" class="h-5 w-5 shrink-0" />
      <div class="grid gap-1">
        <p class="text-sm font-semibold">{{ toast.title }}</p>
        <p v-if="toast.description" class="text-sm opacity-90">
          {{ toast.description }}
        </p>
      </div>
    </div>
    <button
      @click="emit('close', toast.id)"
      class="rounded-md p-1 opacity-70 hover:opacity-100 transition"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>
