<script lang="ts" setup>
import {
  IconArrowRightFromSquare,
  IconDisplayPulse,
  IconListUl,
} from '@iconify-prerendered/vue-gravity-ui'
import { useAuth } from './auth/provider'
import SignInModal from './auth/SignInModal.vue'
import SignUpModal from './auth/SignUpModal.vue'
import CDropdown from './common/CDropdown.vue'
import CUser from './common/CUser.vue'
import LogoRikai from './LogoRikai.vue'
import ThemSwitch from './ThemSwitch.vue'
import { api } from '@/utils/api'
import { authEndpoints } from '@/config/endpoints'
import { checkRole } from '@/utils/checkUserRole'
import type { User } from '@/types'
import { useRouter } from 'vue-router'

const { isAuthenticated, user, signout } = useAuth()
const router = useRouter()

function handleSignout() {
  signout()
  api.post(authEndpoints.SIGN_OUT, {}).then(() => {})
  router.push('/')
}
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
        <CDropdown
          v-if="isAuthenticated"
          :options="[
            {
              label: 'Bảng điều khiển',
              icon: IconDisplayPulse,
              href: '/dashboard',
              hidden: !checkRole(user as User, 'admin'),
            },
            {
              label: 'Quản lý lớp học',
              icon: IconListUl,
              to: '/class',
              hidden: !checkRole(user as User, 'teacher'),
            },
            {
              label: 'Đăng xuất',
              icon: IconArrowRightFromSquare,
              class: 'text-danger-soft-foreground',
              action: handleSignout,
            },
          ]"
        >
          <template #trigger="{ toggle }">
            <button :class="['cursor-pointer']" @click="toggle">
              <CUser :user="user!" />
            </button>
          </template>
        </CDropdown>
        <div class="flex items-center gap-2" v-else>
          <SignInModal />
          <SignUpModal />
        </div>
      </div>
    </header>
  </nav>
</template>
