<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { FilterMatchMode } from "@primevue/core/api";

const route = useRouter();
const store = useDatasetStore();
const fileUploads = ref([]);
const tableLoading = ref(false);
const finished = ref(false);
const filters = ref({
    uploaded_by: { value: null, matchMode: FilterMatchMode.IN },
    phenotype: { value: null, matchMode: FilterMatchMode.EQUALS },
    qc_status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

onMounted(async () => {
    tableLoading.value = true;
    fileUploads.value = await store.fetchFileUploads();
    tableLoading.value = false;
    finished.value = true;
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
const uploaders = computed(() => {
    return fileUploads.value
        .map((file) => file.uploaded_by)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((value) => ({ label: value, value }));
});

const phenotypes = computed(() => {
    return fileUploads.value
        .map((file) => file.phenotype)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((value) => ({ name: value, value }));
});

const statuses = [
    { label: "Failed QC", value: "FAILED QC" },
    { label: "Ready for Review", value: "READY FOR REVIEW" },
    { label: "Submitted to QC", value: "SUBMITTED TO QC" },
    { label: "Review Rejected", value: "REVIEW REJECTED" },
    { label: "Review Approved", value: "REVIEW APPROVED" },
];
</script>

<template>
    <Card v-if="fileUploads.length && finished">
        <template #content>
            <DataTable
                :value="fileUploads"
                :paginator="false"
                rowHover
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                :loading="tableLoading"
                sortField="uploaded_at"
                :sortOrder="-1"
                v-model:filters="filters"
                filterDisplay="row"
                ><template #header>
                    <div class="flex justify-end flex-col sm:flex-row">
                        <Button
                            type="button"
                            label="Upload New Dataset"
                            icon="bi-upload"
                            outlined
                            @click="() => $router.push('/hermes/new')"
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
                            (data.file_size / (1024 * 1024)).toFixed(2) + " mb"
                        }}
                    </template>
                </Column>
                <Column field="uploaded_at" header="Date Uploaded">
                    <template #body="{ data }">
                        {{ formatDate(new Date(data.uploaded_at)) }}
                    </template>
                </Column>
                <Column
                    field="uploaded_by"
                    header="Uploader"
                    :showFilterMatchModes="false"
                    :showFilterMenu="false"
                >
                    <template #body="{ data }">{{ data.uploaded_by }}</template>
                    <template #filter="{ filterModel, filterCallback }">
                        <MultiSelect
                            v-model="filterModel.value"
                            @change="filterCallback()"
                            :options="uploaders"
                            placeholder="Filter by Uploader"
                            optionLabel="label"
                            optionValue="value"
                            :maxSelectedLabels="1"
                            filter
                        >
                        </MultiSelect>
                    </template>
                </Column>
                <Column
                    field="phenotype"
                    header="Phenotype"
                    :showFilterMatchModes="false"
                    :showFilterMenu="false"
                    :showClearButton="false"
                >
                    <template #filter="{ filterModel, filterCallback }">
                        <Select
                            v-model="filterModel.value"
                            @change="filterCallback()"
                            :options="phenotypes"
                            placeholder="Filter by Phenotype"
                            optionLabel="name"
                            optionValue="value"
                            :showClear="true"
                        />
                    </template>
                </Column>
                <Column
                    field="qc_status"
                    header="Status"
                    :showFilterMatchModes="false"
                    :showFilterMenu="false"
                    :showClearButton="false"
                >
                    <template #filter="{ filterModel, filterCallback }">
                        <Select
                            v-model="filterModel.value"
                            @change="filterCallback()"
                            :options="statuses"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Filter by Status"
                            :showClear="true"
                        />
                    </template>
                    <template #body="{ data }">
                        <span v-if="data.qc_status !== 'SUBMITTED TO QC'">
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
                                v-if="data.qc_status !== 'SUBMITTED TO QC'"
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

    <Card v-else-if="finished && !fileUploads.length">
        <template #content>
            <div
                class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20"
            >
                <div class="text-surface-700 dark:text-surface-100 text-center">
                    <div
                        class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-4"
                    >
                        Upload your datasets.
                    </div>
                    <div
                        class="text-surface-700 dark:text-surface-100 text-2xl mb-8"
                    >
                        You don't have any dataset yet. Start uploading your
                        first dataset today.
                    </div>
                    <Button
                        label="Upload"
                        icon="bi-upload"
                        class="mr-2"
                        @click="route.push('/hermes/new')"
                    ></Button>
                </div>
            </div>
        </template>
    </Card>

    <Card v-else>
        <template #content>
            <div
                class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20"
            >
                <div class="text-surface-700 dark:text-surface-100 text-center">
                    <div
                        class="text-surface-600 dark:text-surface-200 font-bold text-4xl mb-4"
                    >
                        Loading...
                    </div>
                    <div
                        class="text-surface-700 dark:text-surface-100 text-2xl mb-8"
                    >
                        Please wait while we load your datasets.
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped>
.p-tag :deep(.p-tag-icon) {
    height: unset;
}
</style>
