<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { user, logout } = useAuth()
const route = useRoute()

const sidebarItems = computed(() => {
  const items = [
    { label: 'Dashboard', icon: 'lucide:layout-dashboard', to: '/' },
    { label: 'Pemilihan', icon: 'lucide:vote', to: '/pemilihan' },
    { label: 'Legislasi', icon: 'lucide:scale', to: '/legislasi' },
  ]
  if (user.value?.peran === 'superadmin' || user.value?.peran === 'admin') {
    items.push({ label: 'Pengguna', icon: 'lucide:users', to: '/pengguna' })
  }
  return items
})

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div class="flex h-16 items-center gap-3 border-b px-6">
        <div class="flex size-8 items-center justify-center rounded-lg bg-primary-600">
          <Icon icon="lucide:landmark" class="size-5 text-white" />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-900">e-Voting ATAS TU</p>
          <p class="text-[10px] text-gray-500">Legislasi Digital</p>
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
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          ]"
        >
          <Icon :icon="item.icon" class="size-5" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- User footer -->
      <div class="absolute bottom-0 left-0 right-0 border-t p-4">
        <div class="flex items-center gap-3">
          <div class="flex size-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
            {{ user?.nama?.charAt(0) || 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="truncate text-sm font-medium text-gray-900">{{ user?.nama }}</p>
            <p class="truncate text-xs text-gray-500">{{ user?.peran }}</p>
          </div>
          <button class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" @click="logout">
            <Icon icon="lucide:log-out" class="size-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="ml-64 flex-1">
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
