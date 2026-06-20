<script setup lang="ts">
const route = useRoute()
const api = useApi()
const id = route.params.id as string

const hasil = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    hasil.value = await api.get<any>(`/pemilihan/${id}/hasil`)
  } catch {} finally { loading.value = false }
})

const maxSuara = computed(() => {
  if (!hasil.value?.kandidat?.length) return 1
  return Math.max(...hasil.value.kandidat.map((k: any) => k.jumlah_suara), 1)
})
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <div>
      <NuxtLink :to="`/pemilihan/${id}`" class="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-2">
        <Icon name="lucide:arrow-left" class="size-3" /> Kembali ke Pemilihan
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Hasil Pemilihan</h1>
      <p class="text-sm text-gray-500 mt-1" v-if="hasil">{{ hasil.judul }}</p>
    </div>

    <AppCard v-if="loading">
      <div class="space-y-4 animate-pulse">
        <div v-for="i in 3" :key="i" class="space-y-2">
          <div class="h-5 w-48 bg-gray-200 rounded" />
          <div class="h-3 bg-gray-200 rounded" />
        </div>
      </div>
    </AppCard>

    <AppCard v-else-if="hasil">
      <div class="text-center mb-6">
        <p class="text-3xl font-bold text-gray-900">{{ hasil.total_suara }}</p>
        <p class="text-sm text-gray-500">Total Suara</p>
      </div>

      <div class="space-y-5">
        <div v-for="k in hasil.kandidat" :key="k.id">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-gray-900">{{ k.nama }}</span>
            <span class="text-sm text-gray-600">{{ k.jumlah_suara }} suara ({{ hasil.total_suara ? Math.round(k.jumlah_suara / hasil.total_suara * 100) : 0 }}%)</span>
          </div>
          <div class="h-3 rounded-full bg-gray-100 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="k.jumlah_suara === maxSuara ? 'bg-primary-600' : 'bg-secondary-400'"
              :style="{ width: `${hasil.total_suara ? (k.jumlah_suara / maxSuara) * 100 : 0}%` }"
            />
          </div>
        </div>
      </div>
    </AppCard>

    <div v-else class="text-center py-12 text-gray-500">Hasil tidak tersedia</div>
  </div>
</template>
