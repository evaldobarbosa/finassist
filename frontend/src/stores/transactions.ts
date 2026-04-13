import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Transaction, TransactionType } from '@/types'

export interface TransactionFilters {
  search: string
  type: TransactionType | ''
  account_id: string
  category_id: string
}

export const useTransactionsStore = defineStore('transactions', () => {
  // Period state (month/year)
  const currentDate = new Date()
  const period = ref({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  })

  // Compute period dates from month/year
  const periodDates = computed(() => {
    const startDate = new Date(period.value.year, period.value.month, 1)
    const endDate = new Date(period.value.year, period.value.month + 1, 0)

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    }
  })

  // State
  const filters = ref<TransactionFilters>({
    search: '',
    type: '',
    account_id: '',
    category_id: '',
  })

  const currentPage = ref(1)
  const perPage = ref(20)

  const selectedTransaction = ref<Transaction | null>(null)
  const isModalOpen = ref(false)
  const modalMode = ref<'create' | 'edit'>('create')
  const defaultTransactionType = ref<TransactionType>('expense')

  // Computed
  const hasActiveFilters = computed(() => {
    return !!(
      filters.value.search ||
      filters.value.type ||
      filters.value.account_id ||
      filters.value.category_id
    )
  })

  // Actions
  function setPeriod(newPeriod: { month: number; year: number }) {
    period.value = newPeriod
    currentPage.value = 1 // Reset to first page when period changes
  }

  function setFilters(newFilters: Partial<TransactionFilters>) {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1 // Reset to first page when filters change
  }

  function resetFilters() {
    filters.value = {
      search: '',
      type: '',
      account_id: '',
      category_id: '',
    }
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function openCreateModal(type: TransactionType = 'expense') {
    selectedTransaction.value = null
    defaultTransactionType.value = type
    modalMode.value = 'create'
    isModalOpen.value = true
  }

  function openEditModal(transaction: Transaction) {
    selectedTransaction.value = transaction
    modalMode.value = 'edit'
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
    selectedTransaction.value = null
  }

  // Build query params for API
  function getQueryParams(): Record<string, string> {
    const params: Record<string, string> = {
      page: currentPage.value.toString(),
      per_page: perPage.value.toString(),
      start_date: periodDates.value.start,
      end_date: periodDates.value.end,
    }

    if (filters.value.search) {
      params.search = filters.value.search
    }
    if (filters.value.type) {
      params.type = filters.value.type
    }
    if (filters.value.account_id) {
      params.account_id = filters.value.account_id
    }
    if (filters.value.category_id) {
      params.category_id = filters.value.category_id
    }

    return params
  }

  return {
    // State
    period,
    periodDates,
    filters,
    currentPage,
    perPage,
    selectedTransaction,
    isModalOpen,
    modalMode,
    defaultTransactionType,

    // Computed
    hasActiveFilters,

    // Actions
    setPeriod,
    setFilters,
    resetFilters,
    setPage,
    openCreateModal,
    openEditModal,
    closeModal,
    getQueryParams,
  }
})
