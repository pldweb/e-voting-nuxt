<script setup lang="ts">
import { cn } from '~/lib/utils'
import { cva } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-800',
        secondary: 'bg-secondary-100 text-secondary-800',
        outline: 'border border-gray-300 text-gray-700',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

interface Props { variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'; class?: string }
withDefaults(defineProps<Props>(), { variant: 'default' })
</script>
<template>
  <span :class="cn(badgeVariants({ variant: $props.variant }), $props.class)"><slot /></span>
</template>
