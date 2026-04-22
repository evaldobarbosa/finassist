<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loader2, AlertTriangle } from 'lucide-vue-next'
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
import { CurrencyInput, parseCurrency, formatCurrency } from '@/components/ui/currency-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ColorPicker from '@/components/categories/ColorPicker.vue'
import type { CreditCard } from '@/types'

const props = defineProps<{
  open: boolean
  card?: CreditCard | null
  isLoading?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [data: Partial<CreditCard>]
  'delete': [id: string]
}>()

const form = ref({
  name: '',
  brand: '',
  last_four_digits: '',
  limit: '',
  closing_day: '',
  due_day: '',
  color: '#1a1a2e',
})

const error = ref('')
const showDeleteConfirm = ref(false)

const isEditMode = computed(() => !!props.card)

const modalTitle = computed(() =>
  isEditMode.value ? 'Editar Cartao' : 'Novo Cartao de Credito'
)

const brandOptions = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'elo', label: 'Elo' },
  { value: 'amex', label: 'American Express' },
  { value: 'hipercard', label: 'Hipercard' },
  { value: 'other', label: 'Outra' },
]

// Initialize form when modal opens
watch([() => props.open, () => props.card], () => {
  if (props.open) {
    showDeleteConfirm.value = false
    if (props.card) {
      form.value = {
        name: props.card.name,
        brand: props.card.brand || '',
        last_four_digits: props.card.last_four_digits || '',
        limit: props.card.limit ? formatCurrency(props.card.limit) : '',
        closing_day: props.card.closing_day?.toString() || '',
        due_day: props.card.due_day?.toString() || '',
        color: props.card.color || '#1a1a2e',
      }
    } else {
      form.value = {
        name: '',
        brand: '',
        last_four_digits: '',
        limit: '',
        closing_day: '',
        due_day: '',
        color: '#1a1a2e',
      }
    }
    error.value = ''
  }
}, { immediate: true })

function handleClosingDayInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  const num = parseInt(value)
  if (num > 31) value = '31'
  if (num < 1 && value !== '') value = '1'
  form.value.closing_day = value
}

function handleDueDayInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  const num = parseInt(value)
  if (num > 31) value = '31'
  if (num < 1 && value !== '') value = '1'
  form.value.due_day = value
}

function handleLastFourInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  form.value.last_four_digits = value
}

function handleClose() {
  emit('update:open', false)
}

function handleSubmit() {
  error.value = ''

  if (!form.value.name.trim()) {
    error.value = 'Digite um nome para o cartao'
    return
  }

  const limit = form.value.limit ? parseCurrency(form.value.limit) : undefined
  if (limit !== undefined && (isNaN(limit) || limit < 0)) {
    error.value = 'Digite um limite valido'
    return
  }

  const closingDay = form.value.closing_day ? parseInt(form.value.closing_day) : undefined
  const dueDay = form.value.due_day ? parseInt(form.value.due_day) : undefined

  emit('submit', {
    name: form.value.name.trim(),
    brand: form.value.brand || undefined,
    last_four_digits: form.value.last_four_digits || undefined,
    limit,
    closing_day: closingDay,
    due_day: dueDay,
    color: form.value.color,
  })
}

function handleDelete() {
  if (props.card) {
    emit('delete', props.card.id)
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
            Tem certeza que deseja excluir este cartao? As transacoes associadas serao mantidas.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4">
          <div
            class="p-6 rounded-xl text-white"
            :style="{ background: `linear-gradient(135deg, ${card?.color || '#1a1a2e'} 0%, ${card?.color || '#1a1a2e'}cc 100%)` }"
          >
            <p class="text-white/70 text-sm">{{ card?.brand }}</p>
            <p class="font-semibold">{{ card?.name }}</p>
            <p class="font-mono mt-2">**** {{ card?.last_four_digits || '0000' }}</p>
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

      <!-- Card Form -->
      <template v-else>
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
          <DialogDescription>
            {{ isEditMode ? 'Atualize os dados do cartao' : 'Adicione um novo cartao de credito' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-5 py-4">
          <!-- Name -->
          <div>
            <Label class="mb-2">Nome do cartao *</Label>
            <Input
              v-model="form.name"
              type="text"
              placeholder="Ex: Nubank, Inter, Itau..."
            />
          </div>

          <!-- Brand and Last 4 Digits -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="mb-2">Bandeira</Label>
              <Select v-model="form.brand">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="brand in brandOptions" :key="brand.value" :value="brand.value">
                    {{ brand.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label class="mb-2">Ultimos 4 digitos</Label>
              <Input
                :model-value="form.last_four_digits"
                @input="handleLastFourInput"
                type="text"
                inputmode="numeric"
                placeholder="0000"
                maxlength="4"
              />
            </div>
          </div>

          <!-- Limit -->
          <div>
            <Label class="mb-2">Limite</Label>
            <CurrencyInput v-model="form.limit" />
          </div>

          <!-- Closing and Due Days -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="mb-2">Dia de fechamento</Label>
              <Input
                :model-value="form.closing_day"
                @input="handleClosingDayInput"
                type="text"
                inputmode="numeric"
                placeholder="Ex: 15"
                maxlength="2"
              />
            </div>
            <div>
              <Label class="mb-2">Dia de vencimento</Label>
              <Input
                :model-value="form.due_day"
                @input="handleDueDayInput"
                type="text"
                inputmode="numeric"
                placeholder="Ex: 25"
                maxlength="2"
              />
            </div>
          </div>

          <!-- Color -->
          <div>
            <Label class="mb-2">Cor do cartao</Label>
            <ColorPicker v-model="form.color" />
          </div>

          <!-- Preview -->
          <div>
            <Label class="mb-2">Previa</Label>
            <div
              class="rounded-xl p-4 text-white"
              :style="{ background: `linear-gradient(135deg, ${form.color} 0%, ${form.color}cc 100%)` }"
            >
              <p class="text-white/70 text-sm">{{ brandOptions.find(b => b.value === form.brand)?.label || 'Cartao' }}</p>
              <p class="font-semibold">{{ form.name || 'Nome do cartao' }}</p>
              <p class="font-mono mt-2 text-sm">**** **** **** {{ form.last_four_digits || '0000' }}</p>
            </div>
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
            {{ isEditMode ? 'Salvar' : 'Criar' }}
          </Button>
        </DialogFooter>
      </template>
    </DialogContent>
  </Dialog>
</template>
