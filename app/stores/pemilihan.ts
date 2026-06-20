import { defineStore } from 'pinia'

export const usePemilihanStore = defineStore('pemilihan', () => {
  const list = ref<Pemilihan[]>([])
  const detail = ref<Pemilihan | null>(null)
  const meta = ref<PaginationMeta>({ halaman_sekarang: 1, halaman_terakhir: 1, per_halaman: 10, total: 0 })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasVoted = ref(false)

  async function fetchList(params?: { status?: string; page?: number; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const api = usePemilihanApi()
      const res = await api.fetchList(params)
      list.value = res.data
      meta.value = res.meta
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(id: string) {
    loading.value = true
    error.value = null
    try {
      const api = usePemilihanApi()
      const [data, voted] = await Promise.all([
        api.fetchDetail(id),
        api.fetchVoteStatus(id).catch(() => ({ voted: false })),
      ])
      detail.value = data
      hasVoted.value = voted.voted
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(form: PemilihanForm) {
    const api = usePemilihanApi()
    return api.create(form)
  }

  async function update(id: string, form: Partial<PemilihanForm>) {
    const api = usePemilihanApi()
    return api.update(id, form)
  }

  async function remove(id: string) {
    const api = usePemilihanApi()
    return api.remove(id)
  }

  async function vote(pemilihanId: string, kandidatId: string) {
    const api = usePemilihanApi()
    await api.vote(pemilihanId, kandidatId)
    hasVoted.value = true
  }

  async function fetchHasil(id: string) {
    const api = usePemilihanApi()
    return api.fetchHasil(id)
  }

  async function fetchHasilWilayah(id: string) {
    const api = usePemilihanApi()
    return api.fetchHasilWilayah(id)
  }

  return { list, detail, meta, loading, error, hasVoted, fetchList, fetchDetail, create, update, remove, vote, fetchHasil, fetchHasilWilayah }
})
