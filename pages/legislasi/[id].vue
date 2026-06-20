<script setup lang="ts">
const route = useRoute()
const api = useApi()
const { user } = useAuth()

const id = route.params.id as string
const legislasi = ref<any>(null)
const loading = ref(true)

const voteForm = ref({ suara: 'setuju', komentar: '' })
const voting = ref(false)
const voteError = ref('')
const voteSuccess = ref('')
const approving = ref(false)

onMounted(async () => {
  try { legislasi.value = await api.get<any>(`/legislasi/${id}`) } catch {} finally { loading.value = false }
})

async function kirimSuara() {
  voteError.value = ''; voteSuccess.value = ''; voting.value = true
  try {
    await api.post(`/legislasi/${id}/suara`, voteForm.value)
    voteSuccess.value = 'Suara berhasil dikirim!'
    legislasi.value = await api.get<any>(`/legislasi/${id}`)
  } catch (e: any) { voteError.value = e.message } finally { voting.value = false }
}

async function setujui() {
  approving.value = true
  try {
    await api.post(`/legislasi/${id}/setujui`)
    legislasi.value = await api.get<any>(`/legislasi/${id}`)
  } catch (e: any) { voteError.value = e.message } finally { approving.value = false }
}

const statusV = (s: string) => {
  const m: Record<string, string> = { draf: 'warning', tinjau: 'secondary', voting: 'default', disetujui: 'success', ditolak: 'danger' }
  return m[s] || 'outline'
}

const canVote = computed(() => legislasi.value?.is_dalam_voting && user.value)
const isAdmin = computed(() => user.value?.peran === 'superadmin' || user.value?.peran === 'admin')
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <NuxtLink to="/legislasi" class="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-2 inline-flex">
      <Icon name="lucide:arrow-left" class="size-3" /> Kembali
    </NuxtLink>

    <div v-if="loading" class="space-y-4"><div class="h-8 w-64 bg-gray-200 rounded animate-pulse" /></div>

    <template v-else-if="legislasi">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <AppBadge>{{ legislasi.tipe?.toUpperCase() }}</AppBadge>
            <AppBadge :variant="statusV(legislasi.status)">{{ legislasi.status }}</AppBadge>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">{{ legislasi.judul }}</h1>
          <p class="text-sm text-gray-500 mt-1">Diusulkan oleh {{ legislasi.pengusul?.nama }}</p>
        </div>
      </div>

      <AppCard>
        <h3 class="font-semibold mb-2">Deskripsi</h3>
        <p class="text-sm text-gray-600">{{ legislasi.deskripsi || 'Tidak ada deskripsi' }}</p>
        <div v-if="legislasi.isi" class="mt-4 pt-4 border-t">
          <h3 class="font-semibold mb-2">Isi Legislasi</h3>
          <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{{ legislasi.isi }}</div>
        </div>
      </AppCard>

      <!-- Voting Stats -->
      <AppCard>
        <h3 class="font-semibold mb-4">Hasil Voting</h3>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div><p class="text-2xl font-bold text-green-600">{{ legislasi.jumlah_setuju || 0 }}</p><p class="text-xs text-gray-500">Setuju</p></div>
          <div><p class="text-2xl font-bold text-red-600">{{ legislasi.jumlah_tidak_setuju || 0 }}</p><p class="text-xs text-gray-500">Tidak Setuju</p></div>
          <div><p class="text-2xl font-bold text-yellow-600">{{ legislasi.jumlah_abstain || 0 }}</p><p class="text-xs text-gray-500">Abstain</p></div>
        </div>
      </AppCard>

      <!-- Vote Section -->
      <AppCard v-if="canVote">
        <h3 class="font-semibold mb-4">Berikan Suara</h3>
        <AppAlert v-if="voteError" variant="danger" icon="lucide:alert-circle" class="mb-4">{{ voteError }}</AppAlert>
        <AppAlert v-if="voteSuccess" variant="success" icon="lucide:check-circle" class="mb-4">{{ voteSuccess }}</AppAlert>

        <div v-if="!voteSuccess" class="space-y-4">
          <AppSelect v-model="voteForm.suara" label="Pilihan Suara" :options="[
            { value: 'setuju', label: '👍 Setuju' },
            { value: 'tidak_setuju', label: '👎 Tidak Setuju' },
            { value: 'abstain', label: '🤚 Abstain' },
          ]" />
          <AppTextarea v-model="voteForm.komentar" label="Komentar (opsional)" placeholder="Alasan atau komentar..." :rows="2" />
          <AppButton :loading="voting" @click="kirimSuara">Kirim Suara</AppButton>
        </div>
      </AppCard>

      <!-- Approve button for admin -->
      <div v-if="isAdmin && legislasi.status === 'voting'" class="flex gap-3">
        <AppButton variant="secondary" icon="lucide:check-check" :loading="approving" @click="setujui">
          Setujui Legislasi
        </AppButton>
      </div>
    </template>

    <div v-else class="text-center py-12 text-gray-500">Legislasi tidak ditemukan</div>
  </div>
</template>
