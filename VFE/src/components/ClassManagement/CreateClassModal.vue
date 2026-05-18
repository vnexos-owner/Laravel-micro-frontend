<script setup lang="ts">
import { IconPlus } from '@iconify-prerendered/vue-gravity-ui'
import { ref } from 'vue'
import CModal from '../common/CModal.vue'

const isOpen = ref<boolean>(false)
</script>

<template>
  <button
    class="bg-accent text-accent-foreground hover:bg-accent-hover p-3 flex gap-2 items-center rounded-full font-semibold cursor-pointer"
    @click="isOpen = true"
  >
    <IconPlus />
    Tạo lớp học
  </button>
  <CModal :open="isOpen" @close="isOpen = false">
    <template #header>
      <p class="text-lg font-semibold">Tạo lớp học</p>
    </template>
  </CModal>
</template>
