<script setup>
import { useLayout } from "@/composables/layout";
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/UserStore";

const { onMenuToggle, toggleDarkMode, initDarkMode, isDarkTheme } = useLayout();

const userStore = useUserStore();
const User = userStore.user;
const isAdmin = User.roles.includes("admin");
const isReviewer = User.roles.includes("reviewer");
const canAddUser = User.permissions.includes("addUser");

function signOut() {
    userStore.logout("/hermes/login");
}
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
    initDarkMode();
});
onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const changePassword = () => {
    topbarMenuActive.value = false;
    router.push("/hermes/changepassword");
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
const items = ref([
    {
        label: "Profile",
        items: [
            {
                label: "Change Password",
                icon: "bi-key",
                command: changePassword,
            },
            {
                label: "Sign out",
                icon: "bi-door-open",
                command: signOut,
            },
        ],
    },
]);
const menuBar = computed(() => {
    let items = [
        {
            label: "Datasets",
            icon: "bi-files",
            url: "/hermes/",
        },
        {
            label: "QC Reports",
            icon: "bi-file-earmark-check",
            url: "/hermes/qc/",
        },
    ];
    if (isReviewer || isAdmin) {
        items.push({
            label: "Meta-Analyses",
            icon: "bi-file-earmark-bar-graph",
            url: "/hermes/ma/",
        });
    }
    if (isAdmin) {
        items.unshift({
            label: "Dashboard",
            icon: "bi-columns-gap",
            url: "/hermes/dashboard/",
        });
    }
    if (canAddUser || isAdmin) {
        items.push({
            label: "Users",
            icon: "bi-people-fill",
            url: "/hermes/users/",
        });
    }

    return items;
});

const menu = ref();
const toggle = (event) => {
    menu.value.toggle(event);
};

const userLabel = computed(() => {
    console.log("user", User.username);
    return User.user_name.charAt(0).toUpperCase() || "";
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <nuxt-link to="/hermes" class="layout-topbar-logo">
                <img src="/tenants/hermes/logo.png" alt="logo" />
            </nuxt-link>
        </div>
        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <Menubar :model="menuBar">
                    <template #end>
                        <Button
                            type="button"
                            class="layout-topbar-action"
                            @click="toggleDarkMode"
                        >
                            <i
                                :class="[
                                    'pi',
                                    {
                                        'pi-moon': isDarkTheme,
                                        'pi-sun': !isDarkTheme,
                                    },
                                ]"
                            ></i>
                        </Button>
                        <Button @click="toggle">
                            <Avatar
                                :label="userLabel"
                                class="mr-2"
                                size="large"
                                shape="circle"
                            />
                        </Button>
                        <Menu
                            ref="menu"
                            id="overlay_menu"
                            :model="items"
                            :popup="true"
                        />
                    </template>
                </Menubar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.p-menubar {
    border: none;
    background-color: transparent;
    padding: 0;
}
.p-menubar button {
    background-color: transparent;
    border: none;
    color: var(--text-color);
    font-size: 1.5rem;
    padding: 0.5rem;
}
</style>
