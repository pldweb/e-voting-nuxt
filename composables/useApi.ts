export function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('token')

  async function fetchApi<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    }

    const url = `${config.public.apiBase}${path}`

    const res = await $fetch<{ success: boolean; message: string; data: T; meta?: any; errors?: any }>(url, {
      ...options,
      headers,
    })

    // Backend returns: { success: bool, message: string, data: T }
    if (!res.success) {
      // Handle 401 globally
      const authStore = useAuthStore()
      authStore.clearAuth()
      await navigateTo('/login')
      throw new Error(res.message || 'Terjadi kesalahan')
    }

    // Attach meta if present (for paginated responses)
    if (res.meta) {
      return { data: res.data, meta: res.meta } as any as T
    }

    return res.data as T
  }

  return {
    get: <T = any>(path: string) => fetchApi<T>(path),
    post: <T = any>(path: string, body?: any) => fetchApi<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T = any>(path: string, body?: any) => fetchApi<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T = any>(path: string) => fetchApi<T>(path, { method: 'DELETE' }),
  }
}
