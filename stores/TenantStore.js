import { defineStore } from "pinia";

export const useTenantStore = defineStore("TenantStore", {
    state: () => {
        return {
            name: "default",
            assetPath: "/tenants/default/",
            strings: {},
        };
    },
    actions: {
        setTenant(tenant) {
            this.name = tenant;
            this.assetPath = `/tenants/${tenant}/`; // Set the path based on the tenant
        },
        setStrings(strings) {
            this.strings = strings;
        },
    },
});
