<script setup>

import { useUserStore } from '~/stores/UserStore';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const route = useRoute();
const config = useRuntimeConfig();
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

function loginWithGoogle () {
  const clientId = config.public.googleAuthClientId;
  const redirectUri = encodeURIComponent(config.public.googleAuthRedirectUri);
  const responseType = 'code';
  const scope = encodeURIComponent('openid email');
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  if (route.query.redirect) {
     window.location.href = redirectUrl + `&state=${route.query.redirect}`;
  } else {
    window.location.href = redirectUrl;
  }
}

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
          <div class="mb-3">
            <button type="submit" class="btn btn-primary btn-block">
              Login
            </button>
            or
            <a class="btn btn-primary btn-block google-signin-btn" role="button" style="text-transform:none" @click="loginWithGoogle()">
              <img alt="Google sign-in" src="https://img.icons8.com/color/16/000000/google-logo.png" />
              Login with Google
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
