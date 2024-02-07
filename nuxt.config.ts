// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: {
        enabled: true,
    },
    css: [
        "bootstrap/dist/css/bootstrap.css",
        "bootstrap-icons/font/bootstrap-icons.css",
        "assets/css/styles.css",
        "assets/css/base.css",
    ],
    runtimeConfig: {
        public: {
            skipAuth: false,
            apiBaseUrl: "",
            phenotypesUrl: "",
            googleAuthClientId: "",
            googleAuthRedirectUri: "",
        },
    },
    modules: [
        "@nuxt/devtools",
        "@pinia/nuxt",
        "nuxt-primevue",
        "@nuxtjs/tailwindcss",
    ],
    primevue: {
        options: { unstyled: true },
        importPT: {
            from: "/presets/lara/",
        }, //import and apply preset
        components: {
            prefix: "Prime",
        },
    },

    // https://stackoverflow.com/questions/74003458/cannot-find-module-pinia-dist-pinia-mjs-when-using-run-dev
    alias: {
        pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
    },
    telemetry: false,
    plugins: [{ src: "~/plugins/bootstrap.js", mode: "client" }],
});
