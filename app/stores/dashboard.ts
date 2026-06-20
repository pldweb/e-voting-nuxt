import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', () => {
  const pemilihanStats = ref<DashboardPemilihanStats | null>(null)
  const peraturanStats = ref<DashboardPeraturanStats | null>(null)
  const pemilihanAktif = ref<Pemilihan[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let pollingInterval: ReturnType<typeof setInterval> | null = null

  async function loadDashboard() {
    loading.value = true
    error.value = null
    try {
      const api = useApi()
      const [statsPemilihan, statsPeraturan, aktif] = await Promise.all([
        api.get<DashboardPemilihanStats>('/dashboard/pemilihan'),
        api.get<DashboardPeraturanStats>('/dashboard/peraturan'),
        api.get<PaginatedResponse<Pemilihan>>('/pemilihan?status=aktif'),
      ])
      pemilihanStats.value = statsPemilihan
      peraturanStats.value = statsPeraturan
      pemilihanAktif.value = aktif.data
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function startPolling(intervalMs = 5000) {
    stopPolling()
    pollingInterval = setInterval(loadDashboard, intervalMs)
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  return { pemilihanStats, peraturanStats, pemilihanAktif, loading, error, loadDashboard, startPolling, stopPolling }
})
