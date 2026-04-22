<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Loader2, Calendar } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CurrencyInput, parseCurrency } from '@/components/ui/currency-input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import type { CreditCard, Category } from '@/types'

const props = defineProps<{
  open: boolean
  card: CreditCard | null
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: { amount: number; description: string; date?: string; category_id?: string; notes?: string }]
}>()

const form = ref({
  amount: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  category_id: '',
  notes: '',
})

// Fetch categories
const { data: categories } = useQuery({
  queryKey: ['categories'],
  queryFn: () => api.get<Category[]>('/categories'),
})

const expenseCategories = computed(() =>
  (categories.value || []).filter((c) => c.type === 'expense')
)

const isFormValid = computed(() => {
  const amount = parseCurrency(form.value.amount)
  return amount > 0 && form.value.description.trim() !== ''
})

function resetForm() {
  form.value = {
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    notes: '',
  }
}

function handleSubmit() {
  if (!isFormValid.value) return

  const categoryId = form.value.category_id && form.value.category_id !== '_none'
    ? form.value.category_id
    : undefined

  emit('submit', {
    amount: parseCurrency(form.value.amount),
    description: form.value.description.trim(),
    date: form.value.date || undefined,
    category_id: categoryId,
    notes: form.value.notes.trim() || undefined,
  })
}

function handleClose(value: boolean) {
  if (!value) {
    resetForm()
  }
  emit('update:open', value)
}

// Reset form when modal opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
    }
  }
)
</script>

<template>
  <Dialog :open="open && !!card" @update:open="handleClose">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Adicionar compra</DialogTitle>
        <p class="text-sm text-on-surface-variant">
          {{ card?.name }} (**** {{ card?.last_four_digits }})
        </p>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Amount -->
        <div class="space-y-2">
          <Label>Valor</Label>
          <CurrencyInput v-model="form.amount" />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <Label>Descricao</Label>
          <Input
            v-model="form.description"
            type="text"
            placeholder="Ex: Supermercado, Restaurante..."
            required
          />
        </div>

        <!-- Date -->
        <div class="space-y-2">
          <Label>Data da compra</Label>
          <div class="relative">
            <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <Input
              v-model="form.date"
              type="date"
              class="pl-10"
            />
          </div>
        </div>

        <!-- Category -->
        <div class="space-y-2">
          <Label>Categoria (opcional)</Label>
          <Select v-model="form.category_id">
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">Sem categoria</SelectItem>
              <SelectItem
                v-for="category in expenseCategories"
                :key="category.id"
                :value="category.id"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: category.color }"
                  />
                  {{ category.name }}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Notes -->
        <div class="space-y-2">
          <Label>Observacoes (opcional)</Label>
          <textarea
            v-model="form.notes"
            placeholder="Detalhes adicionais..."
            rows="2"
            class="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <DialogFooter class="gap-2">
          <Button type="button" variant="outline" @click="handleClose(false)">
            Cancelar
          </Button>
          <Button type="submit" :disabled="!isFormValid || isLoading">
            <Loader2 v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
            Adicionar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
