<script setup lang="ts">
const route = useRoute()
const api = useApi()
const { user } = useAuth()

const id = route.params.id as string
const pemilihan = ref<any>(null)
const loading = ref(true)
const voting = ref(false)
const voteError = ref('')
const selectedKandidat = ref<string[]>([])

onMounted(async () => {
  try {
    pemilihan.value = await api.get<any>(`/pemilihan/${id}`)
  } catch {} finally { loading.value = false }
})

function toggleKandidat(kid: string) {
  if (pemilihan.value?.tipe === 'tunggal') {
    selectedKandidat.value = [kid]
  } else {
    const idx = selectedKandidat.value.indexOf(kid)
    if (idx >= 0) selectedKandidat.value.splice(idx, 1)
    else selectedKandidat.value.push(kid)
  }
}

async function kirimSuara() {
  if (!selectedKandidat.value.length) return
  voteError.value = ''
  voting.value = true
  try {
    await api.post(`/pemilihan/${id}/suara`, { kandidat_ids: selectedKandidat.value })
    // Refresh data
    pemilihan.value = await api.get<any>(`/pemilihan/${id}`)
    selectedKandidat.value = []
  } catch (e: any) {
    voteError.value = e.message
  } finally { voting.value = false }
}

const statusVariant = (s: string) => {
  const map: Record<string, string> = { draf: 'warning', aktif: 'success', ditutup: 'outline' }
  return map[s] || 'outline'
}
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <div>
      <NuxtLink to="/pemilihan" class="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-2">
        <Icon name="lucide:arrow-left" class="size-3" /> Kembali
      </NuxtLink>
    </div>

    <div v-if="loading" class="space-y-4">
      <div class="h-8 w-64 bg-gray-200 rounded animate-pulse" />
      <div class="h-4 w-96 bg-gray-200 rounded animate-pulse" />
    </div>

    <template v-else-if="pemilihan">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ pemilihan.judul }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ pemilihan.deskripsi || 'Tidak ada deskripsi' }}</p>
        </div>
        <AppBadge :variant="statusVariant(pemilihan.status)">{{ pemilihan.status }}</AppBadge>
      </div>

      <!-- Info -->
      <div class="grid grid-cols-3 gap-4">
        <AppCard class="!p-3 text-center">
          <p class="text-xs text-gray-500">Tipe</p>
          <p class="font-semibold">{{ pemilihan.tipe === 'tunggal' ? 'Tunggal' : 'Ganda' }}</p>
        </AppCard>
        <AppCard class="!p-3 text-center">
          <p class="text-xs text-gray-500">Total Suara</p>
          <p class="font-semibold">{{ pemilihan.jumlah_suara || 0 }}</p>
        </AppCard>
        <AppCard class="!p-3 text-center">
          <p class="text-xs text-gray-500">Kandidat</p>
          <p class="font-semibold">{{ pemilihan.kandidat?.length || 0 }}</p>
        </AppCard>
      </div>

      <!-- Vote Error -->
      <AppAlert v-if="voteError" variant="danger" icon="lucide:alert-circle" class="animate-in">
        {{ voteError }}
      </AppAlert>

      <!-- Vote section / Candidates -->
      <div>
        <h2 class="text-lg font-semibold mb-4">Kandidat</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="k in pemilihan.kandidat"
            :key="k.id"
            :class="[
              'rounded-lg border-2 p-5 cursor-pointer transition-all',
              selectedKandidat.includes(k.id)
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            ]"
            @click="pemilihan.status === 'aktif' && toggleKandidat(k.id)"
          >
            <div class="flex items-start gap-4">
              <div class="flex size-12 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">
                {{ k.nama.charAt(0) }}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ k.nama }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ k.deskripsi || 'Tidak ada deskripsi' }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ k.jumlah_suara || 0 }} suara</p>
              </div>
              <div v-if="pemilihan.status === 'aktif'" :class="[
                'flex size-6 items-center justify-center rounded-full border-2',
                selectedKandidat.includes(k.id) ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
              ]">
                <Icon v-if="selectedKandidat.includes(k.id)" name="lucide:check" class="size-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Vote button -->
        <div v-if="pemilihan.status === 'aktif' && selectedKandidat.length" class="mt-6 flex gap-3">
          <AppButton :loading="voting" @click="kirimSuara">
            Kirim Suara ({{ selectedKandidat.length }} dipilih)
          </AppButton>
          <AppButton variant="ghost" @click="selectedKandidat = []">Batal</AppButton>
        </div>
      </div>

      <!-- Hasil link -->
      <div class="flex gap-3 pt-4 border-t">
        <NuxtLink :to="`/pemilihan/${id}/hasil`">
          <AppButton variant="secondary" icon="lucide:bar-chart-3">Lihat Hasil</AppButton>
        </NuxtLink>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Pemilihan tidak ditemukan</p>
    </div>
  </div>
</template>
