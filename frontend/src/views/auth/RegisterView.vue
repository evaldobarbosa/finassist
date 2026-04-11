<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MessageCircle, ArrowLeft, ArrowRight, Loader2, User, Mail, CheckCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/api'
import { PhoneInput } from '@/components/ui/phone-input'
import { OtpInput } from '@/components/ui/otp-input'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const router = useRouter()
const authStore = useAuthStore()

type Step = 'phone' | 'verification' | 'profile'

const step = ref<Step>('phone')
const phone = ref('')
const verificationCode = ref('')
const name = ref('')
const email = ref('')
const isLoading = ref(false)
const error = ref('')
const resendCountdown = ref(0)

const isPhoneValid = computed(() => phone.value.length === 11)
const isProfileValid = computed(() => name.value.trim().length >= 2)

const steps = [
  { id: 'phone', label: 'Telefone' },
  { id: 'verification', label: 'Verificar' },
  { id: 'profile', label: 'Perfil' },
]

const currentStepIndex = computed(() => steps.findIndex(s => s.id === step.value))

async function handlePhoneSubmit() {
  if (!isPhoneValid.value) {
    error.value = 'Digite um numero de telefone valido'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await api.post('/auth/request-code', { phone: phone.value })
    step.value = 'verification'
    startResendCountdown()
  } catch (e) {
    error.value = 'Erro ao enviar codigo. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

async function handleVerificationSubmit(code?: string) {
  const codeToVerify = code || verificationCode.value

  if (codeToVerify.length !== 6) {
    error.value = 'Digite o codigo completo'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await api.post('/auth/verify-code', {
      phone: phone.value,
      code: codeToVerify,
    })
    step.value = 'profile'
  } catch (e) {
    error.value = 'Codigo invalido ou expirado.'
    verificationCode.value = ''
  } finally {
    isLoading.value = false
  }
}

async function handleProfileSubmit() {
  if (!isProfileValid.value) {
    error.value = 'Digite seu nome'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await api.post<{ id: string; phone: string; name: string; email?: string }>('/users', {
      phone: phone.value,
      name: name.value.trim(),
      email: email.value.trim() || undefined,
    })

    authStore.setPhone(phone.value)
    authStore.setUser({
      ...response,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = 'Erro ao criar conta. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

function handleCodeComplete(code: string) {
  handleVerificationSubmit(code)
}

function startResendCountdown() {
  resendCountdown.value = 60
  const interval = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

async function resendCode() {
  if (resendCountdown.value > 0) return

  isLoading.value = true
  error.value = ''

  try {
    await api.post('/auth/request-code', { phone: phone.value })
    startResendCountdown()
  } catch (e) {
    error.value = 'Erro ao reenviar codigo.'
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  error.value = ''
  if (step.value === 'verification') {
    step.value = 'phone'
    verificationCode.value = ''
  } else if (step.value === 'profile') {
    step.value = 'verification'
  }
}

// Demo registration
function handleDemoRegister() {
  authStore.setPhone(phone.value)
  authStore.setUser({
    id: '1',
    phone: phone.value,
    name: name.value || 'Usuario Demo',
    email: email.value || undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left side - Branding (Desktop) -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-container items-center justify-center p-12 relative overflow-hidden">
      <div class="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div class="text-white text-center relative z-10 max-w-md">
        <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <span class="text-4xl font-bold">F</span>
        </div>
        <h1 class="text-4xl font-bold mb-4">FinAssistant</h1>
        <p class="text-lg text-white/90 mb-8">
          Comece a organizar suas financas hoje mesmo. E gratis!
        </p>

        <!-- Features list -->
        <div class="text-left space-y-4">
          <div class="flex items-center gap-3">
            <CheckCircle class="h-5 w-5 text-primary-fixed" />
            <span class="text-white/90">Controle de receitas e despesas</span>
          </div>
          <div class="flex items-center gap-3">
            <CheckCircle class="h-5 w-5 text-primary-fixed" />
            <span class="text-white/90">Gestao de contas e cartoes</span>
          </div>
          <div class="flex items-center gap-3">
            <CheckCircle class="h-5 w-5 text-primary-fixed" />
            <span class="text-white/90">Registro via WhatsApp</span>
          </div>
          <div class="flex items-center gap-3">
            <CheckCircle class="h-5 w-5 text-primary-fixed" />
            <span class="text-white/90">Relatorios e insights</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Register Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-6">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-white">F</span>
          </div>
          <h1 class="text-2xl font-bold text-primary">FinAssistant</h1>
        </div>

        <!-- Progress Steps -->
        <div class="flex items-center justify-center gap-2 mb-8">
          <template v-for="(s, index) in steps" :key="s.id">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition',
                index < currentStepIndex
                  ? 'bg-primary text-white'
                  : index === currentStepIndex
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface-variant'
              ]"
            >
              <CheckCircle v-if="index < currentStepIndex" class="h-4 w-4" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div
              v-if="index < steps.length - 1"
              :class="[
                'w-12 h-1 rounded transition',
                index < currentStepIndex ? 'bg-primary' : 'bg-surface-container'
              ]"
            ></div>
          </template>
        </div>

        <!-- Step: Phone Input -->
        <div v-if="step === 'phone'">
          <h2 class="text-2xl font-semibold text-on-surface mb-2">Criar conta</h2>
          <p class="text-on-surface-variant mb-8">
            Comece informando seu numero de WhatsApp
          </p>

          <form @submit.prevent="handlePhoneSubmit" class="space-y-6">
            <div>
              <Label class="mb-2">Numero de WhatsApp</Label>
              <PhoneInput
                v-model="phone"
                :disabled="isLoading"
                :error="!!error"
              />
            </div>

            <p v-if="error" class="text-tertiary text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ error }}
            </p>

            <Button
              type="submit"
              class="w-full h-12"
              :disabled="isLoading || !isPhoneValid"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin mr-2" />
              <span>Continuar</span>
              <ArrowRight v-if="!isLoading" class="h-5 w-5 ml-2" />
            </Button>
          </form>

          <p class="mt-8 text-center text-sm text-on-surface-variant">
            Ja tem uma conta?
            <router-link to="/login" class="text-primary font-medium hover:underline">
              Entrar
            </router-link>
          </p>
        </div>

        <!-- Step: Verification Code -->
        <div v-else-if="step === 'verification'">
          <button
            @click="goBack"
            class="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-6 transition"
          >
            <ArrowLeft class="h-4 w-4" />
            <span class="text-sm">Voltar</span>
          </button>

          <h2 class="text-2xl font-semibold text-on-surface mb-2">Verificar codigo</h2>
          <p class="text-on-surface-variant mb-2">
            Digite o codigo enviado para
          </p>
          <p class="text-on-surface font-medium mb-8">
            +55 {{ phone.slice(0, 2) }} {{ phone.slice(2, 7) }}-{{ phone.slice(7) }}
          </p>

          <form @submit.prevent="() => handleVerificationSubmit()" class="space-y-6">
            <OtpInput
              v-model="verificationCode"
              :disabled="isLoading"
              :error="!!error"
              @complete="handleCodeComplete"
            />

            <p v-if="error" class="text-tertiary text-sm text-center">
              {{ error }}
            </p>

            <Button
              type="submit"
              class="w-full h-12"
              :disabled="isLoading || verificationCode.length !== 6"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin mr-2" />
              <span>Verificar</span>
              <ArrowRight v-if="!isLoading" class="h-5 w-5 ml-2" />
            </Button>
          </form>

          <div class="mt-6 text-center">
            <button
              @click="resendCode"
              :disabled="resendCountdown > 0 || isLoading"
              :class="[
                'text-sm font-medium transition',
                resendCountdown > 0 ? 'text-on-surface-variant' : 'text-primary hover:underline'
              ]"
            >
              {{ resendCountdown > 0 ? `Reenviar em ${resendCountdown}s` : 'Reenviar codigo' }}
            </button>
          </div>
        </div>

        <!-- Step: Profile -->
        <div v-else-if="step === 'profile'">
          <button
            @click="goBack"
            class="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-6 transition"
          >
            <ArrowLeft class="h-4 w-4" />
            <span class="text-sm">Voltar</span>
          </button>

          <h2 class="text-2xl font-semibold text-on-surface mb-2">Seu perfil</h2>
          <p class="text-on-surface-variant mb-8">
            Conte-nos um pouco sobre voce
          </p>

          <form @submit.prevent="handleProfileSubmit" class="space-y-6">
            <div>
              <Label class="mb-2">Nome *</Label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                <Input
                  v-model="name"
                  type="text"
                  placeholder="Como devemos te chamar?"
                  class="pl-10 h-12"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <div>
              <Label class="mb-2">Email (opcional)</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                <Input
                  v-model="email"
                  type="email"
                  placeholder="seu@email.com"
                  class="pl-10 h-12"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <p v-if="error" class="text-tertiary text-sm">
              {{ error }}
            </p>

            <Button
              type="submit"
              class="w-full h-12"
              :disabled="isLoading || !isProfileValid"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin mr-2" />
              <CheckCircle v-else class="h-5 w-5 mr-2" />
              {{ isLoading ? 'Criando conta...' : 'Criar conta' }}
            </Button>

            <!-- Demo button -->
            <Button
              type="button"
              variant="outline"
              class="w-full"
              @click="handleDemoRegister"
            >
              Criar sem verificacao (Demo)
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
