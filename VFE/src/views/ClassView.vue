<script setup lang="ts">
import { useAuth } from '@/components/auth/provider'
import ClassListManagement from '@/components/ClassManagement/ClassListManagement.vue'
import CreateClassModal from '@/components/ClassManagement/CreateClassModal.vue'
import CLoading from '@/components/common/CLoading.vue'
import { useToast } from '@/components/common/toast'
import { semesterEndpoints } from '@/config/endpoints'
import type { Semester, User } from '@/types'
import { api } from '@/utils/api'
import { checkRole } from '@/utils/checkUserRole'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { user, isAuthenticated } = useAuth()
const router = useRouter()

if (isAuthenticated && !checkRole(user.value as User, 'teacher')) router.push('/')

const currentSemester = ref<Semester>()
const currentSemesterLoading = ref<boolean>(true)
const { toast } = useToast()

api
  .get<Semester>(semesterEndpoints.SEMESTERS_CURRENT)
  .then((val) => {
    currentSemester.value = val
  })
  .catch(() => toast('Có lỗi xảy ra khi lấy học kỳ hiện tại!', 'error'))
  .finally(() => (currentSemesterLoading.value = false))
</script>

<template>
  <section v-if="isAuthenticated">
    <div>
      <h1 class="text-3xl font-semibold">Quản lý lớp học</h1>
      <div class="relative w-fit">
        <p class="text-muted">Học kỳ hiện tại: {{ currentSemester?.name }}</p>
        <CLoading size="sm" v-if="currentSemesterLoading" />
      </div>

      <div class="relative mt-5 bg-segment text-segment-foreground rounded-2xl p-10 shadow-accent">
        <CreateClassModal v-if="!!currentSemester" :semester="currentSemester" />
        <ClassListManagement />
      </div>
    </div>
  </section>
</template>
