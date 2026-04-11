<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loader2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ColorPicker from './ColorPicker.vue'
import IconPicker from './IconPicker.vue'
import type { Category } from '@/types'

type CategoryType = 'income' | 'expense'

const props = defineProps<{
  open: boolean
  category?: Category | null
  categories: Category[]
  isLoading?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [data: Partial<Category>]
  'delete': [id: string]
}>()

const form = ref({
  name: '',
  type: 'expense' as CategoryType,
  color: '#006b2c',
  icon: 'wallet',
  parent_id: '',
  budget_limit: '',
})

const error = ref('')
const showDeleteConfirm = ref(false)
const activeTab = ref<'basic' | 'appearance' | 'budget'>('basic')

const isEditMode = computed(() => !!props.category)

const modalTitle = computed(() =>
  isEditMode.value ? 'Editar Categoria' : 'Nova Categoria'
)

// Filter parent categories (same type, not itself, not a subcategory)
const availableParents = computed(() => {
  return props.categories.filter(c =>
    c.type === form.value.type &&
    c.id !== props.category?.id &&
    !c.parent_id // Only top-level categories can be parents
  )
})

// Initialize form when modal opens
watch([() => props.open, () => props.category], () => {
  if (props.open) {
    showDeleteConfirm.value = false
    activeTab.value = 'basic'
    if (props.category) {
      form.value = {
        name: props.category.name,
        type: props.category.type,
        color: props.category.color,
        icon: props.category.icon || 'wallet',
        parent_id: props.category.parent_id || '',
        budget_limit: props.category.budget_limit?.toString() || '',
      }
    } else {
      form.value = {
        name: '',
        type: 'expense',
        color: '#006b2c',
        icon: 'wallet',
        parent_id: '',
        budget_limit: '',
      }
    }
    error.value = ''
  }
}, { immediate: true })

function handleBudgetInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/[^\d.,]/g, '')
  value = value.replace(',', '.')
  form.value.budget_limit = value
}

function handleClose() {
  emit('update:open', false)
}

function handleSubmit() {
  error.value = ''

  if (!form.value.name.trim()) {
    error.value = 'Digite um nome para a categoria'
    return
  }

  const budgetLimit = form.value.budget_limit
    ? parseFloat(form.value.budget_limit)
    : undefined

  if (budgetLimit !== undefined && (isNaN(budgetLimit) || budgetLimit < 0)) {
    error.value = 'Digite um limite valido'
    return
  }

  emit('submit', {
    name: form.value.name.trim(),
    type: form.value.type,
    color: form.value.color,
    icon: form.value.icon,
    parent_id: form.value.parent_id || undefined,
    budget_limit: budgetLimit,
  })
}

function handleDelete() {
  if (props.category) {
    emit('delete', props.category.id)
  }
}

