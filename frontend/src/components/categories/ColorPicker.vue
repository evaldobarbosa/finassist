<script setup lang="ts">
import { ref, watch } from 'vue'
import { Check } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const colors = [
  // Row 1 - Primary colors
  '#006b2c', '#00873a', '#0058be', '#3498db', '#9b59b6',
  // Row 2 - Warm colors
  '#e74c3c', '#bb0112', '#e91e63', '#ff6b6b', '#f39c12',
  // Row 3 - Cool colors
  '#1abc9c', '#16a085', '#27ae60', '#2ecc71', '#00bcd4',
  // Row 4 - Neutrals
  '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7', '#2c3e50',
]

const selectedColor = ref(props.modelValue)
const customColor = ref('')
const showCustomInput = ref(false)

watch(() => props.modelValue, (newValue) => {
  selectedColor.value = newValue
  if (!colors.includes(newValue)) {
    customColor.value = newValue
  }
})

function selectColor(color: string) {
  selectedColor.value = color
  emit('update:modelValue', color)
  showCustomInput.value = false
}

function handleCustomColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  const color = target.value
  customColor.value = color
  selectedColor.value = color
  emit('update:modelValue', color)
}

function toggleCustomInput() {
  showCustomInput.value = !showCustomInput.value
}
</script>

<template>
  <div class="space-y-3">
    <!-- Preset Colors -->
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="color in colors"
        :key="color"
        type="button"
        @click="selectColor(color)"
        :class="[
          'w-8 h-8 rounded-lg transition-all flex items-center justify-center',
          selectedColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
        ]"
        :style="{ backgroundColor: color }"
      >
        <Check
          v-if="selectedColor === color"
          class="h-4 w-4 text-white drop-shadow"
        />
      </button>
    </div>

    <!-- Custom Color -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="toggleCustomInput"
        class="text-sm text-primary hover:underline"
      >
        {{ showCustomInput ? 'Ocultar' : 'Cor personalizada' }}
      </button>
    </div>

    <div v-if="showCustomInput" class="flex items-center gap-2">
      <input
        type="color"
        :value="customColor || selectedColor"
        @input="handleCustomColorChange"
        class="w-10 h-10 rounded-lg cursor-pointer border-0"
      />
      <input
        type="text"
        :value="customColor || selectedColor"
        @input="handleCustomColorChange"
        placeholder="#000000"
        class="flex-1 px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-lowest"
      />
    </div>
  </div>
</template>
