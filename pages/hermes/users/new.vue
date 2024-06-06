<template>
    <div class="grid">
        <div class="col-6 col-offset-3">
            <div class="card p-fluid">
                <h4>Add new user</h4>
                <form @submit.prevent="handleSubmit" class="form">
                    <div class="field col">
                        <label for="name">Email</label>
                        <InputText
                            v-model="user.name"
                            placeholder="Email"
                            autofocus
                        />
                    </div>
                    <div class="field col">
                        <label for="password">Password</label>
                        <Password
                            v-model="user.password"
                            placeholder="Enter password"
                            toggleMask
                        />
                    </div>
                    <div class="field col">
                        <label for="confirmPassword">Confirm Password</label>
                        <Password
                            v-model="user.confirmPassword"
                            placeholder="Confirm password"
                            :feedback="false"
                            toggleMask
                        />
                    </div>

                    <div class="field col">
                        <label for="userType">User Type</label>
                        <Dropdown
                            v-model="user.userType"
                            :options="userTypes"
                            optionLabel="name"
                            placeholder="Select user type"
                        ></Dropdown>
                    </div>

                    <Button label="Create User" @click="handleSubmit" />
                </form>
            </div>
        </div>
        <Toast position="top-center" />
    </div>
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
