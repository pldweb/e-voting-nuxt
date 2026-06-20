export function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  async function fetchApi<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    }

    const res = await $fetch<{ status: string; message: string; data: T; errors?: any }>(`${config.public.apiBase}${path}`, {
      ...options,
      headers,
    })

    if (res.status === 'error') {
      throw new Error(res.message || 'Terjadi kesalahan')
    }

    return res.data
  }

  return {
    get: <T = any>(path: string) => fetchApi<T>(path),
    post: <T = any>(path: string, body?: any) => fetchApi<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T = any>(path: string, body?: any) => fetchApi<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T = any>(path: string) => fetchApi<T>(path, { method: 'DELETE' }),
  }
}
