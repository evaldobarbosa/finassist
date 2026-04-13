<script setup lang="ts">
import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus, Search, Filter } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import { CategoryTable, CategoryModal } from '@/components/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategoriesStore } from '@/stores/categories'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import type { Category } from '@/types'

const queryClient = useQueryClient()
const categoriesStore = useCategoriesStore()
const { success, error: showError } = useToast()

const {
  isModalOpen,
  modalMode,
  selectedCategory,
  typeFilter,
  searchQuery,
} = storeToRefs(categoriesStore)

// Fetch categories
const { data: categories, isLoading } = useQuery({
  queryKey: ['categories'],
  queryFn: () => api.get<Category[]>('/categories'),
})

// Create category
const createMutation = useMutation({
  mutationFn: (data: Partial<Category>) => api.post<Category>('/categories', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    categoriesStore.closeModal()
    success('Categoria criada', 'Sua categoria foi criada com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel criar a categoria')
  },
})

// Update category
const updateMutation = useMutation({
  mutationFn: ({ id, ...data }: Partial<Category> & { id: string }) =>
    api.put<Category>(`/categories/${id}`, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    categoriesStore.closeModal()
    success('Categoria atualizada', 'Sua categoria foi atualizada com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel atualizar a categoria')
  },
})

// Delete category
const deleteMutation = useMutation({
  mutationFn: (id: string) => api.delete(`/categories/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    categoriesStore.closeModal()
    success('Categoria excluida', 'Sua categoria foi excluida com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel excluir a categoria')
  },
})

// Filter categories
const filteredCategories = computed(() => {
  let result = categories.value || []

  // Filter by type
  if (typeFilter.value !== 'all') {
    result = result.filter(c => c.type === typeFilter.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(query)
    )
  }

  return result
})

// Category counts
const categoryCounts = computed(() => {
  const all = categories.value || []
  return {
    total: all.length,
    income: all.filter(c => c.type === 'income').length,
    expense: all.filter(c => c.type === 'expense').length,
  }
})

// Handlers
function handleEdit(category: Category) {
  categoriesStore.openEditModal(category)
}

function handleDelete(category: Category) {
  categoriesStore.openEditModal(category)
}

function handleModalSubmit(data: Partial<Category>) {
  if (modalMode.value === 'edit' && selectedCategory.value) {
    updateMutation.mutate({ id: selectedCategory.value.id, ...data })
  } else {
    createMutation.mutate(data)
  }
}

function handleModalDelete(id: string) {
  deleteMutation.mutate(id)
}

</script>

<template>
  <AppLayout>
    <div class="p-4 lg:p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-on-surface">Categorias</h1>
          <p class="text-on-surface-variant">
            {{ categoryCounts.total }} categorias ({{ categoryCounts.income }} receitas, {{ categoryCounts.expense }} despesas)
          </p>
        </div>
        <Button @click="categoriesStore.openCreateModal">
          <Plus class="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <Input
            :model-value="searchQuery"
            @update:model-value="(val) => categoriesStore.setSearchQuery(String(val))"
            type="text"
            placeholder="Buscar categorias..."
            class="pl-10"
          />
        </div>

        <!-- Type Filter -->
        <Select :model-value="typeFilter" @update:model-value="(val) => categoriesStore.setTypeFilter(val as 'all' | 'income' | 'expense')">
          <SelectTrigger class="w-full sm:w-[180px]">
            <Filter class="h-4 w-4 mr-2 text-on-surface-variant" />
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
            <SelectItem value="expense">Despesas</SelectItem>
          </SelectContent>
        </Select>

        <!-- Clear Filters -->
        <Button
          v-if="categoriesStore.hasActiveFilters"
          variant="ghost"
          @click="categoriesStore.clearFilters"
          class="text-on-surface-variant"
        >
          Limpar filtros
        </Button>
      </div>

      <!-- Categories Table -->
      <CategoryTable
        :categories="filteredCategories"
        :is-loading="isLoading"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Category Modal -->
    <CategoryModal
      v-model:open="isModalOpen"
      :category="selectedCategory"
      :categories="filteredCategories"
      :is-loading="createMutation.isPending.value || updateMutation.isPending.value"
      :is-deleting="deleteMutation.isPending.value"
      @submit="handleModalSubmit"
      @delete="handleModalDelete"
    />
  </AppLayout>
</template>
