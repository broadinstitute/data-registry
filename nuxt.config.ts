// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    css: ["bootstrap/dist/css/bootstrap.css", "bootstrap-icons/font/bootstrap-icons.css", "assets/css/styles.css"],
    vite: {
        server: {
            // specify a know port, so we can use it in docker invocations
            hmr: {
                clientPort: 24600,
                port: 24600,
            },
        },
    },
    runtimeConfig: {
        public: {
            apiSecret: "",
            apiBaseUrl: "",
            apiDrupalUrl: "",
            phenotypesUrl: "",
        },
    },
    modules: ["@nuxt/devtools", "@pinia/nuxt"],
    // https://stackoverflow.com/questions/74003458/cannot-find-module-pinia-dist-pinia-mjs-when-using-run-dev
    alias: {
        pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
    },
    telemetry: false,
});
