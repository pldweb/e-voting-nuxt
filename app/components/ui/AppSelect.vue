<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Icon } from '@iconify/vue'
import { ListboxContent, ListboxItem, ListboxRoot, ListboxTrigger } from 'radix-vue'

interface Props {
  modelValue?: string
  options: { value: string; label: string }[]
  placeholder?: string
  label?: string
  error?: string
  class?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
const localValue = computed({
  get: () => props.modelValue ?? '',
  set: (v) => emit('update:modelValue', v),
})
const selectedLabel = computed(() => props.options.find(o => o.value === localValue.value)?.label)
</script>
<template>
  <div :class="cn('space-y-1', props.class)">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <ListboxRoot v-model="localValue">
      <ListboxTrigger :class="cn('flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm', error && 'border-red-500')">
        <span :class="!localValue && 'text-gray-400'">{{ selectedLabel || placeholder || 'Pilih...' }}</span>
        <Icon icon="lucide:chevron-down" class="size-4 text-gray-400" />
      </ListboxTrigger>
      <ListboxContent class="z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
        <ListboxItem v-for="opt in options" :key="opt.value" :value="opt.value" :class="cn('px-3 py-2 text-sm cursor-pointer hover:bg-primary-50', localValue === opt.value && 'bg-primary-50 text-primary-700 font-medium')">
          {{ opt.label }}
        </ListboxItem>
      </ListboxContent>
    </ListboxRoot>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
