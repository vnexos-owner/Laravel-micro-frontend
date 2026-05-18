<script lang="ts" setup>
import { useAuth } from '@/components/auth/provider'
import ClassList from '@/components/ClassList/ClassList.vue'
import CLoading from '@/components/common/CLoading.vue'
import { useToast } from '@/components/common/toast'
import { semesterEndpoints } from '@/config/endpoints'
import type { Semester } from '@/types'
import { api } from '@/utils/api'
import { ref } from 'vue'

const { user, isAuthenticated } = useAuth()
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
      <!-- Role teacher -->
      <h1 class="text-3xl font-semibold">Chào mừng, {{ user?.name }}!</h1>
      <div class="relative w-fit">
        <p class="text-muted">Học kỳ hiện tại: {{ currentSemester?.name }}</p>
        <CLoading size="sm" v-if="currentSemesterLoading" />
      </div>

      <div class="relative mt-5 bg-segment text-segment-foreground rounded-2xl p-10 shadow-accent">
        <h1 class="text-xl font-medium">Danh sách lớp học</h1>
        <ClassList />
      </div>
    </div>
  </section>
  <section v-else class="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
    <div class="inline-block max-w-xl text-center justify-center font-semibold">
      <span class="tracking-tight inline font-bold text-[2.3rem] lg:text-5xl">
        Chào mừng bạn đến với&nbsp;
      </span>
      <span
        class="tracking-tight inline font-bold from-[#5EA2EF] to-[#0072F5] text-[2.3rem] lg:text-5xl bg-clip-text text-transparent bg-linear-to-b"
      >
        RIKAI
      </span>
      <span class="tracking-tight inline font-bold text-[2.3rem] lg:text-5xl">!!! </span>
    </div>
  </section>
</template>
