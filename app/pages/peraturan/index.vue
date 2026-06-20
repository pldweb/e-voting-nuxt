<script setup lang="ts">
import { Icon } from '@iconify/vue'

const store = usePeraturanStore()
const auth = useAuthStore()
const router = useRouter()

const tabs = [
  { key: '', label: 'Semua' },
  { key: 'draf', label: 'Draf' },
  { key: 'aktif', label: 'Aktif' },
  { key: 'disetujui', label: 'Disetujui' },
  { key: 'ditutup', label: 'Ditutup' },
]
const tipeFilters = [
  { key: '', label: 'Semua Tipe' },
  { key: 'UU', label: 'UU' },
  { key: 'PERPU', label: 'PERPU' },
  { key: 'PP', label: 'PP' },
]

const activeTab = ref('')
const activeTipe = ref('')
const search = ref('')
const page = ref(1)

async function load() {
  await store.fetchList({
    status: activeTab.value || undefined,
    tipe: activeTipe.value || undefined,
    page: page.value,
    search: search.value || undefined,
  })
}

watch([activeTab, activeTipe], () => { page.value = 1; load() })
watch(page, load)
onMounted(load)

const statusVariant: Record<string, string> = {
  draf: 'default',
  aktif: 'success',
  disetujui: 'success',
  ditutup: 'danger',
  ditolak: 'danger',
}
const statusLabel: Record<string, string> = {
  draf: 'Draf',
  aktif: 'Aktif',
  disetujui: 'Disetujui',
  ditutup: 'Ditutup',
  ditolak: 'Ditolak',
}
const tipeColor: Record<string, string> = {
  UU: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  PERPU: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  PP: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
}

function formatDate(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Peraturan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Daftar legislasi dan peraturan</p>
      </div>
      <button v-if="auth.isSuperAdmin" class="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700" @click="router.push('/peraturan/buat')">
        <Icon icon="lucide:plus" class="size-4" /> Buat Peraturan
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

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <div class="max-w-xs">
        <div class="relative">
          <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input v-model="search" placeholder="Cari peraturan..." class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" @input="page = 1; load()" />
        </div>
      </div>
      <div class="flex gap-2">
        <button
          v-for="tf in tipeFilters"
          :key="tf.key"
          :class="[
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            activeTipe === tf.key
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800',
          ]"
          @click="activeTipe = tf.key"
        >
          {{ tf.label }}
        </button>
      </div>
    </div>

    <!-- List -->
    <div v-if="store.loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-24 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </div>

    <div v-else-if="!store.list.length" class="text-center py-16">
      <Icon icon="lucide:inbox" class="size-14 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
      <p class="text-gray-500 dark:text-gray-400">Belum ada peraturan</p>
    </div>

    <div v-else class="space-y-3">
      <NuxtLink
        v-for="p in store.list"
        :key="p.id"
        :to="`/peraturan/${p.id}`"
        class="block rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span :class="['rounded px-2 py-0.5 text-[10px] font-bold', tipeColor[p.tipe] || 'bg-gray-100 text-gray-600']">
                {{ p.tipe }}
              </span>
              <AppBadge :variant="(statusVariant[p.status] as any) || 'default'">
                {{ statusLabel[p.status] || p.status }}
              </AppBadge>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ p.judul }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ p.deskripsi || 'Tidak ada deskripsi' }}</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1"><Icon icon="lucide:thumbs-up" class="size-3" /> {{ p.total_setuju ?? 0 }}</span>
          <span class="flex items-center gap-1"><Icon icon="lucide:thumbs-down" class="size-3" /> {{ p.total_tidak_setuju ?? 0 }}</span>
          <span v-if="p.partisipasi_persen != null">Partisipasi: {{ p.partisipasi_persen }}%</span>
          <span v-if="p.voting_dimulai" class="flex items-center gap-1"><Icon icon="lucide:calendar" class="size-3" /> {{ formatDate(p.voting_dimulai) }}</span>
        </div>
      </NuxtLink>
    </div>

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
