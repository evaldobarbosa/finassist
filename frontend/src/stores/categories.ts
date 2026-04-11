import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Category } from '@/types'

export const useCategoriesStore = defineStore('categories', () => {
  // Modal state
  const isModalOpen = ref(false)
  const modalMode = ref<'create' | 'edit'>('create')
  const selectedCategory = ref<Category | null>(null)

  // Filter state
  const typeFilter = ref<'all' | 'income' | 'expense'>('all')
  const searchQuery = ref('')

  // Actions
  function openCreateModal() {
    selectedCategory.value = null
    modalMode.value = 'create'
    isModalOpen.value = true
  }

  function openEditModal(category: Category) {
    selectedCategory.value = category
    modalMode.value = 'edit'
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
    selectedCategory.value = null
  }

  function setTypeFilter(type: 'all' | 'income' | 'expense') {
    typeFilter.value = type
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function clearFilters() {
    typeFilter.value = 'all'
    searchQuery.value = ''
  }

  // Computed
  const hasActiveFilters = computed(() => {
    return typeFilter.value !== 'all' || searchQuery.value !== ''
  })

  return {
    // State
    isModalOpen,
    modalMode,
    selectedCategory,
    typeFilter,
    searchQuery,

    // Actions
    openCreateModal,
    openEditModal,
    closeModal,
    setTypeFilter,
    setSearchQuery,
    clearFilters,

    // Computed
    hasActiveFilters,
  }
})
