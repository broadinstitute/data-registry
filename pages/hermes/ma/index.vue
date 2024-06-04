<template>
    <div>
        <h2>Meta-Analyses</h2>
        <Card>
            <template #content>
                <DataTable :value="sampleData">
                    <Column field="name" header="Name">
                        <template #body="{ data }">
                            <NuxtLink :to="`/hermes/ma/${data.id}`">
                                {{ data.name }}
                            </NuxtLink>
                        </template>
                    </Column>
                    <Column field="phenotype" header="Phenotype">
                        <template #body="{ data }">
                            {{ formatPhenotype(data.phenotype) }}
                        </template>
                    </Column>
                    <Column field="datasets" header="Datasets">
                        <template #body="{ data }">
                            {{
                                data.datasets.slice(0, 3).join(", ") +
                                (data.datasets.length > 3 ? ", ..." : "")
                            }}
                        </template>
                    </Column>
                    <Column field="type" header="Type"></Column>
                    <Column field="started" header="Started"></Column>
                    <Column field="user" header="By"></Column>
                    <Column field="status" header="Status">
                        <template #body="{ data }">
                            <Tag
                                :severity="getSeverity(data.status)"
                                :icon="getIcon(data.status)"
                                :value="data.status"
                                rounded
                            />
                        </template>
                    </Column>
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
        datasets: ["Dataset 1", "Dataset 2", "Dataset 3", "Dataset 4"],
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

const getSeverity = (status) => {
    switch (status) {
        case "Running":
            return "info";
        case "Completed":
            return "success";
        case "Failed":
            return "danger";
        default:
            return "secondary";
    }
};

const getIcon = (status) => {
    switch (status) {
        case "Running":
            return "bi-play-circle";
        case "Completed":
            return "bi-check-circle";
        case "Failed":
            return "bi-x-circle";
        default:
            return "bi-circle";
    }
};
</script>
