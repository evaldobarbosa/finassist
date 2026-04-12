<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus, Repeat, TrendingUp, TrendingDown, CalendarDays } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import RecurrenceCard from '@/components/recurrences/RecurrenceCard.vue'
import RecurrenceModal from '@/components/recurrences/RecurrenceModal.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRecurrencesStore } from '@/stores/recurrences'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import { formatCurrency } from '@/lib/utils'
import type { Recurrence } from '@/types'

interface RecurrencesResponse {
  data: Recurrence[]
  total: number
  current_page: number
  last_page: number
}

const queryClient = useQueryClient()
const recurrencesStore = useRecurrencesStore()
const { success, error: showError } = useToast()

const { isModalOpen, selectedRecurrence } = storeToRefs(recurrencesStore)

// Filters
const activeFilter = ref<'all' | 'active' | 'paused'>('all')
const typeFilter = ref<'all' | 'income' | 'expense'>('all')

// Fetch recurrences
const { data: recurrencesData, isLoading } = useQuery({
  queryKey: ['recurrences', activeFilter, typeFilter],
  queryFn: async () => {
    const params = new URLSearchParams()
    if (activeFilter.value === 'active') params.append('active', '1')
    if (activeFilter.value === 'paused') params.append('active', '0')
    if (typeFilter.value !== 'all') params.append('type', typeFilter.value)

    const query = params.toString()
    return api.get<RecurrencesResponse>(`/recurrences${query ? `?${query}` : ''}`)
  },
})

// Create recurrence
const createMutation = useMutation({
  mutationFn: (data: Partial<Recurrence>) =>
    api.post<{ data: Recurrence }>('/recurrences', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['recurrences'] })
    recurrencesStore.closeModal()
    success('Recorrencia criada', 'Sua recorrencia foi adicionada com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel criar a recorrencia')
  },
})

// Update recurrence
const updateMutation = useMutation({
  mutationFn: ({ id, ...data }: Partial<Recurrence> & { id: string }) =>
    api.put<{ data: Recurrence }>(`/recurrences/${id}`, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['recurrences'] })
    recurrencesStore.closeModal()
    success('Recorrencia atualizada', 'Sua recorrencia foi atualizada com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel atualizar a recorrencia')
  },
})

