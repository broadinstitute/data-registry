<script setup>
import { InputText, Button } from 'primevue/components';

const passwords = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const changePassword = () => {
  // Validate passwords match and are not empty
  if (!passwords.value.oldPassword || !passwords.value.newPassword || !passwords.value.confirmPassword) {
    alert('Please fill out all fields.');
    return;
  }
  if (passwords.value.newPassword !== passwords.value.confirmPassword) {
    alert('New passwords do not match.');
    return;
  }
  // Here, you can call an API to change the password
  console.log('Password changed successfully!', passwords.value);
  // Reset form
  passwords.value.oldPassword = '';
  passwords.value.newPassword = '';
  passwords.value.confirmPassword = '';
};
</script>

<template>
  <div>
    <h2>Change Password</h2>
    <form @submit.prevent="changePassword">
      <div class="p-field">
        <label for="oldPassword">Old Password</label>
        <InputText id="oldPassword" type="password" v-model="passwords.oldPassword" />
      </div>
      <div class="p-field">
        <label for="newPassword">New Password</label>
        <InputText id="newPassword" type="password" v-model="passwords.newPassword" />
      </div>
      <div class="p-field">
        <label for="confirmPassword">Confirm New Password</label>
        <InputText id="confirmPassword" type="password" v-model="passwords.confirmPassword" />
      </div>
      <Button label="Change Password" />
    </form>
  </div>
</template>

<style scoped>

</style>
