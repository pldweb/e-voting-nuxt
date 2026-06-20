<script setup lang="ts">
import { Icon } from '@iconify/vue'

const store = usePemilihanStore()
const auth = useAuthStore()
const router = useRouter()

const tabs = [
  { key: '', label: 'Semua' },
  { key: 'draf', label: 'Draf' },
  { key: 'aktif', label: 'Aktif' },
  { key: 'ditutup', label: 'Ditutup' },
]
const activeTab = ref('')

const search = ref('')
const page = ref(1)

const columns = [
  { key: 'judul', label: 'Judul Pemilihan' },
  { key: 'status', label: 'Status' },
  { key: 'kandidat_count', label: 'Kandidat' },
  { key: 'periode', label: 'Periode' },
  { key: 'aksi', label: 'Aksi' },
]

async function load() {
  await store.fetchList({ status: activeTab.value || undefined, page: page.value, search: search.value || undefined })
}

watch(activeTab, () => { page.value = 1; load() })
watch(page, load)
onMounted(load)

function formatDate(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusVariant: Record<string, string> = {
  draf: 'default',
  aktif: 'success',
  ditutup: 'danger',
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Pemilihan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Daftar pemilihan yang tersedia</p>
      </div>
      <button v-if="auth.isSuperAdmin" class="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700" @click="router.push('/pemilihan/buat')">
        <Icon icon="lucide:plus" class="size-4" /> Buat Pemilihan
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          activeTab === tab.key ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Search -->
    <div class="max-w-sm">
      <div class="relative">
        <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input v-model="search" placeholder="Cari pemilihan..." class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" @input="page = 1; load()" />
      </div>
    </div>

    <!-- List -->
    <div v-if="store.loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-24 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </div>

    <div v-else-if="!store.list.length" class="text-center py-16">
      <Icon icon="lucide:inbox" class="size-14 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
      <p class="text-gray-500 dark:text-gray-400">Belum ada pemilihan</p>
    </div>

    <div v-else class="space-y-3">
      <NuxtLink
        v-for="p in store.list"
        :key="p.id"
        :to="`/pemilihan/${p.id}`"
        class="block rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ p.judul }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ p.deskripsi || 'Tidak ada deskripsi' }}</p>
          </div>
          <AppBadge :variant="(statusVariant[p.status] as any) || 'default'">
            {{ p.status === 'draf' ? 'Draf' : p.status === 'aktif' ? 'Aktif' : 'Ditutup' }}
          </AppBadge>
        </div>
        <div class="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1"><Icon icon="lucide:users" class="size-3" /> {{ p.kandidat?.length ?? 0 }} kandidat</span>
          <span v-if="p.dimulai" class="flex items-center gap-1"><Icon icon="lucide:calendar" class="size-3" /> {{ formatDate(p.dimulai) }} — {{ formatDate(p.berakhir) }}</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Pagination -->
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
