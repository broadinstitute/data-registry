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
                        <img
                            src="/tenants/peg/icon_1.png"
                            alt="PEGASUS"
                            class="mb-3"
                            style="height: 64px; width: auto"
                        />
                        <div class="text-900 text-3xl font-medium mb-3">
                            Create a PEG account
                        </div>
                        <span class="text-600 font-medium"
                            >Sign up to submit PEG data</span
                        >
                    </div>

                    <div v-if="success" class="peg-welcome-panel mb-5">
                        <div class="text-primary font-semibold mb-2">
                            {{ existingUser ? 'You already have an account' : 'Account created' }}
                        </div>
                        <p v-if="existingUser" class="text-700 line-height-3 mb-3">
                            Your email <strong>{{ submittedEmail }}</strong> already
                            has an account, so we've given it access to PEG. Your
                            password is unchanged — sign in with your existing
                            password.
                        </p>
                        <p v-else class="text-700 line-height-3 mb-3">
                            Your account <strong>{{ submittedEmail }}</strong> has
                            been created. You can now sign in.
                        </p>
                        <Button
                            label="Go to sign in"
                            class="w-full"
                            icon="bi-person"
                            @click="goToLogin"
                        />
                    </div>

                    <div v-else>
                        <label
                            for="email"
                            class="block text-900 text-xl font-medium mb-2"
                            >Email</label
                        >
                        <InputText
                            id="email"
                            autofocus
                            v-model="email"
                            type="email"
                            placeholder="you@example.com"
                            class="w-full md:w-30rem mb-4"
                            style="padding: 1rem"
                            :class="{ 'p-invalid': formError }"
                        />

                        <label
                            for="password"
                            class="block text-900 font-medium text-xl mb-2"
                            >Password</label
                        >
                        <Password
                            id="password"
                            v-model="password"
                            placeholder="Choose a password"
                            :toggleMask="true"
                            class="w-full mb-4"
                            inputClass="w-full"
                            :inputStyle="{ padding: '1rem' }"
                            :feedback="true"
                            :class="{ 'p-invalid': formError }"
                        ></Password>

                        <label
                            for="confirmPassword"
                            class="block text-900 font-medium text-xl mb-2"
                            >Confirm password</label
                        >
                        <Password
                            id="confirmPassword"
                            v-model="confirmPassword"
                            placeholder="Re-enter password"
                            :toggleMask="true"
                            class="w-full mb-4"
                            inputClass="w-full"
                            :inputStyle="{ padding: '1rem' }"
                            :feedback="false"
                            @keydown.enter="handleSubmit"
                            :class="{ 'p-invalid': formError }"
                        ></Password>

                        <div v-if="formError" class="text-red-500 text-sm mb-3">
                            {{ formError }}
                        </div>

                        <Button
                            :loading="loading"
                            label="Create account"
                            class="w-full p-3 text-xl"
                            icon="bi-person-plus"
                            @click="handleSubmit"
                            :disabled="!email || !password || !confirmPassword"
                        ></Button>

                        <div class="text-center mt-4">
                            <span class="text-600">Already have an account? </span>
                            <NuxtLink
                                to="/peg/login"
                                class="font-semibold text-primary"
                                >Sign in</NuxtLink
                            >
                        </div>
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
  layout: 'peg',
  middleware: []
});

const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const formError = ref('');
const success = ref(false);
const existingUser = ref(false);
const submittedEmail = ref('');

function isValidEmail(value) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

async function handleSubmit() {
  formError.value = '';

  if (!isValidEmail(email.value)) {
    formError.value = 'Please enter a valid email address.';
    return;
  }
  if (password.value.length < 8) {
    formError.value = 'Password must be at least 8 characters.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match.';
    return;
  }

  loading.value = true;
  try {
    const result = await userStore.createPEGUser(email.value, password.value);
    submittedEmail.value = email.value;
    existingUser.value = !!result?.existing_user;
    success.value = true;
    toast.add({
      severity: 'success',
      summary: existingUser.value ? 'Account access granted' : 'Account created',
      detail: existingUser.value
        ? 'This email already had an account — sign in with your existing password.'
        : 'You can now sign in with your new credentials.',
      life: 4000,
    });
  } catch (error) {
    const status = error?.response?.status;
    const detail = error?.response?.data?.detail;
    const detailText = typeof detail === 'string' ? detail : JSON.stringify(detail || '');
    if (status === 409 || /already.*exist|exist.*already/i.test(detailText)) {
      formError.value = 'An account with that email already exists.';
    } else if (status === 503) {
      formError.value = 'Account creation is temporarily unavailable. Please try again later.';
    } else if (typeof detail === 'string') {
      formError.value = detail;
    } else if (detail && typeof detail === 'object') {
      const firstKey = Object.keys(detail)[0];
      const firstVal = firstKey ? detail[firstKey] : null;
      if (Array.isArray(firstVal)) {
        formError.value = firstVal[0];
      } else if (typeof firstVal === 'string') {
        formError.value = firstVal;
      } else {
        formError.value = 'Could not create account.';
      }
    } else {
      formError.value = 'Could not create account. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push('/peg/login');
}

onMounted(() => {
  document.getElementById('email')?.focus();
});
</script>

<style scoped>
label {
    white-space: nowrap;
}

.peg-welcome-panel {
    background: #eff6ff;
    border: 1px solid #dbeafe;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    width: 100%;
    max-width: 30rem;
}
</style>
