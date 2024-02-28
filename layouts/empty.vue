<script setup>
// definePageMeta({
//     layout: "empty",
// });
import PageHeader from "~/components/PageHeader.vue";
import PageFooter from "~/components/PageFooter.vue";
</script>

<template>
    <div>
        <h1>Empty Layout</h1>
        <PageHeader />
        <slot />
        <PageFooter />
    </div>
</template>

<style scoped></style>
