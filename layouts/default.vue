<script setup>
import PageHeader from "@/components/PageHeader.vue";
import PageFooter from "@/components/PageFooter.vue";
</script>

<template>
    <div>
        <PageHeader />
        <slot />
        <PageFooter />
    </div>
</template>

<style scoped></style>
