export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // Not logged in → redirect to login
  if (!auth.token && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Already logged in + going to /login → redirect to /
  if (auth.token && to.path === '/login') {
    return navigateTo('/')
  }
})
