<template>
  <div class="form-container">
    <div class="card p-fluid">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="field">
        <label for="name">Email</label>
        <InputText v-model="user.name" placeholder="Email" autofocus />
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

      <Button label="Create User" @click="handleSubmit"/>
    </form>
    </div>
    <Toast position="top-left" />
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '~/stores/UserStore';
const store = useUserStore();
const toast = useToast();

const user = ref({
  name: '',
  password: '',
  confirmPassword: '',
  userType: null
});

const userTypes = ref([
  { name: 'Uploader', value: 'uploader' },
  { name: 'Reviewer', value: 'reviewer' }
]);

async function handleSubmit() {
  if (user.value.password !== user.value.confirmPassword) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Passwords do not match",
      life: 3000,
    });
    return;
  }
  try {
    await store.createNewHermesUser(user.value.name, user.value.password, user.value.userType);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Dataset status updated successfully",
      life: 3000,
    });
  } catch (error) {
    if (error.response.status === 409) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "User already exists",
        life: 3000,
      });
      return;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    }
  }
}
</script>

<style>
/* Add any component-specific styles here */
</style>
