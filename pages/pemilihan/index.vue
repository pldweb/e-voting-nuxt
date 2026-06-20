<script setup lang="ts">
const api = useApi()
const { user } = useAuth()
const router = useRouter()

const pemilihan = ref<any[]>([])
const loading = ref(true)
const tab = ref('semua')

const columns = [
  { key: 'judul', label: 'Judul' },
  { key: 'status', label: 'Status' },
  { key: 'tipe', label: 'Tipe' },
  { key: 'jumlah_suara', label: 'Suara' },
  { key: 'aksi', label: 'Aksi' },
]

const statusVariant = (s: string) => {
  const map: Record<string, string> = { draf: 'warning', aktif: 'success', ditutup: 'outline', arsip: 'outline' }
  return map[s] || 'outline'
}

onMounted(async () => {
  try {
    const data = await api.get<any[]>('/pemilihan')
    pemilihan.value = data || []
  } catch {} finally { loading.value = false }
})

const filtered = computed(() => {
  if (tab.value === 'semua') return pemilihan.value
  return pemilihan.value.filter((p: any) => p.status === tab.value)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pemilihan</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola pemilihan dan voting</p>
      </div>
      <NuxtLink to="/pemilihan/buat">
        <AppButton icon="lucide:plus">Buat Pemilihan</AppButton>
      </NuxtLink>
    </div>

    <AppTabs v-model="tab" :tabs="[
      { value: 'semua', label: 'Semua', count: pemilihan.length },
      { value: 'draf', label: 'Draf' },
      { value: 'aktif', label: 'Aktif' },
      { value: 'ditutup', label: 'Ditutup' },
    ]" />

    <AppTable :columns="columns" :data="filtered" :loading="loading">
      <template #judul="{ row }">
        <NuxtLink :to="`/pemilihan/${row.id}`" class="font-medium text-primary-700 hover:underline">{{ row.judul }}</NuxtLink>
      </template>
      <template #status="{ row }">
        <AppBadge :variant="statusVariant(row.status)">{{ row.status }}</AppBadge>
      </template>
      <template #tipe="{ row }">{{ row.tipe === 'tunggal' ? 'Tunggal' : 'Ganda' }}</template>
      <template #jumlah_suara="{ row }">{{ row.jumlah_suara || 0 }}</template>
      <template #aksi="{ row }">
        <div class="flex gap-2">
          <NuxtLink :to="`/pemilihan/${row.id}`">
            <AppButton variant="outline" size="sm">Detail</AppButton>
          </NuxtLink>
          <NuxtLink v-if="row.status === 'aktif'" :to="`/pemilihan/${row.id}/hasil`">
            <AppButton variant="secondary" size="sm">Hasil</AppButton>
          </NuxtLink>
        </div>
      </template>
    </AppTable>
  </div>
</template>
