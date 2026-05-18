<script setup lang="ts">
import { IconCircleInfoFill } from '@iconify-prerendered/vue-gravity-ui'
import type { SVGAttributes, VNode } from 'vue'

const emit = defineEmits<{
  click: [event: PointerEvent]
}>()

withDefaults(
  defineProps<{ classes?: string; disabled?: boolean; icon?: (p?: SVGAttributes) => VNode }>(),
  {
    classes: '',
    icon: IconCircleInfoFill,
  },
)
</script>

<template>
  <button
    :class="[
      classes ?? 'p-2',
      'rounded-full bg-accent text-accent-foreground hover:bg-accent-hover',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
    @click="disabled || emit('click', $event)"
  >
    <component :is="icon" />
  </button>
</template>
