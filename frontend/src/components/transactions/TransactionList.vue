<script setup lang="ts">
import { computed } from 'vue'
import { Receipt, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import TransactionListItem from './TransactionListItem.vue'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { Transaction, Category, Account } from '@/types'

const props = defineProps<{
  transactions: Transaction[]
  categories: Category[]
  accounts: Account[]
  isLoading?: boolean
  page?: number
  totalPages?: number
  totalAmount?: { income: number; expense: number }
}>()

const emit = defineEmits<{
  edit: [transaction: Transaction]
  delete: [transaction: Transaction]
  'page-change': [page: number]
}>()

// Group transactions by date
const groupedTransactions = computed(() => {
  const groups: Record<string, Transaction[]> = {}

  for (const transaction of props.transactions) {
    const date = transaction.date.split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
  }

  // Sort groups by date (newest first)
  const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a))

  return sortedKeys.map(date => ({
    date,
    formattedDate: formatDateHeader(date),
    transactions: groups[date],
    total: groups[date].reduce((sum, t) => {
      const amount = Number(t.amount || 0)
      if (t.type === 'income') return sum + amount
      if (t.type === 'expense') return sum - amount
      return sum
    }, 0),
  }))
})

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const isToday = date.toDateString() === today.toDateString()
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return 'Hoje'
  if (isYesterday) return 'Ontem'

  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function getCategory(categoryId?: string): Category | undefined {
  if (!categoryId) return undefined
  return props.categories.find(c => c.id === categoryId)
}

function getAccount(accountId: string): Account | undefined {
  return props.accounts.find(a => a.id === accountId)
}

function handleEdit(transaction: Transaction) {
  emit('edit', transaction)
}

function handleDelete(transaction: Transaction) {
  emit('delete', transaction)
}

function goToPage(page: number) {
  emit('page-change', page)
}
</script>

<template>
  <div class="bg-surface-container-lowest rounded-xl shadow-editorial">
    <!-- Summary Header -->
    <div v-if="totalAmount" class="p-4 border-b border-outline-variant">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div>
            <p class="text-sm text-on-surface-variant">Receitas</p>
            <p class="text-lg font-semibold text-primary">
              {{ formatCurrency(totalAmount.income) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-on-surface-variant">Despesas</p>
            <p class="text-lg font-semibold text-tertiary">
              {{ formatCurrency(totalAmount.expense) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-on-surface-variant">Saldo</p>
            <p
              :class="[
                'text-lg font-semibold',
                totalAmount.income - totalAmount.expense >= 0 ? 'text-primary' : 'text-tertiary'
              ]"
            >
              {{ formatCurrency(totalAmount.income - totalAmount.expense) }}
            </p>
          </div>
        </div>
        <p class="text-sm text-on-surface-variant">
          {{ transactions.length }} transacoes
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-4 space-y-4">
      <div v-for="i in 5" :key="i" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-surface-container animate-pulse"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-surface-container rounded animate-pulse w-3/4"></div>
          <div class="h-3 bg-surface-container rounded animate-pulse w-1/2"></div>
        </div>
        <div class="h-5 bg-surface-container rounded animate-pulse w-20"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="transactions.length === 0"
      class="p-12 text-center"
    >
      <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
        <Receipt class="h-8 w-8 text-on-surface-variant" />
      </div>
      <h3 class="text-lg font-medium text-on-surface mb-2">Nenhuma transacao encontrada</h3>
      <p class="text-on-surface-variant">
        Tente ajustar os filtros ou adicione uma nova transacao
      </p>
    </div>

    <!-- Transaction Groups -->
    <div v-else class="divide-y divide-outline-variant">
      <div v-for="group in groupedTransactions" :key="group.date">
        <!-- Date Header -->
        <div class="px-4 py-3 bg-surface-container-low flex items-center justify-between">
          <p class="text-sm font-medium text-on-surface capitalize">
            {{ group.formattedDate }}
          </p>
          <p
            :class="[
              'text-sm font-medium',
              group.total >= 0 ? 'text-primary' : 'text-tertiary'
            ]"
          >
            {{ group.total >= 0 ? '+' : '' }}{{ formatCurrency(group.total) }}
          </p>
        </div>

        <!-- Transactions -->
        <div class="p-2">
          <TransactionListItem
            v-for="transaction in group.transactions"
            :key="transaction.id"
            :transaction="transaction"
            :category="getCategory(transaction.category_id)"
            :account="getAccount(transaction.account_id)"
            :destination-account="transaction.destination_account_id ? getAccount(transaction.destination_account_id) : undefined"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages && totalPages > 1"
      class="p-4 border-t border-outline-variant flex items-center justify-between"
    >
      <p class="text-sm text-on-surface-variant">
        Pagina {{ page }} de {{ totalPages }}
      </p>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="page === 1"
          @click="goToPage((page || 1) - 1)"
        >
          <ChevronLeft class="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="page === totalPages"
          @click="goToPage((page || 1) + 1)"
        >
          Proxima
          <ChevronRight class="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  </div>
</template>
