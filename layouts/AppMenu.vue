<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/UserStore";
import AppMenuItem from "./AppMenuItem.vue";

const userStore = useUserStore();
const User = userStore.user;
function signOut() {
    userStore.logout();
}
const model = ref([
    {
        label: "Home",
        items: [{ label: "Dashboard", icon: "bi-columns", to: "/" }],
    },

    {
        label: "Data",
        items: [
            {
                label: "Data Sets",
                icon: "bi-journal-text",
                to: "/datasets",
            },
        ],
    },

    {
        label: "Reports",
        items: [
            {
                label: "QC Reports",
                icon: "bi-file-earmark-bar-graph",
            },
        ],
    },
    {
        separator: true,
    },
    // {
    //     label: "Help",
    //     items: [
    //         {
    //             label: "Documentation",
    //             icon: "bi-journals",
    //         },
    //         {
    //             label: "Support",
    //             icon: "bi-chat",
    //         },
    //     ],
    // },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item
                v-if="!item.separator"
                :item="item"
                :index="i"
            ></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <li>
            <a href="https://www.hermesconsortium.org/" target="_blank">
                <img
                    src="/layout/images/hermes-logo-full.png"
                    alt="Prime Blocks"
                    class="w-full mt-3"
                />
            </a>
        </li>
        <li>
            <a class="dropdown-item" href="#" @click.prevent="signOut"
                >Sign out</a
            >
        </li>
    </ul>
    {{ User?.user_name }} ok
</template>

<style lang="scss" scoped></style>
