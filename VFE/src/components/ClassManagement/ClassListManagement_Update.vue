<script setup lang="ts">
import { IconPencilToLine } from '@iconify-prerendered/vue-gravity-ui'
import CIconButton from '../common/CIconButton.vue'
import CTooltip from '../common/CTooltip.vue'
import type { Class } from '@/types'
import { ref } from 'vue'
import { useToast } from '../common/toast'
import { useClassManagement } from './useClassManagement'
import CModal from '../common/CModal.vue'
import CTextField from '../common/CTextField.vue'
import { api } from '@/utils/api'
import { classEndpoints } from '@/config/endpoints'
import CLoading from '../common/CLoading.vue'

const props = defineProps<{ clazz: Class }>()
const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const nameData = ref<string>(props.clazz.name)
const { toast } = useToast()
const { refetch } = useClassManagement()

async function handleSubmit(e: SubmitEvent) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)

  const id = props.clazz.id
  isLoading.value = true
  try {
    await api.patch(classEndpoints.CLASSES_ID.replaceAll('{id}', id), {
      name: formData.get('name'),
    })
    toast('Cập nhật lớp học thành công', 'success')
    isOpen.value = false
    refetch()
  } catch {
    toast('Có lỗi xảy ra trong quá trình cập nhật lớp học', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CTooltip placement="top">
    <CIconButton
      classes="bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover p-2"
      :icon="IconPencilToLine"
      @click="isOpen = true"
    />

    <template #tooltip>Chỉnh sửa thông tin lớp học</template>
  </CTooltip>

  <CModal
    :open="isOpen"
    @close="isOpen = false"
    size="sm"
    :close-on-backdrop="!isLoading"
    :close-on-esc="!isLoading"
  >
    <template #header>
      <p class="text-lg font-semibold">Cập nhật lớp học</p>
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
        :model-value="nameData"
        @update:model-value="nameData = $event"
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
