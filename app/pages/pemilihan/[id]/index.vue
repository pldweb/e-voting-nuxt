<script setup lang="ts">
import { Icon } from '@iconify/vue'

const store = usePemilihanStore()
const route = useRoute()
const router = useRouter()

const id = computed(() => Number(route.params.id))
const selectedKandidat = ref<number | null>(null)
const voting = ref(false)
const voteError = ref('')

onMounted(() => store.fetchDetail(id.value))

async function handleVote() {
  if (!selectedKandidat.value) return
  voting.value = true
  voteError.value = ''
  try {
    await store.vote(id.value, selectedKandidat.value)
    await store.fetchDetail(id.value)
  } catch (e: any) {
    voteError.value = e.message || 'Gagal memberikan suara'
  } finally {
    voting.value = false
  }
}

const statusVariant: Record<string, string> = { draf: 'default', aktif: 'success', ditutup: 'danger' }

function formatDate(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <!-- Back -->
    <NuxtLink to="/pemilihan" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
      <Icon icon="lucide:arrow-left" class="size-4" /> Kembali
    </NuxtLink>

    <!-- Loading -->
    <div v-if="store.loading" class="space-y-4">
      <div class="h-8 w-2/3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
      <div class="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
      <div class="h-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
    </div>

    <template v-else-if="store.detail">
      <!-- Header -->
      <div>
        <div class="flex flex-wrap items-start justify-between gap-3">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ store.detail.judul }}</h1>
          <AppBadge :variant="(statusVariant[store.detail.status] as any) || 'default'">
            {{ store.detail.status === 'draf' ? 'Draf' : store.detail.status === 'aktif' ? 'Aktif' : 'Ditutup' }}
          </AppBadge>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ store.detail.deskripsi || 'Tidak ada deskripsi' }}</p>
        <div class="flex flex-wrap gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span v-if="store.detail.dimulai" class="flex items-center gap-1">
            <Icon icon="lucide:calendar" class="size-3" /> {{ formatDate(store.detail.dimulai) }} — {{ formatDate(store.detail.berakhir) }}
          </span>
        </div>
      </div>

      <!-- Voting Area -->
      <AppCard v-if="store.detail.status === 'aktif' && !store.hasVoted">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Pilih Kandidat</h2>

        <AppAlert v-if="voteError" variant="danger" icon="lucide:alert-circle" class="mb-4">{{ voteError }}</AppAlert>

        <div class="space-y-3">
          <label
            v-for="k in store.detail.kandidat"
            :key="k.id"
            :class="[
              'flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all',
              selectedKandidat === k.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700',
            ]"
          >
            <input
              type="radio"
              :value="k.id"
              v-model="selectedKandidat"
              class="size-5 text-primary-600 accent-primary-600"
            />
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ k.urutan }}. {{ k.nama }}</p>
              <p v-if="k.deskripsi" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ k.deskripsi }}</p>
            </div>
          </label>
        </div>

        <button class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6 w-full" :disabled="!selectedKandidat || voting" @click="handleVote">
          <span v-if="voting" class="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          Konfirmasi Pilihan
        </button>
      </AppCard>

      <!-- Voted notification -->
      <AppAlert v-else-if="store.hasVoted" variant="success" icon="lucide:check-circle">
        Anda sudah memberikan suara pada pemilihan ini.
        <NuxtLink :to="`/pemilihan/${id}/hasil`" class="underline font-medium ml-1">Lihat Hasil</NuxtLink>
      </AppAlert>

      <!-- Closed notification -->
      <AppAlert v-if="store.detail.status === 'ditutup'" variant="warning" icon="lucide:info">
        Pemilihan ini sudah ditutup.
        <NuxtLink :to="`/pemilihan/${id}/hasil`" class="underline font-medium ml-1">Lihat Hasil</NuxtLink>
      </AppAlert>

      <!-- Kandidat List (read-only for non-aktif / already voted) -->
      <AppCard v-if="store.detail.kandidat?.length">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Daftar Kandidat</h3>
        <div class="space-y-2">
          <div
            v-for="k in store.detail.kandidat"
            :key="k.id"
            class="flex items-center gap-3 rounded-lg border dark:border-gray-800 p-3"
          >
            <span class="flex size-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-bold">
              {{ k.urutan }}
            </span>
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ k.nama }}</p>
              <p v-if="k.deskripsi" class="text-xs text-gray-500 dark:text-gray-400">{{ k.deskripsi }}</p>
            </div>
          </div>
        </div>
      </AppCard>
    </template>

    <AppAlert v-else variant="warning">Pemilihan tidak ditemukan</AppAlert>
  </div>
</template>
