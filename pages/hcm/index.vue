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

                        <Column header="QC Status" style="width: 9rem;" :showFilterMenu="false">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-1">
                                    <template v-if="!qcStatus[data.id]">
                                        <Tag value="Not run" severity="secondary" />
                                    </template>
                                    <template v-else-if="qcStatus[data.id] === 'SUBMITTED'">
                                        <i class="bi bi-hourglass-split text-yellow-500 mr-1" />
                                        <span class="text-sm text-yellow-600">Queued</span>
                                    </template>
                                    <template v-else-if="qcStatus[data.id] === 'RUNNING'">
                                        <i class="pi pi-spin pi-spinner mr-1" style="color: var(--blue-500)" />
                                        <span class="text-sm" style="color: var(--blue-600)">
                                            Running{{ qcProgress[data.id] != null ? ` ${qcProgress[data.id]}%` : '' }}
                                        </span>
                                    </template>
                                    <template v-else-if="qcStatus[data.id] === 'COMPLETED'">
                                        <Tag :value="qcErrors[data.id] === 0 ? 'Passed' : `${qcErrors[data.id]} errors`"
                                             :severity="qcErrors[data.id] === 0 ? 'success' : 'warning'" />
                                    </template>
                                    <template v-else-if="qcStatus[data.id] === 'FAILED'">
                                        <Tag value="Failed" severity="danger" />
                                    </template>
                                </div>
                            </template>
                        </Column>

                        <Column header="Actions" style="width: 12rem; text-align: center;">
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
                                        icon="bi-shield-check"
                                        severity="secondary"
                                        outlined
                                        size="small"
                                        title="Run QC"
                                        :disabled="qcStatus[data.id] === 'SUBMITTED' || qcStatus[data.id] === 'RUNNING'"
                                        @click="handleRunQC(data.id)"
                                    />
                                    <Button
                                        v-if="qcStatus[data.id] === 'COMPLETED' && qcErrors[data.id] > 0"
                                        icon="bi-file-earmark-text"
                                        severity="warning"
                                        outlined
                                        size="small"
                                        title="View QC errors"
                                        @click="handleViewErrors(data.id)"
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

    <!-- QC Errors Dialog -->
    <Dialog
        v-model:visible="errorsDialog"
        modal
        header="QC Validation Errors"
        :style="{ width: '500px' }"
    >
        <p class="mb-3 text-sm text-600">
            The full error log is available as a TSV download. A sample of the first errors is shown below.
        </p>
        <div v-if="errorsFileUrl" class="mb-3">
            <Button
                label="Download Full Error Log"
                icon="bi-download"
                severity="warning"
                size="small"
                @click="openUrl(errorsFileUrl)"
            />
        </div>
        <div v-if="errorSamples.length" class="mt-3">
            <p class="font-semibold text-sm mb-2">Sample errors (first {{ errorSamples.length }}):</p>
            <div v-for="(err, i) in errorSamples" :key="i"
                 class="text-sm p-2 mb-1 border-round surface-100">
                <span class="font-medium">Row {{ err.row }}</span> —
                <span class="text-primary">{{ err.column }}</span>:
                <span class="text-600">"{{ err.value }}"</span> — {{ err.error }}
            </div>
        </div>
        <template #footer>
            <Button label="Close" @click="errorsDialog = false" />
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

// QC state — keyed by file ID
const qcStatus = ref({});   // fileId -> 'SUBMITTED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
const qcProgress = ref({}); // fileId -> percent complete (number, when RUNNING)
const qcErrors = ref({});   // fileId -> errors_found count (when COMPLETED)

// Errors dialog
const errorsDialog = ref(false);
const errorsFileUrl = ref(null);
const errorSamples = ref([]);

// Polling interval handle
let pollInterval = null;

// Filters
const filters = ref({
    cohort_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Load GWAS files, then fetch QC status for each
async function loadFiles() {
    tableLoading.value = true;
    try {
        gwasFiles.value = await store.fetchHCMGWASFiles();
        await loadAllQCStatuses();
        startPolling();
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

async function loadAllQCStatuses() {
    await Promise.all(gwasFiles.value.map(f => fetchQCStatus(f.id)));
}

async function fetchQCStatus(fileId) {
    try {
        const result = await store.getHCMGWASValidationProgress(fileId);
        const latest = result.validation_jobs?.[0];
        if (!latest) return;

        qcStatus.value[fileId] = latest.status;
        qcErrors.value[fileId] = latest.errors_found ?? 0;

        if (latest.status === 'RUNNING' && latest.live_progress) {
            qcProgress.value[fileId] = latest.live_progress.percent_complete;
        }
    } catch (e) {
        // 404 means no job has been run yet — that's fine
        if (e.response?.status !== 404) {
            console.error(`Error fetching QC status for ${fileId}:`, e);
        }
    }
}

function startPolling() {
    if (pollInterval) return;
    pollInterval = setInterval(async () => {
        const inFlight = gwasFiles.value
            .filter(f => ['SUBMITTED', 'RUNNING'].includes(qcStatus.value[f.id]));
        if (inFlight.length === 0) return;
        await Promise.all(inFlight.map(f => fetchQCStatus(f.id)));
    }, 10000);
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

// Run QC
async function handleRunQC(fileId) {
    try {
        qcStatus.value[fileId] = 'SUBMITTED';
        await store.startHCMGWASValidation(fileId);
        toast.add({
            severity: 'info',
            summary: 'QC Started',
            detail: 'Validation job submitted. Status will update automatically.',
            life: 4000
        });
    } catch (error) {
        qcStatus.value[fileId] = null;
        console.error('Error starting QC:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.detail || 'Failed to start QC job.',
            life: 5000
        });
    }
}

// View errors
async function handleViewErrors(fileId) {
    errorsFileUrl.value = null;
    errorSamples.value = [];
    try {
        // Get the download URL for the error TSV
        const result = await store.getHCMGWASValidationErrors(fileId);
        errorsFileUrl.value = result.errors_url;

        // Also load the sample errors from the progress endpoint
        const progress = await store.getHCMGWASValidationProgress(fileId);
        const latest = progress.validation_jobs?.[0];
        errorSamples.value = latest?.error_summary ?? [];
    } catch (error) {
        console.error('Error fetching QC errors:', error);
    }
    errorsDialog.value = true;
}

function openUrl(url) {
    window.open(url, '_blank');
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

onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval);
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
