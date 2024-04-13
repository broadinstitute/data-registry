<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useLayout } from "./composables/layout";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/UserStore";
import { useTenantStore } from "~/stores/TenantStore";
const User = useUserStore();
const Tenant = useTenantStore();
const tenantLogo = computed(() => {
    return Tenant.assetPath + Tenant.strings.logo;
});
const { layoutConfig, onMenuToggle } = useLayout();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
});
onBeforeUnmount(() => {
    unbindOutsideClickListener();
});
const logoUrl = computed(() => {
    return `/layout/images/${
        layoutConfig.darkTheme.value ? "logo-white" : "logo-dark"
    }.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push("/");
};

const topbarMenuClasses = computed(() => {
    return {
        "layout-topbar-menu-mobile-active": topbarMenuActive.value,
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };

        document.addEventListener("click", outsideClickListener.value);
    }
};

const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener("click", outsideClickListener);
        outsideClickListener.value = null;
    }
};

const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;
    const sidebarEl = document.querySelector(".layout-topbar-menu");
    const topbarEl = document.querySelector(".layout-topbar-menu-button");

    return !(
        sidebarEl.isSameNode(event.target) ||
        sidebarEl.contains(event.target) ||
        topbarEl.isSameNode(event.target) ||
        topbarEl.contains(event.target)
    );
};
</script>

<template>
    <div class="layout-topbar">
        <nuxt-link to="/" class="layout-topbar-logo">
            <img :src="tenantLogo" alt="logo" />
        </nuxt-link>

        <button
            class="p-link layout-menu-button layout-topbar-button btn"
            @click="onMenuToggle()"
        >
            <i class="bi-list"></i>
        </button>

        <button
            class="p-link layout-topbar-menu-button layout-topbar-button"
            @click="onTopBarMenuButton()"
        >
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button
                @click="onTopBarMenuButton()"
                class="p-link layout-topbar-button btn"
            >
                <i class="bi-bell"></i>
                <span>Alerts</span>
            </button>

            <button
                @click="onTopBarMenuButton()"
                class="p-link layout-topbar-button btn"
            >
                <i class="bi-person"></i>
                <span>Profile</span>
            </button>
            <button
                @click="onSettingsClick()"
                class="p-link layout-topbar-button btn"
            >
                <i class="bi-gear"></i>
                <span>Settings</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
