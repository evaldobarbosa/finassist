<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  Loader2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Repeat,
} from 'lucide-vue-next'
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
import { api } from '@/lib/api'
import type { Recurrence, Account, Category, RecurrenceFrequency } from '@/types'

const props = defineProps<{
  open: boolean
  recurrence?: Recurrence | null
  isLoading?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: Partial<Recurrence>]
  delete: [id: string]
}>()

// Fetch accounts and categories
const { data: accounts } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => api.get<Account[]>('/accounts'),
})

const { data: categories } = useQuery({
  queryKey: ['categories'],
  queryFn: () => api.get<Category[]>('/categories'),
})

const form = ref({
  description: '',
  type: 'expense' as 'income' | 'expense',
  amount: '',
  frequency: 'monthly' as RecurrenceFrequency,
  account_id: '',
  category_id: '',
  day_of_month: '5',
  day_of_week: '1',
  month_of_year: '1',
  start_date: new Date().toISOString().split('T')[0],
  end_date: '',
  notes: '',
})

const error = ref('')
const showDeleteConfirm = ref(false)

const isEditMode = computed(() => !!props.recurrence)

const modalTitle = computed(() =>
  isEditMode.value ? 'Editar Recorrencia' : 'Nova Recorrencia'
)

const expenseCategories = computed(() =>
  (categories.value || []).filter((c) => c.type === 'expense')
)

const incomeCategories = computed(() =>
  (categories.value || []).filter((c) => c.type === 'income')
)

const filteredCategories = computed(() =>
  form.value.type === 'income' ? incomeCategories.value : expenseCategories.value
)

const frequencyOptions = [
  { value: 'daily', label: 'Diaria' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
]

const dayOfWeekOptions = [
  { value: '0', label: 'Domingo' },
  { value: '1', label: 'Segunda' },
  { value: '2', label: 'Terca' },
  { value: '3', label: 'Quarta' },
  { value: '4', label: 'Quinta' },
  { value: '5', label: 'Sexta' },
  { value: '6', label: 'Sabado' },
]

const monthOptions = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Marco' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

// Initialize form when modal opens
watch(
  [() => props.open, () => props.recurrence],
  () => {
    if (props.open) {
      showDeleteConfirm.value = false
      if (props.recurrence) {
        form.value = {
          description: props.recurrence.description,
          type: props.recurrence.type,
          amount: props.recurrence.amount.toString(),
          frequency: props.recurrence.frequency,
          account_id: props.recurrence.account_id,
          category_id: props.recurrence.category_id || '',
          day_of_month: props.recurrence.day_of_month?.toString() || '5',
          day_of_week: props.recurrence.day_of_week?.toString() || '1',
          month_of_year: props.recurrence.month_of_year?.toString() || '1',
          start_date: props.recurrence.start_date.split('T')[0],
          end_date: props.recurrence.end_date?.split('T')[0] || '',
          notes: props.recurrence.notes || '',
        }
      } else {
        const defaultAccount = accounts.value?.find((a) => a.is_default)
        form.value = {
          description: '',
          type: 'expense',
          amount: '',
          frequency: 'monthly',
          account_id: defaultAccount?.id || '',
          category_id: '',
          day_of_month: '5',
          day_of_week: '1',
          month_of_year: '1',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          notes: '',
        }
      }
      error.value = ''
    }
  },
  { immediate: true }
)

function handleAmountInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/[^\d.,-]/g, '')
  value = value.replace(',', '.')
  form.value.amount = value
}

function handleClose() {
  emit('update:open', false)
}

function handleSubmit() {
  error.value = ''

  if (!form.value.description.trim()) {
    error.value = 'Digite uma descricao'
    return
  }

  const amount = parseFloat(form.value.amount)
  if (!amount || amount <= 0) {
    error.value = 'Digite um valor valido'
    return
  }

  if (!form.value.account_id) {
    error.value = 'Selecione uma conta'
    return
  }

  const data: Partial<Recurrence> = {
    description: form.value.description.trim(),
    type: form.value.type,
    amount,
    frequency: form.value.frequency,
    account_id: form.value.account_id,
    category_id: form.value.category_id || undefined,
    start_date: form.value.start_date,
    end_date: form.value.end_date || undefined,
    notes: form.value.notes || undefined,
  }

  // Add scheduling fields based on frequency
  if (form.value.frequency === 'weekly') {
    data.day_of_week = parseInt(form.value.day_of_week)
  } else if (form.value.frequency === 'monthly') {
    data.day_of_month = parseInt(form.value.day_of_month)
  } else if (form.value.frequency === 'yearly') {
    data.day_of_month = parseInt(form.value.day_of_month)
    data.month_of_year = parseInt(form.value.month_of_year)
  }

  emit('submit', data)
}

