<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  class?: string
  error?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = ref(formatPhone(props.modelValue || ''))

// Format phone number as (XX) XXXXX-XXXX
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

// Get raw phone number (only digits)
function getRawPhone(value: string): string {
  return value.replace(/\D/g, '')
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const cursorPosition = target.selectionStart || 0
  const oldLength = inputValue.value.length

  const formatted = formatPhone(target.value)
  inputValue.value = formatted

  // Emit raw value (only digits)
  emit('update:modelValue', getRawPhone(formatted))

  // Adjust cursor position
  const newLength = formatted.length
  const diff = newLength - oldLength

  requestAnimationFrame(() => {
    const newPosition = Math.max(0, cursorPosition + diff)
    target.setSelectionRange(newPosition, newPosition)
  })
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    const formatted = formatPhone(newValue)
    if (formatted !== inputValue.value) {
      inputValue.value = formatted
    }
  }
})

const isValid = computed(() => {
  const raw = getRawPhone(inputValue.value)
  return raw.length === 11
})
</script>

<template>
  <div class="relative">
    <div class="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
      <span class="text-lg">🇧🇷</span>
      <span class="text-on-surface-variant text-sm">+55</span>
    </div>
    <input
      type="tel"
      :value="inputValue"
      @input="handleInput"
      :placeholder="placeholder || '(11) 99999-9999'"
      :disabled="disabled"
      :class="cn(
        'flex h-12 w-full rounded-lg border bg-surface-container-lowest pl-20 pr-4 py-2 text-base ring-offset-surface placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition',
        error
          ? 'border-tertiary focus-visible:ring-tertiary'
          : 'border-outline-variant focus-visible:ring-primary',
        props.class
      )"
    />
    <div
      v-if="inputValue && isValid"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>
