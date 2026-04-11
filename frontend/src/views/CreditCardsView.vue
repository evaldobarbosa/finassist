<script setup lang="ts">
import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus, CreditCard } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import { CreditCardCard, CreditCardModal, InvoiceDetails } from '@/components/credit-cards'
import { Button } from '@/components/ui/button'
import { useCreditCardsStore } from '@/stores/creditCards'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import { formatCurrency } from '@/lib/utils'
import type { CreditCard as CreditCardType, Account, Transaction } from '@/types'

const queryClient = useQueryClient()
const creditCardsStore = useCreditCardsStore()
const { success, error: showError } = useToast()

const {
  isModalOpen,
  modalMode,
  selectedCard,
  isInvoiceOpen,
  invoiceCard,
} = storeToRefs(creditCardsStore)

// Fetch credit cards
const { data: creditCards, isLoading } = useQuery({
  queryKey: ['credit-cards'],
  queryFn: () => api.get<CreditCardType[]>('/credit-cards'),
})

// Fetch accounts for payment
const { data: accounts } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => api.get<Account[]>('/accounts'),
})

// Fetch transactions for invoice
const { data: transactions } = useQuery({
  queryKey: ['transactions'],
  queryFn: () => api.get<{ data: Transaction[] }>('/transactions?limit=100'),
  select: (data) => data.data,
})

// Create credit card
const createMutation = useMutation({
  mutationFn: (data: Partial<CreditCardType>) => api.post<CreditCardType>('/credit-cards', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
    creditCardsStore.closeModal()
    success('Cartao criado', 'Seu cartao foi adicionado com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel criar o cartao')
  },
})

// Update credit card
const updateMutation = useMutation({
  mutationFn: ({ id, ...data }: Partial<CreditCardType> & { id: string }) =>
    api.put<CreditCardType>(`/credit-cards/${id}`, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
    creditCardsStore.closeModal()
    success('Cartao atualizado', 'Seu cartao foi atualizado com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel atualizar o cartao')
  },
})

