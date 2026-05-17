<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const acceptTerms = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleGoogleSignup = async () => {
  // TODO: Implement Google OAuth
  console.log('Google signup')
}

const handleSubmit = async () => {
  if (!name.value || !email.value || !password.value) {
    error.value = 'Preencha todos os campos'
    return
  }

  if (!acceptTerms.value) {
    error.value = 'Você precisa aceitar os termos de uso'
    return
  }

  if (password.value.length < 8) {
    error.value = 'A senha deve ter pelo menos 8 caracteres'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // TODO: Implement actual signup API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/plans')
  } catch (e) {
    error.value = 'Erro ao criar conta. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-10">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
      <span class="text-xl font-bold tracking-tight text-primary">FinAssistant</span>
    </div>

    <!-- Header -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-on-surface tracking-tight">Criar conta</h1>
      <p class="text-on-surface-variant text-sm">Comece a organizar suas finanças hoje.</p>
    </div>

    <!-- Google Signup -->
    <button
      type="button"
      class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all text-on-surface font-medium text-sm"
      @click="handleGoogleSignup"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
      </svg>
      Continuar com Google
    </button>

    <!-- Divider -->
    <div class="relative flex items-center py-4">
      <div class="flex-grow border-t border-surface-variant"></div>
      <span class="flex-shrink mx-4 text-xs font-medium text-on-surface-variant uppercase tracking-widest">ou</span>
      <div class="flex-grow border-t border-surface-variant"></div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="p-3 bg-error-container text-on-error-container rounded-lg text-sm">
      {{ error }}
    </div>

    <!-- Form -->
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <!-- Name -->
        <div class="group">
          <label class="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" for="name">
            Nome completo
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Seu nome"
            class="w-full h-12 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm text-on-surface"
          />
        </div>

        <!-- Email -->
        <div class="group">
          <label class="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" for="email">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            class="w-full h-12 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm text-on-surface"
          />
        </div>

        <!-- Password -->
        <div class="group">
          <label class="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1" for="password">
            Senha
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full h-12 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm text-on-surface"
          />
          <p class="text-xs text-on-surface-variant mt-1 ml-1">Mínimo 8 caracteres</p>
        </div>

        <!-- Terms -->
        <div class="flex items-start gap-3">
          <input
            id="terms"
            v-model="acceptTerms"
            type="checkbox"
            class="mt-1 w-4 h-4 rounded border-surface-variant text-primary focus:ring-primary"
          />
          <label for="terms" class="text-sm text-on-surface-variant">
            Aceito os <a href="#" class="text-primary hover:underline">Termos de Uso</a> e
            <a href="#" class="text-primary hover:underline">Política de Privacidade</a>
          </label>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Criando conta...</span>
        <span v-else>Criar conta</span>
      </button>
    </form>

    <!-- Login Link -->
    <div class="text-center">
      <p class="text-sm text-on-surface-variant">
        Já tem conta?
        <RouterLink to="/login" class="font-bold text-primary hover:underline transition-all">
          Entrar
        </RouterLink>
      </p>
    </div>
  </div>
</template>
