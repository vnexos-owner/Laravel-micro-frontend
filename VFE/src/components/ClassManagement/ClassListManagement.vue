<script setup lang="ts">
import { IconBookmark } from '@iconify-prerendered/vue-gravity-ui'
import CLoading from '../common/CLoading.vue'
import CEmpty from '../common/CEmpty.vue'
import { useClassManagement } from './useClassManagement'
import ClassListManagement_Delete from './ClassListManagement_Delete.vue'
import ClassListManagement_Update from './ClassListManagement_Update.vue'
import ClassListManagement_UpdateCourses from './ClassListManagement_UpdateCourses.vue'
import ClassListManagement_UpdateStudents from './ClassListManagement_UpdateStudents.vue'

const { refetch, isLoading, classes } = useClassManagement()

refetch()
</script>

<template>
  <div class="grid grid-cols-4 justify-around gap-4 mt-4" v-if="classes.length">
    <div
      class="p-2 rounded-2xl shadow-lg w-full h-fit relative"
      v-for="clazz in classes"
      :key="clazz.id"
    >
      <p class="font-semibold text-lg">{{ clazz.name }}</p>
      <span class="flex gap-2 items-center">
        <IconBookmark />
        <p>{{ clazz.semester.name }}</p>
      </span>
      <div class="flex justify-end gap-2">
        <ClassListManagement_UpdateCourses :class-id="clazz.id" />
        <ClassListManagement_UpdateStudents :clazz="clazz" />
        <ClassListManagement_Update :clazz="clazz" />
      </div>
      <ClassListManagement_Delete :clazz="clazz" />
    </div>
  </div>
  <CEmpty message="Bạn đang không quản lý lớp học nào" v-else />
  <CLoading v-if="isLoading" />
</template>
