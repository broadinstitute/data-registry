<template>
    <div class="container-fluid">
        <DRDatasetAccordion />
        <div class="row mt-2">
            <div class="col text-start">
                <nuxt-link :to="{ name: 'datasets_old' }">
                    <button type="button" class="btn btn-success btn-sm">
                        <i class="bi bi-arrow-left" />
                        Back to Dataset List
                    </button>
                </nuxt-link>
            </div>
            <div class="col text-end">
                <nuxt-link :to="{ name: 'datasets_old-new' }">
                    <button type="button" class="btn btn-primary btn-sm">
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
store.$reset();
</script>
