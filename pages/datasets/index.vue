<template>
    <div class="container-fluid">
        <ServerNotification
            :show-notification="store.showNotification"
            :error-message="store.errorMessage"
            :success="store.isServerSuccess"
            :success-message="store.successMessage"
        />
        <DataRegistryDatasetTable />
        <div class="row">
            <div class="col text-end">
                <nuxt-link :to="{ name: 'datasets-new' }">
                    <button type="button" class="btn btn-primary">
                        <i class="bi bi-plus" />
                        Add New Dataset
                    </button>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>
<script setup>
definePageMeta({
    layout: "bootstrap",
});
import { useDatasetStore } from "~/stores/DatasetStore";

const store = useDatasetStore();
</script>

<style></style>
