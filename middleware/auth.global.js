import { useUserStore } from "~/stores/UserStore";
import { callWithNuxt } from "#app";

// so annoying https://github.com/nuxt/nuxt/issues/14269
export default defineNuxtRouteMiddleware(async (to) => {
    const config = useRuntimeConfig();
    if (config.public.skipAuth) {
        return;
    }
    const nuxtApp = useNuxtApp();
    if(to.path.startsWith('/login') || to.path.startsWith('/hermes/login')){
        return;
    }
    const userStore = useUserStore();
    const isLoggedIn = await userStore.isUserLoggedIn();
    if (userStore.user && JSON.stringify(userStore.user.groups) === JSON.stringify(['hermes'])
      && !to.path.startsWith('/hermes')) {
        // eslint-disable-next-line no-undef
        throw createError({
            statusCode: 403,
            message: 'Forbidden',
        });
    }

    if (userStore.user) {
        return;
    }

    if (!isLoggedIn) {
        if (to.path.startsWith('/hermes')) {
            return callWithNuxt(nuxtApp, navigateTo, ['/hermes/login?redirect=' + to.path]);
        } else {
            return callWithNuxt(nuxtApp, navigateTo, ['/login?redirect=' + to.path]);
        }
    }
});
