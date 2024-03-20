<script setup>
import { computed, watch, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { usePrimeVue } from "primevue/config";
import AppTopbar from "./AppTopbar.vue";
import AppFooter from "./AppFooter.vue";
import AppSidebar from "./AppSidebar.vue";
// import AppConfig from "./AppConfig.vue";
import { useLayout } from "./composables/layout";
import { useRouter } from "vue-router";

const $primevue = usePrimeVue();
const { layoutConfig, layoutState, isSidebarActive } = useLayout();
const outsideClickListener = ref(null);
const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
    await userStore.isUserLoggedIn();
    // const { user } = await userStore.isUserLoggedIn();
    // if (!user) {
    //     console.log("User not logged in");
    //     //await router.push("/login");
    // } else {
    //     console.log("User is logged in");
    // }
});

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});
const containerClass = computed(() => {
    return {
        "layout-theme-light": layoutConfig.darkTheme.value === "light",
        "layout-theme-dark": layoutConfig.darkTheme.value === "dark",
        "layout-overlay": layoutConfig.menuMode.value === "overlay",
        "layout-static": layoutConfig.menuMode.value === "static",
        "layout-static-inactive":
            layoutState.staticMenuDesktopInactive.value &&
            layoutConfig.menuMode.value === "static",
        "layout-overlay-active": layoutState.overlayMenuActive.value,
        "layout-mobile-active": layoutState.staticMenuMobileActive.value,
        "p-input-filled": $primevue.config.inputStyle === "filled",
        "p-ripple-disabled": $primevue.config.ripple === false,
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive.value = false;
                layoutState.staticMenuMobileActive.value = false;
                layoutState.menuHoverActive.value = false;
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
    const sidebarEl = document.querySelector(".layout-sidebar");
    const topbarEl = document.querySelector(".layout-menu-button");

    return !(
        sidebarEl.isSameNode(event.target) ||
        sidebarEl.contains(event.target) ||
        topbarEl.isSameNode(event.target) ||
        topbarEl.contains(event.target)
    );
};
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <div class="layout-sidebar">
            <app-sidebar></app-sidebar>
        </div>
        <div class="layout-main-container">
            <div class="layout-main">
                <!-- <router-view></router-view> -->
                <NuxtPage />
            </div>
            <app-footer></app-footer>
        </div>

        <!-- <app-config></app-config> -->
        <div class="layout-mask"></div>
    </div>
</template>

<style lang="scss" scoped></style>
