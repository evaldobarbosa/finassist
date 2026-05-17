<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleGoogleLogin = async () => {
  // TODO: Implement Google OAuth
  console.log('Google login')
}

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = 'Preencha todos os campos'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // TODO: Implement actual login API call
    // Simulating login for now
    await new Promise(resolve => setTimeout(resolve, 1000))

    authStore.setToken('fake-token-123')
    authStore.setUser({
      id: '1',
      name: 'Usuário Teste',
      email: email.value
    })

    router.push('/')
  } catch (e) {
    error.value = 'Credenciais inválidas'
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
      <h1 class="text-3xl font-bold text-on-surface tracking-tight">Bem-vindo de volta</h1>
      <p class="text-on-surface-variant text-sm">Acesse sua conta para gerenciar suas finanças.</p>
    </div>

    <!-- Google Login -->
    <button
      type="button"
      class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all text-on-surface font-medium text-sm"
      @click="handleGoogleLogin"
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
          <div class="flex justify-between items-center mb-1.5 ml-1">
            <label class="block text-xs font-semibold text-on-surface-variant" for="password">
              Senha
            </label>
            <RouterLink to="/reset-password" class="text-xs font-semibold text-primary hover:underline">
              Esqueceu a senha?
            </RouterLink>
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full h-12 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm text-on-surface"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">Entrando...</span>
        <span v-else>Entrar</span>
      </button>
    </form>

    <!-- Sign Up Link -->
    <div class="text-center">
      <p class="text-sm text-on-surface-variant">
        Não tem conta?
        <RouterLink to="/signup" class="font-bold text-primary hover:underline transition-all">
          Criar conta
        </RouterLink>
      </p>
    </div>
  </div>
</template>
