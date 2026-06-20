export function usePemilihanApi() {
  const api = useApi()

  function fetchList(params?: { status?: string; page?: number; search?: string }) {
    const qs = new URLSearchParams()
    if (params?.status) qs.set('status', params.status)
    if (params?.page) qs.set('page', String(params.page))
    if (params?.search) qs.set('search', params.search)
    return api.get<PaginatedResponse<Pemilihan>>(`/pemilihan?${qs.toString()}`)
  }

  function fetchDetail(id: string) {
    return api.get<Pemilihan>(`/pemilihan/${id}`)
  }

  function fetchHasil(id: string) {
    return api.get<HasilPemilihan>(`/pemilihan/${id}/hasil`)
  }

  function fetchHasilWilayah(id: string) {
    return api.get<HasilWilayah>(`/pemilihan/${id}/hasil-wilayah`)
  }

  function fetchVoteStatus(id: string) {
    return api.get<{ voted: boolean }>(`/pemilihan/${id}/status-vote`)
  }

  function create(form: PemilihanForm) {
    return api.post<Pemilihan>('/pemilihan', form)
  }

  function update(id: string, form: Partial<PemilihanForm>) {
    return api.put<Pemilihan>(`/pemilihan/${id}`, form)
  }

  function remove(id: string) {
    return api.delete(`/pemilihan/${id}`)
  }

  function vote(pemilihanId: string, idKandidat: string) {
    return api.post(`/pemilihan/${pemilihanId}/pilih`, { id_kandidat: idKandidat })
  }

  return { fetchList, fetchDetail, fetchHasil, fetchHasilWilayah, fetchVoteStatus, create, update, remove, vote }
}
