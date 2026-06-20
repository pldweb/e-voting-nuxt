<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Icon } from '@iconify/vue'

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  icon?: string
  error?: string
  label?: string
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), { type: 'text' })
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const localValue = computed({
  get: () => props.modelValue ?? '',
  set: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <div :class="cn('space-y-1', props.class)">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="relative">
      <Icon v-if="icon" :icon="icon" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
      <input
        v-model="localValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          icon && 'pl-10',
          error && 'border-red-500 focus:ring-red-500'
        )"
      />
    </div>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
