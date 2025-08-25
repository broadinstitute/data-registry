<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
    >
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="
                    border-radius: 56px;
                    padding: 0.3rem;
                    background: linear-gradient(
                        180deg,
                        var(--primary-color) 10%,
                        rgba(33, 150, 243, 0) 30%
                    );
                "
            >
                <div
                    class="w-full surface-card py-8 px-5 sm:px-8"
                    style="border-radius: 53px"
                >
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">
                            SGC Data Registry
                        </div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>
                    <div>
                        <label
                            for="username"
                            class="block text-900 text-xl font-medium mb-2"
                            >Username</label
                        >
                        <InputText
                            id="username"
                            autofocus
                            v-model="username"
                            type="text"
                            placeholder="Enter username"
                            class="w-full md:w-30rem mb-5"
                            style="padding: 1rem"
                            :class="{ 'p-invalid': loginError }"
                        />

                        <label
                            for="password"
                            class="block text-900 font-medium text-xl mb-2"
                            >Password</label
                        >
                        <Password
                            id="password"
                            v-model="password"
                            placeholder="Enter password"
                            :toggleMask="true"
                            class="w-full mb-5"
                            inputClass="w-full"
                            :inputStyle="{ padding: '1rem' }"
                            @keydown.enter="handleLogin"
                            :feedback="false"
                            :class="{ 'p-invalid': loginError }"
                        ></Password>

                        <div v-if="loginError" class="text-red-500 text-sm mb-3">
                            {{ loginError }}
                        </div>

                        <Button
                            :loading="loading"
                            label="Sign In"
                            class="w-full p-3 text-xl"
                            icon="bi-person"
                            @click="handleLogin"
                            :disabled="!username || !password"
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
        <Toast position="top-center" />
    </div>
</template>

<script setup>
import { useUserStore } from "~/stores/UserStore";
import { useToast } from "primevue/usetoast";

const toast = useToast();

definePageMeta({
  layout: 'empty',
  middleware: []  // Skip auth middleware for login page
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Form data
const username = ref('');
const password = ref('');
const loading = ref(false);
const loginError = ref('');

// Handle login form submission
async function handleLogin() {
  if (!username.value || !password.value) {
    loginError.value = 'Please enter both username and password';
    return;
  }
  
  loading.value = true;
  loginError.value = '';
  
  try {
    const success = await userStore.loginSGC(username.value, password.value);
    
    if (success) {
      // Redirect to intended page or default to SGC home
      const redirectPath = route.query.redirect || '/sgc';
      await router.push(redirectPath);
    } else {
      loginError.value = userStore.loginError || 'Login failed. Please check your credentials.';
    }
  } catch (error) {
    console.error('Login error:', error);
    loginError.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
}

// Clear error when user starts typing
watch([username, password], () => {
  if (loginError.value) {
    loginError.value = '';
  }
});

// Focus username field on mount and show any existing login errors
onMounted(() => {
    document.getElementById("username").focus();
    if (userStore.loginError) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: userStore.loginError,
            life: 3000,
        });
        userStore.loginError = null;
    }
});
</script>

<style scoped>
label {
    white-space: nowrap;
}
</style>