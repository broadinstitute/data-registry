<template>
  <div v-if="showNotification && isVisible">
    <div v-if="success" class="alert alert-success" role="alert">
      {{ successMessage ? successMessage : 'Success!' }}
    </div>
    <div v-else class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps(
    {errorMessage: String,
      success: Boolean,
      successMessage: String,
      displayNotificationSeconds: {
        type: Number,
        default: 7
      },
      showNotification: Boolean})
const isVisible = ref(true);


watch(() => props.showNotification, (newValue) => {
  if (newValue) {
    isVisible.value = true;
    setTimeout(() => {
      isVisible.value = false;
    }, props.displayNotificationSeconds * 1000);
  }
});


</script>


