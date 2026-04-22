<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import PeriodFilter from '@/components/dashboard/PeriodFilter.vue'
import TransactionFilters from '@/components/transactions/TransactionFilters.vue'
import TransactionList from '@/components/transactions/TransactionList.vue'
import TransactionModal from '@/components/transactions/TransactionModal.vue'
import { Button } from '@/components/ui/button'
import { useTransactionsStore } from '@/stores/transactions'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import type { Transaction, Account, Category, TransactionsResponse, CreditCard } from '@/types'

const route = useRoute()
const queryClient = useQueryClient()
const store = useTransactionsStore()
const { success, error: showError } = useToast()

// Use storeToRefs for reactive state
const {
  filters,
  currentPage,
  isModalOpen,
  modalMode,
  selectedTransaction,
  defaultTransactionType,
} = storeToRefs(store)

// Period - manage locally to avoid store issues
const currentDate = new Date()
const period = ref({
  month: currentDate.getMonth(),
  year: currentDate.getFullYear(),
})

function handlePeriodChange(newPeriod: { month: number; year: number }) {
  period.value = newPeriod
}

// Compute period dates
const periodDates = computed(() => {
  const startDate = new Date(period.value.year, period.value.month, 1)
  const endDate = new Date(period.value.year, period.value.month + 1, 0)
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  }
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

// Fetch credit cards
const { data: creditCards } = useQuery({
  queryKey: ['credit-cards'],
  queryFn: () => api.get<CreditCard[]>('/credit-cards'),
})

// Build query params for API
const queryParams = computed(() => {
  const params: Record<string, string> = {
    page: currentPage.value.toString(),
    per_page: '20',
    start_date: periodDates.value.start,
    end_date: periodDates.value.end,
  }

  if (filters.value.search) params.search = filters.value.search
  if (filters.value.type) params.type = filters.value.type
  if (filters.value.account_id) params.account_id = filters.value.account_id
  if (filters.value.category_id) params.category_id = filters.value.category_id

  return params
})

// Fetch transactions
const { data: transactionsData, isLoading, refetch } = useQuery({
  queryKey: computed(() => ['transactions', periodDates.value, filters.value, currentPage.value]),
  queryFn: () => {
    const params = new URLSearchParams(queryParams.value)
    return api.get<TransactionsResponse>(`/transactions?${params.toString()}`)
  },
})

// Create transaction
const createMutation = useMutation({
  mutationFn: (data: Partial<Transaction>) => api.post<Transaction>('/transactions', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
    store.closeModal()
    success('Transacao adicionada', 'Sua transacao foi registrada com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel adicionar a transacao')
  },
})

// Update transaction
const updateMutation = useMutation({
  mutationFn: ({ id, ...data }: Partial<Transaction> & { id: string }) =>
    api.put<Transaction>(`/transactions/${id}`, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
    store.closeModal()
    success('Transacao atualizada', 'Sua transacao foi atualizada com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel atualizar a transacao')
  },
})

// Delete transaction
const deleteMutation = useMutation({
  mutationFn: (id: string) => api.delete(`/transactions/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
    store.closeModal()
    success('Transacao excluida', 'Sua transacao foi excluida com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel excluir a transacao')
  },
})

// Handle URL query params (e.g., ?id=123 to open edit modal)
watch(() => route.query.id, (id) => {
  if (id && transactionsData.value?.data) {
    const transaction = transactionsData.value.data.find(t => t.id === id)
    if (transaction) {
      store.openEditModal(transaction)
    }
  }
}, { immediate: true })

// Computed data
const transactions = computed(() => transactionsData.value?.data || [])
const totalPages = computed(() => transactionsData.value?.last_page || 1)
const accountsList = computed(() => accounts.value || [])
const categoriesList = computed(() => categories.value || [])
const creditCardsList = computed(() => creditCards.value || [])

// Use totals from API response
const totalAmount = computed(() => ({
  income: transactionsData.value?.receitas || 0,
  expense: transactionsData.value?.despesas || 0,
}))

// Handlers
function handleFiltersChange(newFilters: typeof filters.value) {
  store.setFilters(newFilters)
}

function handleEdit(transaction: Transaction) {
  store.openEditModal(transaction)
}

function handleDelete(transaction: Transaction) {
  store.openEditModal(transaction)
}

function handleModalSubmit(data: Partial<Transaction>) {
  if (modalMode.value === 'edit' && selectedTransaction.value) {
    updateMutation.mutate({ id: selectedTransaction.value.id, ...data })
  } else {
    createMutation.mutate(data)
  }
}

function handleModalDelete(id: string) {
  deleteMutation.mutate(id)
}

function handlePageChange(page: number) {
  store.setPage(page)
}

function openCreateModal() {
  store.openCreateModal('expense')
}
</script>

<template>
  <AppLayout>
    <div class="p-4 lg:p-6 space-y-6">
      <!-- Actions -->
      <div class="flex justify-end">
        <Button @click="openCreateModal">
          <Plus class="h-4 w-4 mr-2" />
          Nova Transacao
        </Button>
      </div>

      <!-- Filters with Period Selector -->
      <TransactionFilters
        :model-value="filters"
        :accounts="accountsList"
        :categories="categoriesList"
        @update:model-value="handleFiltersChange"
      >
        <template #period>
          <PeriodFilter :model-value="period" @update:model-value="handlePeriodChange" />
        </template>
      </TransactionFilters>

      <!-- Transaction List -->
      <TransactionList
        :transactions="transactions"
        :categories="categoriesList"
        :accounts="accountsList"
        :is-loading="isLoading"
        :page="currentPage"
        :total-pages="totalPages"
        :total-amount="totalAmount"
        @edit="handleEdit"
        @delete="handleDelete"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Transaction Modal -->
    <TransactionModal
      v-model:open="isModalOpen"
      :type="modalMode === 'create' ? defaultTransactionType : undefined"
      :transaction="selectedTransaction"
      :accounts="accountsList"
      :categories="categoriesList"
      :credit-cards="creditCardsList"
      :is-loading="createMutation.isPending.value || updateMutation.isPending.value"
      :is-deleting="deleteMutation.isPending.value"
      @submit="handleModalSubmit"
      @delete="handleModalDelete"
    />
  </AppLayout>
</template>
