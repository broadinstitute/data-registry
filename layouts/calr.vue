<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">CalR - Calorimetry Analysis</h1>
          </div>
          <nav class="flex items-center space-x-4">
            <NuxtLink to="/calr" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Analyze
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>

    <footer class="bg-white border-t mt-8">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">CalR Calorimetry Viewer</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Apply CalR-specific theme
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: '/themes/primevue/aura-light-indigo/theme.css'
    }
  ]
});
</script>
