<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'admin', middleware: ['role'] })

const store = usePemilihanStore()
const router = useRouter()
const page = ref(1)

onMounted(() => store.fetchList({ page: page.value }))
watch(page, () => store.fetchList({ page: page.value }))

const columns = [
  { key: 'judul', label: 'Judul' },
  { key: 'status', label: 'Status' },
  { key: 'kandidat', label: 'Kandidat' },
  { key: 'total_suara', label: 'Suara' },
  { key: 'aksi', label: 'Aksi', class: 'w-24' },
]

const statusVariant: Record<string, string> = { draf: 'default', aktif: 'success', ditutup: 'danger' }

async function handleDelete(p: Pemilihan) {
  if (!confirm(`Hapus pemilihan "${p.judul}"?`)) return
  try { await store.remove(p.id); await store.fetchList({ page: page.value }) } catch {}
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Pemilihan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manajemen semua pemilihan</p>
      </div>
      <button class="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700" @click="router.push('/pemilihan/buat')">
        <Icon icon="lucide:plus" class="size-4" /> Buat Pemilihan
      </button>
    </div>

    <AppCard class="!p-0 overflow-hidden">
      <AppTable :columns="columns" :data="store.list" :loading="store.loading">
        <template #judul="{ row }">
          <NuxtLink :to="`/pemilihan/${row.id}`" class="text-primary-600 hover:text-primary-800 font-medium">
            {{ row.judul }}
          </NuxtLink>
        </template>
        <template #status="{ row }">
          <AppBadge :variant="(statusVariant[row.status] as any) || 'default'">{{ row.status }}</AppBadge>
        </template>
        <template #kandidat="{ row }">
          {{ row.kandidat?.length ?? 0 }}
        </template>
        <template #total_suara="{ row }">
          {{ row.jumlah_suara ?? 0 }}
        </template>
        <template #aksi="{ row }">
          <div class="flex gap-1">
            <button class="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800" title="Detail" @click="router.push(`/pemilihan/${row.id}`)">
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
