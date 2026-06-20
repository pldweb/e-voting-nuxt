<script setup lang="ts">
const api = useApi()
const legislasi = ref<any[]>([])
const loading = ref(true)
const tab = ref('semua')

const columns = [
  { key: 'judul', label: 'Judul' },
  { key: 'tipe', label: 'Tipe' },
  { key: 'status', label: 'Status' },
  { key: 'pengusul', label: 'Pengusul' },
  { key: 'jumlah_suara', label: 'Suara' },
  { key: 'aksi', label: 'Aksi' },
]

onMounted(async () => {
  try {
    const data = await api.get<any[]>('/legislasi')
    legislasi.value = data || []
  } catch {} finally { loading.value = false }
})

const statusV = (s: string) => {
  const m: Record<string, string> = { draf: 'warning', tinjau: 'secondary', voting: 'default', disetujui: 'success', ditolak: 'danger' }
  return m[s] || 'outline'
}

const filtered = computed(() => {
  if (tab.value === 'semua') return legislasi.value
  return legislasi.value.filter((l: any) => l.status === tab.value)
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Legislasi</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola rancangan undang-undang dan legislasi</p>
      </div>
      <NuxtLink to="/legislasi/buat">
        <AppButton icon="lucide:plus">Buat Legislasi</AppButton>
      </NuxtLink>
    </div>

    <AppTabs v-model="tab" :tabs="[
      { value: 'semua', label: 'Semua', count: legislasi.length },
      { value: 'draf', label: 'Draf' },
      { value: 'voting', label: 'Voting' },
      { value: 'disetujui', label: 'Disetujui' },
    ]" />

    <AppTable :columns="columns" :data="filtered" :loading="loading">
      <template #judul="{ row }">
        <NuxtLink :to="`/legislasi/${row.id}`" class="font-medium text-primary-700 hover:underline">{{ row.judul }}</NuxtLink>
      </template>
      <template #tipe="{ row }">{{ row.tipe?.toUpperCase() }}</template>
      <template #status="{ row }"><AppBadge :variant="statusV(row.status)">{{ row.status }}</AppBadge></template>
      <template #pengusul="{ row }">{{ row.pengusul?.nama || '-' }}</template>
      <template #jumlah_suara="{ row }">{{ row.jumlah_suara || 0 }}</template>
      <template #aksi="{ row }">
        <NuxtLink :to="`/legislasi/${row.id}`"><AppButton variant="outline" size="sm">Detail</AppButton></NuxtLink>
      </template>
    </AppTable>
  </div>
</template>
