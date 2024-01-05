<script setup>

import { useUserStore } from '~/stores/UserStore';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const route = useRoute();
const submitForm = async () => {
  try {
    const userStore = useUserStore();
    await userStore.login(email.value, password.value);
    navigateTo(route.query.redirect !== '/' ? route.query.redirect : '/');
  } catch (error) {
    console.log(error);
    errorMessage.value = 'Sorry, we could not log you in.';
  }
};

onMounted(() => {
  document.getElementById('email').focus();
});
</script>
<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="text-center">
          Login
        </h2>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="email" class="form-label">Username or Email</label>
            <input id="email" v-model="email" type="text" class="form-control" placeholder="Enter username or email">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input id="password" v-model="password" type="password" class="form-control" placeholder="Enter password">
          </div>
          <button type="submit" class="btn btn-primary btn-block">
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
