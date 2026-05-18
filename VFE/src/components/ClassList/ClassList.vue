<script setup lang="ts">
import { accountEndpoints } from '@/config/endpoints'
import { api } from '@/utils/api'
import type { Class } from '@/types'
import { ref } from 'vue'
import { useToast } from '../common/toast'
import CLoading from '@/components/common/CLoading.vue'
import CEmpty from '@/components/common/CEmpty.vue'
import { IconGraduationCap, IconPerson } from '@iconify-prerendered/vue-gravity-ui'
import ClassList_ViewCourses from './ClassList_ViewCourses.vue'
import ClassList_ViewStudents from './ClassList_ViewStudents.vue'

const classes = ref<Class[]>([])
const classesFetching = ref<boolean>(true)
const { toast } = useToast()

api
  .get<Class[]>(accountEndpoints.USERS_CLASSES)
  .then((val) => (classes.value = val))
  .catch(() => toast('Có lỗi xảy ra khi lấy lớp học'))
  .finally(() => (classesFetching.value = false))
</script>

<template>
  <div class="grid grid-cols-4 justify-around" v-if="classes.length">
    <div
      class="m-5 p-2 rounded-2xl shadow-lg w-full h-fit"
      v-for="clazz in classes"
      :key="clazz.id"
    >
      <p class="font-semibold text-lg">{{ clazz.name }}</p>
      <span class="flex gap-2 items-center">
        <IconPerson />
        <p>{{ clazz.homeroom_teacher.name }}</p>
      </span>
      <span class="flex gap-2 items-center">
        <IconGraduationCap />
        <p>{{ clazz.semester.name }}</p>
      </span>
      <div class="flex justify-end gap-2">
        <ClassList_ViewCourses :class-id="clazz.id" />
        <ClassList_ViewStudents :class-id="clazz.id" />
      </div>
    </div>
  </div>
  <CEmpty message="Không có lớp học nào" v-else />
  <CLoading v-if="classesFetching" />
</template>
