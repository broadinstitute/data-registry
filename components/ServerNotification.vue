<template>
  <div v-if="showNotification">
    <div v-if="success" class="alert alert-success" role="alert">
      {{ successMessage ? successMessage : 'Success!' }}
    </div>
    <div v-else class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({errorMessage: String, success: Boolean, successMessage: String, showNotification: Boolean})
</script>


