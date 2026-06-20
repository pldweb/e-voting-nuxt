<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'admin', middleware: ['role'] })

const store = usePeraturanStore()
const router = useRouter()
const page = ref(1)

onMounted(() => store.fetchList({ page: page.value }))
watch(page, () => store.fetchList({ page: page.value }))

const columns = [
  { key: 'judul', label: 'Judul' },
  { key: 'tipe', label: 'Tipe' },
  { key: 'status', label: 'Status' },
  { key: 'suara', label: 'Suara' },
  { key: 'aksi', label: 'Aksi', class: 'w-24' },
]

const statusVariant: Record<string, string> = { draf: 'default', aktif: 'success', disetujui: 'success', ditutup: 'danger', ditolak: 'danger' }
const tipeColor: Record<string, string> = {
  UU: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  PERPU: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  PP: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
}

async function handleDelete(p: Peraturan) {
  if (!confirm(`Hapus peraturan "${p.judul}"?`)) return
  try { await store.remove(p.id); await store.fetchList({ page: page.value }) } catch {}
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Peraturan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manajemen semua peraturan</p>
      </div>
      <button class="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700" @click="router.push('/peraturan/buat')">
        <Icon icon="lucide:plus" class="size-4" /> Buat Peraturan
      </button>
    </div>

    <AppCard class="!p-0 overflow-hidden">
      <AppTable :columns="columns" :data="store.list" :loading="store.loading">
        <template #judul="{ row }">
          <NuxtLink :to="`/peraturan/${row.id}`" class="text-primary-600 hover:text-primary-800 font-medium">
            {{ row.judul }}
          </NuxtLink>
        </template>
        <template #tipe="{ row }">
          <span :class="['rounded px-2 py-0.5 text-[10px] font-bold', tipeColor[row.tipe] || '']">{{ row.tipe }}</span>
        </template>
        <template #status="{ row }">
          <AppBadge :variant="(statusVariant[row.status] as any) || 'default'">{{ row.status }}</AppBadge>
        </template>
        <template #suara="{ row }">
          <span class="text-green-600">+{{ row.total_setuju ?? 0 }}</span>
          <span class="mx-1 text-gray-300">/</span>
          <span class="text-red-600">-{{ row.total_tidak_setuju ?? 0 }}</span>
          <span class="mx-1 text-gray-300">/</span>
          <span class="text-gray-400">-</span>
        </template>
        <template #aksi="{ row }">
          <div class="flex gap-1">
            <button class="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800" title="Detail" @click="router.push(`/peraturan/${row.id}`)">
              <Icon icon="lucide:eye" class="size-4" />
            </button>
            <button class="rounded p-1 hover:bg-red-50 text-gray-400 hover:text-red-600" title="Hapus" @click="handleDelete(row)">
              <Icon icon="lucide:trash-2" class="size-4" />
            </button>
          </div>
        </template>
      </AppTable>
    </AppCard>

    <BasePagination
      v-if="store.meta.last_page > 1"
      :current-page="store.meta.current_page"
      :last-page="store.meta.last_page"
      :total="store.meta.total"
      :per-page="store.meta.per_page"
      @update:page="page = $event"
    />
  </div>
</template>
