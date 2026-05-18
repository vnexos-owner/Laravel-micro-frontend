<script setup lang="ts">
import { IconPlus } from '@iconify-prerendered/vue-gravity-ui'
import { ref } from 'vue'
import CModal from '../common/CModal.vue'
import CTextField from '../common/CTextField.vue'
import { useAuth } from '../auth/provider'
import type { CreateClassBody, Semester } from '@/types'
import { api } from '@/utils/api'
import { classEndpoints } from '@/config/endpoints'
import { useToast } from '../common/toast'
import { useClassManagement } from './useClassManagement'
import CLoading from '../common/CLoading.vue'

const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const { user } = useAuth()
const { toast } = useToast()
const { refetch } = useClassManagement()

defineProps<{ semester: Semester }>()

function handleSubmit(e: SubmitEvent) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)

  const data: CreateClassBody = {
    name: formData.get('name') as string,
    homeroom_teacher_id: formData.get('homeroom_teacher_id') as string,
    semester_id: formData.get('semester_id') as string,
  }

  isLoading.value = true
  api
    .post(classEndpoints.CLASSES, data)
    .then(() => {
      toast('Tạo thành công lớp học ' + data.name)
      refetch()
      isOpen.value = false
    })
    .catch(() => toast('Có lỗi xảy ra trong quá trình tạo lớp học.', 'success'))
    .finally(() => (isLoading.value = false))
}
</script>

<template>
  <button
    class="bg-accent text-accent-foreground hover:bg-accent-hover p-3 flex gap-2 items-center rounded-full font-semibold cursor-pointer"
    @click="isOpen = true"
  >
    <IconPlus />
    Tạo lớp học
  </button>
  <CModal
    :open="isOpen"
    @close="isOpen = false"
    size="sm"
    :close-on-backdrop="!isLoading"
    :close-on-esc="!isLoading"
  >
    <template #header>
      <p class="text-lg font-semibold">Tạo lớp học</p>
    </template>

    <form class="px-5 py-3" @submit="handleSubmit">
      <CTextField
        label="Tên lớp"
        placeholder="Tên lớp học"
        required
        name="name"
        type="text"
        class="my-3"
        :disabled="isLoading"
      />

      <input type="hidden" :value="user?.id" name="homeroom_teacher_id" />

      <CTextField
        disabled
        label="Giáo viên chủ nhiệm"
        name="homeroom_teacher"
        :model-value="user?.name"
        class="my-3"
      />

      <input type="hidden" :value="semester.id" name="semester_id" />

      <CTextField
        disabled
        label="Học kỳ"
        name="homeroom_teacher"
        :model-value="semester.name"
        class="my-3"
      />

      <button
        class="bg-accent text-accent-foreground w-full rounded-full py-2 cursor-pointer mt-5 font-bold"
        type="submit"
        :disabled="isLoading"
      >
        Xác nhận
      </button>
    </form>
    <CLoading v-if="isLoading" />
  </CModal>
</template>
