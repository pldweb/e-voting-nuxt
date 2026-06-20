<template>
  <div>
    <NuxtLoadingIndicator color="#017C3D" :height="3" :duration="3000" :throttle="0" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage>
        <template #fallback>
          <div class="flex items-center justify-center min-h-[60vh]">
            <div class="flex flex-col items-center gap-3">
              <div class="size-10 animate-spin rounded-full border-[3px] border-primary-200 border-t-primary-600"></div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Memuat...</p>
            </div>
          </div>
        </template>
      </NuxtPage>
    </NuxtLayout>
  </div>
</template>
