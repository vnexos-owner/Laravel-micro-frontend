<script setup lang="ts">
import type { Class } from '@/types'
import { api } from '@/utils/api'
import { ref } from 'vue'
import { useToast } from '../common/toast'
import { classEndpoints } from '@/config/endpoints'
import { useAuth } from '../auth/provider'
import { IconBookmark, IconGraduationCap } from '@iconify-prerendered/vue-gravity-ui'

const classes = ref<Class[]>([])
const classesFetching = ref<boolean>(true)
const { toast } = useToast()
const { user } = useAuth()

api
  .get<Class[]>(classEndpoints.CLASSES, { homeroom_teacher_id: user.value?.id })
  .then((val) => (classes.value = val))
  .catch(() => toast('Có lỗi xảy ra khi lấy lớp học'))
  .finally(() => (classesFetching.value = false))
</script>

<template>
  <div class="grid grid-cols-4 justify-around gap-4" v-if="classes.length">
    <div
      class="m-5 p-2 rounded-2xl shadow-lg w-full h-fit"
      v-for="clazz in classes"
      :key="clazz.id"
    >
      <p class="font-semibold text-lg">{{ clazz.name }}</p>
      <span class="flex gap-2 items-center">
        <IconBookmark />
        <p>{{ clazz.semester.name }}</p>
      </span>
      <div class="flex justify-end gap-2"></div>
    </div>
  </div>
  <CEmpty message="Bạn đang không quản lý lớp học nào" v-else />
  <CLoading v-if="classesFetching" />
</template>