function setType(type: CategoryType) {
  form.value.type = type
  form.value.parent_id = '' // Reset parent when type changes
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <!-- Delete Confirmation -->
      <template v-if="showDeleteConfirm">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 text-tertiary">
            <AlertTriangle class="h-5 w-5" />
            Confirmar exclusao
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta categoria? As transacoes associadas serao mantidas sem categoria.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4">
          <div class="p-4 bg-surface-container rounded-lg flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: category?.color + '20', color: category?.color }"
            >
              <span class="font-bold">{{ category?.name?.charAt(0) }}</span>
            </div>
            <div>
              <p class="font-medium text-on-surface">{{ category?.name }}</p>
              <p class="text-sm text-on-surface-variant">
                {{ category?.type === 'income' ? 'Receita' : 'Despesa' }}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showDeleteConfirm = false" :disabled="isDeleting">
            Cancelar
          </Button>
          <Button variant="destructive" @click="handleDelete" :disabled="isDeleting">
            <Loader2 v-if="isDeleting" class="h-4 w-4 animate-spin mr-2" />
            Excluir
          </Button>
        </DialogFooter>
      </template>

      <!-- Category Form -->
      <template v-else>
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
          <DialogDescription>
            {{ isEditMode ? 'Atualize os dados da categoria' : 'Crie uma categoria para organizar suas transacoes' }}
          </DialogDescription>
        </DialogHeader>

        <!-- Tabs -->
        <div class="flex gap-1 p-1 bg-surface-container rounded-lg mb-4">
          <button
            type="button"
            @click="activeTab = 'basic'"
            :class="[
              'flex-1 py-2 px-3 rounded-md text-sm font-medium transition',
              activeTab === 'basic'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            ]"
          >
            Basico
          </button>
          <button
            type="button"
            @click="activeTab = 'appearance'"
            :class="[
              'flex-1 py-2 px-3 rounded-md text-sm font-medium transition',
              activeTab === 'appearance'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            ]"
          >
            Aparencia
          </button>
          <button
            type="button"
            @click="activeTab = 'budget'"
            :class="[
              'flex-1 py-2 px-3 rounded-md text-sm font-medium transition',
              activeTab === 'budget'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            ]"
          >
            Orcamento
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Basic Tab -->
          <div v-show="activeTab === 'basic'" class="space-y-5">
            <!-- Type -->
            <div v-if="!isEditMode">
              <Label class="mb-2">Tipo de categoria</Label>
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="setType('income')"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition',
                    form.type === 'income'
                      ? 'border-primary bg-primary-fixed/20 text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                  ]"
                >
                  <TrendingUp class="h-4 w-4" />
                  <span class="font-medium">Receita</span>
                </button>
                <button
                  type="button"
                  @click="setType('expense')"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition',
                    form.type === 'expense'
                      ? 'border-tertiary bg-tertiary/10 text-tertiary'
                      : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                  ]"
                >
                  <TrendingDown class="h-4 w-4" />
                  <span class="font-medium">Despesa</span>
                </button>
              </div>
            </div>

            <!-- Name -->
            <div>
              <Label class="mb-2">Nome *</Label>
              <Input
                v-model="form.name"
                type="text"
                placeholder="Ex: Alimentacao, Salario, Transporte..."
              />
            </div>

            <!-- Parent Category -->
            <div v-if="availableParents.length > 0">
              <Label class="mb-2">Categoria pai (opcional)</Label>
              <Select v-model="form.parent_id">
                <SelectTrigger>
                  <SelectValue placeholder="Nenhuma (categoria principal)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma (categoria principal)</SelectItem>
                  <SelectItem
                    v-for="parent in availableParents"
                    :key="parent.id"
                    :value="parent.id"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="w-3 h-3 rounded-full"
                        :style="{ backgroundColor: parent.color }"
                      ></div>
                      {{ parent.name }}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-on-surface-variant mt-1">
                Subcategorias herdam as configuracoes da categoria pai
              </p>
            </div>
          </div>

          <!-- Appearance Tab -->
          <div v-show="activeTab === 'appearance'" class="space-y-5">
            <!-- Color -->
            <div>
              <Label class="mb-2">Cor</Label>
              <ColorPicker v-model="form.color" />
            </div>

            <!-- Icon -->
            <div>
              <Label class="mb-2">Icone</Label>
              <IconPicker v-model="form.icon" />
            </div>

            <!-- Preview -->
            <div>
              <Label class="mb-2">Previa</Label>
              <div class="p-4 bg-surface-container rounded-lg flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: form.color + '20', color: form.color }"
                >
                  <span class="font-bold">{{ form.name?.charAt(0) || '?' }}</span>
                </div>
                <div>
                  <p class="font-medium text-on-surface">{{ form.name || 'Nome da categoria' }}</p>
                  <p class="text-sm text-on-surface-variant">
                    {{ form.type === 'income' ? 'Receita' : 'Despesa' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Budget Tab -->
          <div v-show="activeTab === 'budget'" class="space-y-5">
            <div v-if="form.type === 'expense'">
              <Label class="mb-2">Limite mensal (opcional)</Label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">R$</span>
                <Input
                  :model-value="form.budget_limit"
                  @input="handleBudgetInput"
                  type="text"
                  inputmode="decimal"
                  placeholder="0,00"
                  class="pl-10"
                />
              </div>
              <p class="text-xs text-on-surface-variant mt-1">
                Voce sera notificado quando atingir este limite
              </p>
            </div>

            <div v-else class="p-6 text-center">
              <p class="text-on-surface-variant">
                Limites de orcamento estao disponiveis apenas para categorias de despesa
              </p>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-tertiary text-sm">{{ error }}</p>
        </form>

        <DialogFooter class="flex-col sm:flex-row gap-2 mt-4">
          <Button
            v-if="isEditMode"
            variant="outline"
            @click="showDeleteConfirm = true"
            :disabled="isLoading"
            class="text-tertiary border-tertiary hover:bg-tertiary/10 sm:mr-auto"
          >
            Excluir
          </Button>
          <Button variant="outline" @click="handleClose" :disabled="isLoading">
            Cancelar
          </Button>
          <Button @click="handleSubmit" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin mr-2" />
            {{ isEditMode ? 'Salvar' : 'Criar' }}
          </Button>
        </DialogFooter>
      </template>
    </DialogContent>
  </Dialog>
</template>
