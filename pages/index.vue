<script setup lang="ts">
const { user } = useAuth()
const api = useApi()

const stats = ref({ pemilihanAktif: 0, pemilihanTotal: 0, legislasiTotal: 0, suaraHariIni: 0 })
const pemilihanAktif = ref<any[]>([])

onMounted(async () => {
  try {
    const [p] = await Promise.all([
      api.get<any[]>('/pemilihan/aktif'),
    ])
    pemilihanAktif.value = p || []
    stats.value.pemilihanAktif = pemilihanAktif.value.length
  } catch {}
  try { const r = await api.get<any>('/pemilihan?per_page=1') } catch {}
  try { const r = await api.get<any>('/legislasi?per_page=1') } catch {}
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Selamat datang, {{ user?.nama }}</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AppCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-primary-100">
            <Icon name="lucide:vote" class="size-5 text-primary-700" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pemilihanAktif }}</p>
            <p class="text-xs text-gray-500">Pemilihan Aktif</p>
          </div>
        </div>
      </AppCard>

      <AppCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-secondary-100">
            <Icon name="lucide:scale" class="size-5 text-secondary-700" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500">Legislasi Aktif</p>
          </div>
        </div>
      </AppCard>

      <AppCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-green-100">
            <Icon name="lucide:check-circle" class="size-5 text-green-700" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500">Legislasi Disetujui</p>
          </div>
        </div>
      </AppCard>

      <AppCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-yellow-100">
            <Icon name="lucide:users" class="size-5 text-yellow-700" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">14</p>
            <p class="text-xs text-gray-500">Total Pengguna</p>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Active Elections -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Pemilihan yang Sedang Berlangsung</h2>
        <NuxtLink to="/pemilihan">
          <AppButton variant="ghost" size="sm">Lihat Semua</AppButton>
        </NuxtLink>
      </div>

      <div v-if="!pemilihanAktif.length" class="text-center py-12 text-gray-500">
        <Icon name="lucide:inbox" class="size-12 mx-auto mb-3 text-gray-300" />
        <p class="text-sm">Belum ada pemilihan aktif</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink v-for="p in pemilihanAktif" :key="p.id" :to="`/pemilihan/${p.id}`" class="block">
          <AppCard class="!p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900">{{ p.judul }}</h3>
                <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ p.deskripsi || 'Tidak ada deskripsi' }}</p>
              </div>
              <AppBadge variant="success">Aktif</AppBadge>
            </div>
            <div class="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <span class="flex items-center gap-1"><Icon name="lucide:users" class="size-3" /> {{ p.jumlah_suara || 0 }} suara</span>
              <span class="flex items-center gap-1"><Icon name="lucide:user-check" class="size-3" /> {{ p.kandidat?.length || 0 }} kandidat</span>
            </div>
          </AppCard>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
