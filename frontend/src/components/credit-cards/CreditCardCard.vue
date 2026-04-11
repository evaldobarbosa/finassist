<script setup lang="ts">
import { computed } from 'vue'
import {
  CreditCard,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  AlertTriangle,
} from 'lucide-vue-next'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { CreditCard as CreditCardType } from '@/types'

const props = defineProps<{
  card: CreditCardType
}>()

const emit = defineEmits<{
  edit: [card: CreditCardType]
  delete: [card: CreditCardType]
  'view-invoice': [card: CreditCardType]
}>()

const usedPercentage = computed(() => {
  if (!props.card.limit) return 0
  return Math.min(100, (props.card.current_balance / props.card.limit) * 100)
})

const isNearLimit = computed(() => usedPercentage.value >= 80)
const isOverLimit = computed(() => usedPercentage.value >= 100)

const availableLimit = computed(() => {
  return Math.max(0, props.card.limit - props.card.current_balance)
})

const dueDate = computed(() => {
  if (!props.card.due_day) return null
  const today = new Date()
  const dueDate = new Date(today.getFullYear(), today.getMonth(), props.card.due_day)
  if (dueDate < today) {
    dueDate.setMonth(dueDate.getMonth() + 1)
  }
  return dueDate
})

const daysUntilDue = computed(() => {
  if (!dueDate.value) return null
  const today = new Date()
  const diff = dueDate.value.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const formattedDueDate = computed(() => {
  if (!dueDate.value) return ''
  return dueDate.value.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
})

const cardStyle = computed(() => {
  if (props.card.color) {
    return {
      background: `linear-gradient(135deg, ${props.card.color} 0%, ${props.card.color}cc 100%)`,
    }
  }
  return {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  }
})
</script>

<template>
  <div class="relative group">
    <!-- Card Visual -->
    <div
      class="rounded-2xl p-6 text-white shadow-lg aspect-[1.6/1] flex flex-col justify-between"
      :style="cardStyle"
    >
      <!-- Top Row -->
      <div class="flex items-start justify-between">
        <div>
          <p class="text-white/70 text-sm">{{ card.brand || 'Cartao de Credito' }}</p>
          <h3 class="font-semibold text-lg">{{ card.name }}</h3>
        </div>
        <CreditCard class="h-8 w-8 text-white/80" />
      </div>

      <!-- Card Number (masked) -->
      <div class="text-center">
        <p class="font-mono text-lg tracking-widest">
          **** **** **** {{ card.last_four_digits || '0000' }}
        </p>
      </div>

      <!-- Bottom Row -->
      <div class="flex items-end justify-between">
        <div>
          <p class="text-white/70 text-xs">Vencimento</p>
          <p class="font-medium">Dia {{ card.due_day || '--' }}</p>
        </div>
        <div class="text-right">
          <p class="text-white/70 text-xs">Fechamento</p>
          <p class="font-medium">Dia {{ card.closing_day || '--' }}</p>
        </div>
      </div>
    </div>

    <!-- Actions Menu -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button class="absolute top-3 right-3 p-2 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 hover:bg-white/20 transition">
          <MoreVertical class="h-4 w-4 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="emit('view-invoice', card)" class="cursor-pointer">
          <Calendar class="h-4 w-4 mr-2" />
          Ver Fatura
        </DropdownMenuItem>
        <DropdownMenuItem @click="emit('edit', card)" class="cursor-pointer">
          <Pencil class="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="emit('delete', card)" class="cursor-pointer text-tertiary">
          <Trash2 class="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Card Details -->
    <div class="mt-4 bg-surface-container-lowest rounded-xl p-4 shadow-editorial space-y-4">
      <!-- Usage Bar -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-on-surface-variant">Limite utilizado</span>
          <span
            :class="[
              'text-sm font-medium',
              isOverLimit ? 'text-tertiary' : isNearLimit ? 'text-yellow-600' : 'text-on-surface'
            ]"
          >
            {{ usedPercentage.toFixed(0) }}%
          </span>
        </div>
        <div class="h-2 bg-surface-container rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300"
            :class="[
              isOverLimit ? 'bg-tertiary' : isNearLimit ? 'bg-yellow-500' : 'bg-primary'
            ]"
            :style="{ width: `${Math.min(100, usedPercentage)}%` }"
          />
        </div>
      </div>

      <!-- Amounts -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-on-surface-variant">Fatura atual</p>
          <p class="font-semibold text-on-surface">{{ formatCurrency(card.current_balance) }}</p>
        </div>
        <div>
          <p class="text-xs text-on-surface-variant">Limite disponivel</p>
          <p class="font-semibold text-primary">{{ formatCurrency(availableLimit) }}</p>
        </div>
      </div>

      <!-- Due Date Warning -->
      <div
        v-if="daysUntilDue !== null && daysUntilDue <= 7"
        :class="[
          'flex items-center gap-2 p-3 rounded-lg',
          daysUntilDue <= 3 ? 'bg-tertiary/10 text-tertiary' : 'bg-yellow-500/10 text-yellow-600'
        ]"
      >
        <AlertTriangle class="h-4 w-4 shrink-0" />
        <p class="text-sm">
          <span v-if="daysUntilDue === 0">Fatura vence hoje!</span>
          <span v-else-if="daysUntilDue === 1">Fatura vence amanha</span>
          <span v-else>Fatura vence em {{ daysUntilDue }} dias ({{ formattedDueDate }})</span>
        </p>
      </div>

      <!-- Total Limit -->
      <div class="pt-3 border-t border-outline-variant">
        <div class="flex items-center justify-between">
          <span class="text-sm text-on-surface-variant">Limite total</span>
          <span class="font-medium text-on-surface">{{ formatCurrency(card.limit) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
