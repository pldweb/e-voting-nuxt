export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // Skip if no token (global middleware handles redirect to /login)
  if (!auth.token) return

  // Fetch user if not loaded
  if (!auth.user) {
    try {
      await auth.fetchUser()
    } catch {
      auth.clearAuth()
      return navigateTo('/login')
    }
  }

  // Role-based access for /admin/* routes
  if (to.path.startsWith('/admin')) {
    const allowed = ['super_admin', 'verifikator']
    if (!allowed.includes(auth.user?.peran?.kode ?? '')) {
      return navigateTo('/')
    }
  }
})
