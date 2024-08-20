<template>
    <div class="grid grid-cols-4">
        <Card class="form col-start-2 col-span-2">
            <template #title>Add new user</template>
            <template #content>
                <form @submit.prevent="handleSubmit">
                    <div class="grid grid-cols-2 gap-4 mb-2">
                        <label for="name">Email</label>
                        <InputText
                            v-model="user.name"
                            placeholder="Email"
                            autofocus
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-2">
                        <label for="password">Password</label>
                        <Password
                            v-model="user.password"
                            placeholder="Enter password"
                            toggleMask
                            fluid
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-2">
                        <label for="confirmPassword">Confirm Password</label>
                        <Password
                            v-model="user.confirmPassword"
                            placeholder="Confirm password"
                            :feedback="false"
                            toggleMask
                            fluid
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-8">
                        <label for="userType">User Type</label>
                        <Select
                            v-model="user.userType"
                            :options="userTypes"
                            optionLabel="name"
                            placeholder="Select user type"
                        ></Select>
                    </div>
                    <div class="text-center">
                        <Button
                            label="Create User"
                            @click="handleSubmit"
                            severity="primary"
                            icon="bi-person-plus-fill"
                        />
                    </div>
                </form>
            </template>
        </Card>
    </div>

    <Toast position="top-center" />
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useUserStore } from "~/stores/UserStore";
const store = useUserStore();
const toast = useToast();

const user = ref({
    name: "",
    password: "",
    confirmPassword: "",
    userType: null,
});

const userTypes = ref([
    { name: "Uploader", value: "uploader" },
    { name: "Reviewer", value: "reviewer" },
]);

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}

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

    if (!isValidEmail(user.value.name)) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Invalid email address",
            life: 3000,
        });
        return;
    }

    try {
        await store.createNewHermesUser(
            user.value.name,
            user.value.password,
            user.value.userType,
        );
        toast.add({
            severity: "success",
            summary: "Success",
            detail: `User ${user.value.name} created successfully`,
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

<style></style>
