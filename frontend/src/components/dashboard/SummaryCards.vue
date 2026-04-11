<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-vue-next'
import { formatCurrency } from '@/lib/utils'

const props = defineProps<{
  previousBalance: number
  income: number
  expenses: number
  currentBalance: number
  isLoading?: boolean
}>()

const balanceChange = computed(() => {
  return props.currentBalance - props.previousBalance
})

const balanceChangePercent = computed(() => {
  if (props.previousBalance === 0) return 0
  return ((balanceChange.value / Math.abs(props.previousBalance)) * 100).toFixed(1)
})

const isPositiveChange = computed(() => balanceChange.value >= 0)
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
    <!-- Previous Balance -->
    <div class="bg-surface-container-lowest rounded-xl p-4 lg:p-5 shadow-editorial">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-on-surface-variant">Saldo Anterior</span>
        <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
          <Wallet class="h-4 w-4 text-on-surface-variant" />
        </div>
      </div>
      <div v-if="isLoading" class="h-7 bg-surface-container rounded animate-pulse"></div>
      <p v-else class="text-xl lg:text-2xl font-semibold text-on-surface">
        {{ formatCurrency(previousBalance) }}
      </p>
    </div>

    <!-- Income -->
    <div class="bg-surface-container-lowest rounded-xl p-4 lg:p-5 shadow-editorial">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-on-surface-variant">Receitas</span>
        <div class="w-8 h-8 rounded-lg bg-primary-fixed/30 flex items-center justify-center">
          <TrendingUp class="h-4 w-4 text-primary" />
        </div>
      </div>
      <div v-if="isLoading" class="h-7 bg-surface-container rounded animate-pulse"></div>
      <p v-else class="text-xl lg:text-2xl font-semibold text-primary">
        {{ formatCurrency(income) }}
      </p>
    </div>

    <!-- Expenses -->
    <div class="bg-surface-container-lowest rounded-xl p-4 lg:p-5 shadow-editorial">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-on-surface-variant">Despesas</span>
        <div class="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
          <TrendingDown class="h-4 w-4 text-tertiary" />
        </div>
      </div>
      <div v-if="isLoading" class="h-7 bg-surface-container rounded animate-pulse"></div>
      <p v-else class="text-xl lg:text-2xl font-semibold text-tertiary">
        {{ formatCurrency(expenses) }}
      </p>
    </div>

    <!-- Current Balance -->
    <div class="bg-gradient-to-br from-primary to-primary-container rounded-xl p-4 lg:p-5 shadow-editorial text-white">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-white/80">Saldo Atual</span>
        <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <ArrowRight class="h-4 w-4" />
        </div>
      </div>
      <div v-if="isLoading" class="h-7 bg-white/20 rounded animate-pulse"></div>
      <template v-else>
        <p class="text-xl lg:text-2xl font-semibold">
          {{ formatCurrency(currentBalance) }}
        </p>
        <div class="flex items-center gap-1 mt-2 text-sm">
          <TrendingUp v-if="isPositiveChange" class="h-3 w-3" />
          <TrendingDown v-else class="h-3 w-3" />
          <span :class="isPositiveChange ? 'text-primary-fixed' : 'text-white/80'">
            {{ isPositiveChange ? '+' : '' }}{{ balanceChangePercent }}%
          </span>
          <span class="text-white/60">vs anterior</span>
        </div>
      </template>
    </div>
  </div>
</template>
