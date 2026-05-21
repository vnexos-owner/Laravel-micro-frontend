import { accountEndpoints } from '@/config/endpoints'
import type { User } from '@/types'
import { api } from '@/utils/api'
import { ref } from 'vue'
import { useToast } from '../common/toast'

const isFetching = ref<boolean>(false)
const users = ref<User[]>([])
const { toast } = useToast()

export function useUserList() {
  async function getUsers() {
    isFetching.value = true
    try {
      users.value = await api.get<User[]>(accountEndpoints.USERS)
    } catch {
      toast('Có lỗi xảy ra trong quá trình lấy danh sách Môn học', 'error')
    } finally {
      isFetching.value = false
    }
  }
  return { refetch: getUsers, users, isFetching }
}
