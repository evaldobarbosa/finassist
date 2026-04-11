<script setup lang="ts">
import { computed } from 'vue'
import {
  Wallet,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Star,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  EyeOff,
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
import type { Account } from '@/types'

const props = defineProps<{
  account: Account
}>()

const emit = defineEmits<{
  edit: [account: Account]
  delete: [account: Account]
  'set-default': [account: Account]
}>()

const typeConfig = computed(() => {
  switch (props.account.type) {
    case 'checking':
      return {
        icon: Wallet,
        label: 'Conta Corrente',
        colorClass: 'bg-primary/10 text-primary',
      }
    case 'savings':
      return {
        icon: PiggyBank,
        label: 'Poupanca',
        colorClass: 'bg-secondary/10 text-secondary',
      }
    case 'wallet':
      return {
        icon: CreditCard,
        label: 'Carteira',
        colorClass: 'bg-yellow-500/10 text-yellow-600',
      }
    case 'investment':
      return {
        icon: TrendingUp,
        label: 'Investimento',
        colorClass: 'bg-purple-500/10 text-purple-600',
      }
    default:
      return {
        icon: Wallet,
        label: 'Conta',
        colorClass: 'bg-surface-container text-on-surface-variant',
      }
  }
})

const isPositiveBalance = computed(() => props.account.balance >= 0)

const cardStyle = computed(() => {
  if (props.account.color) {
    return {
      borderColor: props.account.color,
      borderLeftWidth: '4px',
    }
  }
  return {}
})
</script>

<template>
  <div
    class="bg-surface-container-lowest rounded-xl p-5 shadow-editorial hover:shadow-lg transition-shadow relative group"
    :style="cardStyle"
  >
    <!-- Default Badge -->
    <Badge
      v-if="account.is_default"
      variant="success"
      class="absolute top-3 right-12"
    >
      <Star class="h-3 w-3 mr-1 fill-current" />
      Padrao
    </Badge>

    <!-- Not included indicator -->
    <div
      v-if="!account.include_in_total"
      class="absolute top-3 right-12"
      :class="account.is_default ? 'right-28' : 'right-12'"
    >
      <Badge variant="outline" class="text-on-surface-variant">
        <EyeOff class="h-3 w-3 mr-1" />
        Oculta
      </Badge>
    </div>

    <!-- Actions Menu -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button class="absolute top-3 right-3 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-container transition">
          <MoreVertical class="h-4 w-4 text-on-surface-variant" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          v-if="!account.is_default"
          @click="emit('set-default', account)"
          class="cursor-pointer"
        >
          <Star class="h-4 w-4 mr-2" />
          Definir como padrao
        </DropdownMenuItem>
        <DropdownMenuItem @click="emit('edit', account)" class="cursor-pointer">
          <Pencil class="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          @click="emit('delete', account)"
          class="cursor-pointer text-tertiary"
          :disabled="account.is_default"
        >
          <Trash2 class="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Icon and Type -->
    <div class="flex items-start gap-4 mb-4">
      <div
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center',
          typeConfig.colorClass
        ]"
      >
        <component :is="typeConfig.icon" class="h-6 w-6" />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-on-surface truncate">
          {{ account.name }}
        </h3>
        <p class="text-sm text-on-surface-variant">
          {{ typeConfig.label }}
        </p>
      </div>
    </div>

    <!-- Balance -->
    <div class="pt-4 border-t border-outline-variant">
      <p class="text-sm text-on-surface-variant mb-1">Saldo atual</p>
      <p
        :class="[
          'text-2xl font-bold',
          isPositiveBalance ? 'text-on-surface' : 'text-tertiary'
        ]"
      >
        {{ formatCurrency(account.balance) }}
      </p>
    </div>
  </div>
</template>
