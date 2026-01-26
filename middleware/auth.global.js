import { useUserStore } from "~/stores/UserStore";
import { callWithNuxt } from "#app";

// so annoying https://github.com/nuxt/nuxt/issues/14269
export default defineNuxtRouteMiddleware(async (to) => {
    const config = useRuntimeConfig();
    if (config.public.skipAuth) {
        return;
    }
    const nuxtApp = useNuxtApp();
    if(to.path.startsWith('/login') || to.path.startsWith('/hermes/login') || to.path.startsWith('/sgc/login') || to.path.startsWith('/peg/login')){
        return;
    }
    
    // Skip authentication for MSKKP routes
    if (to.path.startsWith('/mskkp')) {
        return;
    }
    
    const userStore = useUserStore();
    let isLoggedIn = false;

    // Check SGC authentication for SGC routes
    if (to.path.startsWith('/sgc')) {
        isLoggedIn = await userStore.isSGCUserLoggedIn();
        
        if (!isLoggedIn) {
            return callWithNuxt(nuxtApp, navigateTo, ['/sgc/login?redirect=' + to.path]);
        }
        // User is authenticated for SGC, allow access
        return;
    }

    // Check PEG authentication for PEG routes
    if (to.path.startsWith('/peg')) {
        isLoggedIn = await userStore.isPEGUserLoggedIn();
        
        if (!isLoggedIn) {
            return callWithNuxt(nuxtApp, navigateTo, ['/peg/login?redirect=' + to.path]);
        }
        // User is authenticated for PEG, allow access
        return;
    }

    // For non-SGC routes, use existing authentication
    isLoggedIn = await userStore.isUserLoggedIn();
    
    if (isLoggedIn && userStore.user && JSON.stringify(userStore.user.groups) === JSON.stringify(['hermes'])
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