function handleDelete() {
  if (props.recurrence) {
    emit('delete', props.recurrence.id)
  }
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
            Tem certeza que deseja excluir esta recorrencia? As transacoes ja
            geradas serao mantidas.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4">
          <div class="p-4 bg-surface-container rounded-lg">
            <p class="font-medium text-on-surface">
              {{ recurrence?.description }}
            </p>
            <p class="text-sm text-on-surface-variant">
              {{
                recurrence?.amount?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              }}
              - {{ frequencyOptions.find((f) => f.value === recurrence?.frequency)?.label }}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            @click="showDeleteConfirm = false"
            :disabled="isDeleting"
          >
            Cancelar
          </Button>
          <Button variant="destructive" @click="handleDelete" :disabled="isDeleting">
            <Loader2 v-if="isDeleting" class="h-4 w-4 animate-spin mr-2" />
            Excluir
          </Button>
        </DialogFooter>
      </template>

      <!-- Recurrence Form -->
      <template v-else>
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Repeat class="h-5 w-5" />
            {{ modalTitle }}
          </DialogTitle>
          <DialogDescription>
            {{
              isEditMode
                ? 'Atualize os dados da recorrencia'
                : 'Adicione um custo fixo ou receita recorrente'
            }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-5 py-4">
          <!-- Type -->
          <div>
            <Label class="mb-2">Tipo</Label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="form.type = 'expense'"
                :class="[
                  'flex items-center justify-center gap-2 p-3 rounded-lg border transition',
                  form.type === 'expense'
                    ? 'border-tertiary bg-tertiary/10 text-tertiary'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-container',
                ]"
              >
                <TrendingDown class="h-4 w-4" />
                <span class="font-medium">Despesa</span>
              </button>
              <button
                type="button"
                @click="form.type = 'income'"
                :class="[
                  'flex items-center justify-center gap-2 p-3 rounded-lg border transition',
                  form.type === 'income'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-container',
                ]"
              >
                <TrendingUp class="h-4 w-4" />
                <span class="font-medium">Receita</span>
              </button>
            </div>
          </div>

          <!-- Description -->
          <div>
            <Label class="mb-2">Descricao *</Label>
            <Input
              v-model="form.description"
              type="text"
              placeholder="Ex: Aluguel, Netflix, Salario..."
            />
          </div>

          <!-- Amount -->
          <div>
            <Label class="mb-2">Valor *</Label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >R$</span
              >
              <Input
                :model-value="form.amount"
                @input="handleAmountInput"
                type="text"
                inputmode="decimal"
                placeholder="0,00"
                class="pl-10"
              />
            </div>
          </div>

          <!-- Frequency -->
          <div>
            <Label class="mb-2">Frequencia</Label>
            <Select v-model="form.frequency">
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="opt in frequencyOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Day of Week (for weekly) -->
          <div v-if="form.frequency === 'weekly'">
            <Label class="mb-2">Dia da semana</Label>
            <Select v-model="form.day_of_week">
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="opt in dayOfWeekOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Day of Month (for monthly/yearly) -->
          <div v-if="form.frequency === 'monthly' || form.frequency === 'yearly'">
            <Label class="mb-2">Dia do mes</Label>
            <Input
              v-model="form.day_of_month"
              type="number"
              min="1"
              max="31"
              placeholder="5"
            />
          </div>

          <!-- Month (for yearly) -->
          <div v-if="form.frequency === 'yearly'">
            <Label class="mb-2">Mes</Label>
            <Select v-model="form.month_of_year">
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="opt in monthOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Account -->
          <div>
            <Label class="mb-2">Conta *</Label>
            <Select v-model="form.account_id">
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
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

          <!-- Category -->
          <div>
            <Label class="mb-2">Categoria</Label>
            <Select v-model="form.category_id">
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem categoria</SelectItem>
                <SelectItem
                  v-for="category in filteredCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Start Date -->
          <div>
            <Label class="mb-2">Data de inicio</Label>
            <div class="relative">
              <CalendarDays
                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant"
              />
              <Input v-model="form.start_date" type="date" class="pl-10" />
            </div>
          </div>

          <!-- End Date (optional) -->
          <div>
            <Label class="mb-2">Data de termino (opcional)</Label>
            <div class="relative">
              <CalendarDays
                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant"
              />
              <Input v-model="form.end_date" type="date" class="pl-10" />
            </div>
            <p class="text-xs text-on-surface-variant mt-1">
              Deixe em branco para recorrencia sem fim
            </p>
          </div>

          <!-- Notes -->
          <div>
            <Label class="mb-2">Observacoes</Label>
            <Input
              v-model="form.notes"
              type="text"
              placeholder="Anotacoes opcionais..."
            />
          </div>

          <!-- Error -->
          <p v-if="error" class="text-tertiary text-sm">{{ error }}</p>
        </form>

        <DialogFooter class="flex-col sm:flex-row gap-2">
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
            {{ isEditMode ? 'Salvar' : 'Adicionar' }}
          </Button>
        </DialogFooter>
      </template>
    </DialogContent>
  </Dialog>
</template>
