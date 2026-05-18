<script lang="ts" setup>
import CLoading from '@/components/common/CLoading.vue'
import { useAuth } from '.'
import webLocalStorage from '@/utils/webLocalStorage'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/config'
import { onMounted } from 'vue'
import { setAccessToken } from '@/utils/api'
import webStorageClient from '@/utils/webStorageClient'

const { isFetching, fetchMe } = useAuth()

onMounted(() => {
  const token = webLocalStorage.get(REFRESH_TOKEN)
  setAccessToken(webStorageClient.get(ACCESS_TOKEN))
  if (token) fetchMe()
})
</script>

<template>
  <CLoading v-if="isFetching" />
  <slot v-else />
</template>
