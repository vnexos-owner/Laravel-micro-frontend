<template>
  <div
    class="absolute inset-0 w-full h-full flex flex-col justify-center items-center bg-translate backdrop-blur-sm z-50"
    role="status"
    aria-label="Loading"
    @click="(e) => e.stopPropagation()"
  >
    <div :class="sizeClass">
      <svg class="-rotate-90 w-full h-full" viewBox="0 0 100 100" fill="none">
        <!-- Track circle (background) -->
        <circle class="stroke-default" cx="50" cy="50" r="42" stroke-width="8" />
        <!-- Fill circle (animated) -->
        <circle
          class="stroke-accent fill-circle"
          cx="50"
          cy="50"
          r="42"
          stroke-width="8"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'lg',
    validator: (v: string) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
})

const sizeClass = computed(
  () =>
    ({
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    })[props.size],
)
</script>

<style scoped>
/* Tailwind can't express dasharray/dashoffset or multi-keyframe animations — minimal custom CSS only */
.fill-circle {
  stroke-dasharray: 264;
  stroke-dashoffset: 198;
  transform-origin: center;
  animation:
    spin 1.1s linear infinite,
    dash 1.1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 230;
  }
  50% {
    stroke-dashoffset: 60;
  }
  100% {
    stroke-dashoffset: 230;
  }
}
</style>
