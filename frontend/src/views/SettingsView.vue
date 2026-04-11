<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  User,
  Phone,
  Bell,
  CreditCard,
  LogOut,
  Check,
  Loader2,
  MessageSquare,
  AlertTriangle,
  Crown,
  Sparkles,
} from 'lucide-vue-next'
import AppLayout from '@/components/layout/AppLayout.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { api } from '@/lib/api'
import type { User as UserType } from '@/types'

const queryClient = useQueryClient()
const { user, logout } = useAuth()
const { success, error: showError } = useToast()

const activeTab = ref<'profile' | 'whatsapp' | 'notifications' | 'subscription'>('profile')

// Profile form
const profileForm = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
})

// Notification settings
const notifications = ref({
  bills_reminder: true,
  weekly_summary: true,
  budget_alerts: true,
  transaction_confirmation: false,
})

// Update profile
const updateProfileMutation = useMutation({
  mutationFn: (data: Partial<UserType>) => api.put<UserType>('/user/profile', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user'] })
    success('Perfil atualizado', 'Suas informacoes foram salvas')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel atualizar o perfil')
  },
})

// Update notifications
const updateNotificationsMutation = useMutation({
  mutationFn: (data: typeof notifications.value) => api.put('/user/notifications', data),
  onSuccess: () => {
    success('Notificacoes atualizadas', 'Suas preferencias foram salvas')
  },
  onError: () => {
    showError('Erro', 'Nao foi possivel atualizar as notificacoes')
  },
})

function handleProfileSubmit() {
  updateProfileMutation.mutate({
    name: profileForm.value.name,
    email: profileForm.value.email,
  })
}

function handleNotificationsSubmit() {
  updateNotificationsMutation.mutate(notifications.value)
}

function handleLogout() {
  logout()
}

const tabs = [
  { id: 'profile' as const, label: 'Perfil', icon: User },
  { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageSquare },
  { id: 'notifications' as const, label: 'Notificacoes', icon: Bell },
  { id: 'subscription' as const, label: 'Assinatura', icon: Crown },
]

// Demo subscription data
const subscription = ref({
  plan: 'free',
  status: 'active',
  features: {
    accounts: { used: 2, limit: 3 },
    categories: { used: 8, limit: 10 },
    transactions: { used: 45, limit: 100 },
  },
})

const isPremium = computed(() => subscription.value.plan === 'premium')
</script>

