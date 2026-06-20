<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Icon } from '@iconify/vue'
interface Props { class?: string; icon?: string; size?: 'sm' | 'md' | 'lg' }
withDefaults(defineProps<Props>(), { size: 'md' })
const sizeMap = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-12 text-base' }
</script>
<template>
  <div :class="cn('relative flex shrink-0 overflow-hidden rounded-full bg-gray-200', sizeMap[size], $props.class)">
    <Icon v-if="icon" :icon="icon" class="size-full text-gray-500 m-auto" />
    <span v-else class="flex h-full w-full items-center justify-center font-medium text-gray-600"><slot /></span>
  </div>
</template>
