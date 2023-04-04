<template>
    <div>
        <h1>info</h1>
        <p>Dataset id: {{ $route.params.id }}</p>
    </div>
</template>
<script setup>
//this template is for CRUD operations on a single dataset using id
//default to fetch data from the server, add form to edit/delete data
//need to point to proper api endpoints

import { ref, onMounted, onBeforeMount } from "vue";
const dataset = ref(null);

async function fetchData({ params }) {
    if (params.id) {
        const { data } = await $fetch(`/api/dataset/${params.id}`);
        return { dataset: data };
    }
}
async function deleteDataset() {
    await $fetch(`/api/dataset/${this.dataset.id}`, {
        method: "DELETE",
    });
    this.$router.push("/datasets");
}
async function updateDataset() {
    await $fetch(`/api/dataset/${this.dataset.id}`, {
        method: "PUT",
        body: JSON.stringify(this.dataset),
    });
    this.$router.push("/datasets");
}
</script>
