<script setup lang="ts">
import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import AppLayout from '@/components/layout/AppLayout.vue'
import AccountCard from '@/components/accounts/AccountCard.vue'
import AccountModal from '@/components/accounts/AccountModal.vue'
import { Button } from '@/components/ui/button'
import { useAccountsStore } from '@/stores/accounts'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import { formatCurrency } from '@/lib/utils'
import type { Account } from '@/types'

const queryClient = useQueryClient()
const accountsStore = useAccountsStore()
const { success, error: showError } = useToast()

const { isModalOpen, selectedAccount } = storeToRefs(accountsStore)

// Fetch accounts
const { data: accounts, isLoading } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => api.get<Account[]>('/accounts'),
})

// Create account
const createMutation = useMutation({
  mutationFn: (data: Partial<Account>) => api.post<Account>('/accounts', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    accountsStore.closeModal()
    success('Conta criada', 'Sua conta foi adicionada com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel criar a conta')
  },
})

// Update account
const updateMutation = useMutation({
  mutationFn: ({ id, ...data }: Partial<Account> & { id: string }) =>
    api.put<Account>(`/accounts/${id}`, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    accountsStore.closeModal()
    success('Conta atualizada', 'Sua conta foi atualizada com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel atualizar a conta')
  },
})

// Delete account
const deleteMutation = useMutation({
  mutationFn: (id: string) => api.delete(`/accounts/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    accountsStore.closeModal()
    success('Conta excluida', 'Sua conta foi excluida com sucesso')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel excluir a conta')
  },
})

// Set default account
const setDefaultMutation = useMutation({
  mutationFn: (id: string) => api.patch(`/accounts/${id}/set-default`, {}),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] })
    success('Conta padrao', 'A conta padrao foi alterada')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel definir a conta padrao')
  },
})

// Computed values
const accountsList = computed(() => accounts.value || [])

const totalBalance = computed(() => {
  return accountsList.value
    .filter(a => a.include_in_total)
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)
})

const positiveBalance = computed(() => {
  return accountsList.value
    .filter(a => a.include_in_total && Number(a.balance || 0) > 0)
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)
})

const negativeBalance = computed(() => {
  return accountsList.value
    .filter(a => a.include_in_total && Number(a.balance || 0) < 0)
    .reduce((sum, a) => sum + Math.abs(Number(a.balance || 0)), 0)
})

// Handlers
function handleEdit(account: Account) {
  accountsStore.openEditModal(account)
}

function handleDelete(account: Account) {
  accountsStore.openEditModal(account)
}

function handleSetDefault(account: Account) {
  setDefaultMutation.mutate(account.id)
}

function handleModalSubmit(data: Partial<Account>) {
  if (accountsStore.modalMode === 'edit' && selectedAccount.value) {
    updateMutation.mutate({ id: selectedAccount.value.id, ...data })
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
          <h1 class="text-2xl font-bold text-on-surface">Contas</h1>
          <p class="text-on-surface-variant">Gerencie suas contas bancarias e carteiras</p>
        </div>
        <Button @click="accountsStore.openCreateModal">
          <Plus class="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-surface-container-lowest rounded-xl p-5 shadow-editorial">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet class="h-5 w-5 text-primary" />
            </div>
            <span class="text-sm text-on-surface-variant">Saldo Total</span>
          </div>
          <p
            :class="[
              'text-2xl font-bold',
              totalBalance >= 0 ? 'text-on-surface' : 'text-tertiary'
            ]"
          >
            {{ formatCurrency(totalBalance) }}
          </p>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-5 shadow-editorial">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center">
              <TrendingUp class="h-5 w-5 text-primary" />
            </div>
            <span class="text-sm text-on-surface-variant">Saldos Positivos</span>
          </div>
          <p class="text-2xl font-bold text-primary">
            {{ formatCurrency(positiveBalance) }}
          </p>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-5 shadow-editorial">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <TrendingDown class="h-5 w-5 text-tertiary" />
            </div>
            <span class="text-sm text-on-surface-variant">Saldos Negativos</span>
          </div>
          <p class="text-2xl font-bold text-tertiary">
            {{ formatCurrency(negativeBalance) }}
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-surface-container-lowest rounded-xl p-5 shadow-editorial"
        >
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-surface-container animate-pulse"></div>
            <div class="flex-1 space-y-2">
              <div class="h-5 bg-surface-container rounded animate-pulse w-3/4"></div>
              <div class="h-4 bg-surface-container rounded animate-pulse w-1/2"></div>
            </div>
          </div>
          <div class="pt-4 border-t border-outline-variant">
            <div class="h-4 bg-surface-container rounded animate-pulse w-1/3 mb-2"></div>
            <div class="h-8 bg-surface-container rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="accountsList.length === 0"
        class="bg-surface-container-lowest rounded-xl p-12 shadow-editorial text-center"
      >
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
          <Wallet class="h-8 w-8 text-on-surface-variant" />
        </div>
        <h3 class="text-lg font-medium text-on-surface mb-2">Nenhuma conta cadastrada</h3>
        <p class="text-on-surface-variant mb-6">
          Adicione suas contas bancarias e carteiras para comecar
        </p>
        <Button @click="accountsStore.openCreateModal">
          <Plus class="h-4 w-4 mr-2" />
          Adicionar primeira conta
        </Button>
      </div>

      <!-- Accounts Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AccountCard
          v-for="account in accountsList"
          :key="account.id"
          :account="account"
          @edit="handleEdit"
          @delete="handleDelete"
          @set-default="handleSetDefault"
        />
      </div>
    </div>

    <!-- Account Modal -->
    <AccountModal
      v-model:open="isModalOpen"
      :account="selectedAccount"
      :is-loading="createMutation.isPending.value || updateMutation.isPending.value"
      :is-deleting="deleteMutation.isPending.value"
      @submit="handleModalSubmit"
      @delete="handleModalDelete"
    />
  </AppLayout>
</template>
