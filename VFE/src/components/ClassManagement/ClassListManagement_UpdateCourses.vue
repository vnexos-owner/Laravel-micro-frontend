<script setup lang="ts">
import {
  IconBook,
  IconBookmark,
  IconBookOpen,
  IconGraduationCap,
  IconXmark,
} from '@iconify-prerendered/vue-gravity-ui'
import CIconButton from '../common/CIconButton.vue'
import CTooltip from '../common/CTooltip.vue'
import { ref } from 'vue'
import CModal from '../common/CModal.vue'
import type { Course } from '@/types'
import { classEndpoints } from '@/config/endpoints'
import { useToast } from '../common/toast'
import { api } from '@/utils/api'
import CLoading from '../common/CLoading.vue'
import CEmpty from '../common/CEmpty.vue'
import ClassListManagement_UpdateCourses_Add from './ClassListManagement_UpdateCourses_Add.vue'
import ClassListManagement_UpdateCourses_Delete from './ClassListManagement_UpdateCourses_Delete.vue'

const data = ref<Course[]>([])
const isOpen = ref<boolean>(false)
const props = defineProps<{ classId: string }>()
const isFetching = ref<boolean>(true)
const { toast } = useToast()

function fetchClassCourse() {
  api
    .get<Course[]>(classEndpoints.CLASSES_COURSES.replaceAll('{id}', props.classId))
    .then((val) => (data.value = val))
    .catch(() => toast('Có lỗi xảy ra khi cố gắng lấy danh sách môn học', 'error'))
    .finally(() => (isFetching.value = false))
}
fetchClassCourse()
</script>

<template>
  <CTooltip placement="top">
    <CIconButton
      classes="bg-warning-soft text-warning-soft-foreground hover:bg-warning-soft-hover p-2"
      :icon="IconBookOpen"
      @click="isOpen = true"
    />

    <template #tooltip>Chỉnh sửa danh sách môn học</template>
  </CTooltip>
  <CModal :open="isOpen" @close="isOpen = false" size="sm">
    <template #header>
      <p class="text-lg font-semibold">Danh sách môn học</p>
    </template>
    <ClassListManagement_UpdateCourses_Add :existed-courses="data" :class-id="classId" @refetch="fetchClassCourse" />
    <div class="m-3 p-2 rounded-lg bg-segment overflow-auto max-h-64 h-fit flex flex-col gap-2">
      <div v-if="data.length" class="flex gap-2 flex-col">
        <div
          class="p-2 bg-segment shadow-2xl rounded-2xl relative"
          v-for="course in data"
          :key="course.id"
        >
          <span class="flex gap-1.5 font-medium items-center">
            <IconBook />
            <p class="w-11/12">{{ course.name }}</p>
          </span>
          <span class="flex gap-1.5 text-muted items-center">
            <IconBookmark />
            <p class="w-11/12 text-sm">{{ course.code }}</p>
          </span>
          <span class="flex gap-1.5 text-muted items-center" v-if="course.prerequisite">
            <IconGraduationCap />
            <p class="w-11/12 text-sm">Tiên quyết: {{ course.prerequisite }}</p>
          </span>
          <ClassListManagement_UpdateCourses_Delete :clazz-id="classId" :course="course" @refetch="fetchClassCourse" />
        </div>
      </div>
      <CEmpty class="size-5 h-fit" v-else message="Không có môn học nào" />
      <CLoading v-if="isFetching" />
    </div>
  </CModal>
</template>
