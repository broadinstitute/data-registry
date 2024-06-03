<template>
    <div>
        <h2>Meta-Analyses</h2>
        <Card>
            <template #content>
                <DataTable :value="sampleData">
                    <Column field="name" header="Name"></Column>
                    <Column field="phenotype" header="Phenotype">
                        <template #body="{ data }">
                            {{ formatPhenotype(data.phenotype) }}
                        </template>
                    </Column>
                    <Column field="datasets" header="Datasets">
                        <template #body="{ data }">
                            <!-- <span
                                v-for="dataset in data.datasets"
                                :key="dataset"
                            >
                                <NuxtLink :to="`/hermes/ma/${dataset}`">
                                    {{ dataset }}
                                </NuxtLink>
                            </span> -->
                            {{ data.datasets.join(", ") }}
                        </template>
                    </Column>
                    <Column field="type" header="Type"></Column>
                    <Column field="started" header="Started"></Column>
                    <Column field="user" header="By"></Column>
                    <Column field="status" header="Status"></Column>
                </DataTable>
            </template>
        </Card>
        <Card class="mt-4">
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
        started: "2021-10-01",
        type: "Bottom-line",
        user: "User 1",
    },
    {
        id: 2,
        name: "Meta-Analysis 2",
        phenotype: "BMI",
        datasets: ["Dataset 4", "Dataset 5", "Dataset 6"],
        status: "Completed",
        started: "2021-10-02",
        type: "Bottom-line",
        user: "User 2",
    },
    {
        id: 3,
        name: "Meta-Analysis 3",
        phenotype: "T1D",
        datasets: ["Dataset 7", "Dataset 8", "Dataset 9"],
        status: "Failed",
        started: "2021-10-03",
        type: "Naive",
        user: "User 3",
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
