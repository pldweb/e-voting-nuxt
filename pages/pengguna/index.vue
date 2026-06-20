<script setup lang="ts">
const api = useApi()

const pengguna = ref<any[]>([])
const loading = ref(true)

const columns = [
  { key: 'nama', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'nip', label: 'NIP' },
  { key: 'jabatan', label: 'Jabatan' },
  { key: 'unit_kerja', label: 'Unit Kerja' },
  { key: 'peran', label: 'Peran' },
]

onMounted(async () => {
  try { pengguna.value = await api.get<any[]>('/pengguna') || [] } catch {} finally { loading.value = false }
})

const peranVariant = (p: string) => {
  const m: Record<string, string> = { superadmin: 'danger', admin: 'secondary', pimpinan: 'default', anggota: 'outline' }
  return m[p] || 'outline'
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Pengguna</h1>
      <p class="text-sm text-gray-500 mt-1">Manajemen pengguna sistem</p>
    </div>

    <AppTable :columns="columns" :data="pengguna" :loading="loading">
      <template #nama="{ row }">
        <div class="flex items-center gap-3">
          <div class="flex size-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
            {{ row.nama?.charAt(0) }}
          </div>
          <span class="font-medium">{{ row.nama }}</span>
        </div>
      </template>
      <template #peran="{ row }"><AppBadge :variant="peranVariant(row.peran)">{{ row.peran }}</AppBadge></template>
    </AppTable>
  </div>
</template>
