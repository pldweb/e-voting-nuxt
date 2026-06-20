<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'admin', middleware: ['role'] })

const auth = useAuthStore()
const authApi = useAuthApi()

const users = ref<User[]>([])
const meta = ref({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
const loading = ref(true)
const search = ref('')
const peranFilter = ref('')
const page = ref(1)
const modalOpen = ref(false)
const editingUser = ref<User | null>(null)
const saving = ref(false)
const errorMsg = ref('')

const form = ref({
  nama: '',
  email: '',
  peran: 'pemilih' as string,
  password: '',
  wilayah_id: null as number | null,
})

const columns = [
  { key: 'nama', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'peran', label: 'Peran' },
  { key: 'aksi', label: 'Aksi', class: 'w-24' },
]

async function load() {
  loading.value = true
  try {
    const res = await authApi.fetchUsers({ page: page.value, search: search.value || undefined, peran: peranFilter.value || undefined })
    users.value = res.data
    meta.value = res.meta
  } catch {}
  loading.value = false
}

watch([page, search, peranFilter], () => { page.value = 1; load() })
onMounted(load)

function openCreate() {
  editingUser.value = null
  form.value = { nama: '', email: '', peran: 'pemilih', password: '', wilayah_id: null }
  modalOpen.value = true
}

function openEdit(u: User) {
  editingUser.value = u
  form.value = { nama: u.nama, email: u.email, peran: u.peran, password: '', wilayah_id: u.wilayah_id }
  modalOpen.value = true
}

async function handleSave() {
  saving.value = true
  errorMsg.value = ''
  try {
    if (editingUser.value) {
      const payload: any = { nama: form.value.nama, email: form.value.email, peran: form.value.peran }
      if (form.value.password) payload.password = form.value.password
      await authApi.updateUser(editingUser.value.id, payload)
    } else {
      await authApi.createUser(form.value)
    }
    modalOpen.value = false
    await load()
  } catch (e: any) {
    errorMsg.value = e.message || 'Gagal menyimpan'
  } finally {
    saving.value = false
  }
}

async function handleDelete(u: User) {
  if (!confirm(`Hapus pengguna "${u.nama}"?`)) return
  try {
    await authApi.deleteUser(u.id)
    await load()
  } catch {}
}

const peranVariant: Record<string, string> = {
  superadmin: 'danger',
  verifikator: 'warning',
  pemilih: 'default',
}
const peranLabel: Record<string, string> = {
  superadmin: 'Super Admin',
  verifikator: 'Verifikator',
  pemilih: 'Pemilih',
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Manajemen Pengguna</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola akun pengguna sistem</p>
      </div>
      <button class="inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700" @click="openCreate">
        <Icon icon="lucide:plus" class="size-4" /> Tambah Pengguna
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <div class="max-w-xs flex-1">
        <div class="relative">
          <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input v-model="search" placeholder="Cari pengguna..." class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
        </div>
      </div>
      <select v-model="peranFilter" class="flex h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent">
        <option value="">Semua Peran</option>
        <option value="superadmin">Super Admin</option>
        <option value="verifikator">Verifikator</option>
        <option value="pemilih">Pemilih</option>
      </select>
    </div>

    <!-- Table -->
    <AppCard class="!p-0 overflow-hidden">
      <AppTable :columns="columns" :data="users" :loading="loading">
        <template #nama="{ row }">
          <div class="flex items-center gap-2">
            <span class="flex size-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-bold">
              {{ row.nama?.charAt(0) }}
            </span>
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ row.nama }}</span>
          </div>
        </template>
        <template #email="{ row }">
          <span class="text-gray-500">{{ row.email }}</span>
        </template>
        <template #peran="{ row }">
          <AppBadge :variant="(peranVariant[row.peran] as any) || 'default'">
            {{ peranLabel[row.peran] || row.peran }}
          </AppBadge>
        </template>
        <template #aksi="{ row }">
          <div class="flex gap-1">
            <button class="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800" title="Edit" @click="openEdit(row)">
              <Icon icon="lucide:pencil" class="size-4" />
            </button>
            <button class="rounded p-1 hover:bg-red-50 text-gray-400 hover:text-red-600" title="Hapus" @click="handleDelete(row)">
              <Icon icon="lucide:trash-2" class="size-4" />
            </button>
          </div>
        </template>
      </AppTable>
    </AppCard>

    <BasePagination
      v-if="meta.last_page > 1"
      :current-page="meta.current_page"
      :last-page="meta.last_page"
      :total="meta.total"
      :per-page="meta.per_page"
      @update:page="page = $event"
    />

    <!-- Modal -->
    <AppDialog :open="modalOpen" :title="editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'" @update:open="modalOpen = $event">
      <AppAlert v-if="errorMsg" variant="danger" icon="lucide:alert-circle" class="mb-4">{{ errorMsg }}</AppAlert>
      <form class="space-y-3" @submit.prevent="handleSave">
        <!-- Nama -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
          <div class="relative">
            <Icon icon="lucide:user" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.nama" required class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <div class="relative">
            <Icon icon="lucide:mail" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.email" type="email" required class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
          </div>
        </div>

        <!-- Peran -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Peran</label>
          <select v-model="form.peran" class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent">
            <option value="superadmin">Super Admin</option>
            <option value="verifikator">Verifikator</option>
            <option value="pemilih">Pemilih</option>
          </select>
        </div>

        <!-- Password -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Kata Sandi</label>
          <div class="relative">
            <Icon icon="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.password" type="password" :placeholder="editingUser ? 'Kosongkan jika tidak berubah' : 'Minimal 8 karakter'" class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
          </div>
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
