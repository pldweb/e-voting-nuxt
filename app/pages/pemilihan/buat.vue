<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ middleware: 'role' })

const store = usePemilihanStore()
const router = useRouter()
const saving = ref(false)
const errorMsg = ref('')

const form = ref<PemilihanForm>({
  judul: '',
  deskripsi: '',
  tipe: 'tunggal',
  dimulai: '',
  berakhir: '',
  publik: false,
  kandidat: [{ nama: '', deskripsi: '', urutan: 1 }],
})

function addKandidat() {
  form.value.kandidat.push({ nama: '', deskripsi: '', urutan: form.value.kandidat.length + 1 })
}

function removeKandidat(index: number) {
  if (form.value.kandidat.length <= 1) return
  form.value.kandidat.splice(index, 1)
  form.value.kandidat.forEach((k, i) => (k.urutan = i + 1))
}

async function handleCreate() {
  saving.value = true
  errorMsg.value = ''
  try {
    await store.create(form.value)
    await router.push('/pemilihan')
  } catch (e: any) {
    errorMsg.value = e.message || 'Gagal membuat pemilihan'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <NuxtLink to="/pemilihan" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
      <Icon icon="lucide:arrow-left" class="size-4" /> Kembali
    </NuxtLink>

    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Buat Pemilihan Baru</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Isi detail pemilihan dan daftar kandidat</p>
    </div>

    <AppAlert v-if="errorMsg" variant="danger" icon="lucide:alert-circle">{{ errorMsg }}</AppAlert>

    <AppCard>
      <form class="space-y-4" @submit.prevent="handleCreate">
        <!-- Judul -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Judul Pemilihan</label>
          <div class="relative">
            <Icon icon="lucide:file-text" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.judul" placeholder="Masukkan judul pemilihan" required class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
          </div>
        </div>

        <!-- Deskripsi -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
          <textarea v-model="form.deskripsi" placeholder="Deskripsi singkat pemilihan" rows="4" class="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"></textarea>
        </div>
        <!-- Tipe Pemilihan -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Tipe Pemilihan</label>
          <div class="flex gap-3">
            <label :class="['flex items-center gap-2 rounded-lg border px-4 py-2.5 cursor-pointer transition-colors', form.tipe === 'tunggal' ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300' : 'border-gray-300 dark:border-gray-700']">
              <input type="radio" v-model="form.tipe" value="tunggal" class="sr-only" />
              <Icon icon="lucide:circle-dot" class="size-4" /> Tunggal
            </label>
            <label :class="['flex items-center gap-2 rounded-lg border px-4 py-2.5 cursor-pointer transition-colors', form.tipe === 'ganda' ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300' : 'border-gray-300 dark:border-gray-700']">
              <input type="radio" v-model="form.tipe" value="ganda" class="sr-only" />
              <Icon icon="lucide:check-check" class="size-4" /> Ganda
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Dimulai -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Dimulai</label>
            <div class="relative">
              <Icon icon="lucide:calendar" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input v-model="form.dimulai" type="datetime-local" required class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
            </div>
          </div>

          <!-- Berakhir -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Berakhir</label>
            <div class="relative">
              <Icon icon="lucide:calendar" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input v-model="form.berakhir" type="datetime-local" required class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
            </div>
          </div>
        </div>

        <!-- Publik -->
        <label class="flex items-center gap-3 cursor-pointer">
          <div class="relative">
            <input type="checkbox" v-model="form.publik" class="sr-only peer" />
            <div class="w-10 h-6 rounded-full bg-gray-300 dark:bg-gray-700 peer-checked:bg-primary-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-4"></div>
          </div>
          <span class="text-sm text-gray-700 dark:text-gray-300">Publik (terlihat oleh semua pemilih)</span>
        </label>

        <!-- Kandidat -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Kandidat</label>
            <button type="button" class="inline-flex items-center gap-1 rounded-md text-xs font-medium transition-colors h-8 px-3 hover:bg-gray-100 dark:hover:bg-gray-800" @click="addKandidat">
              <Icon icon="lucide:plus" class="size-3" /> Tambah
            </button>
          </div>
          <div class="space-y-3">
            <div
              v-for="(k, i) in form.kandidat"
              :key="i"
              class="flex items-start gap-3 rounded-lg border dark:border-gray-800 p-3"
            >
              <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-bold mt-1">
                {{ k.urutan }}
              </span>
              <div class="flex-1 space-y-2">
                <input v-model="k.nama" placeholder="Nama kandidat" required class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
                <input v-model="k.deskripsi" placeholder="Deskripsi / visi (opsional)" class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
              </div>
              <button
                type="button"
                class="shrink-0 rounded-md p-1 text-gray-400 hover:text-red-500 mt-2"
                :disabled="form.kandidat.length <= 1"
                @click="removeKandidat(i)"
              >
                <Icon icon="lucide:trash-2" class="size-4" />
              </button>
            </div>
          </div>
        </div>

        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed w-full" :disabled="saving">
          <span v-if="saving" class="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          Simpan Pemilihan
        </button>
      </form>
    </AppCard>
  </div>
</template>
