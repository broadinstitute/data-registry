import { useUserStore } from '~/stores/UserStore'


export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('can', {
    mounted: (el, binding) => {
      const user = useUserStore().user;
      if(user.roles.includes('admin')) {
        return;
      }
      const { value } = binding;
      if (!user.permissions.includes(value)) {
        el.parentNode.removeChild(el);
      }
    }
  });
});

