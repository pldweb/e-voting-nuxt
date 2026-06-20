export function useAuthApi() {
  const api = useApi()
  const auth = useAuthStore()
  const router = useRouter()

  async function login(email: string, password: string) {
    const data = await api.post<LoginResponse>('/login', { email, password })
    auth.token = data.token
    auth.user = data.pengguna
    return data
  }

  async function logout() {
    try { await api.post('/logout') } catch {}
    auth.clearAuth()
    await router.push('/login')
  }

  async function fetchUser() {
    const data = await api.get<User>('/profil')
    auth.user = data
    return data
  }

  async function updateProfile(data: Partial<User> & { kata_sandi?: string }) {
    return api.put<User>('/profil', data)
  }

  async function fetchUsers(params?: { page?: number; search?: string; peran?: string }) {
    const qs = new URLSearchParams()
    if (params?.page) qs.set('page', String(params.page))
    if (params?.search) qs.set('search', params.search)
    if (params?.peran) qs.set('peran', params.peran)
    return api.get<PaginatedResponse<User>>(`/pengguna?${qs.toString()}`)
  }

  async function createUser(data: Partial<User> & { kata_sandi: string; id_peran: string; id_wilayah?: string }) {
    return api.post<User>('/pengguna', data)
  }

  async function updateUser(id: string, data: Partial<User> & { kata_sandi?: string; id_peran?: string }) {
    return api.put<User>(`/pengguna/${id}`, data)
  }

  async function deleteUser(id: string) {
    return api.delete(`/pengguna/${id}`)
  }

  return { login, logout, fetchUser, updateProfile, fetchUsers, createUser, updateUser, deleteUser }
}
