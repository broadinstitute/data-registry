import { useTenantStore } from "~/stores/TenantStore";

export default defineNuxtRouteMiddleware(() => {
    console.log("Hello from tenant middleware!");
    let tenant = window.location.hostname.split(".")[0];
    if (["kpndataregistry", "local"].includes(tenant)) {
        tenant = "default";
    }
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
