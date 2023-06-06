<template>
    <div class="container-fluid">
        <DataRegistryDatasetTable />
        <div class="row">
            <div class="col text-end">
                <nuxt-link to="/datasets/new">
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
</script>

<style></style>
