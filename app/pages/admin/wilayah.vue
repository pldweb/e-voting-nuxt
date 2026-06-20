<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'admin', middleware: ['role'] })

const api = useApi()

const wilayah = ref<(Wilayah & { anak?: Wilayah[] })[]>([])
const loading = ref(true)
const modalOpen = ref(false)
const editing = ref<Wilayah | null>(null)
const saving = ref(false)
const errorMsg = ref('')

const form = ref({
  nama: '',
  kode: '',
  induk_id: null as string | null,
})

async function load() {
  loading.value = true
  try {
    wilayah.value = await api.get<(Wilayah & { children?: Wilayah[] })[]>('/wilayah') || []
  } catch {}
  loading.value = false
}

onMounted(load)

function openCreate(indukId: string | null = null) {
  editing.value = null
  form.value = { nama: '', kode: '', induk_id: indukId }
  modalOpen.value = true
}

function openEdit(w: Wilayah) {
  editing.value = w
  form.value = { nama: w.nama, kode: w.kode, induk_id: (w as any).induk_id || null }
  modalOpen.value = true
}

async function handleSave() {
  saving.value = true
  errorMsg.value = ''
  try {
    if (editing.value) {
      await api.put(`/wilayah/${editing.value.id}`, form.value)
    } else {
      await api.post('/wilayah', form.value)
    }
    modalOpen.value = false
    await load()
  } catch (e: any) {
    errorMsg.value = e.message || 'Gagal menyimpan'
  } finally {
    saving.value = false
  }
}

async function handleDelete(w: Wilayah) {
  if (!confirm(`Hapus wilayah "${w.nama}"?`)) return
  try {
    await api.del(`/wilayah/${w.id}`)
    await load()
  } catch {}
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Wilayah</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Struktur wilayah dan hierarki</p>
      </div>
      <button class="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700" @click="openCreate()">
        <Icon icon="lucide:plus" class="size-4" /> Tambah Wilayah
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
    </div>

    <!-- Empty -->
    <div v-else-if="!wilayah.length" class="text-center py-16">
      <Icon icon="lucide:map-pin" class="size-14 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
      <p class="text-gray-500 dark:text-gray-400">Belum ada data wilayah</p>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div
        v-for="w in wilayah"
        :key="w.id"
        class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 !p-4"
      >
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
            <Icon icon="lucide:map-pin" class="size-5 text-primary-700 dark:text-primary-300" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ w.nama }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ w.kode }}</p>
          </div>
          <span v-if="w.anak?.length" class="text-xs text-gray-400 mr-2">
            {{ w.anak.length }} sub-wilayah
          </span>
          <div class="flex gap-1">
            <button class="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-600" title="Tambah Sub" @click="openCreate(w.id)">
              <Icon icon="lucide:plus-circle" class="size-4" />
            </button>
            <button class="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600" title="Edit" @click="openEdit(w)">
              <Icon icon="lucide:pencil" class="size-4" />
            </button>
            <button class="rounded p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600" title="Hapus" @click="handleDelete(w)">
              <Icon icon="lucide:trash-2" class="size-4" />
            </button>
          </div>
        </div>

        <!-- Children -->
        <div v-if="w.anak?.length" class="ml-10 mt-2 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-4">
          <div
            v-for="child in w.anak"
            :key="child.id"
            class="flex items-center gap-2 text-sm py-1 group"
          >
            <Icon icon="lucide:map-pin" class="size-3 text-gray-400" />
            <span class="text-gray-700 dark:text-gray-300">{{ child.nama }}</span>
            <span class="text-xs text-gray-400">({{ child.kode }})</span>
            <div class="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="rounded p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600" title="Edit" @click="openEdit(child)">
                <Icon icon="lucide:pencil" class="size-3" />
              </button>
              <button class="rounded p-0.5 hover:bg-red-50 text-gray-400 hover:text-red-600" title="Hapus" @click="handleDelete(child)">
                <Icon icon="lucide:trash-2" class="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <AppDialog :open="modalOpen" :title="editing ? 'Edit Wilayah' : 'Tambah Wilayah'" @update:open="modalOpen = $event">
      <div v-if="errorMsg" class="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 mb-4">
        <Icon icon="lucide:alert-circle" class="size-5 shrink-0 mt-0.5" />
        <div>{{ errorMsg }}</div>
      </div>
      <form class="space-y-3" @submit.prevent="handleSave">
        <!-- Nama -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Wilayah</label>
          <input v-model="form.nama" placeholder="Contoh: Wilayah Barat" required class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
        </div>

        <!-- Kode -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Kode</label>
          <input v-model="form.kode" placeholder="Contoh: WBR" required class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800" @click="modalOpen = false">Batal</button>
          <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="saving">
            <span v-if="saving" class="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Simpan
          </button>
        </div>
      </form>
    </AppDialog>
  </div>
</template>
