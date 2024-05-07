import { useUserStore } from "~/stores/UserStore";
import { callWithNuxt } from "#app";

// so annoying https://github.com/nuxt/nuxt/issues/14269
export default defineNuxtRouteMiddleware(async (to) => {
    const config = useRuntimeConfig();
    if (config.public.skipAuth) {
        return;
    }
    const nuxtApp = useNuxtApp();
    const userStore = useUserStore();
    if (userStore.user || to.path.startsWith("/login")) {
        return;
    }
    const isLoggedIn = await userStore.isUserLoggedIn();
    console.log("isLoggedIn", isLoggedIn);
    if (!isLoggedIn) {
        return callWithNuxt(nuxtApp, navigateTo, [
            "/login?redirect=" + to.path,
        ]);
    }
    //temp route for / redirect to /data, will change later
    if (to.path === "/") {
        return callWithNuxt(nuxtApp, navigateTo, ["/data"]);
    }
});
