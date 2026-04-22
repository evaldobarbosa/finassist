import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CreditCard } from '@/types'

export const useCreditCardsStore = defineStore('creditCards', () => {
  // Modal state
  const isModalOpen = ref(false)
  const modalMode = ref<'create' | 'edit'>('create')
  const selectedCard = ref<CreditCard | null>(null)

  // Invoice modal state
  const isInvoiceOpen = ref(false)
  const invoiceCard = ref<CreditCard | null>(null)

  // Add transaction modal state
  const isAddTransactionOpen = ref(false)
  const addTransactionCard = ref<CreditCard | null>(null)

  // Actions
  function openCreateModal() {
    selectedCard.value = null
    modalMode.value = 'create'
    isModalOpen.value = true
  }

  function openEditModal(card: CreditCard) {
    selectedCard.value = card
    modalMode.value = 'edit'
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
    selectedCard.value = null
  }

  function openInvoice(card: CreditCard) {
    invoiceCard.value = card
    isInvoiceOpen.value = true
  }

  function closeInvoice() {
    isInvoiceOpen.value = false
    invoiceCard.value = null
  }

  function openAddTransaction(card: CreditCard) {
    addTransactionCard.value = card
    isAddTransactionOpen.value = true
  }

  function closeAddTransaction() {
    isAddTransactionOpen.value = false
    addTransactionCard.value = null
  }

  return {
    // State
    isModalOpen,
    modalMode,
    selectedCard,
    isInvoiceOpen,
    invoiceCard,
    isAddTransactionOpen,
    addTransactionCard,

    // Actions
    openCreateModal,
    openEditModal,
    closeModal,
    openInvoice,
    closeInvoice,
    openAddTransaction,
    closeAddTransaction,
  }
})
