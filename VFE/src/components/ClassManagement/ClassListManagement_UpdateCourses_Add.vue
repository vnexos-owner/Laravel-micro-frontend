<script setup lang="ts">
import { computed, ref } from 'vue'
import CDropdown from '../common/CDropdown.vue'
import type { Course } from '@/types'
import { useCourseList } from './useCourseList'
import CIconButton from '../common/CIconButton.vue'
import { IconArrowRotateLeft, IconPlus } from '@iconify-prerendered/vue-gravity-ui'
import CTooltip from '../common/CTooltip.vue'
import { api } from '@/utils/api'
import { classEndpoints, courseEndpoints } from '@/config/endpoints'
import { useToast } from '../common/toast'

const { courses, refetch, isFetching } = useCourseList()
const props = defineProps<{ existedCourses: Course[]; classId: string }>()
const emit = defineEmits<{ refetch: [] }>()

const selectedCourse = ref<string | null>(null)
const { toast } = useToast();
const isLoading = ref<boolean>(false)

const data = computed(() =>
  courses.value.map((val) => ({
    label: `${val.code} - ${val.name}`,
    value: val.id,
    disabled: !!props.existedCourses.find((value) => val.id === value.id),
  })),
)

courses.value.length || refetch()

async function addCourse() {
  isLoading.value = true
  try {
    console.log(props.classId)
    await api.post(classEndpoints.CLASSES_COURSES.replaceAll('{id}', props.classId), { course_id: selectedCourse.value })
    toast('Thêm môn học thành công', 'success')
    selectedCourse.value = null
    emit('refetch')
  } catch(err) {
    console.log(err)
    toast('Có lỗi xảy ra khi thêm môn học vào lớp', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex gap-1.5 m-2">
    <CDropdown
      :model-value="selectedCourse"
      :options="data"
      searchable
      class="max-w-9/12"
      @update:model-value="selectedCourse = $event as string | null"
    />
    <div class="flex gap-1 w-4/12 justify-center items-center">
      <CTooltip>
        <CIconButton
          :icon="IconArrowRotateLeft"
          classes="p-2 bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover"
          @click="refetch"
          :disabled="isFetching"
        />

        <template #tooltip> Làm mới danh sách </template>
      </CTooltip>
      <CTooltip>
        <CIconButton
          :icon="IconPlus"
          classes="p-2 bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover"
          @click="addCourse"
          :disabled="!selectedCourse || isLoading"
        />

        <template #tooltip>Thêm môn học</template>
      </CTooltip>
    </div>
  </div>
</template>
