import { useTenantStore } from '~/stores/TenantStore';

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("Hello from tenant middleware!");
  const hostname = window.location.hostname;
  const segments = hostname.split('.');
  // Adjust logic here if your local development has a different segments length
  const tenant = segments.length >= 3 ? segments[0] : 'default';
  const tenantStore = useTenantStore();

  import(`~/assets/tenants/${tenant}/strings.json`)
    .then((module) => {
      tenantStore.setTenant(tenant);
      tenantStore.setStrings(module.default);
    })
    .catch(() => {
      console.error(`Strings for tenant ${tenant} not found.`);
    });
});
