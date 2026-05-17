<script setup lang="ts">
import { ref } from 'vue'

const showOnboardingBanner = ref(true)
</script>

<template>
  <!-- Onboarding Banner -->
  <section
    v-if="showOnboardingBanner"
    class="relative overflow-hidden bg-primary text-white p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6"
    style="box-shadow: 0px 24px 48px -12px rgba(20, 27, 43, 0.08);"
  >
    <div class="relative z-10 space-y-2">
      <span class="px-3 py-1 bg-white/20 rounded-full text-[0.6875rem] font-bold uppercase tracking-widest">
        Ação Necessária
      </span>
      <h3 class="text-2xl font-bold">Complete seu perfil</h3>
      <p class="text-on-primary-container/80 max-w-md">
        Para aproveitar todos os recursos, complete as configurações do seu perfil.
      </p>
    </div>
    <div class="relative z-10 flex flex-col sm:flex-row gap-3">
      <button class="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-lg">
        Começar Agora
      </button>
      <button
        class="bg-transparent border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
        @click="showOnboardingBanner = false"
      >
        Ignorar por enquanto
      </button>
    </div>
    <!-- Decorative element -->
    <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
      <span class="material-symbols-outlined text-[12rem]">award_star</span>
    </div>
  </section>

  <!-- Filter Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl w-fit">
      <button class="px-4 py-2 text-sm font-semibold text-primary bg-white rounded-lg shadow-sm">Mensal</button>
      <button class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Trimestral</button>
      <button class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Anual</button>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-slate-100 rounded-lg text-sm text-slate-600">
        <span class="material-symbols-outlined text-lg">calendar_today</span>
        <span>01 Mar, 2026 - 31 Mar, 2026</span>
      </div>
      <button class="p-2 bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
        <span class="material-symbols-outlined">filter_list</span>
      </button>
    </div>
  </div>

  <!-- Summary Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Saldo Anterior -->
    <div class="bg-surface-container-lowest p-6 rounded-xl space-y-4" style="box-shadow: 0px 24px 48px -12px rgba(20, 27, 43, 0.08);">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Saldo Anterior</span>
        <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
          <span class="material-symbols-outlined text-xl">history</span>
        </div>
      </div>
      <div>
        <p class="text-2xl font-bold tracking-tight">R$ 0,00</p>
        <p class="text-[0.6875rem] text-slate-500 mt-1">Fechamento Fevereiro</p>
      </div>
    </div>

    <!-- Receitas -->
    <div class="bg-surface-container-lowest p-6 rounded-xl space-y-4" style="box-shadow: 0px 24px 48px -12px rgba(20, 27, 43, 0.08);">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Receitas</span>
        <div class="w-8 h-8 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-primary">
          <span class="material-symbols-outlined text-xl">trending_up</span>
        </div>
      </div>
      <div>
        <p class="text-2xl font-bold tracking-tight text-primary">R$ 0,00</p>
        <div class="flex items-center gap-1 mt-1">
          <span class="text-[0.6875rem] text-slate-500">A receber: R$ 0,00</span>
        </div>
      </div>
    </div>

    <!-- Despesas -->
    <div class="bg-surface-container-lowest p-6 rounded-xl space-y-4" style="box-shadow: 0px 24px 48px -12px rgba(20, 27, 43, 0.08);">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Despesas</span>
        <div class="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
          <span class="material-symbols-outlined text-xl">trending_down</span>
        </div>
      </div>
      <div>
        <p class="text-2xl font-bold tracking-tight text-tertiary">R$ 0,00</p>
        <div class="flex items-center gap-1 mt-1">
          <span class="text-[0.6875rem] text-slate-500">A pagar: R$ 0,00</span>
        </div>
      </div>
    </div>

    <!-- Saldo Atual -->
    <div class="bg-white border-2 border-primary/10 p-6 rounded-xl space-y-4" style="box-shadow: 0px 24px 48px -12px rgba(20, 27, 43, 0.08);">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-primary uppercase tracking-tighter">Saldo Atual</span>
        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
        </div>
      </div>
      <div>
        <p class="text-3xl font-bold tracking-tight text-on-surface">R$ 0,00</p>
        <p class="text-[0.6875rem] text-slate-500 mt-1">Disponível em contas</p>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <section
    class="bg-surface-container-lowest rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-6"
    style="box-shadow: 0px 24px 48px -12px rgba(20, 27, 43, 0.08);"
  >
    <div class="relative">
      <div class="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center text-slate-300">
        <span class="material-symbols-outlined text-5xl">database_off</span>
      </div>
      <div class="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
        <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">chat</span>
      </div>
    </div>
    <div class="max-w-md space-y-2">
      <h4 class="text-xl font-bold text-on-surface">Nenhuma transação encontrada</h4>
      <p class="text-slate-500 text-sm">
        Seu histórico está vazio para este período. Que tal conectar seu WhatsApp para registrar transações automaticamente?
      </p>
    </div>
    <div class="flex flex-col sm:flex-row gap-4">
      <button class="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:bg-primary-container transition-all active:scale-95">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.508-2.961-2.623-.087-.116-.705-.934-.705-1.781 0-.848.435-1.264.594-1.439.16-.175.348-.218.464-.218.116 0 .232.001.333.005.109.004.253-.042.395.299.144.348.492 1.203.535 1.29.043.087.072.19.014.305-.058.116-.087.19-.174.29l-.261.305c-.087.101-.178.21-.077.382.101.171.447.737.96 1.192.66.586 1.214.768 1.388.854.174.086.275.072.376-.044.101-.116.435-.508.55-.681.115-.173.231-.144.39-.087.159.058 1.011.477 1.185.565.174.088.29.13.333.203.043.073.043.419-.101.824z"/>
        </svg>
        Conectar WhatsApp
      </button>
      <button class="px-8 py-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
        Lançamento Manual
      </button>
    </div>
  </section>
</template>
