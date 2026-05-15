<script lang="ts" setup>
import { computed, ref } from 'vue'

type CAvatarSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
const props = defineProps<{
  avatar: string
  name: string
  size?: CAvatarSizeType
  clazz?: string
}>()

const imgError = ref(false)
const initials = computed(() => {
  const parts = props.name.split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]?.[0]?.toUpperCase()
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? ''))?.toUpperCase()
})

const sizeClasses: Record<CAvatarSizeType, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const sizeClass = computed(() => sizeClasses[props.size ?? 'md'])
</script>

<template>
  <span
    :class="[
      'inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden',
      sizeClass,
      clazz,
    ]"
    :aria-label="name"
  >
    <!-- Avatar image -->
    <img
      v-if="avatar && !imgError"
      :src="avatar"
      :alt="name"
      class="h-full w-full object-cover"
      @error="imgError = true"
    />

    <!-- Initials fallback -->
    <span
      v-else
      class="flex h-full w-full items-center justify-center rounded-full bg-surface-tertiary text-surface-tertiary-foreground select-none font-bold"
    >
      {{ initials }}
    </span>
  </span>
</template>
