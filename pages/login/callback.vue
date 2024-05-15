<script setup>
definePageMeta({
  layout: false,
});
import { useUserStore } from '~/stores/UserStore';


const route = useRoute();
const userStore = useUserStore();

onMounted(async () => {
  const code = route.query.code;
  if (code) {
    try {
      await userStore.loginWithGoogle(code);
      if (route.query.state) {
        navigateTo(route.query.state);
      } else {
        navigateTo('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        userStore.loginError = "Your Google account is not registered with us.";
      }
      navigateTo('/login');
    }
  }
});

</script>

<template>
  <div>
    <p>Logging in..</p>
  </div>
</template>

<style scoped>

</style>
