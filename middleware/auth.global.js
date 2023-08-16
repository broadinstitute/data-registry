import { useUserStore } from '~/stores/UserStore'
import { callWithNuxt } from '#app'

// so annoying https://github.com/nuxt/nuxt/issues/14269
export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp()
  const userStore = useUserStore()
  if (userStore.user || to.path === '/login') {
    return
  }
  if(!userStore.axios){
    userStore.init()
  }
  const isLoggedIn = await userStore.isUserLoggedIn()
  if (!isLoggedIn) {
    return callWithNuxt(nuxtApp, navigateTo, ['/login?redirect=' + to.path])
  }
})