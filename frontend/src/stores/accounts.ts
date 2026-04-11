import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '@/types'

export const useAccountsStore = defineStore('accounts', () => {
  // State
  const selectedAccount = ref<Account | null>(null)
  const isModalOpen = ref(false)
  const modalMode = ref<'create' | 'edit'>('create')

  // Actions
  function openCreateModal() {
    selectedAccount.value = null
    modalMode.value = 'create'
    isModalOpen.value = true
  }

  function openEditModal(account: Account) {
    selectedAccount.value = account
    modalMode.value = 'edit'
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
    selectedAccount.value = null
  }

  // Computed helpers
  const isEditing = computed(() => modalMode.value === 'edit')

  return {
    // State
    selectedAccount,
    isModalOpen,
    modalMode,

    // Computed
    isEditing,

    // Actions
    openCreateModal,
    openEditModal,
    closeModal,
  }
})
