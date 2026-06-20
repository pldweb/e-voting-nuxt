<script setup lang="ts">
import { cn } from '~/lib/utils'
import { TabsList, TabsRoot, TabsTrigger } from 'radix-vue'

interface Props { modelValue?: string; tabs: { value: string; label: string; count?: number }[]; class?: string }
const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
const local = computed({ get: () => props.modelValue ?? props.tabs[0]?.value ?? '', set: (v) => emit('update:modelValue', v) })
</script>
<template>
  <TabsRoot :model-value="local" @update:model-value="local = $event" :class="cn('', props.class)">
    <TabsList class="flex gap-2 border-b border-gray-200">
      <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value" :class="cn('px-4 py-2.5 text-sm font-medium border-b-2 border-transparent transition-colors hover:text-gray-700 data-[state=active]:border-primary-600 data-[state=active]:text-primary-700', local === tab.value && 'border-primary-600 text-primary-700')">
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{{ tab.count }}</span>
      </TabsTrigger>
    </TabsList>
  </TabsRoot>
</template>
