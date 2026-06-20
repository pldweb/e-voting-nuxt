<script setup lang="ts">
import { cn } from '~/lib/utils'
interface Props { modelValue?: string; placeholder?: string; label?: string; error?: string; rows?: number; class?: string }
const props = withDefaults(defineProps<Props>(), { rows: 4 })
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
const local = computed({ get: () => props.modelValue ?? '', set: (v) => emit('update:modelValue', v) })
</script>
<template>
  <div :class="cn('space-y-1', props.class)">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <textarea v-model="local" :placeholder="placeholder" :rows="rows" :class="cn('flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50', error && 'border-red-500 focus:ring-red-500')" />
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
