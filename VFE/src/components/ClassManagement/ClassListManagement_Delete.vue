<script setup lang="ts">
import { IconXmark } from '@iconify-prerendered/vue-gravity-ui'
import CIconButton from '../common/CIconButton.vue'
import type { Class } from '@/types'
import CModal from '../common/CModal.vue'
import { ref } from 'vue'
import CLoading from '../common/CLoading.vue'
import { api } from '@/utils/api'
import { classEndpoints } from '@/config/endpoints'
import { useToast } from '../common/toast'
import { useClassManagement } from './useClassManagement'

const props = defineProps<{ clazz: Class }>()
const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const { toast } = useToast()
const { refetch } = useClassManagement()

async function handleDelete() {
  const id = props.clazz.id
  isLoading.value = true
  try {
    await api.delete(classEndpoints.CLASSES_ID.replaceAll('{id}', id))
    toast('Xóa lớp học thành công!', 'success')
    isOpen.value = false
    refetch()
  } catch {
    toast('Có lỗi xảy ra trong quá trình xóa lớp học.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CIconButton
    classes="bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft-hover absolute -top-4 -right-4 p-2"
    :icon="IconXmark"
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
      <h1 class="text-2xl font-semibold">Xác nhận xóa lớp học</h1>
    </template>

    <p>
      Bạn có chắc chắn muốn xóa lớp học
      <strong>{{ clazz.name }}</strong> không? Hành động này không thể hoàn tác.
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
