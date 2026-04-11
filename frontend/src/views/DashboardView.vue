<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import AppLayout from '@/components/layout/AppLayout.vue'
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import PeriodFilter from '@/components/dashboard/PeriodFilter.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'
import FloatingActionButton from '@/components/dashboard/FloatingActionButton.vue'
import TransactionModal from '@/components/transactions/TransactionModal.vue'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import type { DashboardSummary, Transaction, Account, Category, TransactionType } from '@/types'

const queryClient = useQueryClient()
const { success, error: showError } = useToast()

// Period state
const currentDate = new Date()
const period = ref({
  month: currentDate.getMonth(),
  year: currentDate.getFullYear(),
})

// Compute period dates
const periodDates = computed(() => {
  const startDate = new Date(period.value.year, period.value.month, 1)
  const endDate = new Date(period.value.year, period.value.month + 1, 0)

  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  }
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

// Demo data for when API is not available
const useDemoData = ref(false)

const demoSummary = {
  previous_balance: 5000,
  income: 8500,
  expenses: 3200,
  current_balance: 10300,
}

const demoTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Salario',
    amount: 8500,
    type: 'income',
    date: new Date().toISOString(),
    account_id: '1',
    category_id: '1',
    is_recurring: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    description: 'Supermercado Extra',
    amount: 450.80,
    type: 'expense',
    date: new Date(Date.now() - 86400000).toISOString(),
    account_id: '1',
    category_id: '2',
    is_recurring: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    description: 'Netflix',
    amount: 39.90,
    type: 'expense',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    account_id: '1',
    category_id: '3',
    is_recurring: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    description: 'Freelance',
    amount: 2500,
    type: 'income',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    account_id: '1',
    category_id: '1',
    is_recurring: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    description: 'Aluguel',
    amount: 1500,
    type: 'expense',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    account_id: '1',
    category_id: '4',
    is_recurring: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const demoAccounts: Account[] = [
  {
    id: '1',
    name: 'Conta Principal',
    type: 'checking',
    balance: 10300,
    is_default: true,
    include_in_total: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Poupanca',
    type: 'savings',
    balance: 5000,
    is_default: false,
    include_in_total: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const demoCategories: Category[] = [
  { id: '1', name: 'Salario', type: 'income', color: '#006b2c', created_at: '', updated_at: '' },
  { id: '2', name: 'Alimentacao', type: 'expense', color: '#ff6b6b', created_at: '', updated_at: '' },
  { id: '3', name: 'Entretenimento', type: 'expense', color: '#9b59b6', created_at: '', updated_at: '' },
  { id: '4', name: 'Moradia', type: 'expense', color: '#3498db', created_at: '', updated_at: '' },
]

// Use demo data if API fails
watch([isSummaryLoading, isTransactionsLoading], () => {
  if (!isSummaryLoading.value && !summary.value) {
    useDemoData.value = true
  }
})

const displaySummary = computed(() => useDemoData.value ? demoSummary : summaryData.value)
const displayTransactions = computed(() => useDemoData.value ? demoTransactions : transactions.value)
const displayAccounts = computed(() => useDemoData.value ? demoAccounts : accountsList.value)
const displayCategories = computed(() => useDemoData.value ? demoCategories : categoriesList.value)
</script>

<template>
  <AppLayout>
    <div class="p-4 lg:p-6 space-y-6">
      <!-- Header with Period Filter -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-on-surface">Dashboard</h1>
          <p class="text-on-surface-variant">Visao geral das suas financas</p>
        </div>
        <PeriodFilter v-model="period" />
      </div>

      <!-- Summary Cards -->
      <SummaryCards
        :previous-balance="displaySummary.previous_balance"
        :income="displaySummary.income"
        :expenses="displaySummary.expenses"
        :current-balance="displaySummary.current_balance"
        :is-loading="isSummaryLoading && !useDemoData"
      />

      <!-- Recent Transactions -->
      <RecentTransactions
        :transactions="displayTransactions"
        :categories="displayCategories"
        :accounts="displayAccounts"
        :is-loading="isTransactionsLoading && !useDemoData"
        :limit="5"
      />

      <!-- Demo data indicator -->
      <div v-if="useDemoData" class="text-center">
        <p class="text-sm text-on-surface-variant">
          Exibindo dados de demonstracao. Conecte a API para ver dados reais.
        </p>
      </div>
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
      :accounts="displayAccounts"
      :categories="displayCategories"
      :is-loading="createTransaction.isPending.value"
      @submit="handleTransactionSubmit"
    />
  </AppLayout>
</template>
