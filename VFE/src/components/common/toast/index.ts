import { ref } from 'vue'

export type ToastVariant = 'success' | 'warning' | 'error' | 'info'

export interface Toast {
  id: number
  text: string
  variant: ToastVariant
}

const toasts = ref<Toast[]>([])
let counter = 0

export function useToast() {
  function toast(text: string, variant: ToastVariant = 'info', duration: number = 3000) {
    const id = ++counter
    toasts.value.push({ id, text, variant })
    setTimeout(() => dismiss(id), duration)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toast, toasts, dismiss }
}
