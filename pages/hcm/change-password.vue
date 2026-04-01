<template>
    <div class="flex justify-content-center">
        <div class="w-full md:w-6 lg:w-4">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>

            <div class="surface-card p-4 border-round">
                <div class="mb-4">
                    <label for="newPassword" class="block text-900 font-medium mb-2">New Password</label>
                    <Password
                        id="newPassword"
                        v-model="newPassword"
                        placeholder="Enter new password"
                        :toggleMask="true"
                        class="w-full"
                        inputClass="w-full"
                        :feedback="false"
                        :class="{ 'p-invalid': errors.newPassword }"
                    />
                    <small v-if="errors.newPassword" class="p-error">{{ errors.newPassword }}</small>
                </div>

                <div class="mb-5">
                    <label for="confirmPassword" class="block text-900 font-medium mb-2">Confirm Password</label>
                    <Password
                        id="confirmPassword"
                        v-model="confirmPassword"
                        placeholder="Confirm new password"
                        :toggleMask="true"
                        class="w-full"
                        inputClass="w-full"
                        :feedback="false"
                        :class="{ 'p-invalid': errors.confirmPassword }"
                        @keydown.enter="handleSubmit"
                    />
                    <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
                </div>

                <Button
                    label="Update Password"
                    class="w-full"
                    :loading="loading"
                    :disabled="!newPassword || !confirmPassword"
                    @click="handleSubmit"
                />
            </div>
        </div>

        <Toast position="top-center" />
    </div>
</template>

<script setup>
import { useUserStore } from "~/stores/UserStore";
import { useToast } from "primevue/usetoast";

const userStore = useUserStore();
const toast = useToast();

const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errors = ref({});

function validate() {
    errors.value = {};
    if (!newPassword.value) {
        errors.value.newPassword = 'Password is required';
    }
    if (newPassword.value !== confirmPassword.value) {
        errors.value.confirmPassword = 'Passwords do not match';
    }
    return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
    if (!validate()) return;

    loading.value = true;
    try {
        await userStore.changeHCMPassword(newPassword.value);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Password updated successfully', life: 3000 });
        newPassword.value = '';
        confirmPassword.value = '';
    } catch (error) {
        const detail = error?.data?.error || 'Failed to update password. Please try again.';
        toast.add({ severity: 'error', summary: 'Error', detail, life: 4000 });
    } finally {
        loading.value = false;
    }
}
</script>
