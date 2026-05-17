<script lang="ts" setup>
import { ref } from 'vue'
import CModal from '../common/CModal.vue'
import LogoRikai from '../LogoRikai.vue'
import CTextField from '../common/CTextField.vue'
import { useToast } from '../common/toast'
import type { AuthResponse, SignInBody } from '@/types'
import { authEndpoints } from '@/config/endpoints'
import webLocalStorage from '@/utils/webLocalStorage'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/config'
import webStorageClient from '@/utils/webStorageClient'
import { api, setAccessToken } from '@/utils/api'
import CLoading from '../common/CLoading.vue'
import { useAuth } from './provider'

const isOpen = ref(false)
const { toast } = useToast()
const isLoading = ref<boolean>(false)
const { fetchMe } = useAuth();

function handleSubmin(e: SubmitEvent) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)

  const body: SignInBody = {
    account: formData.get('account') as string,
    password: formData.get('password') as string,
  }

  isLoading.value = true
  api
    .post<AuthResponse>(authEndpoints.SIGN_IN, body, { skipAuth: true })
    .then((val) => {
      webLocalStorage.set(REFRESH_TOKEN, val.refresh_token)
      webStorageClient.set(ACCESS_TOKEN, val.access_token, {
        expires: new Date(Date.now() + val.expires_in * 1000),
      })
      setAccessToken(val.access_token)
      toast('Đăng nhập thành công!', 'success')
      isOpen.value = false
      fetchMe();
    })
    .catch(() => {
      toast('Đăng nhập thất bại!', 'warning')
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <button
    class="cursor-pointer py-2 px-3.5 bg-gray-300/20 border-separator rounded-3xl hover:bg-gray-300/10 font-medium text-sm"
    @click="isOpen = true"
  >
    Đăng nhập
  </button>

  <CModal :open="isOpen" @close="isOpen = false" size="sm" hide-close-button>
    <template #header>
      <div class="flex flex-col items-center justify-center">
        <LogoRikai :size="75" />
        <h2 class="text-2xl font-bold uppercase">Đăng nhập</h2>
      </div>
    </template>

    <form @submit="handleSubmin">
      <CTextField
        class="my-3"
        type="text"
        label="Tài khoản"
        placeholder="Tên đăng nhập hoặc địa chỉ Email"
        required
        name="account"
        :disabled="isLoading"
      />
      <CTextField
        class="my-3"
        type="password"
        label="Mật khẩu"
        placeholder="Mật khẩu"
        required
        name="password"
        :disabled="isLoading"
      />
      <button
        class="bg-accent text-accent-foreground w-full rounded-full py-2 cursor-pointer mt-5 font-bold"
        type="submit"
        :disabled="isLoading"
      >
        Đăng nhập
      </button>
    </form>
    <CLoading v-if="isLoading" />
  </CModal>
</template>
