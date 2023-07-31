import { defineStore } from 'pinia'




export const useUserStore = defineStore('UserStore', {
  state: () => {
    return {
      user: null,
      axios: null,
    }
  },
  actions: {
    init() {
      const config = useRuntimeConfig()
      this.axios = useAxios(config)
    },
    logout() {
      this.axios.post('/api/logout').then(() => {
          this.user = null
          return navigateTo('/login')
        })
    },
    getUserInfo(navigateToPath) {
      this.axios.get('/api/is-logged-in')
        .then(response => {
          this.user = response.data
        })
        .catch(() => {
          return navigateTo('/login?redirect=' + navigateToPath)
        })
    },
    async login(email, password) {
      await this.axios.post('/api/login', JSON.stringify({ email, password }))
    }
  }
})

