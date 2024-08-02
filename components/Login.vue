<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
import { useUserStore } from "~/stores/UserStore";
const email = ref("");
const password = ref("");
const remember = ref(false);

const route = useRoute();
const config = useRuntimeConfig();
const userStore = useUserStore();

defineProps({
    tenantLogo: {
        type: String,
        required: true,
    },
    tenantWebsite: {
        type: String,
        required: true,
    },
});

const submitForm = async () => {
    try {
        await userStore.login(email.value, password.value);
        await userStore.isUserLoggedIn();
        const defaultUrl = userStore.user.groups.includes("hermes")
            ? "/hermes"
            : "/datasets";
        navigateTo(route.query.redirect ? route.query.redirect : defaultUrl);
    } catch (error) {
        console.log(error);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 3000,
        });
    }
};

function loginWithGoogle() {
    const clientId = config.public.googleAuthClientId;
    const redirectUri = encodeURIComponent(config.public.googleAuthRedirectUri);
    const responseType = "code";
    const scope = encodeURIComponent("openid email profile");
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=select_account`;
    if (route.query.redirect) {
        window.location.href = redirectUrl + `&state=${route.query.redirect}`;
    } else {
        window.location.href = redirectUrl;
    }
}

onMounted(() => {
    document.getElementById("email").focus();
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

<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
    >
        <div class="flex flex-col items-center justify-center">
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
                    class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
                    style="border-radius: 53px"
                >
                    <div class="text-center mb-8">
                        <template v-if="tenantWebsite !== '/'"
                            ><NuxtLink :to="tenantWebsite" target="_blank">
                                <img
                                    :src="tenantLogo"
                                    alt="logo"
                                    class="mb-8 shrink-0"
                                    height="100"
                                />
                            </NuxtLink>
                        </template>
                        <template v-else>
                            <img
                                :src="tenantLogo"
                                alt="logo"
                                class="mb-8 shrink-0"
                                height="100"
                            />
                        </template>
                    </div>
                    <div>
                        <label
                            for="email"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
                            >Email</label
                        >
                        <InputText
                            id="email"
                            autofocus
                            v-model="email"
                            type="text"
                            placeholder="Enter username or email"
                            class="w-full md:w-[30rem] mb-8"
                            style="padding: 1rem"
                        />

                        <label
                            for="password"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
                            >Password</label
                        >
                        <Password
                            id="password"
                            v-model="password"
                            placeholder="Enter password"
                            :toggleMask="true"
                            class="w-full mb-4"
                            inputClass="w-full"
                            :inputStyle="{ padding: '1rem' }"
                            @keydown.enter="submitForm()"
                            :feedback="false"
                        ></Password>

                        <div
                            class="flex items-center justify-between mb-8 gap-8"
                        >
                            <div class="flex items-center">
                                <Checkbox
                                    id="rememberme"
                                    v-model="remember"
                                    binary
                                    class="mr-2"
                                ></Checkbox>
                                <label for="rememberme">Remember me</label>
                            </div>
                        </div>
                        <Button
                            label="Sign In"
                            class="w-full p-4 text-xl"
                            icon="bi-person"
                            @click="submitForm()"
                        ></Button>
                        <Button
                            label="Sign In With Google"
                            class="w-full p-4 text-xl mt-4"
                            icon="bi-google"
                            outlined
                            @click="loginWithGoogle()"
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
        <Toast position="top-center" />
    </div>
</template>

<style scoped>
label {
    white-space: nowrap;
}
</style>
