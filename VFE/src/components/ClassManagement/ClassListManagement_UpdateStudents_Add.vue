<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import CDropdown from '../common/CDropdown.vue'
import type { Class, User } from '@/types'
import CIconButton from '../common/CIconButton.vue'
import { IconArrowRotateLeft, IconPlus } from '@iconify-prerendered/vue-gravity-ui'
import CTooltip from '../common/CTooltip.vue'
import { api } from '@/utils/api'
import { classEndpoints } from '@/config/endpoints'
import { useToast } from '../common/toast'
import { useUserList } from './useUserList'
import CUser from '../common/CUser.vue'
import { useAuth } from '../auth/provider'

const { user } = useAuth()
const { users, refetch, isFetching } = useUserList()
const props = defineProps<{ existedStudents: User[]; clazz: Class }>()
const emit = defineEmits<{ refetch: [] }>()

const selectedCourse = ref<string | null>(null)
const { toast } = useToast()
const isLoading = ref<boolean>(false)

const data = computed(() =>
  users.value.map((val) => ({
    label: val,
    value: val.id,
    disabled: val.id === user.value?.id || !!props.existedStudents.find((u) => u.id === val.id),
  })),
)

watch(data, (val) => {
  console.log(props.clazz)
  console.log(val)
})

async function addStudent() {
  isLoading.value = true
  try {
    console.log(props.clazz.id)
    await api.post(classEndpoints.CLASSES_STUDENTS.replaceAll('{id}', props.clazz.id), {
      student_id: selectedCourse.value,
    })
    toast('Thêm học sinh thành công', 'success')
    selectedCourse.value = null
    emit('refetch')
  } catch (err) {
    console.log(err)
    toast('Có lỗi xảy ra khi thêm học sinh vào lớp', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!users.value.length) refetch()
})
</script>

<template>
  <div class="flex gap-1.5 m-2">
    <CDropdown
      :model-value="selectedCourse"
      :options="data"
      searchable
      class="max-w-9/12"
      @update:model-value="selectedCourse = $event as string | null"
      :render-option="
        (_, option) => h(CUser, { user: option.label as User, disabled: option.disabled })
      "
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
          @click="addStudent"
          :disabled="!selectedCourse || isLoading"
        />

        <template #tooltip>Thêm học sinh</template>
      </CTooltip>
    </div>
  </div>
</template>
