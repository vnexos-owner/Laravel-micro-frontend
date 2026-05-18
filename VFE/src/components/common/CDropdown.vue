<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, type CSSProperties } from 'vue'
import { RouterLink } from 'vue-router'

export type DropdownOption =
  | {
      label: string
      value?: string | number
      description?: string
      class?: string
      icon?: unknown
      disabled?: boolean
      /** Internal route — rendered as <RouterLink> */
      to?: string | Record<string, unknown>
      /** External URL — rendered as <a href> */
      href?: string
      /** Callback — invoked on click */
      action?: () => void
      group?: never
      hidden?: boolean
    }
  | {
      group: string
      label?: never
      value?: never
      class?: never
      description?: never
      icon?: never
      disabled?: never
      to?: never
      href?: never
      action?: never
      hidden?: never
    }

type Variant = 'default' | 'ghost' | 'outlined'
type Size = 'sm' | 'md' | 'lg'
type Align = 'left' | 'right'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | (string | number)[] | null
    options?: DropdownOption[]
    placeholder?: string
    variant?: Variant
    size?: Size
    align?: Align
    multiple?: boolean
    searchable?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    options: () => [],
    placeholder: 'Select an option',
    variant: 'default',
    size: 'md',
    align: 'left',
    multiple: false,
    searchable: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[] | null]
  change: [value: string | number | (string | number)[] | null]
  open: []
  close: []
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const focusedIndex = ref(-1)
const dropdownRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<CSSProperties>({})

const sizeClasses = computed(
  (): string =>
    ({
      sm: 'px-2.5 py-1.5 text-[13px]',
      md: 'px-3.5 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
    })[props.size],
)

const variantClasses = computed(
  (): string =>
    ({
      default: 'bg-field border-border',
      ghost: 'bg-transparent border-transparent shadow-none hover:bg-default',
      outlined: 'bg-transparent border-border shadow-none hover:border-accent',
    })[props.variant],
)

const filteredOptions = computed((): DropdownOption[] => {
  if (!props.searchable || !searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(
    (o) =>
      'group' in o ||
      o.label?.toLowerCase().includes(q) ||
      o.description?.toLowerCase().includes(q),
  )
})

const selectedLabel = computed((): string => {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : []
    return props.options
      .filter(
        (o: DropdownOption): o is Extract<DropdownOption, { value: string | number }> =>
          'value' in o && values.includes(o.value as string | number),
      )
      .map((o: DropdownOption) => o.label)
      .join(', ')
  }
  const found = props.options.find(
    (o): o is Extract<DropdownOption, { value: string | number }> =>
      'value' in o && o.value === props.modelValue,
  ) as DropdownOption | undefined
  return found?.label ?? ''
})

function updatePosition(): void {
  if (!isOpen.value || !dropdownRef.value) return
  const rect = dropdownRef.value.getBoundingClientRect()
  const panelWidth = Math.max(rect.width, panelRef.value?.offsetWidth ?? 0)
  panelStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: props.align === 'right' ? `${rect.right - panelWidth}px` : `${rect.left}px`,
    minWidth: `${rect.width}px`,
  }
}

function toggle(): void {
  if (!props.disabled) isOpen.value ? close() : open()
}

function open(): void {
  isOpen.value = true
  searchQuery.value = ''
  focusedIndex.value = -1
  emit('open')
  nextTick(updatePosition)
}

function close(): void {
  isOpen.value = false
  emit('close')
}

function isSelected(item: DropdownOption): boolean {
  if (!('value' in item)) return false
  return props.multiple
    ? (Array.isArray(props.modelValue) ? props.modelValue : []).includes(
        item.value as string | number,
      )
    : props.modelValue === item.value
}

function select(item: DropdownOption): void {
  if ('group' in item) return
  close()

  if (item.action) {
    item.action()
    return
  }

  if (item.to || item.href) return

  if (item.value === undefined) return
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const val = item.value as string | number
    const idx = values.indexOf(val)
    idx === -1 ? values.push(val) : values.splice(idx, 1)
    emit('update:modelValue', values)
    emit('change', values)
  } else {
    emit('update:modelValue', item.value as string | number)
    emit('change', item.value as string | number)
  }
}

function onClickOutside(e: MouseEvent): void {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(e.target as Node) &&
    panelRef.value &&
    !panelRef.value.contains(e.target as Node)
  )
    close()
}

