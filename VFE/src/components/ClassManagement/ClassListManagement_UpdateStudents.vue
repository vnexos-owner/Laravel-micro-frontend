<script setup lang="ts">
import { IconPersons } from '@iconify-prerendered/vue-gravity-ui'
import CIconButton from '../common/CIconButton.vue'
import CTooltip from '../common/CTooltip.vue'
import { ref } from 'vue'
import CModal from '../common/CModal.vue'
import type { Class, User } from '@/types'
import { classEndpoints } from '@/config/endpoints'
import { useToast } from '../common/toast'
import { api } from '@/utils/api'
import CEmpty from '../common/CEmpty.vue'
import CUser from '../common/CUser.vue'
import ClassListManagement_UpdateStudents_Add from './ClassListManagement_UpdateStudents_Add.vue'
import ClassListManagement_UpdateStudents_Delete from './ClassListManagement_UpdateStudents_Delete.vue'
import CLoading from '../common/CLoading.vue'

const data = ref<User[]>([])
const isOpen = ref<boolean>(false)
const props = defineProps<{ clazz: Class }>()
const isFetching = ref<boolean>(true)
const { toast } = useToast()

function fetchClassStudents() {
  api
    .get<User[]>(classEndpoints.CLASSES_STUDENTS.replaceAll('{id}', props.clazz.id))
    .then((val) => (data.value = val))
    .catch(() => toast('Có lỗi xảy ra khi cố gắng lấy danh sách học sinh', 'error'))
    .finally(() => (isFetching.value = false))
}
fetchClassStudents()
</script>

<template>
  <CTooltip placement="top">
    <CIconButton
      classes="bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover p-2"
      :icon="IconPersons"
      @click="isOpen = true"
    />

    <template #tooltip>Chỉnh sửa danh sách học sinh</template>
  </CTooltip>
  <CModal :open="isOpen" @close="isOpen = false" size="sm">
    <template #header>
      <p class="text-lg font-semibold">Danh sách học sinh</p>
    </template>
    <ClassListManagement_UpdateStudents_Add
      :clazz="clazz"
      :existed-students="data"
      @refetch="fetchClassStudents"
    />
    <div class="m-3 p-2 rounded-lg bg-segment overflow-auto max-h-64 h-fit flex flex-col gap-2">
      <div v-if="data.length" class="flex flex-col gap-2">
        <div
          class="p-2 bg-segment shadow-2xl rounded-2xl flex justify-between items-center"
          v-for="student in data"
          :key="student.id"
        >
          <CUser :user="student" class="w-10/12" />
          <ClassListManagement_UpdateStudents_Delete
            :clazz-id="clazz.id"
            :student="student"
            @refetch="fetchClassStudents"
          />
        </div>
      </div>
      <CEmpty class="size-5 h-fit" v-else message="Không có môn học nào" />
      <CLoading v-if="isFetching" />
    </div>
  </CModal>
</template>
