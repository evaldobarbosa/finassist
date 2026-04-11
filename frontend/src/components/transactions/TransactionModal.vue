<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loader2, Calendar, Repeat, AlertTriangle } from 'lucide-vue-next'
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
import type { Transaction, TransactionType, Account, Category } from '@/types'

const props = defineProps<{
  open: boolean
  type?: TransactionType
  transaction?: Transaction | null
  accounts: Account[]
  categories: Category[]
  isLoading?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [data: Partial<Transaction>]
  'delete': [id: string]
}>()

const form = ref({
  description: '',
  amount: '',
  type: 'expense' as TransactionType,
  date: new Date().toISOString().split('T')[0],
  account_id: '',
  category_id: '',
  destination_account_id: '',
  notes: '',
  is_recurring: false,
  is_installment: false,
  total_installments: '2',
})

const error = ref('')
const showDeleteConfirm = ref(false)

const isEditMode = computed(() => !!props.transaction)

const filteredCategories = computed(() => {
  if (form.value.type === 'transfer') return []
  return props.categories.filter(c =>
    c.type === (form.value.type === 'income' ? 'income' : 'expense')
  )
})

const isTransfer = computed(() => form.value.type === 'transfer')

const modalTitle = computed(() => {
  if (isEditMode.value) return 'Editar Transacao'
  switch (form.value.type) {
    case 'income': return 'Nova Receita'
    case 'expense': return 'Nova Despesa'
    case 'transfer': return 'Nova Transferencia'
    default: return 'Nova Transacao'
  }
})

const typeColors: Record<TransactionType, string> = {
  income: 'bg-primary',
  expense: 'bg-tertiary',
  transfer: 'bg-secondary',
}

// Initialize form when modal opens or transaction changes
watch([() => props.open, () => props.transaction, () => props.type], () => {
  if (props.open) {
    showDeleteConfirm.value = false
    if (props.transaction) {
      form.value = {
        description: props.transaction.description,
        amount: props.transaction.amount.toString(),
        type: props.transaction.type,
        date: props.transaction.date.split('T')[0],
        account_id: props.transaction.account_id,
        category_id: props.transaction.category_id || '',
        destination_account_id: props.transaction.destination_account_id || '',
        notes: props.transaction.notes || '',
        is_recurring: props.transaction.is_recurring,
        is_installment: !!props.transaction.total_installments,
        total_installments: props.transaction.total_installments?.toString() || '2',
      }
    } else {
      form.value = {
        description: '',
        amount: '',
        type: props.type || 'expense',
        date: new Date().toISOString().split('T')[0],
        account_id: props.accounts.find(a => a.is_default)?.id || props.accounts[0]?.id || '',
        category_id: '',
        destination_account_id: '',
        notes: '',
        is_recurring: false,
        is_installment: false,
        total_installments: '2',
      }
    }
    error.value = ''
  }
}, { immediate: true })

function handleAmountInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/[^\d.,]/g, '')
  value = value.replace(',', '.')
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
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
  if (isNaN(amount) || amount <= 0) {
    error.value = 'Digite um valor valido'
    return
  }

  if (!form.value.account_id) {
    error.value = 'Selecione uma conta'
    return
  }

  if (isTransfer.value && !form.value.destination_account_id) {
    error.value = 'Selecione a conta de destino'
    return
  }

  if (isTransfer.value && form.value.account_id === form.value.destination_account_id) {
    error.value = 'Selecione contas diferentes'
    return
  }

  const totalInstallments = form.value.is_installment ? parseInt(form.value.total_installments) : undefined
  if (form.value.is_installment && (!totalInstallments || totalInstallments < 2 || totalInstallments > 48)) {
    error.value = 'Numero de parcelas deve ser entre 2 e 48'
    return
  }

  emit('submit', {
    description: form.value.description.trim(),
    amount,
    type: form.value.type,
    date: form.value.date,
    account_id: form.value.account_id,
    category_id: form.value.category_id || undefined,
    destination_account_id: isTransfer.value ? form.value.destination_account_id : undefined,
    notes: form.value.notes.trim() || undefined,
    is_recurring: form.value.is_recurring,
    total_installments: totalInstallments,
  })
}

function handleDelete() {
  if (props.transaction) {
    emit('delete', props.transaction.id)
  }
}

