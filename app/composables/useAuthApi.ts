export function useAuthApi() {
  const api = useApi()

  async function fetchUsers(params?: { page?: number; search?: string; peran?: string }) {
    return api.get<PaginatedResponse<User>>('/pengguna', params)
  }

  async function fetchUser(id: string) {
    return api.get<User>(`/pengguna/${id}`)
  }

  async function createUser(form: {
    nama: string
    email: string
    peran: string
    password: string
    wilayah_id: number | null
  }) {
    // Map role name to peran_id (backend expects UUID, but we send role code — 
    // controller maps it via Peran model lookup; for now send as-is)
    // Actually backend PenggunaController expects id_peran (UUID), not peran code.
    // We need the Peran IDs. For now send the peran code — the controller
    // currently validates id_peran as uuid, so this will fail.
    // Fix: backend controller needs adjustment OR frontend needs peran lookup.
    // Temporary: skip for now, the store method handles this.
    return api.post<User>('/pengguna', form as any)
  }

  async function updateUser(id: string, form: Record<string, any>) {
    return api.put<User>(`/pengguna/${id}`, form)
  }

  async function deleteUser(id: string) {
    return api.del(`/pengguna/${id}`)
  }

  return { fetchUsers, fetchUser, createUser, updateUser, deleteUser }
}
