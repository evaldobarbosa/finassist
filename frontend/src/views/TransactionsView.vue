<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import TransactionFilters from '@/components/transactions/TransactionFilters.vue'
import TransactionList from '@/components/transactions/TransactionList.vue'
import TransactionModal from '@/components/transactions/TransactionModal.vue'
import { Button } from '@/components/ui/button'
import { useTransactionsStore } from '@/stores/transactions'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import type { Transaction, Account, Category, PaginatedResponse } from '@/types'

const route = useRoute()
const queryClient = useQueryClient()
const transactionsStore = useTransactionsStore()
const { success, error: showError } = useToast()

const {
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
    return api.get<PaginatedResponse<Transaction>>(`/transactions?${params.toString()}`)
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
const totalPages = computed(() => transactionsData.value?.total_pages || 1)
const accountsList = computed(() => accounts.value || [])
const categoriesList = computed(() => categories.value || [])

const totalAmount = computed(() => {
  const data = transactions.value
  return {
    income: data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    expense: data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
  }
})

// Handlers
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

// Demo data for when API is not available
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
    description: 'Freelance - Projeto Web',
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
  {
    id: '6',
    description: 'Conta de Luz',
    amount: 180.50,
    type: 'expense',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    account_id: '1',
    category_id: '4',
    is_recurring: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    description: 'Transferencia para Poupanca',
    amount: 500,
    type: 'transfer',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    account_id: '1',
    destination_account_id: '2',
    is_recurring: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const demoAccounts: Account[] = [
  { id: '1', name: 'Conta Principal', type: 'checking', balance: 10300, is_default: true, include_in_total: true, created_at: '', updated_at: '' },
  { id: '2', name: 'Poupanca', type: 'savings', balance: 5000, is_default: false, include_in_total: true, created_at: '', updated_at: '' },
]

const demoCategories: Category[] = [
  { id: '1', name: 'Salario', type: 'income', color: '#006b2c', created_at: '', updated_at: '' },
  { id: '2', name: 'Alimentacao', type: 'expense', color: '#ff6b6b', created_at: '', updated_at: '' },
  { id: '3', name: 'Entretenimento', type: 'expense', color: '#9b59b6', created_at: '', updated_at: '' },
  { id: '4', name: 'Moradia', type: 'expense', color: '#3498db', created_at: '', updated_at: '' },
]

const useDemoData = computed(() => !isLoading.value && transactions.value.length === 0 && !transactionsStore.hasActiveFilters)

const displayTransactions = computed(() => useDemoData.value ? demoTransactions : transactions.value)
const displayAccounts = computed(() => accountsList.value.length > 0 ? accountsList.value : demoAccounts)
const displayCategories = computed(() => categoriesList.value.length > 0 ? categoriesList.value : demoCategories)
const displayTotalAmount = computed(() => {
  if (useDemoData.value) {
    return {
      income: demoTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      expense: demoTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    }
  }
  return totalAmount.value
})
</script>

<template>
  <AppLayout>
    <div class="p-4 lg:p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-on-surface">Transacoes</h1>
          <p class="text-on-surface-variant">Gerencie suas receitas e despesas</p>
        </div>
        <Button @click="openCreateModal">
          <Plus class="h-4 w-4 mr-2" />
          Nova Transacao
        </Button>
      </div>

      <!-- Filters -->
      <TransactionFilters
        :model-value="filters"
        :accounts="displayAccounts"
        :categories="displayCategories"
        @update:model-value="handleFiltersChange"
      />

      <!-- Transaction List -->
      <TransactionList
        :transactions="displayTransactions"
        :categories="displayCategories"
        :accounts="displayAccounts"
        :is-loading="isLoading"
        :page="currentPage"
        :total-pages="totalPages"
        :total-amount="displayTotalAmount"
        @edit="handleEdit"
        @delete="handleDelete"
        @page-change="handlePageChange"
      />

      <!-- Demo data indicator -->
      <div v-if="useDemoData" class="text-center">
        <p class="text-sm text-on-surface-variant">
          Exibindo dados de demonstracao. Conecte a API para ver dados reais.
        </p>
      </div>
    </div>

    <!-- Transaction Modal -->
    <TransactionModal
      v-model:open="isModalOpen"
      :type="modalMode === 'create' ? defaultTransactionType : undefined"
      :transaction="selectedTransaction"
      :accounts="displayAccounts"
      :categories="displayCategories"
      :is-loading="createMutation.isPending.value || updateMutation.isPending.value"
      :is-deleting="deleteMutation.isPending.value"
      @submit="handleModalSubmit"
      @delete="handleModalDelete"
    />
  </AppLayout>
</template>
