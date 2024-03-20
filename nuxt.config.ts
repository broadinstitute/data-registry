// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: {
        enabled: true,
    },
    app: {
        head: {
            title: "KPN Data Registry",
            link: [
                {
                    id: "theme-css",
                    rel: "stylesheet",
                    type: "text/css",
                    href: "/themes/lara-light-indigo/theme.css",
                },
            ],
        },
    },
    // css: [
    //     "bootstrap/dist/css/bootstrap.css",
    //     "bootstrap-icons/font/bootstrap-icons.css",
    //     "assets/css/styles.css",
    //     "assets/css/base.css",
    // ],
    css: [
        "bootstrap/dist/css/bootstrap.css",
        "bootstrap-icons/font/bootstrap-icons.css",
        "assets/css/styles.css",
        "primeicons/primeicons.css",
        "primeflex/primeflex.scss",
        "primevue/resources/primevue.min.css",
        "@/assets/styles.scss",
        // "assets/css/base.css",
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
        "@nuxt/devtools",
        "nuxt-primevue",
        // "@nuxtjs/tailwindcss",
    ],
    primevue: {
        options: { unstyled: true },
        importPT: {
            from: "/presets/lara/",
        }, //import and apply preset
        components: {
            // prefix: "Prime",
        },
    },

    // https://stackoverflow.com/questions/74003458/cannot-find-module-pinia-dist-pinia-mjs-when-using-run-dev
    alias: {
        pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
    },
    telemetry: false,
    plugins: [{ src: "~/plugins/bootstrap.js", mode: "client" }],
});
