<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, onMounted } from "vue";
import Chart from "primevue/chart";
const store = useDatasetStore();
const fileUploads = ref([]);

onMounted(async () => {
    fileUploads.value = await store.fetchFileUploads();
});
const statusColors = {
    "FAILED QC": "danger",
    "READY FOR REVIEW": "success",
    "SUBMITTED TO QC": "secondary",
    "REVIEW REJECTED": "warning",
    "REVIEW APPROVED": "info",
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

const formatDate = (value) => {
    return value.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
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
                backgroundColor: [
                    "#FFC107",
                    "#007bff",
                    "#28a745",
                    "#dc3545",
                    "#6c757d",
                ],
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
    <div class="grid">
        <div class="col-8">
            <Card>
                <template #title>Recently Added</template>
                <template #content
                    ><DataTable
                        :value="fileUploads"
                        :paginator="true"
                        rowHover
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20]"
                        sortField="uploaded_at"
                        :sortOrder="-1"
                        dataKey="id"
                        ><template #header>
                            <div
                                class="flex justify-content-end flex-column sm:flex-row"
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
                        <Column field="dataset_name" header="Dataset"></Column>

                        <Column field="uploaded_at" header="Date Uploaded">
                            <template #body="{ data }">
                                {{ formatDate(new Date(data.uploaded_at)) }}
                            </template>
                        </Column>
                        <Column field="uploaded_by" header="Uploader"></Column>
                        <Column field="phenotype" header="Phenotype"></Column>
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
        </div>
        <div class="col-4">
            <Card id="pieChart" v-if="fileUploads.length">
                <template #title>Dataset Status</template>
                <template #content>
                    <Chart
                        type="doughnut"
                        :data="pieData"
                        :options="pieOptions"
                        class="h-20rem flex items-center justify-center"
                    ></Chart>
                </template>
            </Card>
            <Card v-else>
                <template #content>
                    <div class="text-center h-10rem">No datasets found</div>
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
