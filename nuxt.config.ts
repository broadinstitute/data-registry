// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    css: ['bootstrap', '~/assets/css/styles.css'],
    runtimeConfig: {
        public: {
            apiSecret: '',
            apiBaseUrl: '',
            phenotypesUrl: ''
        },
    },


})
