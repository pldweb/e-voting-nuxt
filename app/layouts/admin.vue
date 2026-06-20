<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ middleware: ['role'] })

const auth = useAuthStore()
const route = useRoute()

// Pastikan user terload (refresh / tab baru)
onMounted(async () => {
  if (!auth.user && auth.token) {
    try { await auth.fetchUser() } catch {}
  }
})

const sidebarItems = computed(() => {
  const items = [
    { label: 'Dashboard', icon: 'lucide:layout-dashboard', to: '/' },
    { label: 'Pemilihan', icon: 'lucide:vote', to: '/pemilihan' },
    { label: 'Peraturan', icon: 'lucide:scale', to: '/peraturan' },
  ]

  // Admin-only items
  if (auth.isSuperAdmin || auth.isVerifikator) {
    items.push(
      { label: 'Pengguna', icon: 'lucide:users', to: '/admin/pengguna' },
      { label: 'Admin Pemilihan', icon: 'lucide:settings', to: '/admin/pemilihan' },
      { label: 'Admin Peraturan', icon: 'lucide:shield-check', to: '/admin/peraturan' },
      { label: 'Wilayah', icon: 'lucide:map-pin', to: '/admin/wilayah' },
      { label: 'Pengaturan Role', icon: 'lucide:shield', to: '/admin/peran' },
    )
  }

  return items
})

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const mobileOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Mobile overlay -->
    <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-black/50 lg:hidden" @click="mobileOpen = false" />

    <!-- Admin Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 z-50 h-screen w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex h-16 items-center gap-3 border-b dark:border-gray-800 px-6">
        <div class="flex size-8 items-center justify-center rounded-lg bg-secondary-500">
          <Icon icon="lucide:shield" class="size-5 text-white" />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-900 dark:text-gray-100">Admin Panel</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400">e-Voting</p>
        </div>
      </div>

      <nav class="mt-4 space-y-1 px-3">
        <NuxtLink
          v-for="item in sidebarItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            isActive(item.to)
              ? 'bg-secondary-50 dark:bg-secondary-950 text-secondary-700 dark:text-secondary-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
          ]"
        >
          <Icon :icon="item.icon" class="size-5" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- User footer -->
      <div class="absolute bottom-0 left-0 right-0 border-t dark:border-gray-800 p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-9 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 text-sm font-bold shrink-0">
            {{ auth.user?.nama?.charAt(0) || 'A' }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{{ auth.user?.nama }}</p>
            <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ auth.user?.peran?.nama }}</p>
          </div>
          <button
            class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600"
            title="Keluar"
            @click="auth.logout()"
          >
            <Icon icon="lucide:log-out" class="size-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 lg:ml-64">
      <header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900 px-4 lg:hidden">
        <button class="rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileOpen = true">
          <Icon icon="lucide:menu" class="size-5" />
        </button>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Admin Panel</span>
      </header>
      <main class="p-4 md:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
