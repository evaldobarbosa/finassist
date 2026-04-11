<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-vue-next'
import { formatCurrency, formatDateRelative } from '@/lib/utils'
import type { Transaction } from '@/types'

const props = defineProps<{
  transaction: Transaction
  categoryName?: string
  categoryColor?: string
  accountName?: string
}>()

const emit = defineEmits<{
  click: [transaction: Transaction]
}>()

const typeConfig = computed(() => {
  switch (props.transaction.type) {
    case 'income':
      return {
        icon: ArrowDownLeft,
        colorClass: 'text-primary bg-primary-fixed/30',
        amountClass: 'text-primary',
        prefix: '+',
      }
    case 'expense':
      return {
        icon: ArrowUpRight,
        colorClass: 'text-tertiary bg-tertiary/10',
        amountClass: 'text-tertiary',
        prefix: '-',
      }
    case 'transfer':
      return {
        icon: ArrowLeftRight,
        colorClass: 'text-secondary bg-secondary/10',
        amountClass: 'text-secondary',
        prefix: '',
      }
    default:
      return {
        icon: ArrowUpRight,
        colorClass: 'text-on-surface-variant bg-surface-container',
        amountClass: 'text-on-surface',
        prefix: '',
      }
  }
})

const formattedAmount = computed(() => {
  const prefix = typeConfig.value.prefix
  return `${prefix}${formatCurrency(props.transaction.amount)}`
})

const formattedDate = computed(() => {
  return formatDateRelative(props.transaction.date)
})

function handleClick() {
  emit('click', props.transaction)
}
</script>

<template>
  <button
    @click="handleClick"
    class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container transition text-left"
  >
    <!-- Icon -->
    <div
      :class="[
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
        typeConfig.colorClass
      ]"
      :style="categoryColor ? { backgroundColor: `${categoryColor}20`, color: categoryColor } : {}"
    >
      <component :is="typeConfig.icon" class="h-5 w-5" />
    </div>

    <!-- Details -->
    <div class="flex-1 min-w-0">
      <p class="font-medium text-on-surface truncate">
        {{ transaction.description }}
      </p>
      <p class="text-sm text-on-surface-variant truncate">
        <span v-if="categoryName">{{ categoryName }}</span>
        <span v-if="categoryName && accountName"> · </span>
        <span v-if="accountName">{{ accountName }}</span>
        <span v-if="!categoryName && !accountName">{{ formattedDate }}</span>
      </p>
    </div>

    <!-- Amount -->
    <div class="text-right shrink-0">
      <p :class="['font-semibold', typeConfig.amountClass]">
        {{ formattedAmount }}
      </p>
      <p class="text-xs text-on-surface-variant">
        {{ formattedDate }}
      </p>
    </div>
  </button>
</template>
