<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, MoreVertical, Pencil, Trash2, Repeat } from 'lucide-vue-next'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { Transaction, Category, Account } from '@/types'

const props = defineProps<{
  transaction: Transaction
  category?: Category
  account?: Account
  destinationAccount?: Account
}>()

const emit = defineEmits<{
  edit: [transaction: Transaction]
  delete: [transaction: Transaction]
}>()

const typeConfig = computed(() => {
  switch (props.transaction.type) {
    case 'income':
      return {
        icon: ArrowDownLeft,
        colorClass: 'text-primary bg-primary-fixed/30',
        amountClass: 'text-primary',
        prefix: '+',
        label: 'Receita',
      }
    case 'expense':
      return {
        icon: ArrowUpRight,
        colorClass: 'text-tertiary bg-tertiary/10',
        amountClass: 'text-tertiary',
        prefix: '-',
        label: 'Despesa',
      }
    case 'transfer':
      return {
        icon: ArrowLeftRight,
        colorClass: 'text-secondary bg-secondary/10',
        amountClass: 'text-secondary',
        prefix: '',
        label: 'Transferencia',
      }
    default:
      return {
        icon: ArrowUpRight,
        colorClass: 'text-on-surface-variant bg-surface-container',
        amountClass: 'text-on-surface',
        prefix: '',
        label: 'Transacao',
      }
  }
})

const formattedAmount = computed(() => {
  const prefix = typeConfig.value.prefix
  return `${prefix}${formatCurrency(props.transaction.amount)}`
})

const installmentText = computed(() => {
  if (props.transaction.installment_number && props.transaction.total_installments) {
    return `${props.transaction.installment_number}/${props.transaction.total_installments}`
  }
  return null
})

const transferText = computed(() => {
  if (props.transaction.type === 'transfer' && props.account && props.destinationAccount) {
    return `${props.account.name} → ${props.destinationAccount.name}`
  }
  return null
})
</script>

<template>
  <div class="flex items-center gap-3 p-3 hover:bg-surface-container rounded-lg transition group">
    <!-- Icon -->
    <div
      :class="[
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
        typeConfig.colorClass
      ]"
      :style="category?.color ? { backgroundColor: `${category.color}20`, color: category.color } : {}"
    >
      <component :is="typeConfig.icon" class="h-5 w-5" />
    </div>

    <!-- Details -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <p class="font-medium text-on-surface truncate">
          {{ transaction.description }}
        </p>
        <Badge v-if="transaction.is_recurring" variant="outline" class="shrink-0 text-xs">
          <Repeat class="h-3 w-3 mr-1" />
          Recorrente
        </Badge>
        <Badge v-if="installmentText" variant="outline" class="shrink-0 text-xs">
          {{ installmentText }}
        </Badge>
      </div>
      <p class="text-sm text-on-surface-variant truncate">
        <template v-if="transferText">
          {{ transferText }}
        </template>
        <template v-else>
          <span v-if="category">{{ category.name }}</span>
          <span v-if="category && account"> · </span>
          <span v-if="account">{{ account.name }}</span>
        </template>
      </p>
    </div>

    <!-- Amount -->
    <div class="text-right shrink-0">
      <p :class="['font-semibold text-base', typeConfig.amountClass]">
        {{ formattedAmount }}
      </p>
    </div>

    <!-- Actions -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button class="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-container-high transition">
          <MoreVertical class="h-4 w-4 text-on-surface-variant" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="emit('edit', transaction)" class="cursor-pointer">
          <Pencil class="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="emit('delete', transaction)" class="cursor-pointer text-tertiary">
          <Trash2 class="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
