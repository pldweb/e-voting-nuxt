<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { login } = useAuth()
const router = useRouter()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(form.value.email, form.value.password)
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex size-16 items-center justify-center rounded-2xl bg-primary-600 mb-4">
          <Icon name="lucide:landmark" class="size-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">e-Voting ATAS TU</h1>
        <p class="text-sm text-gray-500 mt-1">Portal Legislasi Digital Indonesia</p>
      </div>

      <!-- Card -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-6">Masuk ke Akun</h2>

        <AppAlert v-if="error" variant="danger" icon="lucide:alert-circle" class="mb-4">
          {{ error }}
        </AppAlert>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <AppInput v-model="form.email" label="Email" type="email" placeholder="email@atas-tu.go.id" icon="lucide:mail" />
          <AppInput v-model="form.password" label="Kata Sandi" type="password" placeholder="••••••••" icon="lucide:lock" />

          <AppButton type="submit" class="w-full" :loading="loading">
            Masuk
          </AppButton>
        </form>

        <p class="mt-4 text-center text-xs text-gray-500">
          Gunakan akun ATAS TU yang terdaftar
        </p>
      </div>
    </div>
  </div>
</template>
