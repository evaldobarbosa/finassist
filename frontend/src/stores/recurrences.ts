import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Recurrence } from '@/types'

export const useRecurrencesStore = defineStore('recurrences', () => {
  // State
  const selectedRecurrence = ref<Recurrence | null>(null)
  const isModalOpen = ref(false)
  const modalMode = ref<'create' | 'edit'>('create')

  // Actions
  function openCreateModal() {
    selectedRecurrence.value = null
    modalMode.value = 'create'
    isModalOpen.value = true
  }

  function openEditModal(recurrence: Recurrence) {
    selectedRecurrence.value = recurrence
    modalMode.value = 'edit'
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
    selectedRecurrence.value = null
  }

  // Computed helpers
  const isEditing = computed(() => modalMode.value === 'edit')

  return {
    // State
    selectedRecurrence,
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
