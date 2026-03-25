<template>
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">GWAS Files</h5>
            <Tag :value="gwasFiles.length + ' file' + (gwasFiles.length !== 1 ? 's' : '')" severity="info" />
        </div>

        <div v-if="loading" class="text-center p-4">
            <ProgressSpinner style="width: 40px; height: 40px" />
            <p class="mt-2 text-gray-600">Loading GWAS files...</p>
        </div>

        <div v-else-if="gwasFiles.length === 0" class="text-center p-4">
            <i class="pi pi-inbox text-gray-400" style="font-size: 3rem"></i>
            <p class="mt-3 text-gray-600">No GWAS files have been uploaded for this cohort yet.</p>
        </div>

        <DataTable v-else :value="gwasFiles" class="mt-3" :paginator="gwasFiles.length > 10" :rows="10">
            <Column field="dataset" header="Dataset" :sortable="true">
                <template #body="{ data }">
                    <span class="font-medium">{{ data.dataset }}</span>
                </template>
            </Column>
            <Column field="phenotype" header="Phenotype" :sortable="true" />
            <Column field="ancestry" header="Ancestry" :sortable="true">
                <template #body="{ data }">
                    <Tag :value="data.ancestry" severity="secondary" />
                </template>
            </Column>
            <Column field="metadata.sex" header="Sex">
                <template #body="{ data }">
                    <span class="text-sm">{{ data.metadata?.sex || '-' }}</span>
                </template>
            </Column>
            <Column field="cases" header="Cases" :sortable="true">
                <template #body="{ data }">
                    <span class="text-sm">{{ data.cases !== null ? data.cases : '-' }}</span>
                </template>
            </Column>
            <Column field="controls" header="Controls" :sortable="true">
                <template #body="{ data }">
                    <span class="text-sm">{{ data.controls !== null ? data.controls : '-' }}</span>
                </template>
            </Column>
            <Column field="file_name" header="File Name">
                <template #body="{ data }">
                    <span class="text-sm">{{ data.file_name }}</span>
                </template>
            </Column>
            <Column field="file_size" header="Size" :sortable="true">
                <template #body="{ data }">
                    <span class="text-sm">{{ formatFileSize(data.file_size) }}</span>
                </template>
            </Column>
            <Column field="uploaded_at" header="Uploaded" :sortable="true">
                <template #body="{ data }">
                    <span class="text-sm">
                        {{ new Date(data.uploaded_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        }) }}
                    </span>
                </template>
            </Column>
            <Column header="Metadata" style="width: 5rem; text-align: center">
                <template #body="{ data }">
                    <i
                        v-if="data.metadata && Object.keys(data.metadata).length"
                        class="pi pi-info-circle text-blue-500"
                        style="font-size: 1.2rem; cursor: default"
                        v-tooltip="{ value: formatMetadataTooltip(data.metadata), position: 'left' }"
                    />
                    <span v-else class="text-gray-400">-</span>
                </template>
            </Column>
            <Column header="QC Status" style="width: 10rem;">
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
                            <Tag
                                :value="qcErrors[data.id] === 0 ? 'Passed' : `${qcErrors[data.id]} errors`"
                                :severity="qcErrors[data.id] === 0 ? 'success' : 'warning'"
                            />
                        </template>
                        <template v-else-if="qcStatus[data.id] === 'FAILED'">
                            <Tag value="Failed" severity="danger" />
                        </template>
                    </div>
                </template>
            </Column>
            <Column header="Actions" style="width: 12rem">
                <template #body="{ data }">
                    <div class="flex gap-1">
                        <Button
                            icon="pi pi-download"
                            severity="secondary"
                            outlined
                            size="small"
                            @click="downloadGWASFile(data.id)"
                            title="Download GWAS file"
                        />
                        <Button
                            icon="bi-shield-check"
                            severity="secondary"
                            outlined
                            size="small"
                            title="Run QC"
                            :disabled="['SUBMITTED', 'RUNNING', 'COMPLETED', 'FAILED'].includes(qcStatus[data.id])"
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
                            icon="pi pi-trash"
                            severity="danger"
                            outlined
                            size="small"
                            @click="confirmDeleteGWAS(data)"
                            title="Delete GWAS file"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>

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
                @click="window.open(errorsFileUrl, '_blank')"
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

    <!-- Delete GWAS File Dialog -->
    <Dialog
        v-model:visible="deleteGWASDialog"
        modal
        header="Confirm Delete"
        :style="{ width: '450px' }"
    >
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="color: var(--red-500); font-size: 1.5rem" />
            <span>Are you sure you want to delete this GWAS file?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" outlined @click="deleteGWASDialog = false" class="mr-2" />
            <Button label="Yes" icon="pi pi-check" severity="danger" @click="handleDeleteGWAS" />
        </template>
    </Dialog>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDatasetStore } from "~/stores/DatasetStore";

