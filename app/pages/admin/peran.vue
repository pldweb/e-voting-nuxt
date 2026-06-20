<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'admin', middleware: ['role'] })

const api = useApi()

interface PeranItem {
  id: string
  nama: string
  kode: string
  pengguna_count?: number
}

const peran = ref<PeranItem[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const data = await api.get<PeranItem[]>('/peran') || []
    // Fetch counts per role
    const withCounts = await Promise.all(
      data.map(async (p) => {
        try {
          const detail = await api.get<PeranItem>(`/peran/${p.id}`)
          return { ...p, pengguna_count: detail.pengguna_count ?? 0 }
        } catch {
          return { ...p, pengguna_count: 0 }
        }
      })
    )
    peran.value = withCounts
  } catch {}
  loading.value = false
}

onMounted(load)

// Permission matrix per role
const permissionMatrix: Record<string, { label: string; akses: string[] }> = {
  super_admin: {
    label: 'Super Admin',
    akses: [
      'Dashboard & Statistik',
      'Membuat / Mengelola Pemilihan',
      'Membuat / Mengelola Peraturan',
      'Mengelola Semua Pengguna',
      'Menyetujui Peraturan',
      'Melihat Hasil Pemilihan & Peraturan',
      'Mengelola Wilayah',
    ],
  },
  verifikator: {
    label: 'Verifikator',
    akses: [
      'Dashboard & Statistik',
      'Membuat / Mengelola Pemilihan',
      'Membuat / Mengelola Peraturan',
      'Mengelola Semua Pengguna',
      'Menyetujui Peraturan',
      'Melihat Hasil Pemilihan & Peraturan',
      'Mengelola Wilayah',
    ],
  },
  pemilih: {
    label: 'Pemilih',
    akses: [
      'Dashboard (ringkasan pribadi)',
      'Melihat Pemilihan Aktif',
      'Memberikan Suara Pemilihan',
      'Melihat Peraturan Aktif',
      'Memberikan Suara Peraturan',
      'Melihat Hasil (setelah ditutup)',
    ],
  },
}

const selectedRole = ref<string | null>(null)

const iconMap: Record<string, string> = {
  super_admin: 'lucide:crown',
  verifikator: 'lucide:shield-check',
  pemilih: 'lucide:user',
}

const colorMap: Record<string, string> = {
  super_admin: 'border-red-400 bg-red-50 dark:bg-red-950',
  verifikator: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950',
  pemilih: 'border-blue-400 bg-blue-50 dark:bg-blue-950',
}

const badgeColorMap: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  verifikator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  pemilih: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengaturan Role</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Daftar peran dan hak akses dalam sistem</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </div>

    <!-- Role Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        v-for="p in peran"
        :key="p.id"
        :class="[
          'rounded-xl border-2 p-5 text-left transition-all hover:shadow-md',
          selectedRole === p.kode ? 'ring-2 ring-primary-500 ' + colorMap[p.kode] : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900',
        ]"
        @click="selectedRole = selectedRole === p.kode ? null : p.kode"
      >
        <div class="flex items-center gap-3 mb-3">
          <div :class="['flex size-10 items-center justify-center rounded-lg', badgeColorMap[p.kode] || 'bg-gray-100']">
            <Icon :icon="iconMap[p.kode] || 'lucide:user'" class="size-5" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ p.nama }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ p.pengguna_count }} pengguna</p>
          </div>
        </div>
        <span :class="['inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold', badgeColorMap[p.kode] || 'bg-gray-100 text-gray-600']">
          {{ p.kode }}
        </span>
      </button>
    </div>

    <!-- Permission Detail -->
    <div v-if="selectedRole && permissionMatrix[selectedRole]" class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Hak Akses: {{ permissionMatrix[selectedRole].label }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div
          v-for="akses in permissionMatrix[selectedRole].akses"
          :key="akses"
          class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 py-1"
        >
          <Icon icon="lucide:check-circle" class="size-4 text-green-600 shrink-0" />
          {{ akses }}
        </div>
      </div>
    </div>
  </div>
</template>
