<script setup lang="ts">
import { Icon } from '@iconify/vue'

const auth = useAuthStore()
const api = useApi()

const loading = ref(false)
const saving = ref(false)
const success = ref('')
const error = ref('')

const form = ref({
  nama: auth.user?.nama || '',
  email: auth.user?.email || '',
  password: '',
  password_confirmation: '',
})

async function updateProfile() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const payload: any = { nama: form.value.nama, email: form.value.email }
    if (form.value.password) {
      payload.password = form.value.password
      payload.password_confirmation = form.value.password_confirmation
    }
    await api.put<User>('/profil', payload)
    await auth.fetchUser()
    form.value.password = ''
    form.value.password_confirmation = ''
    success.value = 'Profil berhasil diperbarui'
  } catch (e: any) {
    error.value = e.message || 'Gagal memperbarui profil'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Profil</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola informasi akun Anda</p>
    </div>

    <AppCard>
      <div class="flex items-center gap-4 mb-6">
        <div class="flex size-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-2xl font-bold">
          {{ auth.user?.nama?.charAt(0) || 'U' }}
        </div>
        <div>
          <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ auth.user?.nama }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ auth.user?.email }}</p>
          <AppBadge>{{ auth.user?.peran?.nama }}</AppBadge>
        </div>
      </div>

      <AppAlert v-if="error" variant="danger" icon="lucide:alert-circle" class="mb-4">{{ error }}</AppAlert>
      <AppAlert v-if="success" variant="success" icon="lucide:check-circle" class="mb-4">{{ success }}</AppAlert>

      <form class="space-y-4" @submit.prevent="updateProfile">
        <!-- Nama -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
          <div class="relative">
            <Icon icon="lucide:user" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.nama" placeholder="Nama lengkap" class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <div class="relative">
            <Icon icon="lucide:mail" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.email" type="email" placeholder="email@domain.go.id" class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
          </div>
        </div>

        <!-- Password -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Kata Sandi Baru (opsional)</label>
          <div class="relative">
            <Icon icon="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.password" type="password" placeholder="••••••••" class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
          </div>
        </div>

        <!-- Konfirmasi Password -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Konfirmasi Kata Sandi</label>
          <div class="relative">
            <Icon icon="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.password_confirmation" type="password" placeholder="••••••••" class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" />
          </div>
        </div>

        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="saving">
          <span v-if="saving" class="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          Simpan Perubahan
        </button>
      </form>
    </AppCard>
  </div>
</template>
