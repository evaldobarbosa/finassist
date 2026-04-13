<script setup lang="ts">
import { computed, watch } from 'vue'
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
import type { Transaction, Account, Category, TransactionsResponse } from '@/types'

const route = useRoute()
const queryClient = useQueryClient()
const transactionsStore = useTransactionsStore()
const { success, error: showError } = useToast()

const {
  period,
  filters,
  currentPage,
  isModalOpen,
  modalMode,
  selectedTransaction,
  defaultTransactionType,
} = storeToRefs(transactionsStore)

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

// Build query string from filters
const queryParams = computed(() => transactionsStore.getQueryParams())

// Fetch transactions
const { data: transactionsData, isLoading, refetch } = useQuery({
  queryKey: ['transactions', queryParams],
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
    transactionsStore.closeModal()
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
    transactionsStore.closeModal()
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
    transactionsStore.closeModal()
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
      transactionsStore.openEditModal(transaction)
    }
  }
}, { immediate: true })

// Computed data
const transactions = computed(() => transactionsData.value?.data || [])
const totalPages = computed(() => transactionsData.value?.last_page || 1)
const accountsList = computed(() => accounts.value || [])
const categoriesList = computed(() => categories.value || [])

// Use totals from API response
const totalAmount = computed(() => ({
  income: transactionsData.value?.receitas || 0,
  expense: transactionsData.value?.despesas || 0,
}))

// Handlers
function handlePeriodChange(newPeriod: { month: number; year: number }) {
  transactionsStore.setPeriod(newPeriod)
}

function handleFiltersChange(newFilters: typeof filters.value) {
  transactionsStore.setFilters(newFilters)
}

function handleEdit(transaction: Transaction) {
  transactionsStore.openEditModal(transaction)
}

function handleDelete(transaction: Transaction) {
  transactionsStore.openEditModal(transaction)
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
  transactionsStore.setPage(page)
}

function openCreateModal() {
  transactionsStore.openCreateModal('expense')
}
</script>

<template>
  <AppLayout>
    <div class="p-4 lg:p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-on-surface">Extrato</h1>
          <p class="text-on-surface-variant">Historico de transacoes</p>
        </div>
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
      :is-loading="createMutation.isPending.value || updateMutation.isPending.value"
      :is-deleting="deleteMutation.isPending.value"
      @submit="handleModalSubmit"
      @delete="handleModalDelete"
    />
  </AppLayout>
</template>
