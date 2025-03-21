<script setup>
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/UserStore";

const userStore = useUserStore();
const User = userStore.user;
const isAdmin = User.roles.includes("admin");

function signOut() {
    userStore.logout("/hermes/login");
}
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
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
            label: "Meta-Analyses",
            icon: "bi-file-earmark-bar-graph",
            url: "/hermes/ma/",
        },
    ];
    if (isAdmin) {
        items.unshift({
            label: "Dashboard",
            icon: "bi-columns-gap",
            url: "/hermes/dashboard/",
        });
    }
    if (userStore.user.permissions.includes("addUser")) {
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
</script>

<template>
    <div class="layout-topbar">
        <nuxt-link to="/hermes" class="layout-topbar-logo">
            <img src="/tenants/hermes/logo.png" alt="logo" />
        </nuxt-link>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <Menubar :model="menuBar">
                <template #end>
                    <button
                        @click="toggle"
                        class="p-link layout-topbar-button btn"
                    >
                        <i class="bi-person"></i>
                        <span>Settings</span>
                    </button>
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
</template>

<style lang="scss" scoped>
.p-menubar {
    border: none;
    background-color: transparent;
}
.p-menubar button {
    background-color: transparent;
    border: none;
    color: var(--text-color);
    font-size: 1.5rem;
    padding: 0.5rem;
}
</style>
