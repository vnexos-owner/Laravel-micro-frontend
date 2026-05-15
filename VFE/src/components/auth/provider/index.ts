import { useToast } from '@/components/common/toast'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/config'
import { authEndpoints } from '@/config/endpoints'
import type { User } from '@/types'
import { api, clearAccessToken } from '@/utils/api'
import webLocalStorage from '@/utils/webLocalStorage'
import webStorageClient from '@/utils/webStorageClient'
import { computed, ref } from 'vue'

const user = ref<User | null>(null)
const isFetchingUser = ref<boolean>(false)
const { toast } = useToast()

const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  async function fetchMe(): Promise<User | null> {
    isFetchingUser.value = true
    try {
      const res = await api.get<User>(authEndpoints.ME)
      user.value = res

      return res
    } catch {
      clearAccessToken()
      webLocalStorage.remove(REFRESH_TOKEN)
      webStorageClient.remove(ACCESS_TOKEN)

      toast('Vui lòng đăng nhập lại', 'warning')
      return null
    } finally {
      isFetchingUser.value = false
    }
  }

  return { user, isFetching: isFetchingUser, fetchMe, isAuthenticated }
}
