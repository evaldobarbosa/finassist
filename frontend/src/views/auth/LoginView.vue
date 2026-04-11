<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MessageCircle, ArrowLeft, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/api'
import { PhoneInput } from '@/components/ui/phone-input'
import { OtpInput } from '@/components/ui/otp-input'
import { Button } from '@/components/ui/button'

const router = useRouter()
const authStore = useAuthStore()

type Step = 'phone' | 'verification'

const step = ref<Step>('phone')
const phone = ref('')
const verificationCode = ref('')
const isLoading = ref(false)
const error = ref('')
const resendCountdown = ref(0)

const isPhoneValid = computed(() => phone.value.length === 11)

async function handlePhoneSubmit() {
  if (!isPhoneValid.value) {
    error.value = 'Digite um numero de telefone valido'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Request verification code via WhatsApp
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
    // Verify the code and get user data
    const response = await api.post<{ user: { id: string; phone: string; name?: string } }>('/auth/verify-code', {
      phone: phone.value,
      code: codeToVerify,
    })

    // Store phone and user data
    authStore.setPhone(phone.value)
    if (response.user) {
      authStore.setUser({
        ...response.user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = 'Codigo invalido ou expirado. Tente novamente.'
    verificationCode.value = ''
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
  if (step.value === 'verification') {
    step.value = 'phone'
    verificationCode.value = ''
    error.value = ''
  }
}

// For demo purposes - skip verification in development
function handleDemoLogin() {
  authStore.setPhone(phone.value)
  authStore.setUser({
    id: '1',
    phone: phone.value,
    name: 'Usuario Demo',
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
      <!-- Decorative circles -->
      <div class="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div class="text-white text-center relative z-10 max-w-md">
        <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <span class="text-4xl font-bold">F</span>
        </div>
        <h1 class="text-4xl font-bold mb-4">FinAssistant</h1>
        <p class="text-lg text-white/90 mb-8">
          Seu assistente financeiro pessoal. Organize suas financas de forma simples e inteligente.
        </p>
        <div class="flex items-center justify-center gap-3 text-white/80">
          <MessageCircle class="h-5 w-5" />
          <span>Integrado com WhatsApp</span>
        </div>
      </div>
    </div>

    <!-- Right side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-white">F</span>
          </div>
          <h1 class="text-2xl font-bold text-primary">FinAssistant</h1>
        </div>

        <!-- Step: Phone Input -->
        <div v-if="step === 'phone'">
          <h2 class="text-2xl font-semibold text-on-surface mb-2">Bem-vindo de volta</h2>
          <p class="text-on-surface-variant mb-8">
            Digite seu numero de WhatsApp para entrar
          </p>

          <form @submit.prevent="handlePhoneSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-on-surface mb-2">
                Numero de WhatsApp
              </label>
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
              <MessageCircle v-else class="h-5 w-5 mr-2" />
              {{ isLoading ? 'Enviando...' : 'Receber codigo via WhatsApp' }}
            </Button>

            <!-- Demo login button (development only) -->
            <Button
              v-if="isPhoneValid"
              type="button"
              variant="outline"
              class="w-full"
              @click="handleDemoLogin"
            >
              Entrar sem verificacao (Demo)
            </Button>
          </form>

          <p class="mt-8 text-center text-sm text-on-surface-variant">
            Nao tem uma conta?
            <router-link to="/register" class="text-primary font-medium hover:underline">
              Cadastre-se
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
            Digite o codigo de 6 digitos enviado para
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

            <p v-if="error" class="text-tertiary text-sm text-center flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ error }}
            </p>

            <Button
              type="submit"
              class="w-full h-12"
              :disabled="isLoading || verificationCode.length !== 6"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin mr-2" />
              {{ isLoading ? 'Verificando...' : 'Verificar' }}
            </Button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-on-surface-variant mb-2">Nao recebeu o codigo?</p>
            <button
              @click="resendCode"
              :disabled="resendCountdown > 0 || isLoading"
              :class="[
                'text-sm font-medium transition',
                resendCountdown > 0 || isLoading
                  ? 'text-on-surface-variant cursor-not-allowed'
                  : 'text-primary hover:underline'
              ]"
            >
              {{ resendCountdown > 0 ? `Reenviar em ${resendCountdown}s` : 'Reenviar codigo' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
