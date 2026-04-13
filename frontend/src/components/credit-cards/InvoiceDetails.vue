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
  CreditCard,
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
import type { CreditCard as CreditCardType, InstallmentsByMonthResponse } from '@/types'

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

// Fetch installments for current month
const { data: installmentsData, isLoading, refetch } = useQuery({
  queryKey: ['installments-by-month', monthKey, props.card?.id],
  queryFn: () => api.get<InstallmentsByMonthResponse>(`/installments/by-month?month=${monthKey.value}`),
  enabled: computed(() => props.open && !!props.card),
})

// Filter installments for current card
const cardInstallments = computed(() => {
  if (!installmentsData.value?.data || !props.card) return []
  return installmentsData.value.data.filter(
    inst => inst.installment_purchase?.credit_card_id === props.card?.id
  )
})

const invoiceTotal = computed(() => {
  return cardInstallments.value.reduce((sum, inst) => sum + Number(inst.amount || 0), 0)
})

const pendingTotal = computed(() => {
  return cardInstallments.value
    .filter(inst => inst.status === 'pending')
    .reduce((sum, inst) => sum + Number(inst.amount || 0), 0)
})

const paidTotal = computed(() => {
  return cardInstallments.value
    .filter(inst => inst.status === 'paid')
    .reduce((sum, inst) => sum + Number(inst.amount || 0), 0)
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

// Group installments by purchase (merchant)
const groupedInstallments = computed(() => {
  const groups: Record<string, typeof cardInstallments.value> = {}

  cardInstallments.value.forEach(inst => {
    const key = inst.installment_purchase_id
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(inst)
  })

  return Object.entries(groups).map(([purchaseId, installments]) => {
    const purchase = installments[0].installment_purchase
    return {
      purchaseId,
      merchant: purchase?.merchant || 'Compra parcelada',
      purchaseDate: purchase?.purchase_date,
      totalAmount: purchase?.total_amount || 0,
      installmentCount: purchase?.installment_count || 0,
      installments,
      monthTotal: installments.reduce((sum, inst) => sum + Number(inst.amount || 0), 0),
    }
  }).sort((a, b) => b.monthTotal - a.monthTotal)
})

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
            <div v-if="paidTotal > 0" class="flex gap-3 mt-1 text-sm">
              <span class="text-primary">Pago: {{ formatCurrency(paidTotal) }}</span>
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

      <!-- Installments List -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Loading -->
        <div v-if="isLoading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-20 bg-surface-container rounded-lg animate-pulse" />
        </div>

        <!-- Empty State -->
        <div v-else-if="groupedInstallments.length === 0" class="text-center py-12">
          <Receipt class="h-12 w-12 mx-auto text-on-surface-variant mb-4" />
          <p class="text-on-surface-variant">Nenhuma parcela neste periodo</p>
        </div>

        <!-- Installments by Purchase -->
        <div v-else class="space-y-4">
          <div
            v-for="group in groupedInstallments"
            :key="group.purchaseId"
            class="bg-surface-container rounded-xl overflow-hidden"
          >
            <!-- Purchase Header -->
            <div class="p-4 border-b border-outline-variant/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                    <Layers class="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <div>
                    <p class="font-medium text-on-surface">{{ group.merchant }}</p>
                    <p class="text-xs text-on-surface-variant">
                      Total: {{ formatCurrency(group.totalAmount) }} em {{ group.installmentCount }}x
                    </p>
                  </div>
                </div>
                <span class="font-semibold text-tertiary">-{{ formatCurrency(group.monthTotal) }}</span>
              </div>
            </div>

            <!-- Installment Details -->
            <div class="divide-y divide-outline-variant/30">
              <div
                v-for="installment in group.installments"
                :key="installment.id"
                class="flex items-center justify-between p-3 px-4"
              >
                <div class="flex items-center gap-3">
                  <Badge
                    :variant="installment.status === 'paid' ? 'default' : 'outline'"
                    class="text-xs"
                  >
                    {{ installment.number }}/{{ group.installmentCount }}
                  </Badge>
                  <span class="text-sm text-on-surface-variant">
                    {{ installment.status === 'paid' ? 'Paga' : 'Pendente' }}
                  </span>
                </div>
                <span
                  class="font-medium"
                  :class="installment.status === 'paid' ? 'text-on-surface-variant line-through' : 'text-tertiary'"
                >
                  -{{ formatCurrency(installment.amount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
