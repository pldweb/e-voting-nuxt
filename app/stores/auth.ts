import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // Gunakan useState + localStorage untuk token (hindari issue cookie encoding)
  const token = useState<string | null>('auth:token', () => null)
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const isSuperAdmin = computed(() => user.value?.peran?.kode === 'super_admin')
  const isVerifikator = computed(() => user.value?.peran?.kode === 'verifikator')
  const isPemilih = computed(() => user.value?.peran?.kode === 'pemilih')

  // Hydrate dari localStorage saat client-side
  if (import.meta.client) {
    const stored = localStorage.getItem('auth_token')
    if (stored) token.value = stored
  }

  // Watch token → sync ke localStorage
  watch(token, (val) => {
    if (import.meta.client) {
      if (val) {
        localStorage.setItem('auth_token', val)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  })

  async function login(email: string, password: string) {
    const api = useApi()
    const data = await api.post<LoginResponse>('/login', { email, password })
    token.value = data.token
    user.value = data.pengguna
    return data
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const api = useApi()
      user.value = await api.get<User>('/profil')
    } catch {
      clearAuth()
    }
  }

  async function logout() {
    try {
      const api = useApi()
      await api.post('/logout')
    } catch { /* ignore */ }
    clearAuth()
    await navigateTo('/login')
  }

  function clearAuth() {
    token.value = null
    user.value = null
  }

  return { token, user, isLoggedIn, isSuperAdmin, isVerifikator, isPemilih, login, fetchUser, logout, clearAuth }
})
