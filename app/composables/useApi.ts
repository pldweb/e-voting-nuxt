export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  function getHeaders(): Record<string, string> {
    const h: Record<string, string> = {
      Accept: 'application/json',
    }
    if (auth.token) {
      h.Authorization = `Bearer ${auth.token}`
    }
    return h
  }

  function unwrap<T>(response: any): T {
    if (response?.success !== undefined && response?.data !== undefined) {
      const result = { ...response.data }
      if (response.meta) {
        ;(result as any).meta = response.meta
      }
      return result as T
    }
    return response as T
  }

  async function get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const { data, error } = await useFetch<any>(url, {
      baseURL: config.public.apiBase as string,
      headers: getHeaders(),
      query: params,
    })
    if (error.value) throw new Error(extractMessage(error.value))
    return unwrap<T>(data.value)
  }

  async function post<T>(url: string, body?: Record<string, any>): Promise<T> {
    const { data, error } = await useFetch<any>(url, {
      baseURL: config.public.apiBase as string,
      method: 'POST',
      headers: getHeaders(),
      body,
    })
    if (error.value) throw new Error(extractMessage(error.value))
    return unwrap<T>(data.value)
  }

  async function put<T>(url: string, body?: Record<string, any>): Promise<T> {
    const { data, error } = await useFetch<any>(url, {
      baseURL: config.public.apiBase as string,
      method: 'PUT',
      headers: getHeaders(),
      body,
    })
    if (error.value) throw new Error(extractMessage(error.value))
    return unwrap<T>(data.value)
  }

  async function del<T>(url: string): Promise<T> {
    const { data, error } = await useFetch<any>(url, {
      baseURL: config.public.apiBase as string,
      method: 'DELETE',
      headers: getHeaders(),
    })
    if (error.value) throw new Error(extractMessage(error.value))
    return unwrap<T>(data.value)
  }

  return { get, post, put, del }
}

function extractMessage(err: any): string {
  if (err?.data?.message) return err.data.message
  if (err?.message) return err.message
  return 'Terjadi kesalahan jaringan'
}
