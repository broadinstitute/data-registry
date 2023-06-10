<template>
    <div class="container-fluid">
        <DataRegistryDatasetTable />
        <div class="row">
            <div class="col text-end">
                <nuxt-link :to="{ name: 'datasets-new' }">
                    <button type="button" class="btn btn-primary">
                        <i class="bi bi-plus"></i>
                        Add New Dataset
                    </button>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>


<style></style>