const props = defineProps({
    cohortId: { type: String, required: true },
    toastGroup: { type: String, default: undefined }
});

const toast = useToast();
const store = useDatasetStore();

const gwasFiles = ref([]);
const loading = ref(true);
const deleteGWASDialog = ref(false);
const gwasFileToDelete = ref(null);

const qcStatus = ref({});
const qcProgress = ref({});
const qcErrors = ref({});

const errorsDialog = ref(false);
const errorsFileUrl = ref(null);
const errorSamples = ref([]);

let pollInterval = null;

onMounted(async () => {
    try {
        gwasFiles.value = await store.fetchSGCGWASFiles(props.cohortId);
        await Promise.all(gwasFiles.value.map(f => fetchQCStatus(f.id)));
        startPolling();
    } catch {
        gwasFiles.value = [];
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval);
});

async function fetchQCStatus(fileId) {
    try {
        const result = await store.getSGCGWASValidationProgress(fileId);
        const latest = result.validation_jobs?.[0];
        if (!latest) return;
        qcStatus.value[fileId] = latest.status;
        qcErrors.value[fileId] = latest.errors_found ?? 0;
        if (latest.status === 'RUNNING' && latest.live_progress) {
            qcProgress.value[fileId] = latest.live_progress.percent_complete;
        }
    } catch (e) {
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

async function handleRunQC(fileId) {
    try {
        qcStatus.value[fileId] = 'SUBMITTED';
        await store.startSGCGWASValidation(fileId);
        toast.add({ severity: 'info', summary: 'QC Started', detail: 'Validation job submitted. Status will update automatically.', life: 4000, group: props.toastGroup });
    } catch (error) {
        qcStatus.value[fileId] = null;
        toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.detail || 'Failed to start QC job.', life: 5000, group: props.toastGroup });
    }
}

async function handleViewErrors(fileId) {
    errorsFileUrl.value = null;
    errorSamples.value = [];
    try {
        const result = await store.getSGCGWASValidationErrors(fileId);
        errorsFileUrl.value = result.errors_url;
        const progress = await store.getSGCGWASValidationProgress(fileId);
        const latest = progress.validation_jobs?.[0];
        errorSamples.value = latest?.error_summary ?? [];
    } catch (error) {
        console.error('Error fetching QC errors:', error);
    }
    errorsDialog.value = true;
}

async function downloadGWASFile(fileId) {
    try {
        await store.downloadSGCGWASFile(fileId);
    } catch {
        toast.add({ severity: 'error', summary: 'Download Error', detail: 'Failed to download GWAS file.', life: 5000, group: props.toastGroup });
    }
}

function confirmDeleteGWAS(file) {
    gwasFileToDelete.value = file;
    deleteGWASDialog.value = true;
}

async function handleDeleteGWAS() {
    try {
        await store.deleteSGCGWASFile(gwasFileToDelete.value.id);
        gwasFiles.value = gwasFiles.value.filter(f => f.id !== gwasFileToDelete.value.id);
        deleteGWASDialog.value = false;
        gwasFileToDelete.value = null;
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'GWAS file deleted successfully.', life: 3000, group: props.toastGroup });
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete GWAS file.', life: 5000, group: props.toastGroup });
    }
}

function formatMetadataTooltip(metadata) {
    if (!metadata) return '';
    return Object.entries(metadata).map(([k, v]) => `${k}: ${v}`).join('\n');
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>
