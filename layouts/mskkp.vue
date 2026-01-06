<script setup>
import { usePrimeVue } from "primevue/config";

const $primevue = usePrimeVue();

// Apply Aura Light theme (same as Hermes)
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/primevue@3.53.0/resources/themes/aura-light-indigo/theme.css'
    }
  ]
});
</script>

<template>
  <div class="layout-wrapper">
    <div class="layout-topbar">
      <nuxt-link to="/datasets" class="layout-topbar-logo">
        <span class="text-2xl font-bold">MSKKP Data Registry</span>
      </nuxt-link>
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <NuxtPage />
      </div>
      
      <footer class="layout-footer">
        <span>MSKKP Data Registry</span>
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

.layout-main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  padding: 7rem 2rem 2rem 2rem;
  transition: margin-left 0.2s;
}

.layout-main {
  flex: 1 1 auto;
}

.layout-footer {
  padding: 1rem 0;
  text-align: center;
  color: var(--text-color-secondary);
}
</style>
