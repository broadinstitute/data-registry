import { defineStore } from "pinia";

export const useUserStore = defineStore("UserStore", {
    state: () => {
        return {
            user: null,
            axios: null,
            loginError: null,
            // SGC axios instance for user service
            sgcAxios: null,
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
        async createNewHermesUser(user_name, password, user_type) {
            if (!this.axios) {
                this.init();
            }
            await this.axios.post(
                "/api/add-hermes-user",
                JSON.stringify({ user_name, password, "user_type": user_type.value}),
            );
        },
        async getHermesUsers() {
            if (!this.axios) {
                this.init();
            }
            const { data } = await this.axios.get("/api/hermes-users");
            return data;
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

        // SGC User Service Authentication Methods
        initSGC() {
            const config = useRuntimeConfig();
            if (!config.public.userServiceUrl) {
                throw new Error('User service URL not configured');
            }
            // Create axios instance for user service
            this.sgcAxios = $fetch.create({
                baseURL: config.public.userServiceUrl,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        async loginSGC(username, password) {
            try {
                if (!this.sgcAxios) {
                    this.initSGC();
                }

                const config = useRuntimeConfig();
                
                // Login to user service
                const response = await this.sgcAxios('/api/auth/login/', {
                    method: 'POST',
                    body: {
                        username,
                        password,
                        group: config.public.sgcUserGroup
                    }
                });

                console.log('SGC login response:', response);

                if (response.access) {
                    console.log('Access token received:', response.access);
                    // Store JWT token
                    localStorage.setItem('sgcAuthToken', response.access);
                    
                    // Store user info directly from login response
                    if (response.user) {
                        this.user = response.user;
                        this.loginError = null;
                        return true;
                    }
                } else {
                    console.log('No access token in response:', response);
                }
                
                this.loginError = 'Invalid credentials';
                return false;
            } catch (error) {
                console.error('SGC login error:', error);
                this.loginError = error.data?.detail || 'Login failed. Please check your credentials.';
                return false;
            }
        },

        async verifySGCToken() {
            try {
                if (!this.sgcAxios) {
                    this.initSGC();
                }

                const config = useRuntimeConfig();
                const token = localStorage.getItem('sgcAuthToken');
                
                if (!token) {
                    return false;
                }

                // Verify token with user service
                const response = await this.sgcAxios(`/api/auth/verify/?group=${config.public.sgcUserGroup}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.user) {
                    this.user = response.user;
                    return true;
                }
                
                return false;
            } catch (error) {
                console.error('SGC token verification error:', error);
                localStorage.removeItem('sgcAuthToken');
                return false;
            }
        },

        async isSGCUserLoggedIn() {
            const token = localStorage.getItem('sgcAuthToken');
            if (!token) {
                return false;
            }
            return await this.verifySGCToken();
        },

        logoutSGC() {
            localStorage.removeItem('sgcAuthToken');
            this.user = null;
            this.loginError = null;
        },
    },
});
