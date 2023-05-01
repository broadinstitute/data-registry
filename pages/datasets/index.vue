<template>
    <div class="container-fluid">
        <DataRegistryDatasetTable :data-sets="datasets" />
    </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import DataRegistryDatasetTable from "~/components/DataRegistryDatasetTable.vue";
const config = useRuntimeConfig();
const datasets = ref([]);
onBeforeMount(() => {
    fetchStudies();
});

async function fetchStudies() {
    datasets.value = await $fetch(`${config.apiBaseUrl}/api/datasets`, {
        headers: { "access-token": config.apiSecret },
    });
}
</script>

<style></style>
