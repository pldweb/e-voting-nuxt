import { defineStore } from 'pinia'

export const usePeraturanStore = defineStore('peraturan', () => {
  const list = ref<Peraturan[]>([])
  const detail = ref<Peraturan | null>(null)
  const meta = ref<PaginationMeta>({ halaman_sekarang: 1, halaman_terakhir: 1, per_halaman: 10, total: 0 })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasVoted = ref(false)
  const myVote = ref<string | null>(null)

  async function fetchList(params?: { status?: string; tipe?: string; page?: number; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const api = usePeraturanApi()
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
      const api = usePeraturanApi()
      const [data, voteStatus] = await Promise.all([
        api.fetchDetail(id),
        api.fetchVoteStatus(id).catch(() => ({ voted: false, pilihan: null })),
      ])
      detail.value = data
      hasVoted.value = voteStatus.voted
      myVote.value = voteStatus.pilihan
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function create(form: PeraturanForm) {
    const api = usePeraturanApi()
    return api.create(form)
  }

  async function update(id: string, form: Partial<PeraturanForm>) {
    const api = usePeraturanApi()
    return api.update(id, form)
  }

  async function remove(id: string) {
    const api = usePeraturanApi()
    return api.remove(id)
  }

  async function vote(peraturanId: string, pilihan: 'setuju' | 'tidak_setuju') {
    const api = usePeraturanApi()
    await api.vote(peraturanId, pilihan)
    hasVoted.value = true
    myVote.value = pilihan
  }

  async function approve(id: string) {
    const api = usePeraturanApi()
    return api.approve(id)
  }

  async function fetchHasil(id: string) {
    const api = usePeraturanApi()
    return api.fetchHasil(id)
  }

  return { list, detail, meta, loading, error, hasVoted, myVote, fetchList, fetchDetail, create, update, remove, vote, approve, fetchHasil }
})
