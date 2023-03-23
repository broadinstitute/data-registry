// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    telemetry: false,
    css: ["bootstrap", "~/assets/css/styles.css"],
    vite: {
        optimizeDeps: {
            exclude: ["resolveComponent"],
        },
    },
    runtimeConfig: {
        public: {
            apiSecret: "",
            apiBaseUrl: "",
            phenotypesUrl: "",
        },
    },
    modules: ["@nuxt/devtools"],
});
