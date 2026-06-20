export function usePeraturanApi() {
  const api = useApi()

  async function fetchList(params?: { status?: string; tipe?: string; page?: number; search?: string }) {
    return api.get<PaginatedResponse<Peraturan>>('/peraturan', params)
  }

  async function fetchDetail(id: string) {
    return api.get<{ data: Peraturan }>(`/peraturan/${id}`).then(r => r.data)
  }

  async function fetchVoteStatus(id: string) {
    return api.get<{ voted: boolean; pilihan: string | null }>(`/peraturan/${id}/status-vote`)
  }

  async function create(form: PeraturanForm) {
    return api.post<{ data: Peraturan }>('/peraturan', form as any).then(r => r.data)
  }

  async function update(id: string, form: Partial<PeraturanForm>) {
    return api.put<{ data: Peraturan }>(`/peraturan/${id}`, form as any).then(r => r.data)
  }

  async function remove(id: string) {
    return api.del(`/peraturan/${id}`)
  }

  async function vote(peraturanId: string, pilihan: 'setuju' | 'tidak_setuju') {
    return api.post(`/peraturan/${peraturanId}/beri-suara`, { pilihan_suara: pilihan })
  }

  async function approve(id: string) {
    return api.post<{ data: Peraturan }>(`/peraturan/${id}/setujui`).then(r => r.data)
  }

  async function fetchHasil(id: string) {
    return api.get<{ data: HasilPeraturan }>(`/peraturan/${id}/hasil`).then(r => r.data)
  }

  return { fetchList, fetchDetail, fetchVoteStatus, create, update, remove, vote, approve, fetchHasil }
}
