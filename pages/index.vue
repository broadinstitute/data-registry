<template>
  <div>
    Data Registry
  </div>
</template>
<script setup>
  import { useRouter } from "vue-router";
  const router = useRouter();
  onMounted(() => router.replace({path: '/configbuilder'}));
</script>
