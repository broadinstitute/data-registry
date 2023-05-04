<template>
    <div class="container">
        <p>Dataset id: {{ $route.params.id }}</p>
        <DataRegistryDataset :existing-dataset="route.params.id" />
    </div>
</template>

<script setup>
//this template is for CRUD operations on a single dataset using id
//default to fetch data from the server, add form to edit/delete data
//need to point to proper api endpoints

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const dataset = ref(null);
const route = useRoute();
const phenotypes = useState("phenotypes", () => []);
const phenotypeOptions = useState("phenotypeOptions", () => []);
const studies = useState("studies", () => []);
const config = useRuntimeConfig();


async function fetchData({ params }) {
    if (params.id) {
        const { data } = await $fetch(`/api/datasets/${params.id}`);
        return { dataset: data };
    }
}
async function deleteDataset() {
    await $fetch(`/api/datasets/${this.dataset.id}`, {
        method: "DELETE",
    });
    this.$router.push("/datasets");
}
async function updateDataset() {
    await $fetch(`/api/datasets/${this.dataset.id}`, {
        method: "PUT",
        body: JSON.stringify(this.dataset),
    });
    this.$router.push("/datasets");
}
</script>
