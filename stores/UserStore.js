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
    async isUserLoggedIn() {
      try {
        const { data } = await this.axios.get('/api/is-logged-in')
        this.user = data
        return true
      } catch (error) {
         return false
      }
    },
    async login(email, password) {
      await this.axios.post('/api/login', JSON.stringify({ email, password }))
    }
  }
})

