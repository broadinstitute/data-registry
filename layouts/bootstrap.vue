<script setup>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "assets/css/styles.css";
import PageHeader from "~/components/PageHeader.vue";
import PageFooter from "~/components/PageFooter.vue";
</script>

<template>
    <div>
        <PageHeader />
        <slot />
        <PageFooter />
    </div>
</template>

<style scoped></style>
