<script setup lang="ts">
import { IconFolderOpen } from '@iconify-prerendered/vue-gravity-ui'

withDefaults(defineProps<{ message?: string }>(), {
  message: 'Dữ liệu trống',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-1 w-full">
    <span class="text-7xl text-muted">
      <IconFolderOpen />
    </span>
    <p class="text-xl text-muted font-semibold">{{ message }}</p>
  </div>
</template>
