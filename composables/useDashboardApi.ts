export function useDashboardApi() {
  const api = useApi()

  function fetchPemilihanStats() {
    return api.get<DashboardPemilihanStats>('/dashboard/pemilihan')
  }

  function fetchPeraturanStats() {
    return api.get<DashboardPeraturanStats>('/dashboard/peraturan')
  }

  function fetchAll() {
    return Promise.all([fetchPemilihanStats(), fetchPeraturanStats()])
  }

  return { fetchPemilihanStats, fetchPeraturanStats, fetchAll }
}
