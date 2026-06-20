/**
 * Legacy wrapper — delegates to authStore.
 * Keeps backward compat for any existing code using useAuth().
 */
export function useAuth() {
  const auth = useAuthStore()
  return auth
}
