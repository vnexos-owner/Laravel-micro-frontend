<script lang="ts" setup>
import { useAuth } from './auth/provider'
import SignInModal from './auth/SignInModal.vue'
import SignUpModal from './auth/SignUpModal.vue'
import CUser from './common/CUser.vue'
import LogoRikai from './LogoRikai.vue'
import ThemSwitch from './ThemSwitch.vue'

const { isAuthenticated, user } = useAuth()
</script>

<template>
  <nav class="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
    <header class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="flex items-center gap-1">
          <LogoRikai :size="100" />
        </RouterLink>
      </div>
      <div class="flex items-center gap-2">
        <ThemSwitch />
        <div v-if="isAuthenticated">
          <CUser :user="user!" />
        </div>
        <div v-else>
          <SignInModal />
          <SignUpModal />
        </div>
      </div>
    </header>
  </nav>
</template>
