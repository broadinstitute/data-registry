import { defineStore } from "pinia";

export const useUserStore = defineStore("UserStore", {
    state: () => {
        return {
            user: null,
            axios: null,
            loginError: null,
            // SGC axios instance for user service
            sgcAxios: null,
            // PEG axios instance for user service
            pegAxios: null,
            // CALR axios instance for user service
            calrAxios: null,
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

        // SGC User Management Methods - calls data-registry-api which handles user service tokens
        async createSGCUser(userData, userType) {
            try {
                const config = useRuntimeConfig();
                const sgcAxios = useSGCAxios(config);
                
                const response = await sgcAxios.post('/api/sgc/create-user', {
                    user_name: userData.email,  // Email serves as both username and email
                    password: userData.password,
                    email: userData.email || '',
                    first_name: userData.firstName || '',
                    last_name: userData.lastName || '',
                    user_type: userType  // 'reviewer' or 'uploader'
                });

                return response.data;
            } catch (error) {
                console.error('SGC user creation error:', error);
                throw error;
            }
        },

        // Get list of SGC users (if needed for management interface)
        async getSGCUsers() {
            try {
                const config = useRuntimeConfig();
                const sgcAxios = useSGCAxios(config);

                const response = await sgcAxios.get('/api/sgc/users');
                // The API returns { group: {...}, users: [...], total_count: N }
                // We need to extract just the users array
                return response.data.users || [];
            } catch (error) {
                console.error('Error fetching SGC users:', error);
                throw error;
            }
        },

        // Check if current user has permission to manage users
        canManageUsers() {
            if (!this.user) {
                return false;
            }

            // Extract role names from role objects
            const roleNames = this.user.roles?.map(role => role.name || role) || [];

            // Check if user has reviewer role or manage_users permission
            return roleNames.includes('sgc-reviewer') ||
                   this.user.permissions?.includes('manage_users') ||
                   roleNames.includes('reviewer');
        },

        // PEG User Service Authentication Methods
        initPEG() {
            const config = useRuntimeConfig();
            if (!config.public.userServiceUrl) {
                throw new Error('User service URL not configured');
            }
            // Create axios instance for user service
            this.pegAxios = $fetch.create({
                baseURL: config.public.userServiceUrl,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        async loginPEG(username, password) {
            try {
                if (!this.pegAxios) {
                    this.initPEG();
                }

                const config = useRuntimeConfig();
                
                // Login to user service
                const response = await this.pegAxios('/api/auth/login/', {
                    method: 'POST',
                    body: {
                        username,
                        password,
                        group: config.public.pegUserGroup || 'peg'
                    }
                });

                if (response.access) {
                    // Store JWT token
                    localStorage.setItem('pegAuthToken', response.access);
                    
                    // Store user info directly from login response
                    if (response.user) {
                        this.user = response.user;
                        this.loginError = null;
                        return true;
                    }
                }
                
                this.loginError = 'Invalid credentials';
                return false;
            } catch (error) {
                console.error('PEG login error:', error);
                this.loginError = error.data?.detail || 'Login failed. Please check your credentials.';
                return false;
            }
        },

        async verifyPEGToken() {
            try {
                if (!this.pegAxios) {
                    this.initPEG();
                }

                const config = useRuntimeConfig();
                const token = localStorage.getItem('pegAuthToken');
                
                if (!token) {
                    return false;
                }

                const pegUserGroup = config.public.pegUserGroup || 'peg';
                
                // Verify token with user service
                const response = await this.pegAxios(`/api/auth/verify/?group=${pegUserGroup}`, {
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
                console.error('PEG token verification error:', error);
                localStorage.removeItem('pegAuthToken');
                return false;
            }
        },

        async isPEGUserLoggedIn() {
            const token = localStorage.getItem('pegAuthToken');
            if (!token) {
                return false;
            }
            return await this.verifyPEGToken();
        },

        logoutPEG() {
            localStorage.removeItem('pegAuthToken');
            this.user = null;
            this.loginError = null;
        },

        // CALR User Service Authentication Methods
        initCALR() {
            const config = useRuntimeConfig();
            if (!config.public.userServiceUrl) {
                throw new Error('User service URL not configured');
            }
            // Create axios instance for user service
            this.calrAxios = $fetch.create({
                baseURL: config.public.userServiceUrl,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        async loginCALR(username, password) {
            try {
                if (!this.calrAxios) {
                    this.initCALR();
                }

                const config = useRuntimeConfig();

                // Login to user service
                const response = await this.calrAxios('/api/auth/login/', {
                    method: 'POST',
                    body: {
                        username,
                        password,
                        group: config.public.calrUserGroup || 'calr'
                    }
                });

                if (response.access) {
                    // Store JWT token
                    localStorage.setItem('calrAuthToken', response.access);

                    // Store user info directly from login response
                    if (response.user) {
                        this.user = response.user;
                        this.loginError = null;
                        return true;
                    }
                }

                this.loginError = 'Invalid credentials';
                return false;
            } catch (error) {
                console.error('CALR login error:', error);
                this.loginError = error.data?.detail || 'Login failed. Please check your credentials.';
                return false;
            }
        },

        async verifyCALRToken() {
            try {
                if (!this.calrAxios) {
                    this.initCALR();
                }

                const config = useRuntimeConfig();
                const token = localStorage.getItem('calrAuthToken');

                if (!token) {
                    return false;
                }

                const calrUserGroup = config.public.calrUserGroup || 'calr';

                // Verify token with user service
                const response = await this.calrAxios(`/api/auth/verify/?group=${calrUserGroup}`, {
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
                console.error('CALR token verification error:', error);
                localStorage.removeItem('calrAuthToken');
                return false;
            }
        },

        async isCALRUserLoggedIn() {
            const token = localStorage.getItem('calrAuthToken');
            if (!token) {
                return false;
            }
            return await this.verifyCALRToken();
        },

        logoutCALR() {
            localStorage.removeItem('calrAuthToken');
            this.user = null;
            this.loginError = null;
        },
    },
});
