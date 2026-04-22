<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  modelValue: { month: number; year: number }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: { month: number; year: number }]
}>()

const months = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const currentDate = new Date()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()

// Fallback to current date if modelValue is not yet initialized
const selectedMonth = ref(props.modelValue?.month ?? currentMonth)
const selectedYear = ref(props.modelValue?.year ?? currentYear)

const displayText = computed(() => {
  return `${months[selectedMonth.value]} ${selectedYear.value}`
})

const isCurrentMonth = computed(() => {
  return selectedMonth.value === currentMonth && selectedYear.value === currentYear
})

// Allow navigation up to 12 months in the future (for installments)
const canGoForward = computed(() => {
  const maxDate = new Date(currentYear, currentMonth + 12)
  const selectedDate = new Date(selectedYear.value, selectedMonth.value)
  return selectedDate < maxDate
})

function previousMonth() {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11
    selectedYear.value--
  } else {
    selectedMonth.value--
  }
  emitChange()
}

function nextMonth() {
  if (!canGoForward.value) return

  if (selectedMonth.value === 11) {
    selectedMonth.value = 0
    selectedYear.value++
  } else {
    selectedMonth.value++
  }
  emitChange()
}

function goToCurrentMonth() {
  selectedMonth.value = currentMonth
  selectedYear.value = currentYear
  emitChange()
}

function emitChange() {
  emit('update:modelValue', { month: selectedMonth.value, year: selectedYear.value })
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedMonth.value = newValue.month
    selectedYear.value = newValue.year
  }
}, { deep: true })
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        @click="previousMonth"
        class="h-9 w-9"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>

      <div class="min-w-[160px] text-center">
        <span class="text-lg font-semibold text-on-surface">{{ displayText }}</span>
      </div>

      <Button
        variant="outline"
        size="icon"
        @click="nextMonth"
        :disabled="!canGoForward"
        class="h-9 w-9"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>

    <Button
      v-if="!isCurrentMonth"
      variant="ghost"
      size="sm"
      @click="goToCurrentMonth"
      class="text-primary"
    >
      <Calendar class="h-4 w-4 mr-2" />
      Hoje
    </Button>
  </div>
</template>
