<script setup lang="ts">
import { Icon } from '@iconify/vue'

const store = usePeraturanStore()
const auth = useAuthStore()
const route = useRoute()
const id = computed(() => Number(route.params.id))

const selectedVote = ref<'setuju' | 'tidak_setuju' | 'abstain' | null>(null)
const voting = ref(false)
const voteError = ref('')
const approving = ref(false)

onMounted(() => store.fetchDetail(id.value))

async function handleVote() {
  if (!selectedVote.value) return
  voting.value = true
  voteError.value = ''
  try {
    await store.vote(id.value, selectedVote.value)
    await store.fetchDetail(id.value)
  } catch (e: any) {
    voteError.value = e.message || 'Gagal memberikan suara'
  } finally {
    voting.value = false
  }
}

async function handleApprove() {
  approving.value = true
  try {
    await store.approve(id.value)
    await store.fetchDetail(id.value)
  } catch (e: any) {
    voteError.value = e.message || 'Gagal menyetujui peraturan'
  } finally {
    approving.value = false
  }
}

const statusVariant: Record<string, string> = { draf: 'default', aktif: 'success', disetujui: 'success', ditutup: 'danger', ditolak: 'danger' }
const statusLabel: Record<string, string> = { draf: 'Draf', aktif: 'Aktif', disetujui: 'Disetujui', ditutup: 'Ditutup', ditolak: 'Ditolak' }
const tipeColor: Record<string, string> = {
  UU: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  PERPU: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  PP: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
}

const voteOptions = [
  { value: 'setuju' as const, label: 'Setuju', icon: 'lucide:thumbs-up', color: 'green' },
  { value: 'tidak_setuju' as const, label: 'Tidak Setuju', icon: 'lucide:thumbs-down', color: 'red' },
]

function formatDate(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <NuxtLink to="/peraturan" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
      <Icon icon="lucide:arrow-left" class="size-4" /> Kembali
    </NuxtLink>

    <div v-if="store.loading" class="space-y-4">
      <div class="h-8 w-2/3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
      <div class="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
    </div>

    <template v-else-if="store.detail">
      <!-- Header -->
      <div>
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span :class="['rounded px-2 py-0.5 text-[10px] font-bold', tipeColor[store.detail.tipe] || '']">
                {{ store.detail.tipe }}
              </span>
              <AppBadge :variant="(statusVariant[store.detail.status] as any) || 'default'">
                {{ statusLabel[store.detail.status] || store.detail.status }}
              </AppBadge>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ store.detail.judul }}</h1>
          </div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-3 whitespace-pre-wrap">{{ store.detail.deskripsi || 'Tidak ada deskripsi' }}</p>
        <div class="flex flex-wrap gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span v-if="store.detail.voting_dimulai" class="flex items-center gap-1">
            <Icon icon="lucide:calendar" class="size-3" /> {{ formatDate(store.detail.voting_dimulai) }} — {{ formatDate(store.detail.voting_berakhir) }}
          </span>
        </div>
      </div>

      <!-- Quick Stats -->
      <div v-if="store.detail.status !== 'draf'" class="grid grid-cols-3 gap-3">
        <div class="rounded-lg border dark:border-gray-800 p-3 text-center">
          <p class="text-lg font-bold text-green-600">{{ store.detail.total_setuju ?? 0 }}</p>
          <p class="text-[10px] text-gray-500">Setuju</p>
        </div>
        <div class="rounded-lg border dark:border-gray-800 p-3 text-center">
          <p class="text-lg font-bold text-red-600">{{ store.detail.total_tidak_setuju ?? 0 }}</p>
          <p class="text-[10px] text-gray-500">Tidak Setuju</p>
        </div>
        <div class="rounded-lg border dark:border-gray-800 p-3 text-center">
          <p class="text-lg font-bold text-gray-500">{{ store.detail.jumlah_suara ?? 0 }}</p>
          <p class="text-[10px] text-gray-500">Total Suara</p>
        </div>
      </div>

      <!-- Voting Area -->
      <AppCard v-if="store.detail.status === 'voting' && !store.hasVoted">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Berikan Suara</h2>

        <AppAlert v-if="voteError" variant="danger" icon="lucide:alert-circle" class="mb-4">{{ voteError }}</AppAlert>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            v-for="opt in voteOptions"
            :key="opt.value"
            :class="[
              'flex flex-col items-center gap-2 rounded-lg border p-4 transition-all',
              selectedVote === opt.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700',
            ]"
            @click="selectedVote = opt.value"
          >
            <Icon :icon="opt.icon" class="size-8" :class="{
              'text-green-600': opt.color === 'green',
              'text-red-600': opt.color === 'red',
              'text-gray-400': opt.color === 'gray',
            }" />
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ opt.label }}</span>
          </button>
        </div>

        <button class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6 w-full" :disabled="!selectedVote || voting" @click="handleVote">
          <span v-if="voting" class="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          Konfirmasi Suara
        </button>
      </AppCard>

      <!-- Voted -->
      <AppAlert v-else-if="store.hasVoted" variant="success" icon="lucide:check-circle">
        Anda sudah memberikan suara: <strong>{{ store.myVote === 'setuju' ? 'Setuju' : 'Tidak Setuju' }}</strong>
        <NuxtLink :to="`/peraturan/${id}/hasil`" class="underline font-medium ml-1">Lihat Hasil</NuxtLink>
      </AppAlert>

      <!-- Closed -->
      <AppAlert v-if="store.detail.status === 'ditolak' || store.detail.status === 'disetujui'" variant="warning" icon="lucide:info">
        <template v-if="store.detail.status === 'disetujui'">Peraturan ini telah disetujui.</template>
        <template v-else>Peraturan ini sudah ditutup.</template>
        <NuxtLink :to="`/peraturan/${id}/hasil`" class="underline font-medium ml-1">Lihat Hasil</NuxtLink>
      </AppAlert>

      <!-- Admin Approve -->
      <AppCard v-if="auth.isSuperAdmin && store.detail.status === 'voting'">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Admin: Setujui Peraturan</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Sebagai superadmin, Anda dapat menyetujui peraturan ini secara langsung setelah masa voting berakhir.
        </p>
        <button class="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-secondary-500 text-white hover:bg-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="approving" @click="handleApprove">
          <span v-if="approving" class="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          <Icon v-else icon="lucide:check-circle" class="size-4" />
          Setujui Peraturan
        </button>
      </AppCard>
    </template>

    <AppAlert v-else variant="warning">Peraturan tidak ditemukan</AppAlert>
  </div>
</template>
