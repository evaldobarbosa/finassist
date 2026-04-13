<script setup lang="ts">
import { ref } from 'vue'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { forgotPassword } = useAuth()

const email = ref('')
const isLoading = ref(false)
const error = ref('')
const isSuccess = ref(false)
const successMessage = ref('')

async function handleSubmit() {
  if (!email.value || !email.value.includes('@')) {
    error.value = 'Digite um email valido'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await forgotPassword(email.value)
    isSuccess.value = true
    successMessage.value = response.message || 'Email enviado com sucesso!'
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Erro ao enviar email. Tente novamente.'
  } finally {
    isLoading.value = false
  }
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
          <Mail class="h-10 w-10" />
        </div>
        <h1 class="text-4xl font-bold mb-4">Recuperar senha</h1>
        <p class="text-lg text-white/90">
          Enviaremos um link para seu email para que voce possa criar uma nova senha.
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

        <!-- Success State -->
        <div v-if="isSuccess" class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle class="h-8 w-8 text-green-600" />
          </div>
          <h2 class="text-2xl font-semibold text-on-surface mb-2">Email enviado!</h2>
          <p class="text-on-surface-variant mb-6">
            {{ successMessage }}
          </p>
          <p class="text-sm text-on-surface-variant mb-8">
            Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
            Se nao encontrar o email, verifique a pasta de spam.
          </p>
          <router-link to="/login">
            <Button variant="outline" class="w-full">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Voltar para login
            </Button>
          </router-link>
        </div>

        <!-- Form State -->
        <template v-else>
          <router-link
            to="/login"
            class="inline-flex items-center text-sm text-on-surface-variant hover:text-on-surface mb-6"
          >
            <ArrowLeft class="h-4 w-4 mr-1" />
            Voltar
          </router-link>

          <h2 class="text-2xl font-semibold text-on-surface mb-2">Esqueceu sua senha?</h2>
          <p class="text-on-surface-variant mb-8">
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                :disabled="isLoading"
                autocomplete="email"
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
              :disabled="isLoading || !email"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin mr-2" />
              {{ isLoading ? 'Enviando...' : 'Enviar link de recuperacao' }}
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
