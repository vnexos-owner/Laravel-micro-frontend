<script lang="ts" setup>
import {
  IconCircleCheckFill,
  IconCircleInfoFill,
  IconCircleXmarkFill,
  IconTriangleExclamationFill,
} from '@iconify-prerendered/vue-gravity-ui'
import { useToast, type ToastVariant } from '.'
import type { SVGAttributes, VNode } from 'vue'

const { toasts, dismiss } = useToast()

const icons: Record<ToastVariant, (p?: SVGAttributes | undefined) => VNode> = {
  info: IconCircleInfoFill,
  success: IconCircleCheckFill,
  warning: IconTriangleExclamationFill,
  error: IconCircleXmarkFill,
}

const styles: Record<ToastVariant, string> = {
  success: 'bg-success-soft text-success-soft-foreground',
  warning: 'bg-warning-soft text-warning-soft-foreground',
  error: 'bg-danger-soft text-danger-soft-foreground',
  info: 'bg-default text-default-foreground',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-9999 flex flex-col gap-2 items-end">
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2 items-end">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-72 max-w-xs cursor-pointer select-none',
            styles[t.variant],
          ]"
          @click="dismiss(t.id)"
        >
          <component :is="icons[t.variant]" class="size-5" />
          <span class="flex-1">{{ t.text }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(calc(100% + 24px));
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
