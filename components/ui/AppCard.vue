<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Props {
  class?: string
  padding?: boolean
}

withDefaults(defineProps<Props>(), { padding: true })
</script>

<template>
  <div :class="cn('rounded-lg border border-gray-200 bg-white shadow-sm', padding && 'p-6', $props.class)">
    <slot />
  </div>
</template>
