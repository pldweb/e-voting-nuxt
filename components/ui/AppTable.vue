<script setup lang="ts">
import { cn } from '~/lib/utils'
interface Column { key: string; label: string; class?: string; sortable?: boolean }
interface Props { columns: Column[]; data: any[]; loading?: boolean; class?: string }
const props = withDefaults(defineProps<Props>(), { loading: false })
const emit = defineEmits<{ 'sort': [key: string] }>()
const sortKey = ref<string | null>(null)
const sortDir = ref<'asc'|'desc'>('asc')
function doSort(key: string) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDir.value = 'asc' }
  emit('sort', key)
}
</script>
<template>
  <div :class="cn('overflow-x-auto rounded-lg border border-gray-200', props.class)">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b bg-gray-50">
          <th v-for="col in columns" :key="col.key" :class="cn('px-4 py-3 text-left font-medium text-gray-600', col.class)">
            <button v-if="col.sortable" class="flex items-center gap-1 hover:text-gray-900" @click="doSort(col.key)">
              {{ col.label }}
              <span v-if="sortKey === col.key" class="text-xs">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
            </button>
            <span v-else>{{ col.label }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading" v-for="i in 3" :key="i" class="border-b"><td v-for="col in columns" :key="col.key" class="px-4 py-3"><div class="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
        <tr v-else-if="!data.length"><td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500">Tidak ada data</td></tr>
        <tr v-else v-for="(row, i) in data" :key="i" class="border-b last:border-0 hover:bg-gray-50 transition-colors">
          <td v-for="col in columns" :key="col.key" :class="cn('px-4 py-3', col.class)"><slot :name="col.key" :row="row" :index="i">{{ row[col.key] }}</slot></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
