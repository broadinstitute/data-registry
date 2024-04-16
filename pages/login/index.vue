<script setup>
import { useLayout } from "@/layouts/composables/layout";
import { ref, computed } from "vue";
import { useTenantStore } from "~/stores/TenantStore";
import { useUserStore } from "~/stores/UserStore";
// import AppConfig from "@/layouts/AppConfig.vue";
const { layoutConfig } = useLayout();
const email = ref("");
const password = ref("");
const remember = ref(false);
const errorMessage = ref("");
const tenant = useTenantStore();
const tenantLogo = computed(() => {
    return tenant.assetPath + tenant.strings.logo;
});
const tenantWebsite = computed(() => {
    return tenant.strings.website;
});

const route = useRoute();
const config = useRuntimeConfig();
const userStore = useUserStore();

definePageMeta({
    layout: false,
});

const submitForm = async () => {
    try {
        await userStore.login(email.value, password.value);
        console.log(`redirect ${route.query.redirect}`);
        navigateTo(route.query.redirect ? route.query.redirect : "/hermes");
    } catch (error) {
        console.log(error);
        errorMessage.value = "Sorry, we could not log you in.";
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
        errorMessage.value = userStore.loginError;
        userStore.loginError = null;
    }
});
</script>

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
                        <template v-if="tenantWebsite != '/'"
                            ><NuxtLink :to="tenantWebsite" target="_blank">
                                <img
                                    :src="tenantLogo"
                                    alt="logo"
                                    class="mb-5 flex-shrink-0"
                                    height="100"
                                />
                            </NuxtLink>
                        </template>
                        <template v-else>
                            <img
                                :src="tenantLogo"
                                alt="logo"
                                class="mb-5 flex-shrink-0"
                                height="100"
                            />
                        </template>
                    </div>
                    <div
                        v-if="errorMessage"
                        class="alert alert-danger"
                        role="alert"
                    >
                        {{ errorMessage }}
                    </div>
                    <div>
                        <label
                            for="email"
                            class="block text-900 text-xl font-medium mb-2"
                            >Email</label
                        >
                        <InputText
                            id="email"
                            v-model="email"
                            type="text"
                            placeholder="Enter username or email"
                            class="w-full md:w-30rem mb-5"
                            style="padding: 1rem"
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
                            class="w-full mb-3"
                            inputClass="w-full"
                            :inputStyle="{ padding: '1rem' }"
                            @keydown.enter="submitForm()"
                        ></Password>

                        <div
                            class="flex align-items-center justify-content-between mb-5 gap-5"
                        >
                            <div class="flex align-items-center">
                                <Checkbox
                                    id="rememberme"
                                    v-model="remember"
                                    binary
                                    class="mr-2"
                                ></Checkbox>
                                <label for="rememberme">Remember me</label>
                            </div>
                            <a
                                class="font-medium no-underline ml-2 text-right cursor-pointer"
                                style="color: var(--primary-color)"
                                >Forgot password?</a
                            >
                        </div>
                        <Button
                            label="Sign In"
                            class="w-full p-3 text-xl"
                            icon="bi-person"
                            @click="submitForm()"
                        ></Button>
                        <Button
                            label="Sign In With Google"
                            class="w-full p-3 text-xl mt-3"
                            icon="bi-google"
                            outlined
                            @click="loginWithGoogle()"
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- <AppConfig simple /> -->
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}
.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
label {
    white-space: nowrap;
}
</style>
