<script lang="ts" setup>
import type { User } from '@/types'
import CAvatar from './CAvatar.vue'

withDefaults(defineProps<{ user: User; disabled?: boolean }>(), { disabled: false })
</script>

<template>
  <div class="flex p-px gap-2">
    <CAvatar :avatar="user.avatar ?? ''" :name="user.name" />
    <div :class="['flex flex-col items-start justify-center']">
      <p :class="[disabled ? 'text-muted' : '', 'text-sm font-medium']">{{ user.name }}</p>
      <p :class="['text-sm -mt-1.5', disabled ? 'text-muted/50' : 'text-muted']">
        {{ user.username }}
      </p>
    </div>
  </div>
</template>
