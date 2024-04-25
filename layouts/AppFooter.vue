<script setup>
import { useTenantStore } from "~/stores/TenantStore";
import { useLayout } from "./composables/layout";
import { computed } from "vue";

const Tenant = useTenantStore();
const { layoutConfig } = useLayout();
const logoUrl = computed(() => {
    return `/layout/images/${
        layoutConfig.darkTheme.value ? "logo-white" : "logo-dark"
    }.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <span v-if="Tenant.name == 'default'">
            Made with <i class="pi pi-heart-fill" style="color: darkred" /> by
            the Portal Team.</span
        >
        <span v-else> Powered by KPN Data Registry </span>
    </div>
</template>
<style lang="scss" scoped></style>
