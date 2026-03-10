<template>
    <div class="grid">
        <div v-if="gwasFiles.length && finished" class="col">
            <h2>HCM GWAS Files</h2>
            <div class="flex justify-content-start mb-3">
                <Button id="upload_new"
                    label="Upload GWAS File"
                    icon="bi-upload"
                    class="mr-2"
                    @click="router.push('/hcm/new')"
                ></Button>
            </div>
            <Card class="mt-4">
                <template #content>
                    <DataTable
                        v-model:filters="filters"
                        filterDisplay="row"
                        :value="gwasFiles"
                        class="w-full p-datatable-sm"
                        paginator
                        :rows="20"
                        :loading="tableLoading"
                        sortField="uploaded_at"
                        :sortOrder="-1"
                        stripedRows
                    >
                        <template #empty> No GWAS files found. </template>
                        <template #loading> Loading data. Please wait. </template>

                        <Column field="cohort_name" header="Cohort" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="font-medium">{{ data.cohort_name }}</span>
                            </template>
                            <template #filter="{ filterModel, filterCallback }">
                                <InputText
                                    v-model="filterModel.value"
                                    type="text"
                                    @input="filterCallback()"
                                    class="p-column-filter"
                                    placeholder="Search cohort"
                                />
                            </template>
                        </Column>

                        <Column field="sarc" header="SARC" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <Tag :value="data.sarc" severity="secondary" />
                            </template>
                        </Column>

                        <Column field="ancestry" header="Ancestry" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <Tag :value="data.ancestry" severity="info" />
                            </template>
                        </Column>

                        <Column field="sex" header="Sex" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm">{{ data.sex }}</span>
                            </template>
                        </Column>

                        <Column field="genome_build" header="Build" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm">{{ data.genome_build }}</span>
                            </template>
                        </Column>

                        <Column field="software" header="Software" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm">{{ data.software }}</span>
                            </template>
                        </Column>

                        <Column field="file_name" header="File Name" :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm" style="word-break: break-all;">{{ data.file_name }}</span>
                            </template>
                        </Column>

                        <Column field="uploaded_at" header="Uploaded" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm">
                                    {{ new Date(data.uploaded_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) }}
                                </span>
                            </template>
                        </Column>

                        <Column field="uploaded_by" header="Uploaded By" :showFilterMenu="false">
                            <template #body="{ data }">
                                <span class="text-sm">{{ data.uploaded_by }}</span>
                            </template>
                        </Column>

                        <Column header="Actions" style="width: 8rem; text-align: center;">
                            <template #body="{ data }">
                                <div class="flex gap-1 justify-content-center">
                                    <Button
                                        icon="bi-download"
                                        severity="info"
                                        outlined
                                        size="small"
                                        title="Download file"
                                        @click="handleDownload(data.id)"
                                    />
                                    <Button
                                        icon="bi-trash"
                                        severity="danger"
                                        outlined
                                        size="small"
                                        title="Delete file"
                                        @click="confirmDelete(data)"
                                    />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
        <div v-else-if="finished && !gwasFiles.length" class="col">
            <Card>
                <template #content>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-900 font-bold text-5xl mb-3">
                                Upload your HCM GWAS files.
                            </div>
                            <div class="text-700 text-2xl mb-5">
                                You don't have any GWAS files yet. Start uploading
                                your first file today.
                            </div>
                            <Button
                                label="Upload GWAS File"
                                icon="bi-upload"
                                class="mr-2"
                                @click="router.push('/hcm/new')"
                            ></Button>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <div v-else class="col">
            <Card>
                <template #content>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-600 font-bold text-4xl mb-3">
                                Loading...
                            </div>
                            <div class="text-700 text-2xl mb-5">
                                Please wait while we load your GWAS files.
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <Dialog
        v-model:visible="deleteDialog"
        modal
        header="Confirm Delete"
        :style="{ width: '450px' }"
    >
        <div class="confirmation-content">
            <i class="bi bi-exclamation-triangle mr-3" style="color: var(--red-500)" />
            <span>Are you sure you want to delete <strong>{{ fileToDelete?.file_name }}</strong>?</span>
        </div>
        <template #footer>
            <Button
                label="No"
                icon="bi-x"
                outlined
                @click="deleteDialog = false"
                class="mr-2"
            />
            <Button
                label="Yes"
                icon="bi-check"
                severity="danger"
                @click="handleDelete"
            />
        </template>
    </Dialog>

    <Toast position="top-center" />
</template>

<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';

definePageMeta({
  layout: 'hcm'
});

const toast = useToast();
const store = useDatasetStore();
const router = useRouter();

// Reactive data
const gwasFiles = ref([]);
const tableLoading = ref(false);
const finished = ref(false);
const deleteDialog = ref(false);
const fileToDelete = ref(null);

// Filters
const filters = ref({
    cohort_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Load GWAS files
async function loadFiles() {
    tableLoading.value = true;
    try {
        gwasFiles.value = await store.fetchHCMGWASFiles();
    } catch (error) {
        console.error('Error fetching HCM GWAS files:', error);
        gwasFiles.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load GWAS files.',
            life: 5000
        });
    }
    tableLoading.value = false;
    finished.value = true;
}

// Download
async function handleDownload(fileId) {
    try {
        await store.downloadHCMGWASFile(fileId);
    } catch (error) {
        console.error('Error downloading file:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error downloading file. Please try again.',
            life: 5000
        });
    }
}

// Delete
function confirmDelete(file) {
    fileToDelete.value = file;
    deleteDialog.value = true;
}

async function handleDelete() {
    try {
        await store.deleteHCMGWASFile(fileToDelete.value.id);
        gwasFiles.value = gwasFiles.value.filter(f => f.id !== fileToDelete.value.id);
        deleteDialog.value = false;
        fileToDelete.value = null;
        toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'GWAS file deleted successfully.',
            life: 3000
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.detail || 'Error deleting file. Please try again.',
            life: 5000
        });
    }
}

onMounted(() => {
    loadFiles();
});
</script>

<style scoped>
.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>
