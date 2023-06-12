<template>
    <div class="container">
        <DataRegistryDataset
            :existing-dataset="route.params.id"
            :edit-mode="route.query.edit === 'true'"
        />
        <div class="row mt-2">
            <div class="col text-start">
                <nuxt-link :to="{ name: 'datasets' }">
                    <button type="button" class="btn btn-success">
                        <i class="bi bi-arrow-left"></i>
                        Back to Dataset List
                    </button></nuxt-link
                >
            </div>
            <div class="col text-end">
                <nuxt-link :to="{ name: 'datasets-new' }">
                    <button type="button" class="btn btn-primary">
                        <i class="bi bi-plus"></i>
                        Add New Dataset
                    </button></nuxt-link
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const route = useRoute();
</script>
