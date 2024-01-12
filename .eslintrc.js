module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
  ],
  globals: {
    "useAxios": "readonly",
    "useStore": "readonly",
    "useRouter": "readonly",
    "useRuntimeConfig": "readonly",
    "defineNuxtPlugin": "readonly",
    "navigateTo": "readonly",
    "ref": "readonly",
    "useFormValidation": "readonly",
    "onMounted": "readonly",
    "useRoute": "readonly",
    "useFetch": "readonly",
    "watch": "readonly",
    "computed": "readonly",
    "readyToSave": "readonly",
    "nextTick": "readonly",
    "toRef": "readonly",
    "useNuxtApp": "readonly",
    "defineNuxtRouteMiddleware": "readonly",
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    semi: ["error", "always"],
    eqeqeq: ["error", "always"],
    quotes: "off",
    "comma-dangle": ["error", "never"],
    camelcase: "off",
    "vue/multi-word-component-names": 'off',
  },
};
