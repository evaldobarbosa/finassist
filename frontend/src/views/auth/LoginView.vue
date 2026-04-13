<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { MessageCircle, Loader2, Eye, EyeOff } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Preencha email e senha'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await login({ email: email.value, password: password.value })
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Erro ao fazer login. Verifique suas credenciais.'
  } finally {
    isLoading.value = false
  }
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

        <h2 class="text-2xl font-semibold text-on-surface mb-2">Bem-vindo de volta</h2>
        <p class="text-on-surface-variant mb-8">
          Entre com seu email e senha para acessar sua conta
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

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">Senha</Label>
              <router-link
                to="/forgot-password"
                class="text-sm text-primary hover:underline"
              >
                Esqueci minha senha
              </router-link>
            </div>
            <div class="relative">
              <Input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Digite sua senha"
                :disabled="isLoading"
                autocomplete="current-password"
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
            :disabled="isLoading || !email || !password"
          >
            <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin mr-2" />
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </Button>
        </form>

        <p class="mt-8 text-center text-sm text-on-surface-variant">
          Nao tem uma conta?
          <router-link to="/register" class="text-primary font-medium hover:underline">
            Cadastre-se
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
