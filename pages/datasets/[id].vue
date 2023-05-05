<template>
    <div class="container-fluid">
        <DataRegistryDataset :existing-dataset="route.params.id" />
    </div>
</template>

<script setup>

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const route = useRoute();
</script>
