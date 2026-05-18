import { courseEndpoints } from '@/config/endpoints'
import type { Course } from '@/types'
import { api } from '@/utils/api'
import { ref } from 'vue'
import { useToast } from '../common/toast'

const isFetching = ref<boolean>(false)
const courses = ref<Course[]>([])
const { toast } = useToast()

export function useCourseList() {
  async function getCourses() {
    isFetching.value = true
    try {
      courses.value = await api.get<Course[]>(courseEndpoints.COURSES)
    } catch {
      toast('Có lỗi xảy ra trong quá trình lấy danh sách Môn học', 'error')
    } finally {
      isFetching.value = false
    }
  }
  return { refetch: getCourses, courses, isFetching }
}
