<script setup lang="ts">
import { computed, ref } from 'vue'
import CDropdown from '../common/CDropdown.vue'
import type { Course } from '@/types'
import { useCourseList } from './useCourseList'
import CIconButton from '../common/CIconButton.vue'
import { IconArrowRotateLeft, IconPlus } from '@iconify-prerendered/vue-gravity-ui'
import CTooltip from '../common/CTooltip.vue'

const { courses, refetch, isFetching } = useCourseList()
const props = defineProps<{ existedCourses: Course[] }>()

const selectedCourse = ref<string | null>(null)

const data = computed(() =>
  courses.value.map((val) => ({
    label: `${val.code} - ${val.name}`,
    value: val.id,
    disabled: !!props.existedCourses.find((value) => val.id === value.id),
  })),
)

courses.value.length || refetch()
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
          @click="refetch"
          :disabled="!selectedCourse"
        />

        <template #tooltip>Thêm môn học</template>
      </CTooltip>
    </div>
  </div>
</template>
