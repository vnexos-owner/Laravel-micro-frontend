<script lang="ts" setup>
import { ref } from 'vue'
import CModal from '../common/CModal.vue'
import LogoRikai from '../LogoRikai.vue'
import CTextField from '../common/CTextField.vue'
import { type AuthResponse, type SignUpBody } from '@/types'
import { api, ApiError, setAccessToken } from '@/utils/api'
import { authEndpoints } from '@/config/endpoints'
import { useToast } from '../common/toast'
import CLoading from '../common/CLoading.vue'
import webLocalStorage from '@/utils/webLocalStorage'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/config'
import webStorageClient from '@/utils/webStorageClient'

const isOpen = ref(false)

const { toast } = useToast()
const isLoading = ref<boolean>(false)
const errors = ref<Record<string, string>>({})

function handleSubmit(e: SubmitEvent) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)

  const body: SignUpBody = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    username: formData.get('username') as string,
    password: formData.get('password') as string,
    password_confirmation: formData.get('password_confirmation') as string,
    gender: formData.get('gender') as string,
    dob: formData.get('dob') as string,
  }

  isLoading.value = true
  api
    .post<AuthResponse>(authEndpoints.SIGN_UP, body, { skipAuth: true })
    .then((val) => {
      webLocalStorage.set(REFRESH_TOKEN, val.refresh_token)
      webStorageClient.set(ACCESS_TOKEN, val.access_token, {
        expires: new Date(Date.now() + val.expires_in * 1000),
      })
      setAccessToken(val.access_token)
      toast('Đăng ký thành công!', 'success')
      isOpen.value = false
    })
    .catch((r) => {
      if (r instanceof ApiError) {
        const respondedError: Record<string, unknown> = r.getBody().errors as Record<string, string>
        const errorKeys = Object.keys(respondedError)
        console.log(respondedError)

        for (const key of errorKeys) {
          console.log(key, respondedError[key] as string[])
          errors.value = { ...errors.value, [key]: (respondedError[key] as string[])[0] as string }
        }
      }
      toast('Đăng ký thất bại. Vui lòng thử lại.', 'warning')
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <button
    class="cursor-pointer py-2 px-3.5 bg-accent text-accent-foreground rounded-3xl text-sm font-medium"
    @click="isOpen = true"
  >
    Đăng ký
  </button>

  <CModal :open="isOpen" @close="isOpen = false" size="sm" hide-close-button>
    <template #header>
      <div class="flex flex-col items-center justify-center">
        <LogoRikai :size="75" />
        <h2 class="text-2xl font-bold uppercase">Đăng ký</h2>
      </div>
    </template>

    <form class="px-5" @submit="handleSubmit">
      <CTextField
        class="my-3"
        type="text"
        label="Họ và tên"
        placeholder="Họ và tên"
        required
        name="name"
        :error="errors.name"
        :disabled="isLoading"
      />
      <CTextField
        type="text"
        label="Địa chỉ Email"
        placeholder="Địa chỉ Email"
        required
        name="email"
        class="my-3"
        :error="errors.email"
        :disabled="isLoading"
      />
      <CTextField
        type="text"
        label="Tên đăng nhập"
        placeholder="Tên đăng nhập"
        required
        name="username"
        class="my-3"
        :error="errors.username"
        :disabled="isLoading"
      />
      <CTextField
        type="password"
        label="Mật khẩu"
        placeholder="Mật khẩu"
        required
        name="password"
        class="my-3"
        :error="errors.password"
        :disabled="isLoading"
      />
      <CTextField
        type="password"
        name="password_confirmation"
        required
        label="Nhập lại mật khẩu"
        placeholder="Nhập lại mật khẩu"
        class="my-3"
        :disabled="isLoading"
      />
      <CTextField
        type="date"
        name="dob"
        required
        label="Ngày sinh"
        placeholder="Nhập lại mật khẩu"
        class="my-3"
        :error="errors.dob"
        :disabled="isLoading"
      />
      <CTextField
        type="text"
        name="gender"
        required
        label="Giới tính"
        placeholder="Giới tính"
        class="my-3"
        :error="errors.gender"
        :disabled="isLoading"
      />

      <button
        class="bg-accent text-accent-foreground w-full rounded-full py-2 cursor-pointer mt-5 font-bold"
        type="submit"
        :disabled="isLoading"
      >
        Đăng ký
      </button>
    </form>
    <CLoading v-if="isLoading" />
  </CModal>
</template>
