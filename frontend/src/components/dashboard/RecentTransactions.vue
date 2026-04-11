<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Receipt, ArrowRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import TransactionItem from './TransactionItem.vue'
import type { Transaction, Category, Account } from '@/types'

const props = defineProps<{
  transactions: Transaction[]
  categories?: Category[]
  accounts?: Account[]
  isLoading?: boolean
  limit?: number
}>()

const router = useRouter()

const displayedTransactions = computed(() => {
  const limit = props.limit || 5
  return props.transactions.slice(0, limit)
})

const hasMore = computed(() => {
  const limit = props.limit || 5
  return props.transactions.length > limit
})

function getCategoryName(categoryId?: string): string | undefined {
  if (!categoryId || !props.categories) return undefined
  const category = props.categories.find(c => c.id === categoryId)
  return category?.name
}

function getCategoryColor(categoryId?: string): string | undefined {
  if (!categoryId || !props.categories) return undefined
  const category = props.categories.find(c => c.id === categoryId)
  return category?.color
}

function getAccountName(accountId: string): string | undefined {
  if (!props.accounts) return undefined
  const account = props.accounts.find(a => a.id === accountId)
  return account?.name
}

function handleTransactionClick(transaction: Transaction) {
  router.push({ name: 'transactions', query: { id: transaction.id } })
}

function viewAllTransactions() {
  router.push({ name: 'transactions' })
}
</script>

<template>
  <div class="bg-surface-container-lowest rounded-xl shadow-editorial">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 lg:p-6 border-b border-outline-variant">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
          <Receipt class="h-5 w-5 text-on-surface-variant" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-on-surface">Transacoes Recentes</h2>
          <p class="text-sm text-on-surface-variant">
            {{ transactions.length }} transacoes este mes
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        @click="viewAllTransactions"
        class="text-primary"
      >
        Ver todas
        <ArrowRight class="h-4 w-4 ml-1" />
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-4 lg:p-6 space-y-3">
      <div v-for="i in 5" :key="i" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-surface-container animate-pulse"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-surface-container rounded animate-pulse w-3/4"></div>
          <div class="h-3 bg-surface-container rounded animate-pulse w-1/2"></div>
        </div>
        <div class="space-y-2">
          <div class="h-4 bg-surface-container rounded animate-pulse w-16"></div>
          <div class="h-3 bg-surface-container rounded animate-pulse w-12 ml-auto"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="transactions.length === 0"
      class="p-8 lg:p-12 text-center"
    >
      <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
        <Receipt class="h-8 w-8 text-on-surface-variant" />
      </div>
      <h3 class="text-lg font-medium text-on-surface mb-2">Nenhuma transacao</h3>
      <p class="text-on-surface-variant mb-4">
        Comece adicionando sua primeira transacao
      </p>
    </div>

    <!-- Transaction List -->
    <div v-else class="p-2 lg:p-3">
      <TransactionItem
        v-for="transaction in displayedTransactions"
        :key="transaction.id"
        :transaction="transaction"
        :category-name="getCategoryName(transaction.category_id)"
        :category-color="getCategoryColor(transaction.category_id)"
        :account-name="getAccountName(transaction.account_id)"
        @click="handleTransactionClick"
      />

      <!-- Show more indicator -->
      <div v-if="hasMore" class="pt-2 pb-1 text-center">
        <button
          @click="viewAllTransactions"
          class="text-sm text-primary hover:underline"
        >
          + {{ transactions.length - (limit || 5) }} mais transacoes
        </button>
      </div>
    </div>
  </div>
</template>
