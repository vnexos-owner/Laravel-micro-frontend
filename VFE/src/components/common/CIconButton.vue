<script setup lang="ts">
import { IconCircleInfoFill } from '@iconify-prerendered/vue-gravity-ui'
import type { SVGAttributes, VNode } from 'vue'

const emit = defineEmits<{
  click: [event: PointerEvent]
}>()

withDefaults(defineProps<{ classes?: string; icon?: (p?: SVGAttributes) => VNode }>(), {
  classes: '',
  icon: IconCircleInfoFill,
})
</script>

<template>
  <button
    :class="[
      'p-2 cursor-pointer rounded-full bg-accent text-accent-foreground hover:bg-accent-hover',
      classes,
    ]"
    @click="emit('click', $event)"
  >
    <component :is="icon" />
  </button>
</template>
