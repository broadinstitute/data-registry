<script setup>
import { useUserStore } from '~/stores/UserStore';
const store = useUserStore();
</script>

<template>
  <div class="container">
    <h6>User: {{ store.user.name }}</h6>
    <h6>Roles: {{ store.user.roles.join(', ') }}</h6>
  </div>
</template>
