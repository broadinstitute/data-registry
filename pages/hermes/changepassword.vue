<script setup>
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '~/stores/UserStore';
const store = useUserStore();
const toast = useToast();

const passwords = ref({
  newPassword: '',
  confirmPassword: ''
});

const changePassword = async () => {

  if (passwords.value.newPassword !== passwords.value.confirmPassword) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Passwords do not match",
      life: 3000,
    });
    return;
  }
  if(passwords.value.newPassword.length < 4) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Password must be at least 4 characters",
      life: 3000,
    });
    return;
  }

  try {
    await store.changePassword(passwords.value.newPassword);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `Password changed successfully`,
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  }
};
</script>

<template>
    <div class="form-container">
      <div class="card p-fluid">
        <form @submit.prevent="changePassword">
          <div class="field">
            <label for="newPassword">New Password</label>
            <Password id="newPassword" type="password" v-model="passwords.newPassword" required/>
          </div>
          <div class="field">
            <label for="confirmPassword">Confirm New Password</label>
            <Password id="confirmPassword" type="password" v-model="passwords.confirmPassword" required />
          </div>
          <Button label="Change Password" @click="changePassword"/>
        </form>
      </div>
      <Toast position="top-left" />
    </div>
</template>

<style scoped>

</style>
