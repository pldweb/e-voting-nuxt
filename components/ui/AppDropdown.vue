<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Icon } from '@iconify/vue'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'radix-vue'

interface Item { label: string; icon?: string; action?: () => void; danger?: boolean; separator?: boolean }
interface Props { items: Item[]; class?: string }
defineProps<Props>()
</script>
<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child><slot /></DropdownMenuTrigger>
    <DropdownMenuContent :class="cn('z-50 min-w-[180px] rounded-md border border-gray-200 bg-white py-1 shadow-lg', props.class)">
      <template v-for="(item, i) in items" :key="i">
        <DropdownMenuSeparator v-if="item.separator" class="my-1 h-px bg-gray-200" />
        <DropdownMenuItem v-else :class="cn('flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100', item.danger && 'text-red-600 hover:bg-red-50')" @click="item.action?.()">
          <Icon v-if="item.icon" :icon="item.icon" class="size-4" />
          {{ item.label }}
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>
