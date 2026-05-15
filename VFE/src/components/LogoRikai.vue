<script lang="ts" setup>
import Rikai from '@/assets/RIKAI.png'
defineProps({
  size: {
    type: Number,
    default: 24,
  },
})
</script>

<template>
  <img :src="Rikai" alt="RIKAI" :width="size" class="unselectable" />
</template>
