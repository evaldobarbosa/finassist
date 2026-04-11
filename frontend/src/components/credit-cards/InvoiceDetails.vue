<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-vue-next'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CreditCard, Transaction } from '@/types'

const props = defineProps<{
  open: boolean
  card: CreditCard | null
  transactions?: Transaction[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'pay-invoice': [cardId: string, amount: number]
}>()

const currentMonth = ref(new Date())

const monthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

// Filter transactions for current month's invoice
const invoiceTransactions = computed(() => {
  if (!props.transactions || !props.card) return []

  const closingDay = props.card.closing_day || 1
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  // Invoice period: from closing day of previous month to closing day of current month
  const startDate = new Date(year, month - 1, closingDay + 1)
  const endDate = new Date(year, month, closingDay)

  return props.transactions.filter(t => {
    const txDate = new Date(t.date)
    return txDate >= startDate && txDate <= endDate && t.type === 'expense'
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const invoiceTotal = computed(() => {
  return invoiceTransactions.value.reduce((sum, t) => sum + t.amount, 0)
})

const invoiceStatus = computed(() => {
  const today = new Date()
  const dueDay = props.card?.due_day || 1
  const dueDate = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), dueDay)

  if (today > dueDate) {
    return { label: 'Vencida', variant: 'destructive' as const, icon: AlertTriangle }
  }

  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 7) {
    return { label: 'Vence em breve', variant: 'warning' as const, icon: Clock }
  }

  return { label: 'Aberta', variant: 'outline' as const, icon: Calendar }
})

function previousMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
}

function handleClose() {
  emit('update:open', false)
}

function handlePayInvoice() {
  if (props.card) {
    emit('pay-invoice', props.card.id, invoiceTotal.value)
  }
}

// Group transactions by date
const groupedTransactions = computed(() => {
  const groups: Record<string, Transaction[]> = {}

  invoiceTransactions.value.forEach(t => {
    const dateKey = new Date(t.date).toLocaleDateString('pt-BR')
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(t)
  })

  return Object.entries(groups).map(([date, transactions]) => ({
    date,
    transactions,
    total: transactions.reduce((sum, t) => sum + t.amount, 0),
  }))
})
</script>

<template>
  <div
    v-if="open && card"
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div class="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-outline-variant">
        <div class="flex items-center gap-3">
          <button @click="handleClose" class="p-2 rounded-lg hover:bg-surface-container transition">
            <X class="h-5 w-5 text-on-surface-variant" />
          </button>
          <div>
            <h2 class="font-semibold text-on-surface">Fatura {{ card.name }}</h2>
            <p class="text-sm text-on-surface-variant">**** {{ card.last_four_digits }}</p>
          </div>
        </div>
        <Badge :variant="invoiceStatus.variant">
          <component :is="invoiceStatus.icon" class="h-3 w-3 mr-1" />
          {{ invoiceStatus.label }}
        </Badge>
      </div>

      <!-- Month Navigation -->
      <div class="flex items-center justify-between p-4 bg-surface-container">
        <button @click="previousMonth" class="p-2 rounded-lg hover:bg-surface-container-high transition">
          <ChevronLeft class="h-5 w-5 text-on-surface-variant" />
        </button>
        <span class="font-medium text-on-surface capitalize">{{ monthLabel }}</span>
        <button @click="nextMonth" class="p-2 rounded-lg hover:bg-surface-container-high transition">
          <ChevronRight class="h-5 w-5 text-on-surface-variant" />
        </button>
      </div>

      <!-- Invoice Summary -->
      <div class="p-4 border-b border-outline-variant">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-on-surface-variant">Total da fatura</p>
            <p class="text-2xl font-bold text-on-surface">{{ formatCurrency(invoiceTotal) }}</p>
          </div>
          <Button @click="handlePayInvoice" :disabled="invoiceTotal === 0">
            <CheckCircle class="h-4 w-4 mr-2" />
            Pagar Fatura
          </Button>
        </div>
        <div class="flex gap-4 mt-4 text-sm">
          <div>
            <span class="text-on-surface-variant">Fechamento: </span>
            <span class="font-medium text-on-surface">Dia {{ card.closing_day }}</span>
          </div>
          <div>
            <span class="text-on-surface-variant">Vencimento: </span>
            <span class="font-medium text-on-surface">Dia {{ card.due_day }}</span>
          </div>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="groupedTransactions.length === 0" class="text-center py-12">
          <Receipt class="h-12 w-12 mx-auto text-on-surface-variant mb-4" />
          <p class="text-on-surface-variant">Nenhuma transacao neste periodo</p>
        </div>

        <div v-else class="space-y-6">
          <div v-for="group in groupedTransactions" :key="group.date">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-on-surface-variant">{{ group.date }}</span>
              <span class="text-sm text-tertiary">-{{ formatCurrency(group.total) }}</span>
            </div>
            <div class="space-y-2">
              <div
                v-for="transaction in group.transactions"
                :key="transaction.id"
                class="flex items-center justify-between p-3 bg-surface-container rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                    <Receipt class="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <div>
                    <p class="font-medium text-on-surface">{{ transaction.description }}</p>
                    <p v-if="transaction.installment_info" class="text-xs text-on-surface-variant">
                      {{ transaction.installment_info }}
                    </p>
                  </div>
                </div>
                <span class="font-medium text-tertiary">-{{ formatCurrency(transaction.amount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
