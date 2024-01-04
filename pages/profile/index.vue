<script setup>
import { useUserStore } from '~/stores/UserStore';
const store = useUserStore();
</script>

<template>
  <div class="container">
    <h6>User: {{ store.user.name }}</h6>
    <h6>Role: {{ store.user.role }}</h6>
  </div>
</template>
