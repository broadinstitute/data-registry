<template>
    <Card>
        <template #header>
            <div class="p-4">
                <h3 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-2">
                    Create New SGC User
                </h3>
                <p class="text-surface-600 dark:text-surface-400">
                    Create a new user account for SGC data registry access
                </p>
            </div>
        </template>
        
        <template #content>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Email -->
                <div class="field">
                    <label for="email" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        Email *
                    </label>
                    <InputText
                        id="email"
                        v-model="formData.email"
                        type="email"
                        placeholder="Enter email address"
                        class="w-full"
                        :class="{ 'p-invalid': errors.email }"
                        :disabled="loading"
                        required
                    />
                    <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
                </div>

                <!-- First Name -->
                <div class="field">
                    <label for="firstName" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        First Name
                    </label>
                    <InputText
                        id="firstName"
                        v-model="formData.firstName"
                        placeholder="Enter first name"
                        class="w-full"
                        :disabled="loading"
                    />
                </div>

                <!-- Last Name -->
                <div class="field">
                    <label for="lastName" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        Last Name
                    </label>
                    <InputText
                        id="lastName"
                        v-model="formData.lastName"
                        placeholder="Enter last name"
                        class="w-full"
                        :disabled="loading"
                    />
                </div>

                <!-- User Type -->
                <div class="field">
                    <label for="userType" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        User Type *
                    </label>
                    <Dropdown
                        id="userType"
                        v-model="formData.userType"
                        :options="userTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select user type"
                        class="w-full"
                        :class="{ 'p-invalid': errors.userType }"
                        :disabled="loading"
                        required
                    />
                    <small v-if="errors.userType" class="p-error">{{ errors.userType }}</small>
                    <small class="text-surface-600 dark:text-surface-400 mt-1 block">
                        <strong>Reviewer:</strong> Can review and approve submissions, create new users<br>
                        <strong>Uploader:</strong> Can upload cohort data and metadata
                    </small>
                </div>

                <!-- Password -->
                <div class="field">
                    <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        Password *
                    </label>
                    <Password
                        id="password"
                        v-model="formData.password"
                        placeholder="Enter password"
                        class="w-full"
                        inputClass="w-full"
                        :class="{ 'p-invalid': errors.password }"
                        :disabled="loading"
                        :feedback="true"
                        :toggleMask="true"
                        required
                    />
                    <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
                </div>

                <!-- Confirm Password -->
                <div class="field">
                    <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        Confirm Password *
                    </label>
                    <Password
                        id="confirmPassword"
                        v-model="formData.confirmPassword"
                        placeholder="Confirm password"
                        class="w-full"
                        inputClass="w-full"
                        :class="{ 'p-invalid': errors.confirmPassword }"
                        :disabled="loading"
                        :feedback="false"
                        :toggleMask="true"
                        required
                    />
                    <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="flex justify-content-end gap-3">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    severity="secondary"
                    outlined
                    @click="handleCancel"
                    :disabled="loading"
                />
                <Button
                    label="Create User"
                    icon="pi pi-user-plus"
                    @click="handleSubmit"
                    :loading="loading"
                    :disabled="!isFormValid"
                />
            </div>
        </template>
    </Card>

    <Toast position="top-center" />
</template>

<script setup>
import { useUserStore } from "~/stores/UserStore";
import { useToast } from "primevue/usetoast";

const emit = defineEmits(['user-created', 'cancel']);

const userStore = useUserStore();
const toast = useToast();

const loading = ref(false);
const formData = ref({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    userType: ''
});

const errors = ref({});

const userTypeOptions = ref([
    { label: 'Reviewer', value: 'reviewer' },
    { label: 'Uploader', value: 'uploader' }
]);

const isFormValid = computed(() => {
    return formData.value.email &&
           formData.value.password &&
           formData.value.confirmPassword &&
           formData.value.userType;
});

const validateForm = () => {
    errors.value = {};

    if (!formData.value.email) {
        errors.value.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        errors.value.email = 'Please enter a valid email address';
    }

    if (!formData.value.userType) {
        errors.value.userType = 'User type is required';
    }

    if (!formData.value.password) {
        errors.value.password = 'Password is required';
    } else if (formData.value.password.length < 8) {
        errors.value.password = 'Password must be at least 8 characters long';
    }

    if (!formData.value.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm the password';
    } else if (formData.value.password !== formData.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match';
    }

    return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
    if (!validateForm()) {
        return;
    }

    loading.value = true;

    try {
        const result = await userStore.createSGCUser(formData.value, formData.value.userType);
        
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `User "${formData.value.email}" created successfully`,
            life: 5000
        });

        emit('user-created', result);
        
        // Reset form
        formData.value = {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            userType: ''
        };

    } catch (error) {
        console.error('Error creating user:', error);
        
        let errorMessage = 'Failed to create user';
        if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error.message) {
            errorMessage = error.message;
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    emit('cancel');
};

// Focus email field when component mounts
onMounted(() => {
    nextTick(() => {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.focus();
        }
    });
});
</script>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}

.p-error {
    color: var(--red-500);
    font-size: 0.875rem;
}
</style>
