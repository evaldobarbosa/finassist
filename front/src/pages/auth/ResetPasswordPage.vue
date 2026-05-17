<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const isLoading = ref(false)
const isSent = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Digite seu email'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // TODO: Implement actual reset password API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    isSent.value = true
  } catch (e) {
    error.value = 'Erro ao enviar email. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-10">
    <!-- Back Link -->
    <RouterLink to="/login" class="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
      <span class="material-symbols-outlined text-lg">arrow_back</span>
      Voltar para login
    </RouterLink>

    <!-- Sent State -->
    <template v-if="isSent">
      <div class="text-center space-y-6">
        <div class="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <span class="material-symbols-outlined text-primary text-4xl">mail</span>
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-on-surface">Email enviado!</h1>
          <p class="text-on-surface-variant text-sm max-w-sm mx-auto">
            Verifique sua caixa de entrada e clique no link para redefinir sua senha.
          </p>
        </div>
        <RouterLink
          to="/login"
          class="inline-block py-3 px-6 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all text-on-surface font-medium text-sm"
        >
          Voltar para login
        </RouterLink>
      </div>
    </template>

    <!-- Form State -->
    <template v-else>
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-on-surface tracking-tight">Recuperar senha</h1>
        <p class="text-on-surface-variant text-sm">
          Digite seu email para receber o link de recuperação.
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-3 bg-error-container text-on-error-container rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="handleSubmit">
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

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Enviando...</span>
          <span v-else>Enviar link</span>
        </button>
      </form>
    </template>
  </div>
</template>
