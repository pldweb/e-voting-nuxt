<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Icon } from '@iconify/vue'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'radix-vue'

interface Props { open?: boolean; title?: string; description?: string; class?: string; maxWidth?: string }
const props = withDefaults(defineProps<Props>(), { maxWidth: 'max-w-lg' })
const emit = defineEmits<{ 'update:open': [v: boolean] }>()
const isOpen = computed({
  get: () => props.open ?? false,
  set: (v) => emit('update:open', v),
})
</script>
<template>
  <DialogRoot :open="isOpen" @update:open="isOpen = $event">
    <DialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <DialogContent :class="cn('fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 shadow-lg w-full', maxWidth, props.class)">
        <DialogClose class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"><Icon icon="lucide:x" class="size-4" /></DialogClose>
        <DialogTitle v-if="title" class="text-lg font-semibold">{{ title }}</DialogTitle>
        <DialogDescription v-if="description" class="text-sm text-gray-500 mt-1">{{ description }}</DialogDescription>
        <div class="mt-4"><slot /></div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
