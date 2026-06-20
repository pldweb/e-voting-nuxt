<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Icon } from '@iconify/vue'
import { cva } from 'class-variance-authority'

const alertVariants = cva('flex gap-3 rounded-lg border p-4 text-sm', {
  variants: {
    variant: {
      default: 'bg-primary-50 border-primary-200 text-primary-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      danger: 'bg-red-50 border-red-200 text-red-800',
      success: 'bg-green-50 border-green-200 text-green-800',
    }
  },
  defaultVariants: { variant: 'default' }
})
interface Props { variant?: 'default'|'warning'|'danger'|'success'; icon?: string; class?: string }
withDefaults(defineProps<Props>(), { variant: 'default' })
</script>
<template>
  <div :class="cn(alertVariants({ variant: $props.variant }), $props.class)">
    <Icon v-if="icon" :icon="icon" class="size-5 shrink-0 mt-0.5" />
    <div><slot /></div>
  </div>
</template>
