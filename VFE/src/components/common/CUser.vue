<script lang="ts" setup>
import type { User } from '@/types'
import CAvatar from './CAvatar.vue'

defineProps<{ user: User }>()
</script>

<template>
  <div class="flex p-px gap-2">
    <CAvatar :avatar="user.avatar ?? ''" :name="user.name" />
    <div class="flex flex-col items-start justify-center">
      <p class="text-sm font-medium">{{ user.name }}</p>
      <p class="text-muted text-sm -mt-1.5">{{ user.username }}</p>
    </div>
  </div>
</template>
