<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import Chart from "primevue/chart";
const store = useDatasetStore();
const fileUploads = ref([]);
const metaAnalyses = ref([]);

onMounted(async () => {
    fileUploads.value = await store.fetchFileUploads();
    metaAnalyses.value = await store.fetchMetaAnalyses();
});

const latest5Datasets = computed(() => {
    return fileUploads.value.slice(0, 5);
});

const latest5Analyses = computed(() => {
    return metaAnalyses.value.slice(0, 5);
});

const statusColors = {
    "FAILED QC": "#ef4444",
    "READY FOR REVIEW": "#22c55e",
    "SUBMITTED TO QC": "#475569",
    "REVIEW REJECTED": "#4338ca",
    "REVIEW APPROVED": "#0ea5e9",
};

const getSeverity = (status) => {
    switch (status) {
        case "FAILED QC":
            return "danger";
        case "READY FOR REVIEW":
            return "success";
        case "SUBMITTED TO QC":
            return "secondary";
        case "REVIEW REJECTED":
            return "warning";
        default:
            return "info";
    }
};

const getIcon = (status) => {
    switch (status) {
        case "FAILED QC":
            return "bi-x";
        case "READY FOR REVIEW":
            return "bi-check";
        case "SUBMITTED TO QC":
            return "bi-plus";
        case "REVIEW REJECTED":
            return "bi-x-square";
        case "REVIEW APPROVED":
            return "bi-check-square";
    }
};

//computed function to tally the number of datasets for each unique status
const statusCounts = computed(() => {
    const counts = {};
    fileUploads.value.forEach((file) => {
        if (counts[file.qc_status]) {
            counts[file.qc_status]++;
        } else {
            counts[file.qc_status] = 1;
        }
    });
    return counts;
});

//generate data for piechart from statusCounts, using primevue chart
const pieData = computed(() => {
    return {
        labels: Object.keys(statusCounts.value),
        datasets: [
            {
                data: Object.values(statusCounts.value),
                //generate array of background colors for each status in the pie chart that corresponds to the statusColors object using color variables

                backgroundColor: Object.keys(statusCounts.value).map(
                    (status) => statusColors[status],
                ),
                // backgroundColor: [
                //     "#FFC107",
                //     "#007bff",
                //     "#28a745",
                //     "#dc3545",
                //     "#6c757d",
                // ],
            },
        ],
    };
});

const pieOptions = {
    plugins: {
        legend: {
            labels: {
                usePointStyle: true,
                color: "#334155",
            },
        },
    },
};
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-8">
            <Card>
                <template #content
                    ><DataTable
                        :value="latest5Datasets"
                        :paginator="false"
                        rowHover
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20]"
                        sortField="uploaded_at"
                        :sortOrder="-1"
                        dataKey="id"
                        ><template #header>
                            <div
                                class="flex flex-wrap items-center justify-between gap-2"
                            >
                                <span class="text-xl font-bold"
                                    >Recent Datasets</span
                                >
                                <Button
                                    type="button"
                                    label="View All Dataset"
                                    icon="bi-card-list"
                                    outlined
                                    @click="() => $router.push('/hermes/')"
                                />
                            </div>
                        </template>
                        <template #empty> No dataset found. </template>
                        <template #loading>
                            Loading dataset data. Please wait...
                        </template>
                        <Column field="dataset_name" header="Name"></Column>
                        <Column field="uploaded_at" header="Date">
                            <template #body="{ data }">
                                {{ formatDate(new Date(data.uploaded_at)) }}
                            </template>
                        </Column>
                        <Column field="phenotype" header="Phenotype"></Column>
                        <Column field="uploaded_by" header="Uploader"></Column>
                        <Column field="qc_status" header="Status">
                            <template #body="{ data }">
                                <span
                                    v-if="data.qc_status !== 'SUBMITTED TO QC'"
                                >
                                    <nuxt-link :to="`/hermes/qc/${data.id}`">
                                        <Tag
                                            :severity="
                                                getSeverity(data.qc_status)
                                            "
                                            :icon="getIcon(data.qc_status)"
                                            :value="
                                                data.qc_status.toUpperCase()
                                            "
                                            rounded
                                        />
                                    </nuxt-link>
                                </span>
                                <span v-else>
                                    <Tag
                                        :severity="getSeverity(data.qc_status)"
                                        :icon="getIcon(data.qc_status)"
                                        :value="data.qc_status.toUpperCase()"
                                        rounded
                                    />
                                </span>
                            </template>
                        </Column> </DataTable
                ></template>
            </Card>

            <Card class="mt-4">
                <template #content>
                    <DataTable
                        :value="latest5Analyses"
                        :paginator="false"
                        rowHover
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20]"
                        sortField="created_at"
                        :sortOrder="-1"
                        dataKey="id"
                        ><template #header>
                            <div
                                class="flex flex-wrap items-center justify-between gap-2"
                            >
                                <span class="text-xl font-bold"
                                    >Recent Meta-Analyses</span
                                >
                                <Button
                                    type="button"
                                    label="View All Meta-Analyses"
                                    icon="bi-card-list"
                                    outlined
                                    @click="() => $router.push('/hermes/ma/')"
                                />
                            </div>
                        </template>
                        <template #empty> No dataset found. </template>
                        <template #loading>
                            Loading dataset data. Please wait...
                        </template>
                        <Column field="name" header="Name">
                            <template #body="{ data }">
                                <NuxtLink :to="`/hermes/ma/${data.id}`">
                                    {{ data.name }}
                                </NuxtLink>
                            </template>
                        </Column>
                        <Column field="created_at" header="Date">
                            <template #body="{ data }">
                                {{ formatDate(new Date(data.created_at)) }}
                            </template>
                        </Column>
                        <Column field="phenotype" header="Phenotype">
                            <template #body="{ data }">
                                {{ data.phenotype }}
                            </template>
                        </Column>
                        <Column field="datasets" header="Datasets">
                            <template #body="{ data }">
                                {{
                                    data.dataset_names.slice(0, 3).join(", ") +
                                    (data.dataset_names.length > 3
                                        ? ", ..."
                                        : "")
                                }}
                            </template>
                        </Column>
                        <Column field="method" header="Method"></Column>
                        <Column field="status" header="Status"> </Column
                    ></DataTable>
                </template>
            </Card>
        </div>
        <div class="col-span-4">
            <Card id="pieChart" v-if="fileUploads.length">
                <template #title>Dataset Status</template>
                <template #content>
                    <Chart
                        type="doughnut"
                        :data="pieData"
                        :options="pieOptions"
                        class="h-80 flex items-center justify-center"
                    ></Chart>
                </template>
            </Card>
            <Card v-else>
                <template #content>
                    <div class="text-center h-40">No datasets found</div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
/* button span.icon {
    margin-right: 10px;
} */
/* .p-tag .p-tag-icon {
    margin-right: 0.25rem;
} */
#pieChart {
    height: 25rem;
}
#pieChart :deep(.p-card-content) {
    margin: 0 auto;
}
</style>