<template>
  <AppLayout>
    <div class="p-4 lg:p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-on-surface">Configuracoes</h1>
          <p class="text-on-surface-variant">Gerencie sua conta e preferencias</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Sidebar Navigation -->
          <nav class="lg:w-64 shrink-0">
            <div class="bg-surface-container-lowest rounded-xl shadow-editorial p-2">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition',
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-on-surface hover:bg-surface-container'
                ]"
              >
                <component :is="tab.icon" class="h-5 w-5" />
                {{ tab.label }}
              </button>

              <Separator class="my-2" />

              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-tertiary hover:bg-tertiary/10 transition"
              >
                <LogOut class="h-5 w-5" />
                Sair
              </button>
            </div>
          </nav>

          <!-- Content -->
          <div class="flex-1">
            <!-- Profile Tab -->
            <div v-show="activeTab === 'profile'" class="space-y-6">
              <div class="bg-surface-container-lowest rounded-xl shadow-editorial p-6">
                <h2 class="text-lg font-semibold text-on-surface mb-4">Informacoes pessoais</h2>

                <form @submit.prevent="handleProfileSubmit" class="space-y-4">
                  <div>
                    <Label class="mb-2">Nome</Label>
                    <Input
                      v-model="profileForm.name"
                      type="text"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <Label class="mb-2">Email</Label>
                    <Input
                      v-model="profileForm.email"
                      type="email"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <Label class="mb-2">Telefone</Label>
                    <div class="flex items-center gap-2">
                      <Input
                        :model-value="user?.phone || '+55 11 99999-9999'"
                        type="text"
                        disabled
                        class="flex-1"
                      />
                      <Badge variant="success">
                        <Check class="h-3 w-3 mr-1" />
                        Verificado
                      </Badge>
                    </div>
                    <p class="text-xs text-on-surface-variant mt-1">
                      O telefone e usado para login e nao pode ser alterado
                    </p>
                  </div>

                  <Button type="submit" :disabled="updateProfileMutation.isPending.value">
                    <Loader2 v-if="updateProfileMutation.isPending.value" class="h-4 w-4 animate-spin mr-2" />
                    Salvar alteracoes
                  </Button>
                </form>
              </div>

              <!-- Danger Zone -->
              <div class="bg-surface-container-lowest rounded-xl shadow-editorial p-6 border border-tertiary/20">
                <h2 class="text-lg font-semibold text-tertiary mb-2 flex items-center gap-2">
                  <AlertTriangle class="h-5 w-5" />
                  Zona de perigo
                </h2>
                <p class="text-on-surface-variant mb-4">
                  Acoes irreversiveis que afetam sua conta permanentemente
                </p>
                <Button variant="destructive" disabled>
                  Excluir minha conta
                </Button>
              </div>
            </div>

            <!-- WhatsApp Tab -->
            <div v-show="activeTab === 'whatsapp'" class="space-y-6">
              <div class="bg-surface-container-lowest rounded-xl shadow-editorial p-6">
                <h2 class="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
                  <MessageSquare class="h-5 w-5 text-green-500" />
                  Integracao com WhatsApp
                </h2>

                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                    <div class="flex items-center gap-3">
                      <Phone class="h-10 w-10 p-2 bg-green-500 text-white rounded-full" />
                      <div>
                        <p class="font-medium text-on-surface">WhatsApp conectado</p>
                        <p class="text-sm text-on-surface-variant">{{ user?.phone || '+55 11 99999-9999' }}</p>
                      </div>
                    </div>
                    <Badge variant="success">
                      <Check class="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>

                  <div class="space-y-3">
                    <h3 class="font-medium text-on-surface">O que voce pode fazer:</h3>
                    <ul class="space-y-2 text-on-surface-variant">
                      <li class="flex items-start gap-2">
                        <Check class="h-4 w-4 text-green-500 mt-0.5" />
                        Registrar transacoes por mensagem de texto
                      </li>
                      <li class="flex items-start gap-2">
                        <Check class="h-4 w-4 text-green-500 mt-0.5" />
                        Receber resumos diarios e semanais
                      </li>
                      <li class="flex items-start gap-2">
                        <Check class="h-4 w-4 text-green-500 mt-0.5" />
                        Consultar saldo e extrato
                      </li>
                      <li class="flex items-start gap-2">
                        <Check class="h-4 w-4 text-green-500 mt-0.5" />
                        Alertas de vencimento de contas
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 class="font-medium text-on-surface mb-2">Comandos disponiveis:</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div class="p-3 bg-surface-container rounded-lg">
                        <code class="text-primary text-sm">gastei 50 com almoco</code>
                        <p class="text-xs text-on-surface-variant mt-1">Registra uma despesa</p>
                      </div>
                      <div class="p-3 bg-surface-container rounded-lg">
                        <code class="text-primary text-sm">recebi 3000 de salario</code>
                        <p class="text-xs text-on-surface-variant mt-1">Registra uma receita</p>
                      </div>
                      <div class="p-3 bg-surface-container rounded-lg">
                        <code class="text-primary text-sm">saldo</code>
                        <p class="text-xs text-on-surface-variant mt-1">Consulta o saldo atual</p>
                      </div>
                      <div class="p-3 bg-surface-container rounded-lg">
                        <code class="text-primary text-sm">extrato</code>
                        <p class="text-xs text-on-surface-variant mt-1">Ultimas transacoes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications Tab -->
            <div v-show="activeTab === 'notifications'" class="space-y-6">
              <div class="bg-surface-container-lowest rounded-xl shadow-editorial p-6">
                <h2 class="text-lg font-semibold text-on-surface mb-4">Preferencias de notificacao</h2>

                <form @submit.prevent="handleNotificationsSubmit" class="space-y-4">
                  <label class="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="notifications.bills_reminder"
                      class="w-5 h-5 text-primary mt-0.5"
                    />
                    <div>
                      <p class="font-medium text-on-surface">Lembrete de contas a pagar</p>
                      <p class="text-sm text-on-surface-variant">
                        Receba alertas antes do vencimento de faturas e boletos
                      </p>
                    </div>
                  </label>

                  <label class="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="notifications.weekly_summary"
                      class="w-5 h-5 text-primary mt-0.5"
                    />
                    <div>
                      <p class="font-medium text-on-surface">Resumo semanal</p>
                      <p class="text-sm text-on-surface-variant">
                        Receba um resumo das suas financas toda segunda-feira
                      </p>
                    </div>
                  </label>

                  <label class="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="notifications.budget_alerts"
                      class="w-5 h-5 text-primary mt-0.5"
                    />
                    <div>
                      <p class="font-medium text-on-surface">Alertas de orcamento</p>
                      <p class="text-sm text-on-surface-variant">
                        Seja notificado quando estiver proximo do limite de uma categoria
                      </p>
                    </div>
                  </label>

                  <label class="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="notifications.transaction_confirmation"
                      class="w-5 h-5 text-primary mt-0.5"
                    />
                    <div>
                      <p class="font-medium text-on-surface">Confirmacao de transacoes</p>
                      <p class="text-sm text-on-surface-variant">
                        Receba confirmacao a cada transacao registrada
                      </p>
                    </div>
                  </label>

                  <Button type="submit" :disabled="updateNotificationsMutation.isPending.value">
                    <Loader2 v-if="updateNotificationsMutation.isPending.value" class="h-4 w-4 animate-spin mr-2" />
                    Salvar preferencias
                  </Button>
                </form>
              </div>
            </div>

            <!-- Subscription Tab -->
            <div v-show="activeTab === 'subscription'" class="space-y-6">
              <!-- Current Plan -->
              <div class="bg-surface-container-lowest rounded-xl shadow-editorial p-6">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg font-semibold text-on-surface">Seu plano atual</h2>
                  <Badge :variant="isPremium ? 'success' : 'outline'">
                    {{ isPremium ? 'Premium' : 'Gratuito' }}
                  </Badge>
                </div>

                <div v-if="!isPremium" class="space-y-4">
                  <p class="text-on-surface-variant">
                    Voce esta usando o plano gratuito com recursos limitados.
                  </p>

                  <!-- Usage -->
                  <div class="space-y-3">
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-on-surface-variant">Contas</span>
                        <span class="text-on-surface">
                          {{ subscription.features.accounts.used }}/{{ subscription.features.accounts.limit }}
                        </span>
                      </div>
                      <div class="h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          class="h-full bg-primary rounded-full"
                          :style="{ width: `${(subscription.features.accounts.used / subscription.features.accounts.limit) * 100}%` }"
                        />
                      </div>
                    </div>

                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-on-surface-variant">Categorias</span>
                        <span class="text-on-surface">
                          {{ subscription.features.categories.used }}/{{ subscription.features.categories.limit }}
                        </span>
                      </div>
                      <div class="h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          class="h-full bg-primary rounded-full"
                          :style="{ width: `${(subscription.features.categories.used / subscription.features.categories.limit) * 100}%` }"
                        />
                      </div>
                    </div>

                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-on-surface-variant">Transacoes/mes</span>
                        <span class="text-on-surface">
                          {{ subscription.features.transactions.used }}/{{ subscription.features.transactions.limit }}
                        </span>
                      </div>
                      <div class="h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          class="h-full bg-primary rounded-full"
                          :style="{ width: `${(subscription.features.transactions.used / subscription.features.transactions.limit) * 100}%` }"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="space-y-4">
                  <p class="text-on-surface-variant">
                    Voce tem acesso ilimitado a todos os recursos.
                  </p>
                  <Badge variant="success" class="text-sm py-1 px-3">
                    <Sparkles class="h-4 w-4 mr-1" />
                    Recursos ilimitados
                  </Badge>
                </div>
              </div>

              <!-- Upgrade CTA -->
              <div
                v-if="!isPremium"
                class="bg-gradient-to-br from-primary to-primary-container rounded-xl shadow-editorial p-6 text-white"
              >
                <div class="flex items-start gap-4">
                  <div class="p-3 bg-white/20 rounded-full">
                    <Crown class="h-8 w-8" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold mb-2">Upgrade para Premium</h3>
                    <ul class="space-y-2 mb-4">
                      <li class="flex items-center gap-2">
                        <Check class="h-4 w-4" />
                        Contas e categorias ilimitadas
                      </li>
                      <li class="flex items-center gap-2">
                        <Check class="h-4 w-4" />
                        Transacoes ilimitadas
                      </li>
                      <li class="flex items-center gap-2">
                        <Check class="h-4 w-4" />
                        Relatorios avancados
                      </li>
                      <li class="flex items-center gap-2">
                        <Check class="h-4 w-4" />
                        Exportacao de dados
                      </li>
                      <li class="flex items-center gap-2">
                        <Check class="h-4 w-4" />
                        Suporte prioritario
                      </li>
                    </ul>
                    <div class="flex items-baseline gap-2 mb-4">
                      <span class="text-3xl font-bold">R$ 19,90</span>
                      <span class="text-white/70">/mes</span>
                    </div>
                    <Button variant="secondary" class="bg-white text-primary hover:bg-white/90">
                      <CreditCard class="h-4 w-4 mr-2" />
                      Assinar agora
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
