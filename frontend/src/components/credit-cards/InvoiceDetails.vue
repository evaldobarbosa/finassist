<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
  ShoppingCart,
  Layers,
} from 'lucide-vue-next'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import type { CreditCard as CreditCardType, CreditCardStatementResponse, CreditCardStatementTransaction } from '@/types'

const props = defineProps<{
  open: boolean
  card: CreditCardType | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'pay-invoice': [cardId: string, amount: number]
}>()

const currentMonth = ref(new Date())

const monthKey = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = String(currentMonth.value.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
})

const monthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

// Fetch statement for current month
const { data: statementData, isLoading, refetch } = useQuery({
  queryKey: ['credit-card-statement', props.card?.id, monthKey],
  queryFn: () => api.get<CreditCardStatementResponse>(`/credit-cards/${props.card?.id}/statement/${monthKey.value}`),
  enabled: computed(() => props.open && !!props.card),
})

const transactions = computed(() => statementData.value?.data?.transactions || [])

const invoiceTotal = computed(() => {
  return parseFloat(statementData.value?.data?.total || '0')
})

const pendingTotal = computed(() => {
  return transactions.value
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
})

const confirmedTotal = computed(() => {
  return transactions.value
    .filter(t => t.status === 'confirmed')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
})

const invoiceStatus = computed(() => {
  const today = new Date()
  const dueDay = props.card?.due_day || 1
  const dueDate = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), dueDay)

  if (pendingTotal.value === 0 && invoiceTotal.value > 0) {
    return { label: 'Paga', variant: 'default' as const, icon: CheckCircle }
  }

  if (today > dueDate && pendingTotal.value > 0) {
    return { label: 'Vencida', variant: 'destructive' as const, icon: AlertTriangle }
  }

  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 7 && diffDays >= 0) {
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

function handlePayInvoice() {
  if (props.card) {
    emit('pay-invoice', props.card.id, invoiceTotal.value)
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function getTransactionIcon(transaction: CreditCardStatementTransaction) {
  return transaction.is_installment ? Layers : ShoppingCart
}

function getInstallmentLabel(transaction: CreditCardStatementTransaction): string {
  if (transaction.is_installment && transaction.installment_number && transaction.installment_total) {
    return `${transaction.installment_number}/${transaction.installment_total}`
  }
  return ''
}

// Refetch when month changes
watch(monthKey, () => {
  if (props.open && props.card) {
    refetch()
  }
})
</script>

<template>
  <Dialog :open="open && !!card" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
      <!-- Header -->
      <DialogHeader class="flex flex-row items-center justify-between p-4 border-b border-outline-variant space-y-0">
        <div>
          <DialogTitle class="font-semibold text-on-surface">Fatura {{ card?.name }}</DialogTitle>
          <p class="text-sm text-on-surface-variant">**** {{ card?.last_four_digits }}</p>
        </div>
        <Badge :variant="invoiceStatus.variant">
          <component :is="invoiceStatus.icon" class="h-3 w-3 mr-1" />
          {{ invoiceStatus.label }}
        </Badge>
      </DialogHeader>

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
            <div v-if="confirmedTotal > 0" class="flex gap-3 mt-1 text-sm">
              <span class="text-primary">Pago: {{ formatCurrency(confirmedTotal) }}</span>
              <span v-if="pendingTotal > 0" class="text-tertiary">Pendente: {{ formatCurrency(pendingTotal) }}</span>
            </div>
          </div>
          <Button @click="handlePayInvoice" :disabled="pendingTotal === 0">
            <CheckCircle class="h-4 w-4 mr-2" />
            Pagar Fatura
          </Button>
        </div>
        <div class="flex gap-4 mt-4 text-sm">
          <div>
            <span class="text-on-surface-variant">Fechamento: </span>
            <span class="font-medium text-on-surface">Dia {{ card?.closing_day }}</span>
          </div>
          <div>
            <span class="text-on-surface-variant">Vencimento: </span>
            <span class="font-medium text-on-surface">Dia {{ card?.due_day }}</span>
          </div>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Loading -->
        <div v-if="isLoading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-16 bg-surface-container rounded-lg animate-pulse" />
        </div>

        <!-- Empty State -->
        <div v-else-if="transactions.length === 0" class="text-center py-12">
          <Receipt class="h-12 w-12 mx-auto text-on-surface-variant mb-4" />
          <p class="text-on-surface-variant">Nenhuma transacao neste periodo</p>
        </div>

        <!-- Transactions -->
        <div v-else class="space-y-2">
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="flex items-center gap-3 p-3 bg-surface-container rounded-lg"
          >
            <!-- Icon -->
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              :class="transaction.is_installment ? 'bg-secondary/10' : 'bg-tertiary/10'"
            >
              <component
                :is="getTransactionIcon(transaction)"
                class="h-5 w-5"
                :class="transaction.is_installment ? 'text-secondary' : 'text-tertiary'"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="font-medium text-on-surface truncate">{{ transaction.description }}</p>
                <Badge v-if="transaction.is_installment" variant="outline" class="text-xs shrink-0">
                  {{ getInstallmentLabel(transaction) }}
                </Badge>
              </div>
              <div class="flex items-center gap-2 text-xs text-on-surface-variant">
                <span>{{ formatDate(transaction.date) }}</span>
                <span v-if="transaction.category" class="flex items-center gap-1">
                  <span
                    class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: transaction.category.color }"
                  />
                  {{ transaction.category.name }}
                </span>
              </div>
            </div>

            <!-- Amount -->
            <div class="text-right shrink-0">
              <p
                class="font-semibold"
                :class="transaction.status === 'confirmed' ? 'text-on-surface-variant line-through' : 'text-tertiary'"
              >
                -{{ formatCurrency(parseFloat(transaction.amount)) }}
              </p>
              <Badge
                v-if="transaction.status === 'confirmed'"
                variant="default"
                class="text-xs"
              >
                Pago
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
