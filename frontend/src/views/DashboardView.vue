<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { FileText } from 'lucide-vue-next'
import AppLayout from '@/components/layout/AppLayout.vue'
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'
import FloatingActionButton from '@/components/dashboard/FloatingActionButton.vue'
import TransactionModal from '@/components/transactions/TransactionModal.vue'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import type { DashboardSummary, Transaction, Account, Category, TransactionType } from '@/types'

const router = useRouter()
const queryClient = useQueryClient()
const { success, error: showError } = useToast()

// Current month period
const currentDate = new Date()
const periodDates = computed(() => {
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  }
})

const currentMonthLabel = computed(() => {
  return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

// Fetch dashboard summary
const { data: summary, isLoading: isSummaryLoading } = useQuery({
  queryKey: ['dashboard', periodDates],
  queryFn: () => api.get<DashboardSummary>(
    `/dashboard?start=${periodDates.value.start}&end=${periodDates.value.end}`
  ),
})

// Fetch recent transactions
const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
  queryKey: ['transactions', periodDates],
  queryFn: () => api.get<{ data: Transaction[] }>(
    `/transactions?start_date=${periodDates.value.start}&end_date=${periodDates.value.end}&per_page=10`
  ),
})

// Fetch accounts
const { data: accounts } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => api.get<Account[]>('/accounts'),
})

// Fetch categories
const { data: categories } = useQuery({
  queryKey: ['categories'],
  queryFn: () => api.get<Category[]>('/categories'),
})

// Create transaction mutation
const createTransaction = useMutation({
  mutationFn: (data: Partial<Transaction>) => api.post<Transaction>('/transactions', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
    transactionModalOpen.value = false
    success('Transacao adicionada', 'Sua transacao foi registrada com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel adicionar a transacao')
  },
})

// Transaction modal state
const transactionModalOpen = ref(false)
const transactionType = ref<TransactionType>('expense')

function openTransactionModal(type: TransactionType) {
  transactionType.value = type
  transactionModalOpen.value = true
}

function handleTransactionSubmit(data: Partial<Transaction>) {
  createTransaction.mutate(data)
}

function goToExtrato() {
  router.push('/transactions')
}

// Computed data with fallbacks
const summaryData = computed(() => summary.value || {
  previous_balance: 0,
  income: 0,
  expenses: 0,
  current_balance: 0,
})

const transactions = computed(() => transactionsData.value?.data || [])
const accountsList = computed(() => accounts.value || [])
const categoriesList = computed(() => categories.value || [])
</script>

<template>
  <AppLayout>
    <div class="p-4 lg:p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-on-surface">Dashboard</h1>
          <p class="text-on-surface-variant capitalize">{{ currentMonthLabel }}</p>
        </div>
        <Button variant="outline" @click="goToExtrato">
          <FileText class="h-4 w-4 mr-2" />
          Ver extrato do mes
        </Button>
      </div>

      <!-- Summary Cards -->
      <SummaryCards
        :previous-balance="summaryData.previous_balance"
        :income="summaryData.income"
        :expenses="summaryData.expenses"
        :current-balance="summaryData.current_balance"
        :is-loading="isSummaryLoading"
      />

      <!-- Recent Transactions -->
      <RecentTransactions
        :transactions="transactions"
        :categories="categoriesList"
        :accounts="accountsList"
        :is-loading="isTransactionsLoading"
        :limit="5"
      />
    </div>

    <!-- Floating Action Button -->
    <FloatingActionButton
      @add-income="openTransactionModal('income')"
      @add-expense="openTransactionModal('expense')"
      @add-transfer="openTransactionModal('transfer')"
    />

    <!-- Transaction Modal -->
    <TransactionModal
      v-model:open="transactionModalOpen"
      :type="transactionType"
      :accounts="accountsList"
      :categories="categoriesList"
      :is-loading="createTransaction.isPending.value"
      @submit="handleTransactionSubmit"
    />
  </AppLayout>
</template>
