<script setup lang="ts">
const api = useApi()
const router = useRouter()

const form = ref({
  judul: '',
  deskripsi: '',
  tipe: 'tunggal',
  maks_suara: 1,
  dimulai: '',
  berakhir: '',
  publik: false,
  kandidat: [{ nama: '', deskripsi: '', urutan: 1 }],
})

const loading = ref(false)
const error = ref('')

function tambahKandidat() {
  form.value.kandidat.push({ nama: '', deskripsi: '', urutan: form.value.kandidat.length + 1 })
}

function hapusKandidat(i: number) {
  if (form.value.kandidat.length > 1) form.value.kandidat.splice(i, 1)
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/pemilihan', form.value)
    router.push('/pemilihan')
  } catch (e: any) {
    error.value = e.message
  } finally { loading.value = false }
}
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <NuxtLink to="/pemilihan" class="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-2">
        <Icon name="lucide:arrow-left" class="size-3" /> Kembali
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Buat Pemilihan Baru</h1>
    </div>

    <AppAlert v-if="error" variant="danger" icon="lucide:alert-circle">{{ error }}</AppAlert>

    <AppCard>
      <form class="space-y-4" @submit.prevent="submit">
        <AppInput v-model="form.judul" label="Judul Pemilihan" placeholder="Masukkan judul pemilihan" />

        <AppTextarea v-model="form.deskripsi" label="Deskripsi" placeholder="Deskripsi pemilihan (opsional)" />

        <div class="grid grid-cols-2 gap-4">
          <AppSelect v-model="form.tipe" label="Tipe Pemilihan" :options="[
            { value: 'tunggal', label: 'Tunggal (satu pilihan)' },
            { value: 'ganda', label: 'Ganda (multi pilihan)' },
          ]" />
          <AppInput v-if="form.tipe === 'ganda'" v-model.number="form.maks_suara" label="Maksimal Suara" type="number" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.dimulai" label="Waktu Mulai" type="datetime-local" />
          <AppInput v-model="form.berakhir" label="Waktu Berakhir" type="datetime-local" />
        </div>

        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.publik" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
          Tampilkan hasil secara publik
        </label>

        <!-- Kandidat -->
        <div class="border-t pt-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-gray-900">Kandidat</h3>
            <AppButton variant="outline" size="sm" icon="lucide:plus" @click="tambahKandidat">Tambah</AppButton>
          </div>

          <div v-for="(k, i) in form.kandidat" :key="i" class="space-y-2 p-4 mb-3 rounded-lg border border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600">Kandidat {{ i + 1 }}</span>
              <button v-if="form.kandidat.length > 1" class="text-red-500 hover:text-red-700" @click="hapusKandidat(i)">
                <Icon name="lucide:trash-2" class="size-4" />
              </button>
            </div>
            <AppInput v-model="k.nama" placeholder="Nama kandidat" />
            <AppInput v-model="k.deskripsi" placeholder="Deskripsi (opsional)" />
            <input type="hidden" v-model.number="k.urutan" :value="i + 1" />
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <AppButton type="submit" :loading="loading">Simpan Pemilihan</AppButton>
          <NuxtLink to="/pemilihan"><AppButton variant="outline">Batal</AppButton></NuxtLink>
        </div>
      </form>
    </AppCard>
  </div>
</template>
