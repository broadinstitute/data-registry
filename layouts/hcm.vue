<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">HCM GWAS Data Registry</h1>
          </div>
          <nav class="flex items-center space-x-4">
            <NuxtLink to="/hcm" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              GWAS Files
            </NuxtLink>
            <NuxtLink to="/hcm/new" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Upload GWAS
            </NuxtLink>
            <NuxtLink
              v-if="isReviewer"
              to="/hcm/gwas-summary"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              GWAS Summary
            </NuxtLink>
            <NuxtLink
              v-if="isReviewer"
              to="/hcm/users"
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
import { computed } from "vue";

const userStore = useUserStore();
const router = useRouter();

// Apply theme
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: '/themes/primevue/aura-light-indigo/theme.css'
    }
  ]
});

// Check if user is a reviewer
const isReviewer = computed(() => {
  const user = userStore.user;
  if (!user) return false;

  const roleNames = user.roles?.map(role => role.name || role) || [];
  return roleNames.includes('hcm-reviewer') || roleNames.includes('admin');
});

// Handle logout
async function handleLogout() {
  userStore.logoutHCM();
  await router.push('/hcm/login');
}
</script>