function onKeydown(e: KeyboardEvent): void {
  if (!isOpen.value) {
    if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
      e.preventDefault()
      open()
    }
    return
  }
  const selectables = filteredOptions.value.filter((o) => !('group' in o) && !o.disabled)
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusedIndex.value = Math.min(focusedIndex.value + 1, selectables.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
  } else if (e.key === 'Enter' && focusedIndex.value >= 0) {
    e.preventDefault()
    select(selectables[focusedIndex.value] as DropdownOption)
  } else if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
  dropdownRef.value?.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  dropdownRef.value?.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="relative inline-flex w-full flex-col" ref="dropdownRef">
    <!-- Trigger -->
    <slot
      name="trigger"
      :toggle="toggle"
      :isOpen="isOpen"
      :selectedLabel="selectedLabel"
      :disabled="disabled"
    >
      <button
        type="button"
        :disabled="disabled"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
        @click="toggle"
        class="inline-flex w-full items-center gap-2 rounded-field border border-border bg-field text-field-foreground shadow-field outline-none transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-disabled disabled:cursor-not-allowed hover:border-muted"
        :class="[
          sizeClasses,
          variantClasses,
          { 'border-accent ring-2 ring-focus ring-offset-2 ring-offset-background': isOpen },
        ]"
      >
        <span v-if="$slots['leading-icon']" class="flex items-center text-muted">
          <slot name="leading-icon" />
        </span>

        <span class="flex-1 truncate text-left" :class="!selectedLabel ? 'text-muted' : ''">
          {{ selectedLabel || placeholder }}
        </span>

        <span
          class="flex items-center text-muted transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
    </slot>

    <!-- Panel — teleported to body to escape any overflow/relative ancestor -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-1 scale-[0.98]"
      >
        <div
          v-if="isOpen"
          ref="panelRef"
          role="listbox"
          class="fixed z-50 max-h-72 overflow-y-auto rounded-lg border border-border bg-overlay text-overlay-foreground shadow-overlay p-1"
          :style="panelStyle"
        >
          <!-- Search -->
          <div
            v-if="searchable"
            class="flex items-center gap-2 px-2.5 py-1.5 mb-1 border-b border-separator"
          >
            <svg
              class="text-muted shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="flex-1 bg-transparent border-none outline-none text-sm text-field-foreground placeholder:text-muted"
              @click.stop
            />
          </div>

          <!-- Header slot -->
          <div
            v-if="$slots.header"
            class="px-2.5 py-1.5 text-xs text-muted border-b border-separator mb-1"
          >
            <slot name="header" />
          </div>

          <!-- List -->
          <ul class="flex flex-col gap-px list-none m-0 p-0">
            <li
              v-if="filteredOptions.length === 0"
              class="px-2.5 py-4 text-center text-sm text-muted"
            >
              <slot name="empty">No options found</slot>
            </li>

            <template
              v-for="(item, index) in filteredOptions.filter((option) => !option.hidden)"
              :key="'value' in item ? item.value : index"
            >
              <!-- Group label -->
              <li
                v-if="item.group"
                class="px-2.5 pt-1.5 pb-0.5 text-[11px] font-semibold uppercase tracking-widest text-muted"
              >
                {{ item.group }}
              </li>

              <!-- Option — RouterLink -->
              <RouterLink
                v-else-if="!item.group && item.to"
                :to="item.to"
                @click="!item.disabled && select(item)"
                @mouseenter="focusedIndex = index"
                class="flex items-center justify-between px-2.5 py-2 rounded-md text-sm select-none transition-colors duration-100 no-underline"
                :class="[
                  item.disabled
                    ? 'opacity-disabled cursor-not-allowed pointer-events-none'
                    : 'cursor-pointer',
                  isSelected(item)
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'hover:bg-default text-overlay-foreground',
                ]"
              >
                <span
                  :class="['flex flex-col font-medium flex-1 overflow-hidden', item.class ?? '']"
                >
                  <span class="truncate">{{ item.label }}</span>
                  <span v-if="item.description" class="text-xs text-muted truncate">{{
                    item.description
                  }}</span>
                </span>
                <span :class="['text-muted', item.class ?? '']" v-if="item.icon">
                  <component :is="item.icon" />
                </span>
              </RouterLink>

              <!-- Option — external href -->
              <a
                v-else-if="!item.group && item.href"
                :href="item.href"
                rel="noopener noreferrer"
                @click="!item.disabled && select(item)"
                @mouseenter="focusedIndex = index"
                class="flex font-medium items-center justify-between px-2.5 py-2 rounded-md text-sm select-none transition-colors duration-100 no-underline"
                :class="[
                  item.disabled
                    ? 'opacity-disabled cursor-not-allowed pointer-events-none'
                    : 'cursor-pointer',
                  'hover:bg-default text-overlay-foreground',
                ]"
              >
                <span class="flex flex-col flex-1 overflow-hidden">
                  <span class="truncate font-medium">{{ item.label }}</span>
                  <span v-if="item.description" class="text-xs text-muted truncate">{{
                    item.description
                  }}</span>
                </span>
                <span class="text-muted" v-if="item.icon">
                  <component :is="item.icon" />
                </span>
              </a>

              <!-- Option — action / value -->
              <li
                v-else
                role="option"
                :aria-selected="isSelected(item)"
                :aria-disabled="item.disabled"
                @click="!item.disabled && select(item)"
                @mouseenter="focusedIndex = index"
                class="flex items-center gap-2 px-2.5 py-2 rounded-md text-sm select-none transition-colors duration-100"
                :class="[
                  item.disabled ? 'opacity-disabled cursor-not-allowed' : 'cursor-pointer',
                  isSelected(item) ? 'bg-accent/10 text-accent font-medium' : 'hover:bg-default',
                ]"
              >
                <span
                  :class="[
                    'flex flex-col flex-1 overflow-hidden font-medium',
                    item.class ?? '',
                    item.disabled ? 'text-muted' : '',
                  ]"
                >
                  <span class="truncate">{{ item.label }}</span>
                  <span v-if="item.description" class="text-xs text-muted truncate">{{
                    item.description
                  }}</span>
                </span>
                <span
                  v-if="isSelected(item)"
                  class="flex items-center text-accent shrink-0 ml-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span :class="[item.class ?? 'text-muted']" v-if="item.icon">
                  <component :is="item.icon" />
                </span>
              </li>
            </template>
          </ul>

          <!-- Footer slot -->
          <div
            v-if="$slots.footer"
            class="px-2.5 py-1.5 text-xs text-muted border-t border-separator mt-1"
          >
            <slot name="footer" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
