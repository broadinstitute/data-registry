import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";
const IndigoAura = definePreset(Aura, {
    semantic: {
        primary: {
            50: "{indigo.50}",
            100: "{indigo.100}",
            200: "{indigo.200}",
            300: "{indigo.300}",
            400: "{indigo.400}",
            500: "{indigo.500}",
            600: "{indigo.600}",
            700: "{indigo.700}",
            800: "{indigo.800}",
            900: "{indigo.900}",
            950: "{indigo.950}",
        },
    },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,

    devtools: {
        enabled: true,

      timeline: {
          enabled: true,
      },
  },
  build: {
    sourcemap: true,  // Ensure this is enabled
  },

    app: {
        head: {
            title: "KPN Data Registry",
        },
    },

    css: [
        //"bootstrap/dist/css/bootstrap.css",
        "bootstrap-icons/font/bootstrap-icons.css",
        //"assets/css/styles.css",
        "primeicons/primeicons.css",
        // "primeflex/primeflex.scss",
        // "primevue/resources/primevue.min.css",

        "@/assets/styles.scss",
        "assets/css/base.css",
        // "primevue/resources/themes/aura-light-indigo/theme.css",
        //"@/assets/css/tailwind.css",
        "@/assets/css/shiki.css",
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
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt",
        "@nuxt/devtools",
        "@primevue/nuxt-module",
        "nuxt-shiki",
    ],

    primevue: {
        options: {
            unstyled: false,
            ripple: true,
            theme: {
                preset: IndigoAura,
                options: {
                    darkModeSelector: ".app-dark",
                    cssLayer: {
                        name: "primevue",
                        order: "tailwind-base, primevue, tailwind-utilities",
                    },
                },
            },
        },
        autoImport: true,
        //importPT: {
        //    from: "/presets/lara/",
        //}, //import and apply preset
        // components: {
        // prefix: "Prime",
        // },
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
        bundledThemes: ["min-light", "min-dark"],
        defaultTheme: {
            light: "min-light",
            dark: "min-dark",
        },
    },

    // https://stackoverflow.com/questions/74003458/cannot-find-module-pinia-dist-pinia-mjs-when-using-run-dev
    alias: {
        pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
    },

    telemetry: false,

    hooks: {
        "pages:extend"(pages) {
            // add a route
            pages.push({
                path: "/",
                redirect: "/datasets",
            });
        },
    },

    compatibilityDate: "2024-07-15",
});
