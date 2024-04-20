<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, onMounted } from "vue";

const store = useDatasetStore();
const fileUploads = ref([]);

onMounted(async () => {
    fileUploads.value = await store.fetchFileUploads();
});

const getSeverity = (status) => {
    switch (status) {
        case "FAILED":
            return "danger";
        case "SUCCEEDED":
            return "success";
        case "SUBMITTED":
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
        case "FAILED":
            return "bi-x";
        case "SUCCEEDED":
            return "bi-check";
        case "SUBMITTED":
            return "bi-plus";
        case "REVIEW REJECTED":
            return "bi-x-square";
        case "REVIEW APPROVED":
            return "bi-check-square";
    }
};
</script>

<template>
    <div class="container-fluid">
        <h3>Uploaded Datasets</h3>
        <DataTable
            :value="fileUploads"
            :paginator="false"
            rowHover
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            ><template #header>
                <div class="flex justify-content-end flex-column sm:flex-row">
                    <Button
                        type="button"
                        label="Upload New Dataset"
                        icon="bi-upload"
                        outlined
                        @click="() => $router.push('/hermes/qc/upload')"
                    />
                </div>
            </template>
            <template #empty> No dataset found. </template>
            <template #loading> Loading dataset data. Please wait... </template>
            <Column field="dataset_name" header="Dataset"></Column>
            <Column field="file_name" header="File Name"></Column>
            <Column field="file_size" header="File Size">
                <template #body="{ data }">
                    {{ ((data.file_size / 1024) * 2).toFixed(2) + " mb" }}
                </template>
            </Column>
            <Column field="uploaded_at" header="Date Uploaded">
                <template #body="{ data }">
                    {{ formatDate(new Date(data.uploaded_at)) }}
                </template>
            </Column>
            <Column field="uploaded_by" header="Uploader"></Column>
            <Column field="phenotype" header="Phenotype"></Column>
            <Column field="qc_status" header="Status">
                <template #body="{ data }">
                    <span v-if="data.qc_status !== 'SUBMITTED'">
                        <nuxt-link :to="`/hermes/qc/${data.id}`">
                            <Tag
                                :severity="getSeverity(data.qc_status)"
                                :icon="getIcon(data.qc_status)"
                                :value="data.qc_status.toUpperCase()"
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
            </Column>
            <Column field="qc_report" header="QC Report">
                <template #body="{ data }">
                    <NuxtLink :to="`/hermes/qc/${data.id}`">
                        <Button
                            v-if="data.qc_status !== 'SUBMITTED'"
                            outlined
                            size="small"
                        >
                            View
                        </Button></NuxtLink
                    >
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
/* button span.icon {
    margin-right: 10px;
} */
/* .p-tag .p-tag-icon {
    margin-right: 0.25rem;
} */
</style>