// Delete recurrence
const deleteMutation = useMutation({
  mutationFn: (id: string) => api.delete(`/recurrences/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['recurrences'] })
    recurrencesStore.closeModal()
    success('Recorrencia excluida', 'Sua recorrencia foi excluida com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel excluir a recorrencia')
  },
})

// Pause recurrence
const pauseMutation = useMutation({
  mutationFn: (id: string) => api.post(`/recurrences/${id}/pause`, {}),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['recurrences'] })
    success('Recorrencia pausada', 'A recorrencia foi pausada')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel pausar a recorrencia')
  },
})

// Resume recurrence
const resumeMutation = useMutation({
  mutationFn: (id: string) => api.post(`/recurrences/${id}/resume`, {}),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['recurrences'] })
    success('Recorrencia retomada', 'A recorrencia foi retomada')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel retomar a recorrencia')
  },
})

// Computed values
const recurrencesList = computed(() => recurrencesData.value?.data || [])

const totalMonthlyExpenses = computed(() => {
  return recurrencesList.value
    .filter((r) => r.is_active && r.type === 'expense' && r.frequency === 'monthly')
    .reduce((sum, r) => sum + Number(r.amount), 0)
})

const totalMonthlyIncome = computed(() => {
  return recurrencesList.value
    .filter((r) => r.is_active && r.type === 'income' && r.frequency === 'monthly')
    .reduce((sum, r) => sum + Number(r.amount), 0)
})

const activeCount = computed(() =>
  recurrencesList.value.filter((r) => r.is_active).length
)

const pausedCount = computed(() =>
  recurrencesList.value.filter((r) => !r.is_active).length
)

// Handlers
function handleEdit(recurrence: Recurrence) {
  recurrencesStore.openEditModal(recurrence)
}

function handleDelete(recurrence: Recurrence) {
  recurrencesStore.openEditModal(recurrence)
}

function handlePause(recurrence: Recurrence) {
  pauseMutation.mutate(recurrence.id)
}

function handleResume(recurrence: Recurrence) {
  resumeMutation.mutate(recurrence.id)
}

function handleModalSubmit(data: Partial<Recurrence>) {
  if (recurrencesStore.modalMode === 'edit' && selectedRecurrence.value) {
    updateMutation.mutate({ id: selectedRecurrence.value.id, ...data })
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
          <h1 class="text-2xl font-bold text-on-surface">Recorrencias</h1>
          <p class="text-on-surface-variant">
            Gerencie seus custos fixos e receitas recorrentes
          </p>
        </div>
        <Button @click="recurrencesStore.openCreateModal">
          <Plus class="h-4 w-4 mr-2" />
          Nova Recorrencia
        </Button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-surface-container-lowest rounded-xl p-5 shadow-editorial">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <TrendingDown class="h-5 w-5 text-tertiary" />
            </div>
            <span class="text-sm text-on-surface-variant">Despesas Mensais</span>
          </div>
          <p class="text-2xl font-bold text-tertiary">
            {{ formatCurrency(totalMonthlyExpenses) }}
          </p>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-5 shadow-editorial">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp class="h-5 w-5 text-primary" />
            </div>
            <span class="text-sm text-on-surface-variant">Receitas Mensais</span>
          </div>
          <p class="text-2xl font-bold text-primary">
            {{ formatCurrency(totalMonthlyIncome) }}
          </p>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-5 shadow-editorial">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Repeat class="h-5 w-5 text-secondary" />
            </div>
            <span class="text-sm text-on-surface-variant">Total</span>
          </div>
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="bg-primary/10 text-primary border-primary/20">
              {{ activeCount }} ativas
            </Badge>
            <Badge
              v-if="pausedCount > 0"
              variant="outline"
              class="bg-outline/10 text-on-surface-variant"
            >
              {{ pausedCount }} pausadas
            </Badge>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2">
        <Button
          :variant="activeFilter === 'all' ? 'default' : 'outline'"
          size="sm"
          @click="activeFilter = 'all'"
        >
          Todas
        </Button>
        <Button
          :variant="activeFilter === 'active' ? 'default' : 'outline'"
          size="sm"
          @click="activeFilter = 'active'"
        >
          Ativas
        </Button>
        <Button
          :variant="activeFilter === 'paused' ? 'default' : 'outline'"
          size="sm"
          @click="activeFilter = 'paused'"
        >
          Pausadas
        </Button>
        <div class="w-px bg-outline-variant mx-2"></div>
        <Button
          :variant="typeFilter === 'all' ? 'default' : 'outline'"
          size="sm"
          @click="typeFilter = 'all'"
        >
          Todos os tipos
        </Button>
        <Button
          :variant="typeFilter === 'expense' ? 'default' : 'outline'"
          size="sm"
          @click="typeFilter = 'expense'"
        >
          <TrendingDown class="h-4 w-4 mr-1" />
          Despesas
        </Button>
        <Button
          :variant="typeFilter === 'income' ? 'default' : 'outline'"
          size="sm"
          @click="typeFilter = 'income'"
        >
          <TrendingUp class="h-4 w-4 mr-1" />
          Receitas
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-surface-container-lowest rounded-xl p-5 shadow-editorial"
        >
          <div class="flex items-start gap-4 mb-4">
            <div class="w-10 h-10 rounded-lg bg-surface-container animate-pulse"></div>
            <div class="flex-1 space-y-2">
              <div class="h-5 bg-surface-container rounded animate-pulse w-3/4"></div>
              <div class="h-4 bg-surface-container rounded animate-pulse w-1/2"></div>
            </div>
          </div>
          <div class="h-8 bg-surface-container rounded animate-pulse w-1/3 mb-4"></div>
          <div class="pt-4 border-t border-outline-variant">
            <div class="h-4 bg-surface-container rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="recurrencesList.length === 0"
        class="bg-surface-container-lowest rounded-xl p-12 shadow-editorial text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4"
        >
          <CalendarDays class="h-8 w-8 text-on-surface-variant" />
        </div>
        <h3 class="text-lg font-medium text-on-surface mb-2">
          Nenhuma recorrencia cadastrada
        </h3>
        <p class="text-on-surface-variant mb-6">
          Adicione seus custos fixos e receitas recorrentes para ter controle total
        </p>
        <Button @click="recurrencesStore.openCreateModal">
          <Plus class="h-4 w-4 mr-2" />
          Adicionar primeira recorrencia
        </Button>
      </div>

      <!-- Recurrences Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RecurrenceCard
          v-for="recurrence in recurrencesList"
          :key="recurrence.id"
          :recurrence="recurrence"
          @edit="handleEdit"
          @delete="handleDelete"
          @pause="handlePause"
          @resume="handleResume"
        />
      </div>
    </div>

    <!-- Recurrence Modal -->
    <RecurrenceModal
      v-model:open="isModalOpen"
      :recurrence="selectedRecurrence"
      :is-loading="createMutation.isPending.value || updateMutation.isPending.value"
      :is-deleting="deleteMutation.isPending.value"
      @submit="handleModalSubmit"
      @delete="handleModalDelete"
    />
  </AppLayout>
</template>
