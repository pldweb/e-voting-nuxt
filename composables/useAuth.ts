export function useAuth() {
  const token = useCookie('token')
  const user = useState<any>('user', () => null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  async function login(email: string, password: string) {
    const api = useApi()
    const data = await api.post<{ pengguna: any; token: string }>('/login', { email, password })
    token.value = data.token
    user.value = data.pengguna
    return data
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const api = useApi()
      user.value = await api.get<any>('/me')
    } catch {
      token.value = null
      user.value = null
    }
  }

  async function logout() {
    try {
      const api = useApi()
      await api.post('/logout')
    } catch {}
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return { token, user, isLoggedIn, login, fetchUser, logout }
}
