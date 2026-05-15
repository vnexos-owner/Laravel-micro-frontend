<script lang="ts" setup>
import { IconXmark } from '@iconify-prerendered/vue-gravity-ui'
import { onUnmounted, watch } from 'vue'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const props = withDefaults(
  defineProps<{
    open: boolean
    size?: ModalSize
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
    hideCloseButton?: boolean
  }>(),
  {
    size: 'md',
    closeOnBackdrop: true,
    closeOnEsc: true,
    hideCloseButton: false,
  },
)

const emit = defineEmits<{ close: [] }>()

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full m-4',
}

function onBackdrop() {
  if (props.closeOnBackdrop) emit('close')
}

function onKeyDown(e: KeyboardEvent) {
  if (props.closeOnEsc && e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (val) => {
    if (val) window.addEventListener('keydown', onKeyDown)
    else window.removeEventListener('keydown', onKeyDown)
  },
)

onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop-blur-sm"
        @click.self="onBackdrop"
      >
        <Transition name="dialog" appear>
          <div
            v-if="open"
            :class="[
              'relative w-full rounded-2xl bg-default text-default-foreground shadow-2xl overflow-hidden',
              sizes[size],
            ]"
          >
            <!-- Close button -->
            <button
              v-if="!hideCloseButton"
              class="absolute top-3 right-3 z-10 p-1.5 bg-default text-default-foreground hover:opacity-75 transition-opacity cursor-pointer rounded-full"
              @click="emit('close')"
            >
              <IconXmark />
            </button>

            <!-- Header -->
            <div v-if="$slots.header" class="px-6 pt-6 pb-4 border-b border-background">
              <slot name="header" />
            </div>

            <!-- Body -->
            <div v-if="$slots.default" class="px-6 py-5">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 pb-6 pt-4 border-t border-background">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
