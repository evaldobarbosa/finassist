<script setup lang="ts">
import { computed } from 'vue'
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronRight,
} from 'lucide-vue-next'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { Category } from '@/types'

const props = defineProps<{
  categories: Category[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  edit: [category: Category]
  delete: [category: Category]
}>()

// Group categories by parent
const groupedCategories = computed(() => {
  const parents = props.categories.filter(c => !c.parent_id)
  const children = props.categories.filter(c => c.parent_id)

  return parents.map(parent => ({
    ...parent,
    children: children.filter(c => c.parent_id === parent.id),
  }))
})

// Separate by type
const incomeCategories = computed(() =>
  groupedCategories.value.filter(c => c.type === 'income')
)

const expenseCategories = computed(() =>
  groupedCategories.value.filter(c => c.type === 'expense')
)

function getTypeLabel(type: string) {
  return type === 'income' ? 'Receita' : 'Despesa'
}

function getTypeVariant(type: string) {
  return type === 'income' ? 'success' : 'destructive'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-surface-container rounded-lg animate-pulse" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="categories.length === 0"
      class="bg-surface-container-lowest rounded-xl shadow-editorial p-12 text-center"
    >
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-container flex items-center justify-center">
        <TrendingDown class="h-8 w-8 text-on-surface-variant" />
      </div>
      <h3 class="text-lg font-medium text-on-surface mb-2">Nenhuma categoria</h3>
      <p class="text-on-surface-variant max-w-sm mx-auto">
        Crie categorias para organizar suas transacoes de forma mais eficiente
      </p>
    </div>

    <!-- Categories List -->
    <template v-else>
      <!-- Income Categories -->
      <div v-if="incomeCategories.length > 0" class="space-y-3">
        <div class="flex items-center gap-2 px-1">
          <TrendingUp class="h-5 w-5 text-primary" />
          <h3 class="font-semibold text-on-surface">Receitas</h3>
          <Badge variant="outline" class="ml-auto">
            {{ incomeCategories.length }} categorias
          </Badge>
        </div>

        <div class="bg-surface-container-lowest rounded-xl shadow-editorial overflow-hidden">
          <table class="w-full">
            <thead class="bg-surface-container">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium text-on-surface-variant">Nome</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-on-surface-variant hidden sm:table-cell">Tipo</th>
                <th class="px-6 py-3 text-right text-sm font-medium text-on-surface-variant">Acoes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              <template v-for="category in incomeCategories" :key="category.id">
                <!-- Parent Category -->
                <tr class="hover:bg-surface-container/50 transition">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        :style="{ backgroundColor: category.color + '20', color: category.color }"
                      >
                        <span class="font-bold">{{ category.name.charAt(0) }}</span>
                      </div>
                      <div>
                        <p class="font-medium text-on-surface">{{ category.name }}</p>
                        <p v-if="category.children?.length" class="text-xs text-on-surface-variant">
                          {{ category.children.length }} subcategoria(s)
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <Badge :variant="getTypeVariant(category.type)">
                      {{ getTypeLabel(category.type) }}
                    </Badge>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <button class="p-2 rounded-lg hover:bg-surface-container transition">
                          <MoreVertical class="h-4 w-4 text-on-surface-variant" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="emit('edit', category)" class="cursor-pointer">
                          <Pencil class="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem @click="emit('delete', category)" class="cursor-pointer text-tertiary">
                          <Trash2 class="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>

                <!-- Child Categories -->
                <tr
                  v-for="child in category.children"
                  :key="child.id"
                  class="hover:bg-surface-container/50 transition bg-surface-container/20"
                >
                  <td class="px-6 py-3">
                    <div class="flex items-center gap-3 pl-8">
                      <ChevronRight class="h-4 w-4 text-on-surface-variant shrink-0" />
                      <div
                        class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        :style="{ backgroundColor: child.color + '20', color: child.color }"
                      >
                        <span class="text-sm font-bold">{{ child.name.charAt(0) }}</span>
                      </div>
                      <p class="font-medium text-on-surface">{{ child.name }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-3 hidden sm:table-cell">
                    <Badge variant="outline" class="text-xs">Subcategoria</Badge>
                  </td>
                  <td class="px-6 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <button class="p-2 rounded-lg hover:bg-surface-container transition">
                          <MoreVertical class="h-4 w-4 text-on-surface-variant" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="emit('edit', child)" class="cursor-pointer">
                          <Pencil class="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem @click="emit('delete', child)" class="cursor-pointer text-tertiary">
                          <Trash2 class="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Expense Categories -->
      <div v-if="expenseCategories.length > 0" class="space-y-3">
        <div class="flex items-center gap-2 px-1">
          <TrendingDown class="h-5 w-5 text-tertiary" />
          <h3 class="font-semibold text-on-surface">Despesas</h3>
          <Badge variant="outline" class="ml-auto">
            {{ expenseCategories.length }} categorias
          </Badge>
        </div>

        <div class="bg-surface-container-lowest rounded-xl shadow-editorial overflow-hidden">
          <table class="w-full">
            <thead class="bg-surface-container">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium text-on-surface-variant">Nome</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-on-surface-variant hidden sm:table-cell">Tipo</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-on-surface-variant hidden md:table-cell">Limite</th>
                <th class="px-6 py-3 text-right text-sm font-medium text-on-surface-variant">Acoes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              <template v-for="category in expenseCategories" :key="category.id">
                <!-- Parent Category -->
                <tr class="hover:bg-surface-container/50 transition">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        :style="{ backgroundColor: category.color + '20', color: category.color }"
                      >
                        <span class="font-bold">{{ category.name.charAt(0) }}</span>
                      </div>
                      <div>
                        <p class="font-medium text-on-surface">{{ category.name }}</p>
                        <p v-if="category.children?.length" class="text-xs text-on-surface-variant">
                          {{ category.children.length }} subcategoria(s)
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <Badge :variant="getTypeVariant(category.type)">
                      {{ getTypeLabel(category.type) }}
                    </Badge>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <span v-if="category.budget_limit" class="text-on-surface">
                      {{ formatCurrency(category.budget_limit) }}
                    </span>
                    <span v-else class="text-on-surface-variant">—</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <button class="p-2 rounded-lg hover:bg-surface-container transition">
                          <MoreVertical class="h-4 w-4 text-on-surface-variant" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="emit('edit', category)" class="cursor-pointer">
                          <Pencil class="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem @click="emit('delete', category)" class="cursor-pointer text-tertiary">
                          <Trash2 class="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>

                <!-- Child Categories -->
                <tr
                  v-for="child in category.children"
                  :key="child.id"
                  class="hover:bg-surface-container/50 transition bg-surface-container/20"
                >
                  <td class="px-6 py-3">
                    <div class="flex items-center gap-3 pl-8">
                      <ChevronRight class="h-4 w-4 text-on-surface-variant shrink-0" />
                      <div
                        class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        :style="{ backgroundColor: child.color + '20', color: child.color }"
                      >
                        <span class="text-sm font-bold">{{ child.name.charAt(0) }}</span>
                      </div>
                      <p class="font-medium text-on-surface">{{ child.name }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-3 hidden sm:table-cell">
                    <Badge variant="outline" class="text-xs">Subcategoria</Badge>
                  </td>
                  <td class="px-6 py-3 hidden md:table-cell">
                    <span v-if="child.budget_limit" class="text-on-surface text-sm">
                      {{ formatCurrency(child.budget_limit) }}
                    </span>
                    <span v-else class="text-on-surface-variant">—</span>
                  </td>
                  <td class="px-6 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <button class="p-2 rounded-lg hover:bg-surface-container transition">
                          <MoreVertical class="h-4 w-4 text-on-surface-variant" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="emit('edit', child)" class="cursor-pointer">
                          <Pencil class="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem @click="emit('delete', child)" class="cursor-pointer text-tertiary">
                          <Trash2 class="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
