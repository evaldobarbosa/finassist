<script setup lang="ts">
import { computed } from 'vue'
import {
  CalendarDays,
  Pause,
  Play,
  MoreVertical,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency } from '@/lib/utils'
import type { Recurrence } from '@/types'

const props = defineProps<{
  recurrence: Recurrence
}>()

const emit = defineEmits<{
  edit: [recurrence: Recurrence]
  delete: [recurrence: Recurrence]
  pause: [recurrence: Recurrence]
  resume: [recurrence: Recurrence]
}>()

const frequencyLabels: Record<string, string> = {
  daily: 'Diaria',
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
}

const dayOfWeekLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

const frequencyLabel = computed(() => frequencyLabels[props.recurrence.frequency] || props.recurrence.frequency)

const scheduleInfo = computed(() => {
  const { frequency, day_of_month, day_of_week, month_of_year } = props.recurrence

  if (frequency === 'daily') return 'Todo dia'
  if (frequency === 'weekly' && day_of_week !== undefined) {
    return `Toda ${dayOfWeekLabels[day_of_week]}`
  }
  if (frequency === 'monthly' && day_of_month) {
    return `Todo dia ${day_of_month}`
  }
  if (frequency === 'yearly' && month_of_year && day_of_month) {
    return `${day_of_month}/${month_of_year.toString().padStart(2, '0')}`
  }
  return frequencyLabel.value
})

const nextDueFormatted = computed(() => {
  if (!props.recurrence.next_due_date) return '-'
  const date = new Date(props.recurrence.next_due_date)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
})

const isIncome = computed(() => props.recurrence.type === 'income')
</script>

<template>
  <div
    :class="[
      'bg-surface-container-lowest rounded-xl p-5 shadow-editorial transition-all hover:shadow-lg',
      !recurrence.is_active && 'opacity-60'
    ]"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-3 mb-4">
      <div class="flex items-center gap-3">
        <div
          :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center',
            isIncome ? 'bg-primary/10' : 'bg-tertiary/10'
          ]"
        >
          <TrendingUp v-if="isIncome" class="h-5 w-5 text-primary" />
          <TrendingDown v-else class="h-5 w-5 text-tertiary" />
        </div>
        <div>
          <h3 class="font-medium text-on-surface">{{ recurrence.description }}</h3>
          <p class="text-sm text-on-surface-variant">
            {{ recurrence.category?.name || 'Sem categoria' }}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-8 w-8">
            <MoreVertical class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="emit('edit', recurrence)">
            <Pencil class="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="recurrence.is_active"
            @click="emit('pause', recurrence)"
          >
            <Pause class="h-4 w-4 mr-2" />
            Pausar
          </DropdownMenuItem>
          <DropdownMenuItem
            v-else
            @click="emit('resume', recurrence)"
          >
            <Play class="h-4 w-4 mr-2" />
            Retomar
          </DropdownMenuItem>
          <DropdownMenuItem
            class="text-tertiary focus:text-tertiary"
            @click="emit('delete', recurrence)"
          >
            <Trash2 class="h-4 w-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Amount -->
    <div class="mb-4">
      <p
        :class="[
          'text-2xl font-bold',
          isIncome ? 'text-primary' : 'text-tertiary'
        ]"
      >
        {{ isIncome ? '+' : '-' }} {{ formatCurrency(recurrence.amount) }}
      </p>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-outline-variant">
      <div class="flex items-center gap-2">
        <Badge variant="outline" class="text-xs">
          {{ frequencyLabel }}
        </Badge>
        <span class="text-sm text-on-surface-variant">{{ scheduleInfo }}</span>
      </div>

      <div class="flex items-center gap-1 text-sm text-on-surface-variant">
        <CalendarDays class="h-4 w-4" />
        <span>{{ nextDueFormatted }}</span>
      </div>
    </div>

    <!-- Status Badge -->
    <div v-if="!recurrence.is_active" class="mt-3">
      <Badge variant="secondary" class="bg-outline/20 text-on-surface-variant">
        <Pause class="h-3 w-3 mr-1" />
        Pausada
      </Badge>
    </div>
  </div>
</template>
