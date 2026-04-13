<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Loader2, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const route = useRoute()
const { resetPassword } = useAuth()

const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const isLoading = ref(false)
const error = ref('')
const isSuccess = ref(false)
const isInvalidToken = ref(false)

const token = computed(() => route.query.token as string || '')
const email = computed(() => route.query.email as string || '')

onMounted(() => {
  if (!token.value || !email.value) {
    isInvalidToken.value = true
  }
})

const isFormValid = computed(() => {
  return (
    password.value.length >= 8 &&
    password.value === passwordConfirmation.value
  )
})

const passwordStrength = computed(() => {
  const pwd = password.value
  if (!pwd) return 0
  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++
  return strength
})

const passwordStrengthLabel = computed(() => {
  const labels = ['Muito fraca', 'Fraca', 'Media', 'Forte', 'Muito forte']
  return labels[passwordStrength.value]
})

const passwordStrengthColor = computed(() => {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500']
  return colors[passwordStrength.value]
})

async function handleSubmit() {
  if (!isFormValid.value) {
    if (password.value !== passwordConfirmation.value) {
      error.value = 'As senhas nao conferem'
    } else if (password.value.length < 8) {
      error.value = 'A senha deve ter pelo menos 8 caracteres'
    }
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    isSuccess.value = true
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Erro ao redefinir senha. O link pode ter expirado.'
  } finally {
    isLoading.value = false
  }
}

function goToLogin() {
  router.push({ name: 'login' })
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
          <Lock class="h-10 w-10" />
        </div>
        <h1 class="text-4xl font-bold mb-4">Nova senha</h1>
        <p class="text-lg text-white/90">
          Crie uma senha forte e segura para proteger sua conta.
        </p>
      </div>
    </div>

    <!-- Right side - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-6">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-white">F</span>
          </div>
          <h1 class="text-2xl font-bold text-primary">FinAssistant</h1>
        </div>

        <!-- Invalid Token State -->
        <div v-if="isInvalidToken" class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle class="h-8 w-8 text-red-600" />
          </div>
          <h2 class="text-2xl font-semibold text-on-surface mb-2">Link invalido</h2>
          <p class="text-on-surface-variant mb-8">
            Este link de recuperacao de senha e invalido ou expirou.
            Solicite um novo link para redefinir sua senha.
          </p>
          <router-link to="/forgot-password">
            <Button class="w-full">
              Solicitar novo link
            </Button>
          </router-link>
        </div>

        <!-- Success State -->
        <div v-else-if="isSuccess" class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle class="h-8 w-8 text-green-600" />
          </div>
          <h2 class="text-2xl font-semibold text-on-surface mb-2">Senha redefinida!</h2>
          <p class="text-on-surface-variant mb-8">
            Sua senha foi alterada com sucesso. Agora voce pode entrar com sua nova senha.
          </p>
          <Button @click="goToLogin" class="w-full">
            Ir para login
          </Button>
        </div>

        <!-- Form State -->
        <template v-else>
          <h2 class="text-2xl font-semibold text-on-surface mb-2">Criar nova senha</h2>
          <p class="text-on-surface-variant mb-8">
            Digite sua nova senha abaixo
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="space-y-2">
              <Label for="password">Nova senha</Label>
              <div class="relative">
                <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Minimo 8 caracteres"
                  :disabled="isLoading"
                  autocomplete="new-password"
                  class="pr-10"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <EyeOff v-if="showPassword" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
              <!-- Password strength indicator -->
              <div v-if="password" class="space-y-1">
                <div class="flex gap-1">
                  <div
                    v-for="i in 4"
                    :key="i"
                    :class="[
                      'h-1 flex-1 rounded',
                      i <= passwordStrength ? passwordStrengthColor : 'bg-surface-container'
                    ]"
                  ></div>
                </div>
                <p class="text-xs text-on-surface-variant">
                  Forca da senha: {{ passwordStrengthLabel }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="passwordConfirmation">Confirmar nova senha</Label>
              <div class="relative">
                <Input
                  id="passwordConfirmation"
                  v-model="passwordConfirmation"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  placeholder="Digite a senha novamente"
                  :disabled="isLoading"
                  autocomplete="new-password"
                  class="pr-10"
                />
                <button
                  type="button"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <EyeOff v-if="showPasswordConfirmation" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
              <p
                v-if="passwordConfirmation && password !== passwordConfirmation"
                class="text-xs text-tertiary"
              >
                As senhas nao conferem
              </p>
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
              :disabled="isLoading || !isFormValid"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin mr-2" />
              {{ isLoading ? 'Redefinindo...' : 'Redefinir senha' }}
            </Button>
          </form>

          <p class="mt-8 text-center text-sm text-on-surface-variant">
            Lembrou sua senha?
            <router-link to="/login" class="text-primary font-medium hover:underline">
              Entrar
            </router-link>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
