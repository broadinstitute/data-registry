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
    async logout() {
      await this.axios.post('/api/logout')
      this.user = null
      navigateTo('/login')
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

