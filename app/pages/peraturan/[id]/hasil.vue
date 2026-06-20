<script setup lang="ts">
import { Icon } from '@iconify/vue'

const store = usePeraturanStore()
const route = useRoute()
const id = computed(() => route.params.id as string)

const data = ref<HasilPeraturan | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    data.value = await store.fetchHasil(id.value)
  } catch {}
  loading.value = false
})
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <NuxtLink :to="`/peraturan/${id}`" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
      <Icon icon="lucide:arrow-left" class="size-4" /> Kembali ke Detail
    </NuxtLink>

    <div v-if="loading" class="space-y-4">
      <div class="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
      <div class="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
    </div>

    <template v-else-if="data">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Hasil: {{ data.judul }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total suara: {{ data.total_suara }}</p>
      </div>

      <!-- Donut Chart -->
      <AppCard>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Sebaran Suara</h3>
        <BaseChart
          type="donut"
          :labels="['Setuju', 'Tidak Setuju']"
          :datasets="[{
            data: [data.jumlah_setuju || 0, data.jumlah_tidak_setuju || 0],
            backgroundColor: ['#017C3D', '#EF4444']
          }]"
          height="240"
        />
      </AppCard>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AppCard class="!p-4 text-center">
          <p class="text-3xl font-bold text-green-600">{{ data.jumlah_setuju ?? 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Setuju</p>
        </AppCard>
        <AppCard class="!p-4 text-center">
          <p class="text-3xl font-bold text-red-600">{{ data.jumlah_tidak_setuju ?? 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Tidak Setuju</p>
        </AppCard>
        <AppCard class="!p-4 text-center">
          <p class="text-3xl font-bold text-gray-500">{{ data.total_suara ?? 0 }}</p>
          <p class="text-xs text-gray-500 mt-1">Total Suara</p>
        </AppCard>
      </div>

      <!-- Percentage Bars -->
      <AppCard>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Persentase</h3>
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-400">Setuju</span>
              <span class="text-sm font-semibold text-green-600">{{ data.persentase_setuju }}%</span>
            </div>
            <div class="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div class="h-full rounded-full bg-green-500 transition-all" :style="{ width: data.persentase_setuju + '%' }" />
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-400">Tidak Setuju</span>
              <span class="text-sm font-semibold text-red-600">{{ data.persentase_tidak_setuju }}%</span>
            </div>
            <div class="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div class="h-full rounded-full bg-red-500 transition-all" :style="{ width: data.persentase_tidak_setuju + '%' }" />
            </div>
          </div>
        </div>
      </AppCard>
    </template>
  </div>
</template>
