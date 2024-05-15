import { defineStore } from "pinia";

export const useUserStore = defineStore("UserStore", {
    state: () => {
        return {
            user: null,
            axios: null,
            loginError: null,
        };
    },
    actions: {
        init() {
            const config = useRuntimeConfig();
            this.axios = useAxios(config);
        },
        async logout(redirectUrl) {
            await this.axios.post("/api/logout");
            this.user = null;
            navigateTo(redirectUrl);
        },
        async isUserLoggedIn() {
            try {
                if (!this.axios) {
                    this.init();
                }
                const { data } = await this.axios.get("/api/is-logged-in");
                this.user = data;
                return true;
            } catch (error) {
                return false;
            }
        },
        async changePassword(password) {
            if (!this.axios) {
                this.init();
            }
            await this.axios.post(
                "/api/change-password",
                JSON.stringify({ password }),
            );
        },
        async loginWithGoogle(code) {
            if (!this.axios) {
                this.init();
            }
            await this.axios.post(
                "/api/google-login",
                JSON.stringify({ code }),
            );
        },
        async login(user_name, password) {
            if (!this.axios) {
                this.init();
            }
            await this.axios.post(
                "/api/login",
                JSON.stringify({ user_name, password }),
            );
        },
    },
});
