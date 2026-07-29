<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Menubar :model="menuItems">
          <template #start>
            <h1 class="text-xl font-semibold text-gray-900 pr-4 white-space-nowrap">SGC Data Registry</h1>
          </template>
          <template #item="{ item, props, hasSubmenu }">
            <a
              v-ripple
              class="flex align-items-center"
              :class="{ 'text-primary font-semibold': isActive(item) }"
              v-bind="props.action"
            >
              <span>{{ item.label }}</span>
              <i v-if="hasSubmenu" class="pi pi-angle-down ml-2"></i>
            </a>
          </template>
          <template #end>
            <Button
              label="Sign Out"
              text
              @click="handleLogout"
            />
          </template>
        </Menubar>
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
const route = useRoute();

// Apply SGC-specific theme (same as default for now)
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
  return roleNames.includes('sgc-reviewer') || roleNames.includes('admin');
});

// Menubar items, permission-gated. Sign Out lives in the #end slot, not here.
const menuItems = computed(() => {
  const items = [
    { label: 'Cohorts', to: '/sgc', command: () => navigateTo('/sgc') },
    { label: 'Phenotypes', to: '/sgc/phenotypes', command: () => navigateTo('/sgc/phenotypes') },
  ];

  if (isReviewer.value) {
    items.push(
      { label: 'GWAS Files', to: '/sgc/gwas-summary', command: () => navigateTo('/sgc/gwas-summary') },
      { label: 'GWAS QC Plots', to: '/sgc/gwas-qc-plots', command: () => navigateTo('/sgc/gwas-qc-plots') },
      { label: 'Meta-analysis', to: '/sgc/ma', command: () => navigateTo('/sgc/ma') },
    );
  }

  const moreItems = [];
  if (isReviewer.value) {
    moreItems.push(
      { label: 'Phenotype Case Totals', to: '/sgc/phenotype-case-totals', command: () => navigateTo('/sgc/phenotype-case-totals') },
      { label: 'MA Ignore List', to: '/sgc/ma-ignore', command: () => navigateTo('/sgc/ma-ignore') },
    );
  }
  if (userStore.canManageUsers()) {
    moreItems.push(
      { label: 'User Management', to: '/sgc/users', command: () => navigateTo('/sgc/users') },
    );
  }
  if (moreItems.length > 0) {
    items.push({ label: 'More', items: moreItems });
  }

  return items;
});

// Highlight the item matching the current route
function isActive(item) {
  return !!item.to && route.path === item.to;
}

// Handle logout
async function handleLogout() {
  userStore.logoutSGC();
  await router.push('/sgc/login');
}
</script>

<style lang="scss" scoped>
.p-menubar {
  border: none;
  background-color: transparent;
  padding-left: 0;
  padding-right: 0;
}
</style>
