<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import CToast from './components/common/toast/CToast.vue'
import AuthProvider from './components/auth/provider/AuthProvider.vue'
</script>

<template>
  <AuthProvider>
    <CToast />
    <NavBar />
    <main class="container mx-auto max-w-7xl pt-16 px-6 grow">
      <RouterView />
    </main>
  </AuthProvider>
</template>

<style scoped></style>
