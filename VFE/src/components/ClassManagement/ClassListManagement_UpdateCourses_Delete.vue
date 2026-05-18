<script setup lang="ts">
import { classEndpoints } from '@/config/endpoints';
import { api } from '@/utils/api';
import { IconXmark } from '@iconify-prerendered/vue-gravity-ui';
import { ref } from 'vue';
import { useToast } from '../common/toast';
import type { Course } from '@/types';
import CModal from '../common/CModal.vue';
import CIconButton from '../common/CIconButton.vue';

const props = defineProps<{ clazzId: string; course: Course }>()
const emit = defineEmits<{refetch: []}>()
const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const { toast } = useToast()

async function handleDelete() {
  isLoading.value = true
  try {
    await api.delete(classEndpoints.CLASSES_COURSES.replaceAll('{id}', props.clazzId), { course_id: props.course.id })
    toast('Xóa lớp học thành công!', 'success')
    isOpen.value = false
    emit('refetch')
  } catch {
    toast('Có lỗi xảy ra trong quá trình xóa lớp học.', 'error')
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <CIconButton
    :icon="IconXmark"
    classes="text-xs p-0.5 bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft-hover absolute  -right-1 -top-1"
    @click="isOpen = true"
  />
  <CModal
    :open="isOpen"
    @close="isOpen = false"
    size="sm"
    :close-on-backdrop="!isLoading"
    :close-on-esc="!isLoading"
  >
    <template #header>
      <h1 class="text-2xl font-semibold">Xác nhận xóa môn học</h1>
    </template>

    <p>
      Bạn có chắc chắn muốn xóa môn
      <strong>{{ course.name }}</strong> khỏi lớp học không? Hành động này không thể hoàn tác.
    </p>

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
    <CLoading v-if="isLoading" />
  </CModal>
</template>