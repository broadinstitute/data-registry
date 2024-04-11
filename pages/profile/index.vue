<script setup>
import { useUserStore } from '~/stores/UserStore';
const store = useUserStore();

const password1 = ref('');
const password2 = ref('');
const errorMessage = ref('');
const passwordChanged = ref(false);
async function changePassword() {
  errorMessage.value = '';
  passwordChanged.value = false;
  if (password1.value !== password2.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }
  if(password1.value === ''){
    errorMessage.value = 'Password cannot be empty';
    return;
  }
  try {
    await store.changePassword(password1.value);
    passwordChanged.value = true;
  } catch (error) {
    console.log(error);
    errorMessage.value = error.message;
  }
}

async function copyApiToken(){
  await navigator.clipboard.writeText(store.user.api_token);
}

</script>

<template>
  <div class="container py-4">
    <h3 class="mb-4">User Profile</h3>

    <div class="card mb-4">
      <div class="card-body">
        <p class="card-text"><strong>User:</strong> {{ store.user.user_name }}</p>
        <p class="card-text"><strong>Roles:</strong> {{ store.user.roles.join(', ') }}</p>
        <p class="card-text">
          <strong>API Token:</strong>
          <button class="btn btn-outline-secondary btn-sm" @click="copyApiToken">
            <i class="bi-clipboard"></i>
          </button>
        </p>
      </div>
    </div>

    <div v-if="store.user.is_internal">
      <hr>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title text-center">Change Password</h5>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
          <div v-if="passwordChanged" class="alert alert-success" role="alert">
            Password changed successfully
          </div>

          <form @submit.prevent="changePassword">
            <div class="mb-3">
              <input id="password1" v-model="password1" type="password" class="form-control"
                     placeholder="New Password">
            </div>
            <div class="mb-3">
              <input id="password2" v-model="password2" type="password" class="form-control"
                     placeholder="Confirm New Password">
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
