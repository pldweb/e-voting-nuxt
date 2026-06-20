export function usePemilihanApi() {
  const api = useApi()

  async function fetchList(params?: { status?: string; page?: number; search?: string }) {
    return api.get<PaginatedResponse<Pemilihan>>('/pemilihan', params)
  }

  async function fetchDetail(id: string) {
    return api.get<{ data: Pemilihan }>(`/pemilihan/${id}`).then(r => r.data)
  }

  async function fetchVoteStatus(id: string) {
    return api.get<{ voted: boolean }>(`/pemilihan/${id}/status-vote`)
  }

  async function create(form: PemilihanForm) {
    return api.post<{ data: Pemilihan }>('/pemilihan', form as any).then(r => r.data)
  }

  async function update(id: string, form: Partial<PemilihanForm>) {
    return api.put<{ data: Pemilihan }>(`/pemilihan/${id}`, form as any).then(r => r.data)
  }

  async function remove(id: string) {
    return api.del(`/pemilihan/${id}`)
  }

  async function vote(pemilihanId: string, kandidatId: string) {
    return api.post(`/pemilihan/${pemilihanId}/pilih`, { id_kandidat: kandidatId })
  }

  async function fetchHasil(id: string) {
    return api.get<{ data: HasilPemilihan }>(`/pemilihan/${id}/hasil`).then(r => r.data)
  }

  async function fetchHasilWilayah(id: string) {
    return api.get<{ data: HasilWilayah }>(`/pemilihan/${id}/hasil-wilayah`).then(r => r.data)
  }

  return { fetchList, fetchDetail, fetchVoteStatus, create, update, remove, vote, fetchHasil, fetchHasilWilayah }
}
