<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';

definePageMeta({
    layout: 'mskkp'
});

const store = useDatasetStore();
const toast = useToast();
const router = useRouter();

const datasets = ref([]);
const tableLoading = ref(false);

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '—';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
}

function truncate(str, len) {
    if (!str) return '—';
    return str.length > len ? str.slice(0, len) + '…' : str;
}

function formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

async function loadDatasets() {
    tableLoading.value = true;
    try {
        datasets.value = await store.fetchMSKKPDatasets();
    } catch (error) {
        console.error('Error fetching MSKKP datasets:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load datasets.',
            life: 5000
        });
    }
    tableLoading.value = false;
}

async function handleDownload(datasetId) {
    try {
        await store.downloadMSKKPDataset(datasetId);
    } catch (error) {
        console.error('Download error:', error);
        toast.add({
            severity: 'error',
            summary: 'Download Failed',
            detail: 'Could not download file. Please try again.',
            life: 5000
        });
    }
}

async function handleDownloadReadme(datasetId) {
    try {
        await store.downloadMSKKPReadme(datasetId);
    } catch (error) {
        console.error('README download error:', error);
        toast.add({
            severity: 'error',
            summary: 'Download Failed',
            detail: 'Could not download README. Please try again.',
            life: 5000
        });
    }
}

onMounted(loadDatasets);
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="flex justify-content-between align-items-center mb-3">
                <h2>MSKKP GWAS Datasets</h2>
                <Button
                    label="Upload Dataset"
                    icon="pi pi-upload"
                    @click="router.push('/mskkp/new')"
                />
            </div>

            <Card>
                <template #content>
                    <DataTable
                        v-model:filters="filters"
                        filterDisplay="row"
                        :value="datasets"
                        class="w-full p-datatable-sm"
                        paginator
                        :rows="20"
                        :loading="tableLoading"
                        sortField="uploaded_at"
                        :sortOrder="-1"
                        stripedRows
                    >
                        <template #empty>No datasets found.</template>
                        <template #loading>Loading datasets. Please wait.</template>

                        <Column field="name" header="Cohort Name" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="font-medium">{{ data.name }}</span>
                            </template>
                            <template #filter="{ filterModel, filterCallback }">
                                <InputText
                                    v-model="filterModel.value"
                                    type="text"
                                    @input="filterCallback()"
                                    class="p-column-filter"
                                    placeholder="Search"
                                />
                            </template>
                        </Column>

                        <Column field="ancestry" header="Ancestry" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <Tag :value="data.ancestry" severity="info" />
                            </template>
                        </Column>

                        <Column field="genome_build" header="Build" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm">{{ data.genome_build }}</span>
                            </template>
                        </Column>

                        <Column field="phenotype" header="Phenotype" :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm" :title="data.phenotype">{{ truncate(data.phenotype, 60) }}</span>
                            </template>
                        </Column>

                        <Column field="file_name" header="File Name" :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm" style="word-break: break-all;">{{ data.file_name }}</span>
                            </template>
                        </Column>

                        <Column field="file_size" header="Size" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm">{{ formatBytes(data.file_size) }}</span>
                            </template>
                        </Column>

                        <Column field="uploaded_at" header="Uploaded" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm">{{ formatDate(data.uploaded_at) }}</span>
                            </template>
                        </Column>

                        <Column field="uploaded_by" header="Uploaded By" :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm">{{ data.uploaded_by }}</span>
                            </template>
                        </Column>

                        <Column header="Actions" style="width: 8rem;" :showFilterMenu="false">
                            <template #body="{ data }">
                                <div class="flex gap-1 justify-content-center">
                                    <Button
                                        icon="pi pi-download"
                                        severity="info"
                                        outlined
                                        size="small"
                                        title="Download GWAS file"
                                        @click="handleDownload(data.id)"
                                    />
                                    <Button
                                        v-if="data.readme_s3_path"
                                        icon="pi pi-file"
                                        severity="secondary"
                                        outlined
                                        size="small"
                                        title="Download README"
                                        @click="handleDownloadReadme(data.id)"
                                    />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
    </div>
    <Toast position="top-center" />
</template>
