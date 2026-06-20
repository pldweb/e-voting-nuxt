<script setup lang="ts">
const api = useApi()
const router = useRouter()

const form = ref({ judul: '', tipe: 'uu', deskripsi: '', isi: '' })
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/legislasi', form.value)
    router.push('/legislasi')
  } catch (e: any) { error.value = e.message } finally { loading.value = false }
}
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <NuxtLink to="/legislasi" class="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-2">
        <Icon name="lucide:arrow-left" class="size-3" /> Kembali
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Buat Legislasi Baru</h1>
    </div>

    <AppAlert v-if="error" variant="danger" icon="lucide:alert-circle">{{ error }}</AppAlert>

    <AppCard>
      <form class="space-y-4" @submit.prevent="submit">
        <AppInput v-model="form.judul" label="Judul Legislasi" placeholder="Masukkan judul legislasi" />
        <AppSelect v-model="form.tipe" label="Tipe Legislasi" :options="[
          { value: 'uu', label: 'UU - Undang-Undang' },
          { value: 'perpu', label: 'PERPU - Peraturan Pemerintah Pengganti UU' },
          { value: 'pp', label: 'PP - Peraturan Pemerintah' },
        ]" />
        <AppTextarea v-model="form.deskripsi" label="Deskripsi" placeholder="Deskripsi singkat" :rows="3" />
        <AppTextarea v-model="form.isi" label="Isi Legislasi" placeholder="Tulis isi rancangan legislasi..." :rows="10" />

        <div class="flex gap-3 pt-4">
          <AppButton type="submit" :loading="loading">Simpan Legislasi</AppButton>
          <NuxtLink to="/legislasi"><AppButton variant="outline">Batal</AppButton></NuxtLink>
        </div>
      </form>
    </AppCard>
  </div>
</template>
