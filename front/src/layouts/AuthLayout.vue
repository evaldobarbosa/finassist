<script setup lang="ts">
// Auth layout - split screen with decorative right side
</script>

<template>
  <main class="min-h-screen flex flex-col md:flex-row">
    <!-- Left Side: Form Content -->
    <section class="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </section>

    <!-- Right Side: Decorative Area -->
    <section class="hidden md:flex w-1/2 relative bg-primary-container overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-tr from-primary via-primary-container/80 to-transparent"></div>

      <!-- Content -->
      <div class="relative z-10 w-full flex flex-col items-start justify-end p-16 space-y-6">
        <div class="max-w-md space-y-4">
          <div class="w-12 h-1 bg-on-primary-fixed rounded-full"></div>
          <h2 class="text-4xl lg:text-5xl font-bold text-on-primary leading-tight tracking-tight">
            Transforme dados em decisões inteligentes.
          </h2>
          <p class="text-primary-fixed text-lg font-medium opacity-90 leading-relaxed">
            Uma interface limpa para uma mente focada. Controle suas finanças com o rigor que seu patrimônio exige.
          </p>
        </div>

        <!-- Floating Card -->
        <div class="mt-8 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-xs animate-float">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-full bg-primary-fixed/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary-fixed">trending_up</span>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-widest text-primary-fixed font-bold">Economia Mensal</p>
              <p class="text-xl font-bold text-white">+R$ 1.250</p>
            </div>
          </div>
          <div class="h-12 w-full flex items-end gap-1">
            <div class="flex-1 bg-primary-fixed/30 h-1/2 rounded-t-sm"></div>
            <div class="flex-1 bg-primary-fixed/30 h-3/4 rounded-t-sm"></div>
            <div class="flex-1 bg-primary-fixed/50 h-2/3 rounded-t-sm"></div>
            <div class="flex-1 bg-primary-fixed/40 h-full rounded-t-sm"></div>
            <div class="flex-1 bg-primary-fixed h-5/6 rounded-t-sm"></div>
          </div>
        </div>
      </div>

      <!-- Abstract Shapes -->
      <div class="absolute -top-20 -right-20 w-80 h-80 bg-primary-fixed rounded-full blur-[100px] opacity-20"></div>
      <div class="absolute -bottom-20 left-1/4 w-60 h-60 bg-white rounded-full blur-[80px] opacity-10"></div>
    </section>
  </main>
</template>
