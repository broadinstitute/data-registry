<template>
  <div class="form-container">
    <div class="card p-fluid">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="field">
        <label for="name">Username/Email</label>
        <InputText v-model="user.name" placeholder="Username/Email" autofocus />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <Password v-model="user.password" placeholder="Enter password"/>
      </div>
      <div class="field">
        <label for="confirmPassword">Confirm Password</label>
        <password v-model="user.confirmPassword" placeholder="Confirm password" />
      </div>

      <div class="field">
        <label for="userType">User Type</label>
        <dropdown
            v-model="user.userType"
            :options="userTypes"
            optionLabel="name"
            placeholder="Select user type"
        ></dropdown>
      </div>


      <Button label="Create User" />
    </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const user = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: null
});

const userTypes = ref([
  { name: 'Uploader', value: 'uploader' },
  { name: 'Reviewer', value: 'reviewer' }
]);

function handleSubmit() {
  if (user.value.password !== user.value.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  console.log('User created:', user.value);
  // Handle user creation logic here
}
</script>

<style>
/* Add any component-specific styles here */
</style>
