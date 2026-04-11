<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, Filter, X, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Account, Category, TransactionType } from '@/types'

export interface TransactionFiltersValue {
  search: string
  type: TransactionType | ''
  account_id: string
  category_id: string
  start_date: string
  end_date: string
}

const props = defineProps<{
  modelValue: TransactionFiltersValue
  accounts: Account[]
  categories: Category[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TransactionFiltersValue]
}>()

const isExpanded = ref(false)
const localFilters = ref<TransactionFiltersValue>({ ...props.modelValue })

// Sync with external changes
watch(() => props.modelValue, (newValue) => {
  localFilters.value = { ...newValue }
}, { deep: true })

// Emit changes
function updateFilter<K extends keyof TransactionFiltersValue>(
  key: K,
  value: TransactionFiltersValue[K]
) {
  localFilters.value[key] = value
  emit('update:modelValue', { ...localFilters.value })
}

// Count active filters (excluding search)
const activeFilterCount = computed(() => {
  let count = 0
  if (localFilters.value.type) count++
  if (localFilters.value.account_id) count++
  if (localFilters.value.category_id) count++
  if (localFilters.value.start_date) count++
  if (localFilters.value.end_date) count++
  return count
})

// Filter categories by selected type
const filteredCategories = computed(() => {
  if (!localFilters.value.type || localFilters.value.type === 'transfer') {
    return props.categories
  }
  return props.categories.filter(c =>
    c.type === (localFilters.value.type === 'income' ? 'income' : 'expense')
  )
})

function clearFilters() {
  const cleared: TransactionFiltersValue = {
    search: '',
    type: '',
    account_id: '',
    category_id: '',
    start_date: '',
    end_date: '',
  }
  localFilters.value = cleared
  emit('update:modelValue', cleared)
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="bg-surface-container-lowest rounded-xl shadow-editorial">
    <!-- Search and Filter Toggle -->
    <div class="p-4 flex gap-3">
      <!-- Search -->
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
        <Input
          :model-value="localFilters.search"
          @update:model-value="updateFilter('search', $event as string)"
          type="text"
          placeholder="Buscar transacoes..."
          class="pl-10"
        />
      </div>

      <!-- Filter Toggle Button -->
      <Button
        variant="outline"
        @click="toggleExpanded"
        :class="activeFilterCount > 0 ? 'border-primary text-primary' : ''"
      >
        <Filter class="h-4 w-4 mr-2" />
        Filtros
        <Badge v-if="activeFilterCount > 0" variant="default" class="ml-2 h-5 w-5 p-0 justify-center">
          {{ activeFilterCount }}
        </Badge>
        <ChevronDown
          :class="[
            'h-4 w-4 ml-2 transition-transform',
            isExpanded ? 'rotate-180' : ''
          ]"
        />
      </Button>
    </div>

    <!-- Expanded Filters -->
    <Transition name="slide">
      <div v-if="isExpanded" class="px-4 pb-4 border-t border-outline-variant pt-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-medium text-on-surface-variant mb-2">
              Tipo
            </label>
            <Select
              :model-value="localFilters.type"
              @update:model-value="updateFilter('type', $event as TransactionType | '')"
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
                <SelectItem value="transfer">Transferencias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Account Filter -->
          <div>
            <label class="block text-sm font-medium text-on-surface-variant mb-2">
              Conta
            </label>
            <Select
              :model-value="localFilters.account_id"
              @update:model-value="updateFilter('account_id', $event as string)"
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as contas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as contas</SelectItem>
                <SelectItem
                  v-for="account in accounts"
                  :key="account.id"
                  :value="account.id"
                >
                  {{ account.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-on-surface-variant mb-2">
              Categoria
            </label>
            <Select
              :model-value="localFilters.category_id"
              @update:model-value="updateFilter('category_id', $event as string)"
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                <SelectItem
                  v-for="category in filteredCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: category.color }"
                    ></div>
                    {{ category.name }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-on-surface-variant mb-2">
              Periodo
            </label>
            <div class="flex gap-2">
              <Input
                :model-value="localFilters.start_date"
                @update:model-value="updateFilter('start_date', $event as string)"
                type="date"
                class="flex-1"
                placeholder="De"
              />
              <Input
                :model-value="localFilters.end_date"
                @update:model-value="updateFilter('end_date', $event as string)"
                type="date"
                class="flex-1"
                placeholder="Ate"
              />
            </div>
          </div>
        </div>

        <!-- Clear Filters -->
        <div v-if="activeFilterCount > 0" class="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" @click="clearFilters">
            <X class="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 300px;
}
</style>
