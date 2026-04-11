<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  modelValue?: string
  length?: number
  disabled?: boolean
  error?: boolean
  class?: string
}>(), {
  length: 6,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'complete': [value: string]
}>()

const inputs = ref<HTMLInputElement[]>([])
const values = ref<string[]>(Array(props.length).fill(''))

// Initialize values from modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const chars = newValue.split('').slice(0, props.length)
    values.value = [...chars, ...Array(props.length - chars.length).fill('')]
  } else {
    values.value = Array(props.length).fill('')
  }
}, { immediate: true })

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '').slice(-1)

  values.value[index] = value

  // Emit the combined value
  const combinedValue = values.value.join('')
  emit('update:modelValue', combinedValue)

  // Move to next input if value entered
  if (value && index < props.length - 1) {
    nextTick(() => {
      inputs.value[index + 1]?.focus()
    })
  }

  // Emit complete event when all fields are filled
  if (combinedValue.length === props.length) {
    emit('complete', combinedValue)
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!values.value[index] && index > 0) {
      // Move to previous input and clear it
      values.value[index - 1] = ''
      emit('update:modelValue', values.value.join(''))
      nextTick(() => {
        inputs.value[index - 1]?.focus()
      })
    }
  }

  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    inputs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < props.length - 1) {
    event.preventDefault()
    inputs.value[index + 1]?.focus()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, props.length)

  if (pastedData) {
    const chars = pastedData.split('')
    values.value = [...chars, ...Array(props.length - chars.length).fill('')]
    emit('update:modelValue', pastedData)

    // Focus the appropriate input
    const focusIndex = Math.min(chars.length, props.length - 1)
    nextTick(() => {
      inputs.value[focusIndex]?.focus()
    })

    if (pastedData.length === props.length) {
      emit('complete', pastedData)
    }
  }
}

function handleFocus(index: number) {
  // Select the input content on focus
  inputs.value[index]?.select()
}

onMounted(() => {
  // Focus first input on mount
  inputs.value[0]?.focus()
})

function setInputRef(el: HTMLInputElement | null, index: number) {
  if (el) {
    inputs.value[index] = el
  }
}
</script>

<template>
  <div :class="cn('flex gap-2 justify-center', props.class)">
    <input
      v-for="(_, index) in length"
      :key="index"
      :ref="(el) => setInputRef(el as HTMLInputElement, index)"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="values[index]"
      :disabled="disabled"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
      @paste="handlePaste"
      @focus="handleFocus(index)"
      :class="cn(
        'w-12 h-14 text-center text-xl font-semibold rounded-lg border bg-surface-container-lowest transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        error
          ? 'border-tertiary focus:ring-tertiary'
          : values[index]
            ? 'border-primary focus:ring-primary'
            : 'border-outline-variant focus:ring-primary'
      )"
    />
  </div>
</template>
