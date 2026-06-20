<script setup lang="ts">
const route = useRoute()
const api = useApi()
const id = route.params.id as string

const hasil = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try { hasil.value = await api.get<any>(`/legislasi/${id}/hasil`) } catch {} finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <NuxtLink :to="`/legislasi/${id}`" class="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-2 inline-flex">
      <Icon name="lucide:arrow-left" class="size-3" /> Kembali
    </NuxtLink>
    <h1 class="text-2xl font-bold text-gray-900">Hasil Legislasi</h1>
    <p class="text-sm text-gray-500" v-if="hasil">{{ hasil.judul }}</p>

    <AppCard v-if="loading"><div class="animate-pulse space-y-3"><div class="h-20 bg-gray-200 rounded" /></div></AppCard>

    <AppCard v-else-if="hasil">
      <div class="text-center mb-8">
        <p class="text-3xl font-bold">{{ hasil.total_suara }}</p>
        <p class="text-sm text-gray-500">Total Suara</p>
      </div>
      <div class="grid grid-cols-3 gap-6">
        <div class="text-center p-4 rounded-lg bg-green-50">
          <p class="text-3xl font-bold text-green-700">{{ hasil.jumlah_setuju }}</p>
          <p class="text-sm text-green-600">Setuju</p>
          <p class="text-xs text-green-500 mt-1">{{ hasil.persentase_setuju }}%</p>
        </div>
        <div class="text-center p-4 rounded-lg bg-red-50">
          <p class="text-3xl font-bold text-red-700">{{ hasil.jumlah_tidak_setuju }}</p>
          <p class="text-sm text-red-600">Tidak Setuju</p>
          <p class="text-xs text-red-500 mt-1">{{ hasil.persentase_tidak_setuju }}%</p>
        </div>
        <div class="text-center p-4 rounded-lg bg-yellow-50">
          <p class="text-3xl font-bold text-yellow-700">{{ hasil.jumlah_abstain }}</p>
          <p class="text-sm text-yellow-600">Abstain</p>
          <p class="text-xs text-yellow-500 mt-1">{{ hasil.persentase_abstain }}%</p>
        </div>
      </div>
    </AppCard>
  </div>
</template>
