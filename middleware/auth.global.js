import { useUserStore } from '~/stores/UserStore'


export default defineNuxtRouteMiddleware((to, from) => {

  const userStore = useUserStore()
  if(!userStore.axios){
    userStore.init()
  }
  if (userStore.user || to.path === '/login') {
    return
  }
  userStore.getUserInfo(to.path)
})
