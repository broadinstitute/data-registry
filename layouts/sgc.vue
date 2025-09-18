<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">SGC Data Registry</h1>
          </div>
          <nav class="flex items-center space-x-4">
            <NuxtLink to="/sgc" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Uploads
            </NuxtLink>
            <NuxtLink to="/sgc/new" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              New Upload
            </NuxtLink>
            <NuxtLink 
              v-if="userStore.canManageUsers()" 
              to="/sgc/users" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              User Management
            </NuxtLink>
            <button @click="handleLogout" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Sign Out
            </button>
          </nav>
        </div>
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/UserStore";

const userStore = useUserStore();
const router = useRouter();

// Handle logout
async function handleLogout() {
  userStore.logoutSGC();
  await router.push('/sgc/login');
}
</script>