<script setup lang="ts">
import { Icon } from '@iconify/vue'

const auth = useAuthStore()
const dashboard = useDashboardStore()

// Initial load
onMounted(async () => {
  await dashboard.loadDashboard()
  dashboard.startPolling(5000)
})

onUnmounted(() => {
  dashboard.stopPolling()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Selamat datang, {{ auth.user?.nama }}</p>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Pemilihan Aktif -->
      <AppCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
            <Icon icon="lucide:vote" class="size-5 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ dashboard.pemilihanStats?.total_pemilihan_aktif ?? '-' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Pemilihan Aktif</p>
          </div>
        </div>
      </AppCard>

      <!-- Suara Hari Ini -->
      <AppCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
            <Icon icon="lucide:check-check" class="size-5 text-green-700 dark:text-green-300" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ dashboard.pemilihanStats?.total_suara_hari_ini ?? '-' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Suara Hari Ini</p>
          </div>
        </div>
      </AppCard>

      <!-- Peraturan Voting -->
      <AppCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-950">
            <Icon icon="lucide:scale" class="size-5 text-yellow-700 dark:text-yellow-300" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ dashboard.peraturanStats?.total_peraturan_voting ?? '-' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Peraturan Voting</p>
          </div>
        </div>
      </AppCard>

      <!-- Peraturan Disetujui -->
      <AppCard class="!p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950">
            <Icon icon="lucide:badge-check" class="size-5 text-primary-700 dark:text-primary-300" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ dashboard.peraturanStats?.total_peraturan_disetujui ?? '-' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Peraturan Disetujui</p>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Donut Chart Hasil Kandidat (dari pemilihan pertama yang aktif) -->
      <AppCard>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Hasil Kandidat</h3>
        <BaseChart
          v-if="dashboard.pemilihanStats?.pemilihan_aktif?.[0]?.kandidat?.length"
          type="donut"
          :labels="dashboard.pemilihanStats.pemilihan_aktif[0].kandidat.map(k => k.nama)"
          :datasets="[{
            data: dashboard.pemilihanStats.pemilihan_aktif[0].kandidat.map(k => k.jumlah_suara),
            backgroundColor: ['#017C3D', '#FF6916', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B']
          }]"
          height="220"
        />
        <p v-else class="text-sm text-gray-400 text-center py-8">Belum ada data hasil kandidat</p>
      </AppCard>

      <!-- Ranking Kandidat -->
      <AppCard>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Ranking Kandidat</h3>
        <div v-if="dashboard.pemilihanStats?.pemilihan_aktif?.[0]?.kandidat?.length" class="space-y-3">
          <div
            v-for="(k, i) in dashboard.pemilihanStats.pemilihan_aktif[0].kandidat"
            :key="k.id"
            class="flex items-center gap-3"
          >
            <span class="flex size-6 items-center justify-center rounded-full text-xs font-bold"
              :class="i === 0 ? 'bg-yellow-100 text-yellow-800' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-50 text-gray-400'"
            >
              {{ i + 1 }}
            </span>
            <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{{ k.nama }}</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ k.jumlah_suara }}</span>
            <div class="w-24 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                class="h-full rounded-full bg-primary-500 transition-all duration-500"
                :style="{ width: Math.round((k.jumlah_suara / Math.max(...dashboard.pemilihanStats!.pemilihan_aktif[0].kandidat.map(x => x.jumlah_suara), 1)) * 100) + '%' }"
              />
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400 text-center py-8">Belum ada data kandidat</p>
      </AppCard>
    </div>

    <!-- Statistik Wilayah -->
    <AppCard>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Statistik Wilayah</h3>
      <div v-if="dashboard.pemilihanStats?.statistik_wilayah && Object.keys(dashboard.pemilihanStats.statistik_wilayah).length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b dark:border-gray-800">
              <th class="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Wilayah</th>
              <th class="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Suara Masuk</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(jumlah, nama) in dashboard.pemilihanStats.statistik_wilayah" :key="nama" class="border-b dark:border-gray-800 last:border-0">
              <td class="py-2.5 px-3 text-gray-900 dark:text-gray-100">{{ nama }}</td>
              <td class="py-2.5 px-3 text-gray-600 dark:text-gray-400">{{ jumlah }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-sm text-gray-400 text-center py-8">Belum ada statistik wilayah</p>
    </AppCard>

    <!-- Peraturan Detail -->
    <AppCard v-if="dashboard.peraturanStats?.detail?.length">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Detail Peraturan</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b dark:border-gray-800">
              <th class="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Judul</th>
              <th class="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Tipe</th>
              <th class="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th class="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Setuju</th>
              <th class="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Tidak Setuju</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in dashboard.peraturanStats.detail" :key="p.id" class="border-b dark:border-gray-800 last:border-0">
              <td class="py-2.5 px-3 text-gray-900 dark:text-gray-100 max-w-48 truncate">{{ p.judul }}</td>
              <td class="py-2.5 px-3">
                <AppBadge :variant="p.tipe === 'uu' ? 'primary' : p.tipe === 'perpu' ? 'warning' : 'default'" size="sm">
                  {{ p.tipe.toUpperCase() }}
                </AppBadge>
              </td>
              <td class="py-2.5 px-3">
                <AppBadge :variant="p.status === 'voting' ? 'info' : p.status === 'disetujui' ? 'success' : 'default'" size="sm">
                  {{ p.status }}
                </AppBadge>
              </td>
              <td class="py-2.5 px-3 text-green-600 font-medium">{{ p.jumlah_setuju }}</td>
              <td class="py-2.5 px-3 text-red-600">{{ p.jumlah_tidak_setuju }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>
