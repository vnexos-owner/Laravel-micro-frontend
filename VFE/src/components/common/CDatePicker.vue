<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, useId } from 'vue'

export interface DatePickerProps {
  modelValue?: string // ISO date string: 'YYYY-MM-DD'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  min?: string // ISO date string
  max?: string // ISO date string
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  placeholder: 'Select a date',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = useId()
const open = ref(false)
const containerRef = ref<HTMLElement | null>(null)

// ── Calendar state ──────────────────────────────────────────────────────────
const today = new Date()
today.setHours(0, 0, 0, 0)

function parseISO(s: string | undefined): Date | null {
  if (!s) return null
  const d = new Date(`${s}T00:00:00`)
  return isNaN(d.getTime()) ? null : d
}

function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const selectedDate = computed(() => parseISO(props.modelValue))

// Cursor = the month/year the calendar is showing
const cursor = ref<Date>(
  (() => {
    const d = selectedDate.value ?? new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })(),
)

watch(
  () => props.modelValue,
  (v) => {
    const d = parseISO(v)
    if (d) cursor.value = new Date(d.getFullYear(), d.getMonth(), 1)
  },
)

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const cursorLabel = computed(
  () => `${MONTHS[cursor.value.getMonth()]} ${cursor.value.getFullYear()}`,
)

interface CalDay {
  date: Date
  iso: string
  day: number
  currentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
}

const calendarDays = computed((): CalDay[] => {
  const year = cursor.value.getFullYear()
  const month = cursor.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const minDate = parseISO(props.min)
  const maxDate = parseISO(props.max)

  const days: CalDay[] = []

  // Trailing days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrev - i)
    date.setHours(0, 0, 0, 0)
    days.push(makeDay(date, false, minDate, maxDate))
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    date.setHours(0, 0, 0, 0)
    days.push(makeDay(date, true, minDate, maxDate))
  }

  // Leading days from next month
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d)
    date.setHours(0, 0, 0, 0)
    days.push(makeDay(date, false, minDate, maxDate))
  }

  return days
})

function makeDay(
  date: Date,
  currentMonth: boolean,
  minDate: Date | null,
  maxDate: Date | null,
): CalDay {
  const iso = toISO(date)
  const isDisabled = (minDate !== null && date < minDate) || (maxDate !== null && date > maxDate)
  return {
    date,
    iso,
    day: date.getDate(),
    currentMonth,
    isToday: date.getTime() === today.getTime(),
    isSelected: iso === props.modelValue,
    isDisabled,
  }
}

function prevMonth() {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() - 1, 1)
}

function nextMonth() {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + 1, 1)
}

function selectDay(day: CalDay) {
  if (day.isDisabled) return
  emit('update:modelValue', day.iso)
  open.value = false
}

// ── Display value ───────────────────────────────────────────────────────────
const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const d = parseISO(props.modelValue)
  if (!d) return props.modelValue
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
})

// ── Click-outside ───────────────────────────────────────────────────────────
function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))

// ── Keyboard ─────────────────────────────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

const hasError = computed(() => !!props.error)

const triggerClasses = computed(() => [
  'flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-all duration-150',
  'dark:bg-gray-900',
  hasError.value
    ? 'border-red-400 ring-1 ring-red-400 dark:border-red-500'
    : open.value
      ? 'border-blue-500 ring-1 ring-blue-500 dark:border-blue-400 dark:ring-blue-400'
      : 'border-gray-300 dark:border-gray-600',
  props.disabled
    ? 'cursor-not-allowed opacity-50'
    : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500',
])
</script>

<template>
  <div ref="containerRef" class="relative flex flex-col gap-1" @keydown="onKeydown">
    <!-- Label -->
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-red-500" aria-hidden="true">*</span>
    </label>

    <!-- Trigger -->
    <button
      :id="id"
      type="button"
      :disabled="disabled"
      :aria-expanded="open"
      :aria-haspopup="'dialog'"
      :aria-invalid="hasError"
      :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
      :class="triggerClasses"
      @click="open = !open"
    >
      <span
        :class="
          displayValue ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
        "
      >
        {{ displayValue || placeholder }}
      </span>
      <!-- Calendar icon -->
      <svg
        class="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
        <path d="M5 1v3M11 1v3M1.5 6.5h13" />
      </svg>
    </button>

    <!-- Dropdown calendar -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="open"
        role="dialog"
        :aria-label="label ? `${label} calendar` : 'Date picker'"
        class="absolute left-0 z-50 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        style="top: 100%"
      >
        <!-- Month navigation -->
        <div class="mb-2 flex items-center justify-between">
          <button
            type="button"
            class="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            :aria-label="'Previous month'"
            @click="prevMonth"
          >
            <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path
                d="M10 3 5 8l5 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
            </svg>
          </button>
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{
            cursorLabel
          }}</span>
          <button
            type="button"
            class="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            :aria-label="'Next month'"
            @click="nextMonth"
          >
            <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
            </svg>
          </button>
        </div>

        <!-- Day headers -->
        <div class="mb-1 grid grid-cols-7 gap-0.5">
          <div
            v-for="d in DAYS"
            :key="d"
            class="text-center text-xs font-medium text-gray-400 dark:text-gray-500"
          >
            {{ d }}
          </div>
        </div>

        <!-- Day grid -->
        <div class="grid grid-cols-7 gap-0.5">
          <button
            v-for="day in calendarDays"
            :key="day.iso"
            type="button"
            :disabled="day.isDisabled"
            :aria-label="
              day.date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            "
            :aria-pressed="day.isSelected"
            :class="[
              'flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors duration-100',
              day.isDisabled
                ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                : day.isSelected
                  ? 'bg-blue-600 font-semibold text-white hover:bg-blue-700'
                  : day.isToday
                    ? 'border border-blue-400 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950'
                    : day.currentMonth
                      ? 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800'
                      : 'text-gray-400 hover:bg-gray-50 dark:text-gray-600 dark:hover:bg-gray-800/50',
            ]"
            @click="selectDay(day)"
          >
            {{ day.day }}
          </button>
        </div>

        <!-- Today shortcut -->
        <div class="mt-2 border-t border-gray-100 pt-2 dark:border-gray-800">
          <button
            type="button"
            class="w-full rounded-md py-1 text-center text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
            @click="
              () => {
                emit('update:modelValue', toISO(today))
                open = false
              }
            "
          >
            Today
          </button>
        </div>
      </div>
    </Transition>

    <!-- Field error -->
    <p
      v-if="error"
      :id="`${id}-error`"
      role="alert"
      class="flex items-center gap-1 text-xs text-red-500 dark:text-red-400"
    >
      <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z"
        />
      </svg>
      {{ error }}
    </p>

    <!-- Hint -->
    <p v-else-if="hint" :id="`${id}-hint`" class="text-xs text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>
