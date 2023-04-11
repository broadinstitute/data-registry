<template>
  <div v-if="showNotification">
    <div v-if="success" class="alert alert-success" role="alert">
      Successfully added dataset
    </div>
    <div v-else class="alert alert-danger" role="alert">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({message: String, success: Boolean, showNotification: Boolean})
</script>


