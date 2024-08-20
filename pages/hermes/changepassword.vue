<script setup>
import { useToast } from "primevue/usetoast";
import { useUserStore } from "~/stores/UserStore";
const store = useUserStore();
const toast = useToast();

const passwords = ref({
    newPassword: "",
    confirmPassword: "",
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
    if (passwords.value.newPassword.length < 4) {
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
    <div class="grid grid-cols-3">
        <div class="card p-fluid col-start-2">
            <h4>Change Password</h4>
            <form @submit.prevent="changePassword">
                <div class="flex flex-col grow basis-0 gap-2 mb-4">
                    <label for="newPassword" class="block">New Password</label>
                    <Password
                        id="newPassword"
                        type="password"
                        v-model="passwords.newPassword"
                        required
                        toggleMask
                        fluid
                    />
                </div>
                <div class="flex flex-col grow basis-0 gap-2 mb-8">
                    <label for="confirmPassword" class="block"
                        >Confirm New Password</label
                    >
                    <Password
                        id="confirmPassword"
                        type="password"
                        v-model="passwords.confirmPassword"
                        required
                        toggleMask
                        :feedback="false"
                        fluid
                    />
                </div>
                <div class="text-center">
                    <Button
                        label="Change Password"
                        @click="changePassword"
                        icon="bi-arrow-clockwise"
                        severity="primary"
                    />
                </div>
            </form>
        </div>

        <Toast position="top-center" />
    </div>
</template>

<style scoped></style>
