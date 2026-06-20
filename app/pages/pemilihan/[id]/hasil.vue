<script setup lang="ts">
import { Icon } from '@iconify/vue'

const store = usePemilihanStore()
const route = useRoute()
const id = computed(() => Number(route.params.id))

const data = ref<Pemilihan | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    data.value = await store.fetchHasil(id.value)
  } catch {}
  loading.value = false
})

function formatDate(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <NuxtLink :to="`/pemilihan/${id}`" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
      <Icon icon="lucide:arrow-left" class="size-4" /> Kembali ke Detail
    </NuxtLink>

    <div v-if="loading" class="space-y-4">
      <div class="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
      <div class="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
    </div>

    <template v-else-if="data">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Hasil: {{ data.judul }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ data.deskripsi }}</p>
      </div>

      <!-- Donut Chart -->
      <AppCard>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Sebaran Suara</h3>
        <BaseChart
          v-if="data.kandidat?.length"
          type="donut"
          :labels="data.kandidat.map(k => k.nama)"
          :datasets="[{
            data: data.kandidat.map(k => k.jumlah_suara),
            backgroundColor: ['#017C3D', '#FF6916', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B']
          }]"
          height="240"
        />
        <p v-else class="text-sm text-gray-400 text-center py-8">Belum ada data</p>
      </AppCard>

      <!-- Ranking Table -->
      <AppCard v-if="data.kandidat?.length">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Perolehan Suara</h3>
        <div class="space-y-3">
          <div v-for="(k, i) in data.kandidat" :key="k.id" class="flex items-center gap-3">
            <span
              class="flex size-7 items-center justify-center rounded-full text-xs font-bold"
              :class="i === 0 ? 'bg-yellow-100 text-yellow-800' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-400'"
            >
              {{ i + 1 }}
            </span>
            <span class="flex-1 text-sm text-gray-700 dark:text-gray-300">{{ k.nama }}</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ k.jumlah_suara }} suara</span>
            <div class="w-32 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                class="h-full rounded-full bg-primary-500 transition-all duration-500"
                :style="{ width: (data.kandidat.reduce((a:number,b:any)=>a+b.jumlah_suara,0) > 0 ? Math.round((k.jumlah_suara / data.kandidat.reduce((a:number,b:any)=>a+b.jumlah_suara,0)) * 100) : 0) + '%' }"
              />
            </div>
            <span class="text-xs text-gray-500 w-10 text-right">
              {{ data.kandidat.reduce((a:number,b:any)=>a+b.jumlah_suara,0) > 0 ? Math.round((k.jumlah_suara / data.kandidat.reduce((a:number,b:any)=>a+b.jumlah_suara,0)) * 100) : 0 }}%
            </span>
          </div>
        </div>
      </AppCard>
    </template>

    <AppAlert v-else variant="warning">Data hasil tidak tersedia</AppAlert>
  </div>
</template>
