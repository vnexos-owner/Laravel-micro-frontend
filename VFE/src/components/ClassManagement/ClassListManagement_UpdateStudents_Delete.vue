<script setup lang="ts">
import { classEndpoints } from '@/config/endpoints'
import { api } from '@/utils/api'
import { IconTrashBin } from '@iconify-prerendered/vue-gravity-ui'
import { ref } from 'vue'
import { useToast } from '../common/toast'
import type { User } from '@/types'
import CModal from '../common/CModal.vue'
import CIconButton from '../common/CIconButton.vue'
import CLoading from '../common/CLoading.vue'

const props = defineProps<{ clazzId: string; student: User }>()
const emit = defineEmits<{ refetch: [] }>()
const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const { toast } = useToast()

async function handleDelete() {
  isLoading.value = true
  try {
    await api.delete(classEndpoints.CLASSES_STUDENTS.replaceAll('{id}', props.clazzId), {
      student_id: props.student.id,
    })
    toast('Xóa học sinh thành công!', 'success')
    isOpen.value = false
    emit('refetch')
  } catch {
    toast('Có lỗi xảy ra trong quá trình xóa học sinh.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <CIconButton
      :icon="IconTrashBin"
      classes="text-xs p-2 bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft-hover"
      @click="isOpen = true"
    />
  </div>
  <CModal
    :open="isOpen"
    @close="isOpen = false"
    size="sm"
    :close-on-backdrop="!isLoading"
    :close-on-esc="!isLoading"
  >
    <template #header>
      <h1 class="text-2xl font-semibold">Xác nhận xóa học sinh</h1>
    </template>

    <p>
      Bạn có chắc chắn muốn xóa học sinh
      <strong>{{ student.name }}</strong> khỏi lớp học không? Hành động này không thể hoàn tác.
    </p>
    <CLoading v-if="isLoading" />

    <template #footer>
      <div class="flex gap-2 justify-end items-center">
        <button
          class="px-5 py-2 rounded-full bg-danger text-danger-foreground hover:bg-danger-hover cursor-pointer"
          @click="handleDelete"
          :disabled="isLoading"
        >
          Xóa
        </button>
        <button
          class="px-5 py-2 rounded-full bg-overlay text-overlay-foreground hover:bg-overlay-hover cursor-pointer"
          @click="isOpen = false"
          :disabled="isLoading"
        >
          Hủy
        </button>
      </div>
    </template>
  </CModal>
</template>
