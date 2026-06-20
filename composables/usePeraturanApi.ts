export function usePeraturanApi() {
  const api = useApi()

  function fetchList(params?: { status?: string; tipe?: string; page?: number; search?: string }) {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    if (params?.tipe) qs.set('tipe', params.tipe)
    if (params?.page) qs.set('page', String(params.page))
    if (params?.search) qs.set('search', params.search)
    return api.get<PaginatedResponse<Peraturan>>(`/peraturan?${qs.toString()}`)
  }

  function fetchDetail(id: string) {
    return api.get<Peraturan>(`/peraturan/${id}`)
  }

  function fetchHasil(id: string) {
    return api.get<HasilPeraturan>(`/peraturan/${id}/hasil`)
  }

  function fetchVoteStatus(id: string) {
    return api.get<{ voted: boolean; pilihan: string | null }>(`/peraturan/${id}/status-vote`)
  }

  function create(form: PeraturanForm) {
    return api.post<Peraturan>('/peraturan', form)
  }

  function update(id: string, form: Partial<PeraturanForm>) {
    return api.put<Peraturan>(`/peraturan/${id}`, form)
  }

  function remove(id: string) {
    return api.delete(`/peraturan/${id}`)
  }

  function vote(peraturanId: string, pilihanSuara: 'setuju' | 'tidak_setuju') {
    return api.post(`/peraturan/${peraturanId}/beri-suara`, { pilihan_suara: pilihanSuara })
  }

  function approve(id: string) {
    return api.post(`/peraturan/${id}/setujui`)
  }

  return { fetchList, fetchDetail, fetchHasil, fetchVoteStatus, create, update, remove, vote, approve }
}
