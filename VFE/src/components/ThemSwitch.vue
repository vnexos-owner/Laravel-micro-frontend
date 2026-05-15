<script lang="ts" setup>
import { IconMoon, IconSun } from '@iconify-prerendered/vue-gravity-ui'
import { onMounted, ref } from 'vue'

const theme = ref<string>('light')
const mounted = ref<boolean>(false)

function applyTheme(value: string) {
  document.documentElement.classList.toggle('dark', value === 'dark')
  localStorage.setItem('theme', value)
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  applyTheme(theme.value)
}

onMounted(() => {
  const stored = localStorage.getItem('theme')
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  theme.value = stored ?? preferred
  applyTheme(theme.value)
  mounted.value = true
})
</script>

<template>
  <button
    class="px-px transition-opacity hover:opacity-80 cursor-pointer inline-flex items-center justify-center w-auto h-auto bg-transparent rounded-lg text-muted"
    @click="toggleTheme"
  >
    <span v-if="mounted">
      <IconSun v-if="theme === 'light'" class="size-6" />
      <IconMoon v-else class="size-6" />
    </span>
    <span v-else class="w-5.5 h-5.5 inline-block" />
  </button>
</template>
