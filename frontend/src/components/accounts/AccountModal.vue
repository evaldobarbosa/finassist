<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Loader2, AlertTriangle, Wallet, PiggyBank, CreditCard, TrendingUp } from 'lucide-vue-next'
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
import type { Account } from '@/types'

type AccountType = 'checking' | 'savings' | 'wallet' | 'investment'

const props = defineProps<{
  open: boolean
  account?: Account | null
  isLoading?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [data: Partial<Account>]
  'delete': [id: string]
}>()

const form = ref({
  name: '',
  type: 'checking' as AccountType,
  balance: '',
  color: '#006b2c',
  is_default: false,
  include_in_total: true,
})

const error = ref('')
const showDeleteConfirm = ref(false)

const isEditMode = computed(() => !!props.account)

const modalTitle = computed(() =>
  isEditMode.value ? 'Editar Conta' : 'Nova Conta'
)

const accountTypes: { value: AccountType; label: string; icon: typeof Wallet }[] = [
  { value: 'checking', label: 'Conta Corrente', icon: Wallet },
  { value: 'savings', label: 'Poupanca', icon: PiggyBank },
  { value: 'wallet', label: 'Carteira', icon: CreditCard },
  { value: 'investment', label: 'Investimento', icon: TrendingUp },
]

const colorOptions = [
  '#006b2c', // Primary green
  '#0058be', // Blue
  '#9b59b6', // Purple
  '#e74c3c', // Red
  '#f39c12', // Orange
  '#1abc9c', // Teal
  '#34495e', // Dark gray
  '#e91e63', // Pink
]

// Initialize form when modal opens
watch([() => props.open, () => props.account], () => {
  if (props.open) {
    showDeleteConfirm.value = false
    if (props.account) {
      form.value = {
        name: props.account.name,
        type: props.account.type,
        balance: formatCurrency(Number(props.account.balance)),
        color: props.account.color || '#006b2c',
        is_default: props.account.is_default,
        include_in_total: props.account.include_in_total,
      }
    } else {
      form.value = {
        name: '',
        type: 'checking',
        balance: '0,00',
        color: '#006b2c',
        is_default: false,
        include_in_total: true,
      }
    }
    error.value = ''
  }
}, { immediate: true })

function handleClose() {
  emit('update:open', false)
}

function handleSubmit() {
  error.value = ''

  if (!form.value.name.trim()) {
    error.value = 'Digite um nome para a conta'
    return
  }

  const balance = form.value.balance ? parseCurrency(form.value.balance) : 0

  emit('submit', {
    name: form.value.name.trim(),
    type: form.value.type,
    balance,
    color: form.value.color,
    is_default: form.value.is_default,
    include_in_total: form.value.include_in_total,
  })
}

function handleDelete() {
  if (props.account) {
    emit('delete', props.account.id)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[450px]">
      <!-- Delete Confirmation -->
      <template v-if="showDeleteConfirm">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 text-tertiary">
            <AlertTriangle class="h-5 w-5" />
            Confirmar exclusao
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta conta? Todas as transacoes associadas serao mantidas, mas sem conta vinculada.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4">
          <div class="p-4 bg-surface-container rounded-lg">
            <p class="font-medium text-on-surface">{{ account?.name }}</p>
            <p class="text-sm text-on-surface-variant">
              Saldo: {{ account?.balance?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
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

      <!-- Account Form -->
      <template v-else>
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
          <DialogDescription>
            {{ isEditMode ? 'Atualize os dados da conta' : 'Adicione uma nova conta para organizar suas financas' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-5 py-4">
          <!-- Name -->
          <div>
            <Label class="mb-2">Nome da conta *</Label>
            <Input
              v-model="form.name"
              type="text"
              placeholder="Ex: Nubank, Bradesco, Carteira..."
            />
          </div>

          <!-- Type -->
          <div>
            <Label class="mb-2">Tipo de conta</Label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="type in accountTypes"
                :key="type.value"
                type="button"
                @click="form.type = type.value"
                :class="[
                  'flex items-center gap-2 p-3 rounded-lg border transition',
                  form.type === type.value
                    ? 'border-primary bg-primary-fixed/20 text-primary'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                ]"
              >
                <component :is="type.icon" class="h-4 w-4" />
                <span class="text-sm font-medium">{{ type.label }}</span>
              </button>
            </div>
          </div>

          <!-- Initial Balance (only for new accounts) -->
          <div v-if="!isEditMode">
            <Label class="mb-2">Saldo inicial</Label>
            <CurrencyInput v-model="form.balance" />
            <p class="text-xs text-on-surface-variant mt-1">
              Informe o saldo atual desta conta
            </p>
          </div>

          <!-- Color -->
          <div>
            <Label class="mb-2">Cor</Label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="color in colorOptions"
                :key="color"
                type="button"
                @click="form.color = color"
                :class="[
                  'w-8 h-8 rounded-full transition-transform',
                  form.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                ]"
                :style="{ backgroundColor: color }"
              ></button>
            </div>
          </div>

          <!-- Options -->
          <div class="space-y-3">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="form.include_in_total"
                class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <div>
                <span class="text-sm font-medium text-on-surface">Incluir no saldo total</span>
                <p class="text-xs text-on-surface-variant">O saldo sera somado no dashboard</p>
              </div>
            </label>

            <label v-if="!isEditMode" class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="form.is_default"
                class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <div>
                <span class="text-sm font-medium text-on-surface">Conta padrao</span>
                <p class="text-xs text-on-surface-variant">Sera selecionada automaticamente em novas transacoes</p>
              </div>
            </label>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-tertiary text-sm">{{ error }}</p>
        </form>

        <DialogFooter class="flex-col sm:flex-row gap-2">
          <Button
            v-if="isEditMode && !account?.is_default"
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
