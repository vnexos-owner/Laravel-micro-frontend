<script lang="ts" setup>
export type DropdownAlign = 'left' | 'right' | 'center'
export type DropdownPlacement = 'botton' | 'top'

export interface DropdownItem {
    key: string;
    label: string;
    description?: string;
    icon?: unknown
    variant?: 'default' | 'danger'
    disabled?: boolean
    dividerBefore?: boolean
}
</script>

<template>
  <div></div>
</template>
