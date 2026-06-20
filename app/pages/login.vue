<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const router = useRouter()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value.email, form.value.password)
    await router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Login gagal. Periksa email dan kata sandi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Logo -->
    <div class="text-center mb-8">
      <div class="inline-flex size-16 items-center justify-center rounded-2xl bg-primary-600 mb-4">
        <Icon icon="lucide:landmark" class="size-8 text-white" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">e-Voting</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Sistem Voting Digital Indonesia</p>
    </div>

    <!-- Card -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Masuk ke Akun</h2>

      <AppAlert v-if="error" variant="danger" icon="lucide:alert-circle" class="mb-4">
        {{ error }}
      </AppAlert>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <div class="relative">
            <Icon icon="lucide:mail" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.email" type="email" placeholder="email@domain.go.id" class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
        </div>

        <!-- Password -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Kata Sandi</label>
          <div class="relative">
            <Icon icon="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input v-model="form.password" type="password" placeholder="••••••••" class="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
        </div>

        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed w-full" :disabled="loading">
          <span v-if="loading" class="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          Masuk
        </button>
      </form>

      <p class="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Gunakan akun resmi yang terdaftar
      </p>
    </div>
  </div>
</template>
