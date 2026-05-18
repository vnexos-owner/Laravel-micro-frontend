<script setup lang="ts">
import { ref, computed } from 'vue'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    placement?: Placement
    delay?: number
  }>(),
  {
    placement: 'top',
    delay: 0,
  },
)

const isVisible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)

let showTimer: ReturnType<typeof setTimeout> | null = null

function show(): void {
  if (showTimer) clearTimeout(showTimer)
  showTimer = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

function hide(): void {
  if (showTimer) clearTimeout(showTimer)
  isVisible.value = false
}

const positionClasses = computed(
  (): string =>
    ({
      top: 'bottom-full left-1/2 -translate-x-1/2 pb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 pt-2',
      left: 'right-full top-1/2 -translate-y-1/2 pr-2',
      right: 'left-full top-1/2 -translate-y-1/2 pl-2',
    })[props.placement],
)

const arrowClasses = computed(
  (): string =>
    ({
      top: 'bottom-[3px] left-1/2 -translate-x-1/2 border-t-0 border-l-0',
      bottom: 'top-[3px] left-1/2 -translate-x-1/2 border-b-0 border-r-0',
      left: 'right-[3px] top-1/2 -translate-y-1/2 border-l-0 border-b-0',
      right: 'left-[3px] top-1/2 -translate-y-1/2 border-r-0 border-t-0',
    })[props.placement],
)
</script>

<template>
  <div
    class="relative inline-flex"
    ref="triggerRef"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <!-- Default slot: the wrapped component -->
    <slot />

    <!-- Tooltip -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isVisible && $slots.tooltip"
        ref="tooltipRef"
        role="tooltip"
        class="absolute z-50 w-max max-w-xs"
        :class="positionClasses"
      >
        <!-- Arrow -->
        <div
          class="absolute w-2 h-2 bg-overlay border border-border rotate-45"
          :class="arrowClasses"
        />

        <!-- Content -->
        <div
          class="relative rounded-lg border border-border bg-overlay text-overlay-foreground shadow-overlay text-xs px-2.5 py-1.5"
        >
          <slot name="tooltip" />
        </div>
      </div>
    </Transition>
  </div>
</template>
