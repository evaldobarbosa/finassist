<script setup lang="ts">
import { ref } from 'vue'
import { Plus, X, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-vue-next'

const emit = defineEmits<{
  'add-income': []
  'add-expense': []
  'add-transfer': []
}>()

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function handleIncome() {
  emit('add-income')
  close()
}

function handleExpense() {
  emit('add-expense')
  close()
}

function handleTransfer() {
  emit('add-transfer')
  close()
}
</script>

<template>
  <div class="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-30">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/20 backdrop-blur-sm"
        @click="close"
      ></div>
    </Transition>

    <!-- Action Buttons -->
    <Transition name="fab-menu">
      <div v-if="isOpen" class="absolute bottom-16 right-0 flex flex-col gap-3 items-end">
        <!-- Transfer -->
        <button
          @click="handleTransfer"
          class="flex items-center gap-3 pl-4 pr-3 py-2 bg-surface-container-lowest rounded-full shadow-lg hover:shadow-xl transition group"
        >
          <span class="text-sm font-medium text-on-surface">Transferencia</span>
          <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeftRight class="h-5 w-5 text-white" />
          </div>
        </button>

        <!-- Expense -->
        <button
          @click="handleExpense"
          class="flex items-center gap-3 pl-4 pr-3 py-2 bg-surface-container-lowest rounded-full shadow-lg hover:shadow-xl transition group"
        >
          <span class="text-sm font-medium text-on-surface">Despesa</span>
          <div class="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center">
            <TrendingDown class="h-5 w-5 text-white" />
          </div>
        </button>

        <!-- Income -->
        <button
          @click="handleIncome"
          class="flex items-center gap-3 pl-4 pr-3 py-2 bg-surface-container-lowest rounded-full shadow-lg hover:shadow-xl transition group"
        >
          <span class="text-sm font-medium text-on-surface">Receita</span>
          <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <TrendingUp class="h-5 w-5 text-white" />
          </div>
        </button>
      </div>
    </Transition>

    <!-- Main FAB -->
    <button
      @click="toggle"
      :class="[
        'w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center',
        isOpen
          ? 'bg-surface-container-lowest text-on-surface rotate-45'
          : 'bg-primary text-white'
      ]"
    >
      <Plus class="h-6 w-6" v-if="!isOpen" />
      <X class="h-6 w-6" v-else />
    </button>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: all 0.3s ease;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
