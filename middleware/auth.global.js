import { useUserStore } from "~/stores/UserStore";
import { callWithNuxt } from "#app";

// so annoying https://github.com/nuxt/nuxt/issues/14269
export default defineNuxtRouteMiddleware(async (to) => {
    const config = useRuntimeConfig()
    if (config.public.skipAuth) {
        return;
    }
    const nuxtApp = useNuxtApp();
    const userStore = useUserStore();
    if (userStore.user || to.path.startsWith('/login') || to.path.startsWith('/hermes/login')) {
        return;
    }
    const isLoggedIn = await userStore.isUserLoggedIn();
    if (!isLoggedIn) {
        if (to.path.startsWith('/hermes')) {
            return callWithNuxt(nuxtApp, navigateTo, ['/hermes/login?redirect=' + to.path]);
        } else {
            return callWithNuxt(nuxtApp, navigateTo, ['/login?redirect=' + to.path]);
        }

    }
});