// Delete credit card
const deleteMutation = useMutation({
  mutationFn: (id: string) => api.delete(`/credit-cards/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
    creditCardsStore.closeModal()
    success('Cartao excluido', 'Seu cartao foi excluido com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel excluir o cartao')
  },
})

// Computed values
const cardsList = computed(() => creditCards.value || [])
const accountsList = computed(() => accounts.value || [])

const totalLimit = computed(() => {
  return cardsList.value.reduce((sum, card) => sum + (card.limit || 0), 0)
})

const totalUsed = computed(() => {
  return cardsList.value.reduce((sum, card) => sum + card.current_balance, 0)
})

const totalAvailable = computed(() => {
  return totalLimit.value - totalUsed.value
})

// Handlers
function handleEdit(card: CreditCardType) {
  creditCardsStore.openEditModal(card)
}

function handleDelete(card: CreditCardType) {
  creditCardsStore.openEditModal(card)
}

function handleViewInvoice(card: CreditCardType) {
  creditCardsStore.openInvoice(card)
}

function handleModalSubmit(data: Partial<CreditCardType>) {
  if (modalMode.value === 'edit' && selectedCard.value) {
    updateMutation.mutate({ id: selectedCard.value.id, ...data })
  } else {
    createMutation.mutate(data)
  }
}

function handleModalDelete(id: string) {
  deleteMutation.mutate(id)
}

function handlePayInvoice(cardId: string, amount: number) {
  // TODO: Implement invoice payment flow
  success('Em breve', 'Funcionalidade de pagamento sera implementada em breve')
  creditCardsStore.closeInvoice()
}

// Demo data
const demoCreditCards: CreditCardType[] = [
  {
    id: '1',
    name: 'Nubank',
    brand: 'mastercard',
    last_four_digits: '4532',
    limit: 5000,
    current_balance: 1250.80,
    closing_day: 15,
    due_day: 22,
    color: '#8B5CF6',
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    name: 'Inter',
    brand: 'mastercard',
    last_four_digits: '7891',
    limit: 3000,
    current_balance: 890.50,
    closing_day: 10,
    due_day: 17,
    color: '#F97316',
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    name: 'Itau Platinum',
    brand: 'visa',
    last_four_digits: '2468',
    limit: 10000,
    current_balance: 3500,
    closing_day: 5,
    due_day: 12,
    color: '#1a1a2e',
    created_at: '',
    updated_at: '',
  },
]

const demoAccounts: Account[] = [
  { id: '1', name: 'Conta Principal', type: 'checking', balance: 10300, is_default: true, include_in_total: true, created_at: '', updated_at: '' },
]

const useDemoData = computed(() => !isLoading.value && cardsList.value.length === 0)

const displayCards = computed(() => useDemoData.value ? demoCreditCards : cardsList.value)
const displayAccounts = computed(() => accountsList.value.length > 0 ? accountsList.value : demoAccounts)

const displayTotals = computed(() => {
  if (useDemoData.value) {
    const total = demoCreditCards.reduce((sum, card) => sum + (card.limit || 0), 0)
    const used = demoCreditCards.reduce((sum, card) => sum + card.current_balance, 0)
    return { limit: total, used, available: total - used }
  }
  return { limit: totalLimit.value, used: totalUsed.value, available: totalAvailable.value }
})
</script>

<template>
  <AppLayout>
    <div class="p-4 lg:p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-on-surface">Cartoes de Credito</h1>
          <p class="text-on-surface-variant">
            {{ displayCards.length }} cartao(s) cadastrado(s)
          </p>
        </div>
        <Button @click="creditCardsStore.openCreateModal">
          <Plus class="h-4 w-4 mr-2" />
          Novo Cartao
        </Button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-surface-container-lowest rounded-xl p-4 shadow-editorial">
          <p class="text-sm text-on-surface-variant">Limite total</p>
          <p class="text-xl font-bold text-on-surface">{{ formatCurrency(displayTotals.limit) }}</p>
        </div>
        <div class="bg-surface-container-lowest rounded-xl p-4 shadow-editorial">
          <p class="text-sm text-on-surface-variant">Total utilizado</p>
          <p class="text-xl font-bold text-tertiary">{{ formatCurrency(displayTotals.used) }}</p>
        </div>
        <div class="bg-surface-container-lowest rounded-xl p-4 shadow-editorial">
          <p class="text-sm text-on-surface-variant">Disponivel</p>
          <p class="text-xl font-bold text-primary">{{ formatCurrency(displayTotals.available) }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="space-y-4">
          <div class="h-40 bg-surface-container rounded-2xl animate-pulse" />
          <div class="h-32 bg-surface-container rounded-xl animate-pulse" />
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="displayCards.length === 0"
        class="bg-surface-container-lowest rounded-xl shadow-editorial p-12 text-center"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-container flex items-center justify-center">
          <CreditCard class="h-8 w-8 text-on-surface-variant" />
        </div>
        <h3 class="text-lg font-medium text-on-surface mb-2">Nenhum cartao cadastrado</h3>
        <p class="text-on-surface-variant max-w-sm mx-auto mb-4">
          Adicione seus cartoes de credito para acompanhar gastos e faturas
        </p>
        <Button @click="creditCardsStore.openCreateModal">
          <Plus class="h-4 w-4 mr-2" />
          Adicionar primeiro cartao
        </Button>
      </div>

      <!-- Credit Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreditCardCard
          v-for="card in displayCards"
          :key="card.id"
          :card="card"
          @edit="handleEdit"
          @delete="handleDelete"
          @view-invoice="handleViewInvoice"
        />
      </div>

      <!-- Demo data indicator -->
      <div v-if="useDemoData" class="text-center">
        <p class="text-sm text-on-surface-variant">
          Exibindo dados de demonstracao. Conecte a API para ver dados reais.
        </p>
      </div>
    </div>

    <!-- Credit Card Modal -->
    <CreditCardModal
      v-model:open="isModalOpen"
      :card="selectedCard"
      :accounts="displayAccounts"
      :is-loading="createMutation.isPending.value || updateMutation.isPending.value"
      :is-deleting="deleteMutation.isPending.value"
      @submit="handleModalSubmit"
      @delete="handleModalDelete"
    />

    <!-- Invoice Details -->
    <InvoiceDetails
      v-model:open="isInvoiceOpen"
      :card="invoiceCard"
      :transactions="transactions"
      @pay-invoice="handlePayInvoice"
    />
  </AppLayout>
</template>
