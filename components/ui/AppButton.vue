<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { Icon } from '@iconify/vue'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-500',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-primary-600',
        ghost: 'hover:bg-gray-100 focus-visible:ring-primary-600',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base rounded-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface Props extends PrimitiveProps {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  icon?: string
  loading?: boolean
  class?: string
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)"
    :disabled="loading"
  >
    <span v-if="loading" class="i-lucide-loader-circle animate-spin size-4" />
    <Icon v-else-if="icon" :icon="icon" class="size-4" />
    <slot />
  </Primitive>
</template>
