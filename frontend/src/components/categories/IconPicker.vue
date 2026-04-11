<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Heart,
  Briefcase,
  GraduationCap,
  Plane,
  Gift,
  Smartphone,
  Wifi,
  Zap,
  Droplets,
  Bus,
  Coffee,
  Music,
  Film,
  Gamepad2,
  Dumbbell,
  Shirt,
  Scissors,
  PawPrint,
  Baby,
  Pill,
  Stethoscope,
  Building2,
  Landmark,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Wallet,
  Receipt,
  DollarSign,
  Percent,
  type LucideIcon,
} from 'lucide-vue-next'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

interface IconOption {
  name: string
  icon: LucideIcon
  category: string
}

const icons: IconOption[] = [
  // Shopping & Food
  { name: 'shopping-cart', icon: ShoppingCart, category: 'Compras' },
  { name: 'utensils', icon: Utensils, category: 'Alimentacao' },
  { name: 'coffee', icon: Coffee, category: 'Alimentacao' },

  // Home & Bills
  { name: 'home', icon: Home, category: 'Moradia' },
  { name: 'zap', icon: Zap, category: 'Contas' },
  { name: 'droplets', icon: Droplets, category: 'Contas' },
  { name: 'wifi', icon: Wifi, category: 'Contas' },
  { name: 'smartphone', icon: Smartphone, category: 'Contas' },

  // Transport
  { name: 'car', icon: Car, category: 'Transporte' },
  { name: 'bus', icon: Bus, category: 'Transporte' },
  { name: 'plane', icon: Plane, category: 'Viagem' },

  // Entertainment
  { name: 'music', icon: Music, category: 'Entretenimento' },
  { name: 'film', icon: Film, category: 'Entretenimento' },
  { name: 'gamepad-2', icon: Gamepad2, category: 'Entretenimento' },

  // Health & Personal
  { name: 'heart', icon: Heart, category: 'Saude' },
  { name: 'pill', icon: Pill, category: 'Saude' },
  { name: 'stethoscope', icon: Stethoscope, category: 'Saude' },
  { name: 'dumbbell', icon: Dumbbell, category: 'Saude' },
  { name: 'scissors', icon: Scissors, category: 'Pessoal' },
  { name: 'shirt', icon: Shirt, category: 'Vestuario' },

  // Family
  { name: 'baby', icon: Baby, category: 'Familia' },
  { name: 'paw-print', icon: PawPrint, category: 'Pets' },
  { name: 'gift', icon: Gift, category: 'Presentes' },

  // Work & Education
  { name: 'briefcase', icon: Briefcase, category: 'Trabalho' },
  { name: 'graduation-cap', icon: GraduationCap, category: 'Educacao' },
  { name: 'building-2', icon: Building2, category: 'Trabalho' },

  // Finance
  { name: 'wallet', icon: Wallet, category: 'Financas' },
  { name: 'piggy-bank', icon: PiggyBank, category: 'Financas' },
  { name: 'trending-up', icon: TrendingUp, category: 'Investimentos' },
  { name: 'credit-card', icon: CreditCard, category: 'Financas' },
  { name: 'landmark', icon: Landmark, category: 'Financas' },
  { name: 'dollar-sign', icon: DollarSign, category: 'Financas' },
  { name: 'receipt', icon: Receipt, category: 'Financas' },
  { name: 'percent', icon: Percent, category: 'Financas' },
]

const selectedIcon = ref(props.modelValue || 'wallet')
const searchQuery = ref('')

const filteredIcons = computed(() => {
  if (!searchQuery.value) return icons
  const query = searchQuery.value.toLowerCase()
  return icons.filter(
    icon =>
      icon.name.includes(query) ||
      icon.category.toLowerCase().includes(query)
  )
})

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedIcon.value = newValue
  }
})

function selectIcon(iconName: string) {
  selectedIcon.value = iconName
  emit('update:modelValue', iconName)
}

function getIconComponent(iconName: string): LucideIcon {
  return icons.find(i => i.name === iconName)?.icon || Wallet
}
</script>

<template>
  <div class="space-y-3">
    <!-- Search -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Buscar icone..."
      class="w-full px-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-lowest"
    />

    <!-- Icons Grid -->
    <div class="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
      <button
        v-for="icon in filteredIcons"
        :key="icon.name"
        type="button"
        @click="selectIcon(icon.name)"
        :title="icon.category"
        :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
          selectedIcon === icon.name
            ? 'bg-primary text-white ring-2 ring-offset-2 ring-primary'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        ]"
      >
        <component :is="icon.icon" class="h-5 w-5" />
      </button>
    </div>

    <!-- Selected indicator -->
    <p v-if="selectedIcon" class="text-xs text-on-surface-variant">
      Icone selecionado: {{ icons.find(i => i.name === selectedIcon)?.category || selectedIcon }}
    </p>
  </div>
</template>
