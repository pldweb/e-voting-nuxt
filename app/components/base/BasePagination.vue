<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Icon } from '@iconify/vue'

interface Props {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const pages = computed(() => {
  const p: (number | string)[] = []
  const total = props.lastPage
  const curr = props.currentPage
  if (total <= 7) {
    for (let i = 1; i <= total; i++) p.push(i)
  } else {
    p.push(1)
    if (curr > 3) p.push('...')
    const s = Math.max(2, curr - 1)
    const e = Math.min(total - 1, curr + 1)
    for (let i = s; i <= e; i++) p.push(i)
    if (curr < total - 2) p.push('...')
    p.push(total)
  }
  return p
})
</script>

<template>
  <div :class="cn('flex flex-wrap items-center justify-between gap-4', props.class)">
    <span class="text-sm text-gray-500">Total {{ total }} data · Halaman {{ currentPage }} dari {{ lastPage }}</span>
    <div class="flex items-center gap-1">
      <button
        :disabled="currentPage <= 1"
        class="inline-flex size-9 items-center justify-center rounded-md border text-sm disabled:opacity-40 hover:bg-gray-100"
        @click="emit('update:page', currentPage - 1)"
      >
        <Icon icon="lucide:chevron-left" class="size-4" />
      </button>
      <template v-for="p in pages" :key="p">
        <span v-if="p === '...'" class="px-1 text-gray-400">...</span>
        <button
          v-else
          :class="[
            'inline-flex size-9 items-center justify-center rounded-md text-sm',
            p === currentPage
              ? 'bg-primary-600 text-white font-semibold'
              : 'border hover:bg-gray-100'
          ]"
          @click="emit('update:page', p as number)"
        >
          {{ p }}
        </button>
      </template>
      <button
        :disabled="currentPage >= lastPage"
        class="inline-flex size-9 items-center justify-center rounded-md border text-sm disabled:opacity-40 hover:bg-gray-100"
        @click="emit('update:page', currentPage + 1)"
      >
        <Icon icon="lucide:chevron-right" class="size-4" />
      </button>
    </div>
  </div>
</template>
