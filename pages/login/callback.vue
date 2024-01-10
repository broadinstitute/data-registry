<script setup>
import { useUserStore } from '~/stores/UserStore';


const route = useRoute();
const userStore = useUserStore();

onMounted(async () => {
  const code = route.query.code;
  console.log("Hello");
  if (code) {
    // try {
    console.log(code);
      await userStore.loginWithGoogle(code);
    //   if (route.query.state) {
    //     navigateTo(route.query.state);
    //   } else {
    //     navigateTo('/');
    //   }
    // } catch (error) {
    //   console.log(error);
      // navigateTo('/login');
    // }
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
