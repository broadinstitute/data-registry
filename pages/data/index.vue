<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, onMounted } from "vue";

const route = useRouter();
const store = useDatasetStore();
const fileUploads = ref([]);

onMounted(async () => {
    fileUploads.value = await store.fetchFileUploads();
});

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
</script>

<template>
    <div class="grid">
        <div v-if="fileUploads.length" class="col">
            <Card>
                <template #content>
                    <DataTable
                        :value="fileUploads"
                        :paginator="false"
                        rowHover
                        :rows="10"
                        :rowsPerPageOptions="[5, 10, 20]"
                        ><template #header>
                            <div
                                class="flex justify-content-end flex-column sm:flex-row"
                            >
                                <Button
                                    type="button"
                                    label="Upload New Dataset"
                                    icon="bi-upload"
                                    outlined
                                    @click="() => $router.push('/data/new')"
                                />
                            </div>
                        </template>
                        <template #empty> No dataset found. </template>
                        <template #loading>
                            Loading dataset data. Please wait...
                        </template>
                        <Column field="dataset_name" header="Dataset"></Column>
                        <Column field="file_name" header="File Name"></Column>
                        <Column field="file_size" header="File Size">
                            <template #body="{ data }">
                                {{
                                    ((data.file_size / 1024) * 2).toFixed(2) +
                                    " mb"
                                }}
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
                                <span
                                    v-if="data.qc_status !== 'SUBMITTED TO QC'"
                                >
                                    <nuxt-link :to="`/data/qc/${data.id}`">
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
                        </Column>
                        <Column field="qc_report" header="QC Report">
                            <template #body="{ data }">
                                <NuxtLink :to="`/data/qc/${data.id}`">
                                    <Button
                                        v-if="
                                            data.qc_status !== 'SUBMITTED TO QC'
                                        "
                                        outlined
                                        size="small"
                                    >
                                        View
                                    </Button></NuxtLink
                                >
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
        <div v-else class="col">
            <Card>
                <template #content>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-900 font-bold text-5xl mb-3">
                                Upload your datasets.
                            </div>
                            <div class="text-700 text-2xl mb-5">
                                You don't have any dataset yet. Start uploading
                                your first dataset today.
                            </div>
                            <Button
                                label="Upload"
                                icon="bi-upload"
                                class="mr-2"
                                @click="route.push('/data/new')"
                            ></Button>
                        </div>
                    </div>
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
</style>
