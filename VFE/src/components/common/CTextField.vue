<script setup lang="ts">
import { computed, useId } from 'vue'

export interface CTextFieldProps {
  modelValue?: string
  label?: string
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date'
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  prefixIcon?: unknown
  suffixIcon?: unknown
  name?: string
}

const props = withDefaults(defineProps<CTextFieldProps>(), {
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const id = useId()

const hasError = computed(() => !!props.error)

const inputClasses = computed(() => [
  'w-full rounded-full border bg-overlay px-3 py-2 text-sm text-overlay-foreground outline-none',
  'transition-all duration-150',
  'placeholder:text-muted',
  props.prefixIcon ? 'pl-9' : '',
  props.suffixIcon ? 'pr-9' : '',
  hasError.value
    ? 'border-danger ring-1 ring-danger'
    : 'border-muted focus:border-accent focus:ring-1 focus:ring-accent',
  props.disabled ? 'cursor-not-allowed opacity-50' : '',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- Label -->
    <label v-if="label" :for="id" class="text-sm font-medium text-segment-foreground">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-danger" aria-hidden="true">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Prefix icon -->
      <span
        v-if="prefixIcon"
        class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
        aria-hidden="true"
      >
        <component :is="prefixIcon" class="h-4 w-4" />
      </span>

      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readOnly"
        :required="required"
        :aria-invalid="hasError"
        :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
        :class="inputClasses"
        :name="name"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />

      <!-- Suffix icon -->
      <span
        v-if="suffixIcon"
        class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        aria-hidden="true"
      >
        <component :is="suffixIcon" class="h-4 w-4" />
      </span>
    </div>

    <!-- Field error -->
    <p
      v-if="error"
      :id="`${id}-error`"
      role="alert"
      class="flex items-center gap-1 text-xs text-danger"
    >
      <!-- Inline error icon (no external dep) -->
      <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z"
        />
      </svg>
      {{ error }}
    </p>

    <!-- Hint text (shown when no error) -->
    <p v-else-if="hint" :id="`${id}-hint`" class="text-xs text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>