function setType(type: TransactionType) {
  form.value.type = type
  form.value.category_id = ''
}

function toggleRecurring() {
  form.value.is_recurring = !form.value.is_recurring
  if (form.value.is_recurring) {
    form.value.is_installment = false
  }
}

function toggleInstallment() {
  form.value.is_installment = !form.value.is_installment
  if (form.value.is_installment) {
    form.value.is_recurring = false
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
            Tem certeza que deseja excluir esta transacao? Esta acao nao pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4">
          <div class="p-4 bg-surface-container rounded-lg">
            <p class="font-medium text-on-surface">{{ transaction?.description }}</p>
            <p class="text-sm text-on-surface-variant">
              {{ transaction?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </p>
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

      <!-- Transaction Form -->
      <template v-else>
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
          <DialogDescription>
            {{ isEditMode ? 'Atualize os dados da transacao' : 'Preencha os dados da transacao' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
          <!-- Transaction Type Toggle -->
          <div v-if="!isEditMode" class="flex gap-2 p-1 bg-surface-container rounded-lg">
            <button
              type="button"
              v-for="t in (['income', 'expense', 'transfer'] as TransactionType[])"
              :key="t"
              @click="setType(t)"
              :class="[
                'flex-1 py-2 px-3 rounded-md text-sm font-medium transition',
                form.type === t
                  ? `${typeColors[t]} text-white`
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              ]"
            >
              {{ t === 'income' ? 'Receita' : t === 'expense' ? 'Despesa' : 'Transferencia' }}
            </button>
          </div>

          <!-- Amount -->
          <div>
            <Label class="mb-2">Valor *</Label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">R$</span>
              <Input
                :model-value="form.amount"
                @input="handleAmountInput"
                type="text"
                inputmode="decimal"
                placeholder="0,00"
                class="pl-10 text-lg font-semibold h-12"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <Label class="mb-2">Descricao *</Label>
            <Input
              v-model="form.description"
              type="text"
              placeholder="Ex: Salario, Mercado, Aluguel..."
            />
          </div>

          <!-- Date -->
          <div>
            <Label class="mb-2">Data</Label>
            <div class="relative">
              <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
              <Input
                v-model="form.date"
                type="date"
                class="pl-10"
              />
            </div>
          </div>

          <!-- Account -->
          <div>
            <Label class="mb-2">{{ isTransfer ? 'Conta de Origem' : 'Conta' }} *</Label>
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

          <!-- Destination Account (for transfers) -->
          <div v-if="isTransfer">
            <Label class="mb-2">Conta de Destino *</Label>
            <Select v-model="form.destination_account_id">
              <SelectTrigger>
                <SelectValue placeholder="Selecione a conta de destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="account in accounts.filter(a => a.id !== form.account_id)"
                  :key="account.id"
                  :value="account.id"
                >
                  {{ account.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Category (not for transfers) -->
          <div v-if="!isTransfer">
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

          <!-- Recurring / Installment Options (not for transfers and not in edit mode) -->
          <div v-if="!isTransfer && !isEditMode" class="flex gap-4">
            <button
              type="button"
              @click="toggleRecurring"
              :class="[
                'flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition',
                form.is_recurring
                  ? 'border-primary bg-primary-fixed/20 text-primary'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
              ]"
            >
              <Repeat class="h-4 w-4" />
              <span class="text-sm font-medium">Recorrente</span>
            </button>
            <button
              type="button"
              @click="toggleInstallment"
              :class="[
                'flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition',
                form.is_installment
                  ? 'border-primary bg-primary-fixed/20 text-primary'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
              ]"
            >
              <span class="text-sm font-medium">Parcelado</span>
            </button>
          </div>

          <!-- Installment Count -->
          <div v-if="form.is_installment && !isEditMode">
            <Label class="mb-2">Numero de parcelas</Label>
            <Select v-model="form.total_installments">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="n in 12"
                  :key="n"
                  :value="(n + 1).toString()"
                >
                  {{ n + 1 }}x
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Notes -->
          <div>
            <Label class="mb-2">Observacoes</Label>
            <Input
              v-model="form.notes"
              type="text"
              placeholder="Adicione uma observacao (opcional)"
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
