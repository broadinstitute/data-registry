// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    css: ["bootstrap", "~/assets/css/styles.css"],
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
            apiBaseUrl: "http://ec2-52-23-213-123.compute-1.amazonaws.com",
            phenotypesUrl: "",
        },
    },
    modules: ["@nuxt/devtools"],
    telemetry: false,
});
