<script setup>
import { useLayout } from "./composables/layout";
import { computed } from "vue";
const { layoutConfig } = useLayout();
const logoUrl = computed(() => {
    return `/layout/images/${
        layoutConfig.darkTheme.value ? "logo-white" : "logo-dark"
    }.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <span>
            Made with <i class="pi pi-heart-fill" style="color: darkred" /> by
            the Portal Team.</span
        >
    </div>
</template>
<style lang="scss" scoped></style>
