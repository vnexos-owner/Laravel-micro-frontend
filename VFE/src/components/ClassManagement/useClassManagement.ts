import { classEndpoints } from '@/config/endpoints'
import type { Class } from '@/types'
import { api } from '@/utils/api'
import { ref } from 'vue'
import { useToast } from '../common/toast'
import { useAuth } from '../auth/provider'

const classes = ref<Class[]>([])
const classesFetching = ref<boolean>(true)
const { toast } = useToast()
const { user } = useAuth()

function handleGetClass() {
  api
    .get<Class[]>(classEndpoints.CLASSES, { homeroom_teacher_id: user.value?.id })
    .then((val) => (classes.value = val))
    .catch(() => toast('Có lỗi xảy ra khi lấy lớp học'))
    .finally(() => (classesFetching.value = false))
}

export function useClassManagement() {
  return { refetch: handleGetClass, classes, isLoading: classesFetching }
}
