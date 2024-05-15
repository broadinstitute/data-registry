<template>
  <nav class="navbar navbar-expand-lg p-3 mb-3 border-bottom">
    <div class="container">
      <a href="/" class="navbar-brand mr-4">
        <span>[ Data Registry <i class="bi bi-r-square-fill" /> ]</span>
      </a>

      <ul class="navbar-nav">
        <li class="nav-item">
          <a href="/" class="nav-link px-2 link-secondary">Home</a>
        </li>
        <li class="nav-item">
          <nuxt-link href="/datasets" class="nav-link px-2 link-body-emphasis">
            Datasets
          </nuxt-link>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Tools
          </a>
          <ul class="dropdown-menu">
            <li>
              <a
                class="dropdown-item"
                href="/configbuilder"
              >BYOR Config Builder</a>
            </li>
            <li>
              <a class="dropdown-item" href="#">Data Converter</a>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item" href="#">More ...</a>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <a
            href="#"
            class="nav-link px-2 link-body-emphasis"
          >Help</a>
        </li>
      </ul>

      <span v-if="userStore.user" class="navbar-text dropdown text-end">
        <a
          href="#"
          class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://kp4cd.org/sites/default/files/cmd_small.svg"
            alt="logo"
            width="32"
            height="32"
            class="rounded-circle"
          >
        </a>
        <ul class="dropdown-menu text-small">
          <li><a class="dropdown-item" href="#">Settings</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="navigateTo('/profile')">Profile</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" @click.prevent="signOut">Sign out</a></li>
        </ul>
      </span>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '~/stores/UserStore';


const userStore = useUserStore();

function signOut () {
  userStore.logout('/login');
}

</script>
