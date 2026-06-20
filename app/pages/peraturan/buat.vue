<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ middleware: 'role' })

const store = usePeraturanStore()
const router = useRouter()
const saving = ref(false)
const errorMsg = ref('')

const form = ref<PeraturanForm>({
  judul: '',
  deskripsi: '',
  tipe: 'uu',
  isi: '',
})

const tipeOptions = [
  { value: 'uu', label: 'UU' },
  { value: 'perpu', label: 'PERPU' },
  { value: 'pp', label: 'PP' },
]

async function handleCreate() {
  saving.value = true
  errorMsg.value = ''
  try {
    await store.create(form.value)
    await router.push('/peraturan')
  } catch (e: any) {
    errorMsg.value = e.message || 'Gagal membuat peraturan'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <NuxtLink to="/peraturan" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
      <Icon icon="lucide:arrow-left" class="size-4" /> Kembali
    </NuxtLink>

    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Buat Peraturan Baru</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Isi detail peraturan atau legislasi</p>
    </div>

    <AppAlert v-if="errorMsg" variant="danger" icon="lucide:alert-circle">{{ errorMsg }}</AppAlert>

    <AppCard>
      <form class="space-y-4" @submit.prevent="handleCreate">
        <!-- Judul -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Judul Peraturan</label>
          <div class="relative">
            <Icon icon="lucide:file-text" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.judul" placeholder="Masukkan judul peraturan" required class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
          </div>
        </div>

        <!-- Tipe -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipe Peraturan</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              v-for="opt in tipeOptions"
              :key="opt.value"
              type="button"
              :class="[
                'rounded-lg border px-4 py-3 text-sm font-medium text-left transition-all',
                form.tipe === opt.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
              ]"
              @click="form.tipe = opt.value as any"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Deskripsi -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
          <textarea v-model="form.deskripsi" placeholder="Deskripsi singkat peraturan" rows="3" class="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"></textarea>
        </div>

        <!-- Isi Peraturan -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Isi Peraturan</label>
          <textarea v-model="form.isi" placeholder="Teks lengkap pasal/draft peraturan..." rows="6" class="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"></textarea>
        </div>

        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed w-full" :disabled="saving">
          <span v-if="saving" class="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          Simpan Peraturan
        </button>
      </form>
    </AppCard>
  </div>
</template>
