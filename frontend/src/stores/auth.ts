import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

const STORAGE_KEY = 'finassistant_auth'

interface StoredAuth {
  phone: string | null
  user: User | null
}

function loadFromStorage(): StoredAuth {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Invalid JSON, clear storage
    localStorage.removeItem(STORAGE_KEY)
  }
  return { phone: null, user: null }
}

function saveToStorage(data: StoredAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useAuthStore = defineStore('auth', () => {
  const stored = loadFromStorage()

  const user = ref<User | null>(stored.user)
  const phone = ref<string | null>(stored.phone)

  const isAuthenticated = computed(() => !!phone.value)
  const userName = computed(() => user.value?.name || 'Usuario')
  const userInitials = computed(() => {
    if (user.value?.name) {
      return user.value.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    }
    return 'U'
  })

  // Persist changes to localStorage
  watch([phone, user], () => {
    saveToStorage({ phone: phone.value, user: user.value })
  }, { deep: true })

  function setPhone(newPhone: string) {
    phone.value = newPhone
  }

  function setUser(newUser: User) {
    user.value = newUser
  }

  function updateUser(updates: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updates, updated_at: new Date().toISOString() }
    }
  }

  function logout() {
    user.value = null
    phone.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    user,
    phone,
    isAuthenticated,
    userName,
    userInitials,
    setPhone,
    setUser,
    updateUser,
    logout,
  }
})
