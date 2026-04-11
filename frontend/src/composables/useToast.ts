import { ref } from 'vue'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  function addToast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      variant: 'default',
      duration: 5000,
      ...toast,
    }

    toasts.value.push(newToast)

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function toast(title: string, description?: string) {
    addToast({ title, description, variant: 'default' })
  }

  function success(title: string, description?: string) {
    addToast({ title, description, variant: 'success' })
  }

  function error(title: string, description?: string) {
    addToast({ title, description, variant: 'error' })
  }

  function warning(title: string, description?: string) {
    addToast({ title, description, variant: 'warning' })
  }

  return {
    toasts,
    addToast,
    removeToast,
    toast,
    success,
    error,
    warning,
  }
}
