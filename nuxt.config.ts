// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },
    app: {
        head: {
            title: "KPN Data Registry",
            // link: [
            //     {
            //         id: "theme-css",
            //         rel: "stylesheet",
            //         type: "text/css",
            //         href: "/themes/aura-light-indigo/theme.css",
            //     },
            // ],
        },
    },
    // css: [
    //     "bootstrap/dist/css/bootstrap.css",
    //     "bootstrap-icons/font/bootstrap-icons.css",
    //     "assets/css/styles.css",
    //     "assets/css/base.css",
    // ],
    css: [
        //"bootstrap/dist/css/bootstrap.css",
        "bootstrap-icons/font/bootstrap-icons.css",
        //"assets/css/styles.css",
        "primeicons/primeicons.css",
        "primeflex/primeflex.scss",
        "primevue/resources/primevue.min.css",
        "@/assets/styles.scss",
        // "assets/css/base.css",
        "primevue/resources/themes/aura-light-indigo/theme.css",
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
        "@pinia/nuxt",
        "@nuxt/devtools", // "@nuxtjs/tailwindcss",
        "nuxt-primevue",
        "nuxt-shiki",
    ],
    primevue: {
        options: { unstyled: false, ripple: true },
        //importPT: {
        //    from: "/presets/lara/",
        //}, //import and apply preset
        components: {
            // prefix: "Prime",
        },
    },
    shiki: {
        bundledLangs: [
            "javascript",
            "typescript",
            "json",
            "html",
            "css",
            "scss",
            "yaml",
            "markdown",
            "r",
        ],
    },

    // https://stackoverflow.com/questions/74003458/cannot-find-module-pinia-dist-pinia-mjs-when-using-run-dev
    alias: {
        pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
    },
    telemetry: false,
    plugins: [{ src: "~/plugins/bootstrap.js", mode: "client" }],
});
