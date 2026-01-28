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
                        <!-- Fun mouse illustration -->
                        <div class="mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="120" height="120">
                                <!-- Wheel group (spins) -->
                                <g class="wheel-spin">
                                    <!-- Exercise wheel rim -->
                                    <circle cx="100" cy="100" r="70" fill="none" stroke="#cbd5e1" stroke-width="8"/>
                                    <circle cx="100" cy="100" r="55" fill="none" stroke="#e2e8f0" stroke-width="2"/>
                                    <!-- Wheel spokes -->
                                    <line x1="100" y1="30" x2="100" y2="170" stroke="#e2e8f0" stroke-width="2"/>
                                    <line x1="30" y1="100" x2="170" y2="100" stroke="#e2e8f0" stroke-width="2"/>
                                    <line x1="50" y1="50" x2="150" y2="150" stroke="#e2e8f0" stroke-width="2"/>
                                    <line x1="150" y1="50" x2="50" y2="150" stroke="#e2e8f0" stroke-width="2"/>
                                </g>
                                <!-- Wheel stand (stationary) - A-frame base -->
                                <path d="M 100 170 L 100 185 M 100 185 L 70 195 M 100 185 L 130 195" stroke="#94a3b8" stroke-width="6" fill="none" stroke-linecap="round"/>
                                <!-- Mouse group (stationary with bobbing) -->
                                <g class="mouse-bob">
                                    <!-- Mouse body -->
                                    <ellipse cx="95" cy="95" rx="25" ry="18" fill="#9ca3af"/>
                                    <!-- Mouse head -->
                                    <circle cx="118" cy="88" r="12" fill="#9ca3af"/>
                                    <!-- Mouse ear -->
                                    <circle cx="126" cy="78" r="7" fill="#d1d5db"/>
                                    <circle cx="126" cy="78" r="4" fill="#fecaca"/>
                                    <!-- Mouse eye -->
                                    <circle cx="124" cy="86" r="2" fill="#1f2937"/>
                                    <!-- Mouse nose -->
                                    <circle cx="130" cy="90" r="2" fill="#f472b6"/>
                                    <!-- Mouse tail -->
                                    <path d="M 70 98 Q 50 105 45 120" stroke="#9ca3af" stroke-width="3" fill="none" stroke-linecap="round"/>
                                    <!-- Mouse legs (running) -->
                                    <line x1="85" y1="108" x2="80" y2="118" stroke="#9ca3af" stroke-width="4" stroke-linecap="round" class="leg-back"/>
                                    <line x1="105" y1="108" x2="115" y2="115" stroke="#9ca3af" stroke-width="4" stroke-linecap="round" class="leg-front"/>
                                </g>
                            </svg>
                        </div>
                        <div class="text-900 text-3xl font-medium mb-3">
                            CALR Data Registry
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
  layout: 'calr',
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
    const success = await userStore.loginCALR(username.value, password.value);

    if (success) {
      // Redirect to intended page or default to CALR home
      const redirectPath = route.query.redirect || '/calr';
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
    document.getElementById("username")?.focus();
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

.wheel-spin {
    transform-origin: 100px 100px;
    animation: spin 3s linear infinite;
}

.mouse-bob {
    animation: bob 0.3s ease-in-out infinite;
}

.leg-back {
    transform-origin: 85px 108px;
    animation: leg-move 0.15s ease-in-out infinite alternate;
}

.leg-front {
    transform-origin: 105px 108px;
    animation: leg-move 0.15s ease-in-out infinite alternate-reverse;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
}

@keyframes leg-move {
    from { transform: rotate(-10deg); }
    to { transform: rotate(10deg); }
}
</style>
