<script setup>
import { useUserStore } from "~/stores/UserStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// Hide navbar on login page
const showNavbar = computed(() => route.path !== '/calr/login');

// Handle logout
async function handleLogout() {
  userStore.logoutCALR();
  await router.push('/calr/login');
}
</script>

<template>
  <div class="layout-wrapper">
    <div v-if="showNavbar" class="layout-topbar">
      <nuxt-link to="/calr" class="layout-topbar-logo">
        <span class="text-2xl font-bold">CALR Data Registry</span>
      </nuxt-link>

      <div class="layout-topbar-menu">
        <Button
          label="Sign Out"
          icon="bi-box-arrow-right"
          text
          @click="handleLogout"
          class="p-button-text"
        />
      </div>
    </div>

    <div class="layout-main-container" :class="{ 'no-topbar': !showNavbar }">
      <div class="layout-main">
        <NuxtPage />
      </div>

      <footer class="layout-footer">
        <span>CALR Data Registry</span>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-topbar {
  position: fixed;
  height: 5rem;
  z-index: 997;
  left: 0;
  top: 0;
  width: 100%;
  padding: 0 2rem;
  background-color: var(--surface-card);
  transition: left 0.2s;
  display: flex;
  align-items: center;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
}

.layout-topbar-logo {
  display: flex;
  align-items: center;
  color: var(--surface-900);
  font-size: 1.5rem;
  font-weight: 500;
  width: 300px;
  border-radius: 12px;
  text-decoration: none;
}

.layout-topbar-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.layout-main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  padding: 7rem 2rem 2rem 2rem;
  transition: margin-left 0.2s;

  &.no-topbar {
    padding-top: 2rem;
  }
}

.layout-main {
  flex: 1 1 auto;
}

.layout-footer {
  padding: 1rem 0;
  text-align: center;
  color: var(--text-color-secondary);
}

:deep(.p-menubar) {
  border: none;
  background-color: transparent;
}
</style>
