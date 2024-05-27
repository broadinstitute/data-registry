<template>
    <div>
        <h2>Meta-Analyses</h2>
        <div class="card">
            <div class="card-header">
                <h3>Meta-Analysis</h3>
            </div>
            <div class="card-body">
                <DataTable :value="sampleData">
                    <Column field="name" header="Name"></Column>
                    <Column field="phenotype" header="Phenotype">
                        <template #body="{ data }">
                            {{ formatPhenotype(data.phenotype) }}
                        </template>
                    </Column>
                    <Column field="datasets" header="Datasets">
                        <template #body="{ data }">
                            <span
                                v-for="dataset in data.datasets"
                                :key="dataset"
                            >
                                <NuxtLink :to="`/hermes/ma/${dataset}`">
                                    {{ dataset }}
                                </NuxtLink>
                            </span>
                        </template>
                    </Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="actions" header="Actions"></Column>
                </DataTable>
            </div>
        </div>
        <Card>
            <template #content>
                <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                    <div class="text-700 text-center">
                        <div class="text-900 font-bold text-5xl mb-3">
                            Create a meta analysis.
                        </div>
                        <div class="text-700 text-2xl mb-5">
                            You don't have any meta analysis running. Start by
                            creating a new analysis.
                        </div>
                        <Button
                            label="Meta-Analysis"
                            icon="bi-plus-lg"
                            class="mr-2"
                            @click="route.push('/hermes/ma/new')"
                        ></Button>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>
<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
const route = useRouter();
const store = useDatasetStore();
const phenotypeMap = ref([]);
const sampleData = ref([
    {
        id: 1,
        name: "Meta-Analysis 1",
        phenotype: "T2D",
        datasets: ["Dataset 1", "Dataset 2", "Dataset 3"],
        status: "Running",
    },
    {
        id: 2,
        name: "Meta-Analysis 2",
        phenotype: "BMI",
        datasets: ["Dataset 4", "Dataset 5", "Dataset 6"],
        status: "Completed",
    },
    {
        id: 3,
        name: "Meta-Analysis 3",
        phenotype: "T1D",
        datasets: ["Dataset 7", "Dataset 8", "Dataset 9"],
        status: "Failed",
    },
]);
onMounted(async () => {
    await store.fetchPhenotypes();
    phenotypeMap.value = store.phenotypes;
});

const formatPhenotype = (phenotype) => {
    return phenotypeMap.value[phenotype]
        ? phenotypeMap.value[phenotype].description
        : phenotype;
};
</script>
