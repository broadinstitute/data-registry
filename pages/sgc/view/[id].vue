<template>
    <div class="grid">
        <div class="col mb-4">
            <div class="flex justify-content-between align-items-center">
                <h2 class="mb-0">
                    Cohort Details
                </h2>
                <Button
                    label="Edit Cohort"
                    icon="pi pi-pencil"
                    @click="navigateTo(`/sgc/edit/${cohortId}`)"
                    outlined
                />
            </div>
        </div>
    </div>

    <!-- Loading State -->
    <div class="grid" v-if="loading">
        <div class="col-12">
            <div class="text-center p-4">
                <ProgressSpinner />
                <p>Loading cohort information...</p>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="grid" v-else>
        <div class="col-12">
            <TabView>

                <!-- Tab 1: Phase 0 -->
                <TabPanel header="Phase 0">
                    <!-- Cohort Metadata -->
                    <div class="card p-fluid mb-4">
                        <h5>Cohort Information</h5>
                        <SGCMetadataForm
                            :initial-data="cohortData"
                            :disabled="true"
                            :show-save-button="false"
                        />
                    </div>

                    <!-- Files Section -->
                    <div class="card">
                        <h5>Uploaded Files</h5>

                        <!-- Validation Status Banner -->
                        <div v-if="validationPassed" class="mb-4 p-3" style="background-color: var(--green-50); border: 1px solid var(--green-200); border-radius: 6px;">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-check-circle text-green-600" style="font-size: 1.5rem"></i>
                                <div>
                                    <span class="text-green-800 font-medium text-lg">Cohort Validated</span>
                                    <p class="text-green-700 text-sm mt-1 mb-0">All files have been uploaded and validated successfully.</p>
                                </div>
                            </div>
                        </div>

                        <div v-else class="mb-4 p-3" style="background-color: var(--orange-50); border: 1px solid var(--orange-200); border-radius: 6px;">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-exclamation-triangle text-orange-600" style="font-size: 1.5rem"></i>
                                <div>
                                    <span class="text-orange-800 font-medium text-lg">Validation Pending</span>
                                    <p class="text-orange-700 text-sm mt-1 mb-0">This cohort has not completed validation. Please edit the cohort to complete the upload process.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Files List -->
                        <DataTable :value="filesList" class="mt-3">
                            <Column field="label" header="File Type" class="font-semibold"></Column>
                            <Column field="fileName" header="File Name">
                                <template #body="{ data }">
                                    <span v-if="data.fileName">{{ data.fileName }}</span>
                                    <span v-else class="text-gray-400">Not uploaded</span>
                                </template>
                            </Column>
                            <Column field="uploadedAt" header="Uploaded">
                                <template #body="{ data }">
                                    <span v-if="data.uploadedAt">
                                        {{ new Date(data.uploadedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) }}
                                    </span>
                                    <span v-else class="text-gray-400">-</span>
                                </template>
                            </Column>
                            <Column field="status" header="Status" style="width: 8rem">
                                <template #body="{ data }">
                                    <Tag v-if="data.uploaded" severity="success" value="Uploaded" icon="pi pi-check" />
                                    <Tag v-else severity="danger" value="Missing" icon="pi pi-times" />
                                </template>
                            </Column>
                            <Column header="Actions" style="width: 8rem">
                                <template #body="{ data }">
                                    <Button
                                        v-if="data.fileId"
                                        icon="pi pi-download"
                                        severity="secondary"
                                        outlined
                                        size="small"
                                        @click="downloadFile(data.fileId)"
                                        title="Download file"
                                    />
                                </template>
                            </Column>
                        </DataTable>

                        <!-- Cohort Metadata -->
                        <div class="mt-4 pt-4" style="border-top: 1px solid var(--surface-300);">
                            <h6 class="mb-3">Additional Information</h6>
                            <div class="grid">
                                <div class="col-12 md:col-6">
                                    <p class="text-sm text-gray-600 mb-1">Created</p>
                                    <p class="font-medium">{{ cohortData?.created_at ? new Date(cohortData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-' }}</p>
                                </div>
                                <div class="col-12 md:col-6">
                                    <p class="text-sm text-gray-600 mb-1">Uploaded By</p>
                                    <p class="font-medium">{{ cohortData?.uploaded_by || '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>

                <!-- Tab 2: GWAS -->
                <TabPanel header="GWAS">
                    <!-- GWAS Cohort Metadata -->
                    <div class="card p-fluid mb-4">
                        <h5>GWAS Cohort Metadata</h5>
                        <div v-if="loadingGwasMetadata" class="text-center p-4">
                            <ProgressSpinner style="width: 40px; height: 40px" />
                            <p class="mt-2 text-gray-600">Loading GWAS metadata...</p>
                        </div>
                        <div v-else-if="!gwasMetadata" class="text-center p-4">
                            <i class="pi pi-info-circle text-gray-400" style="font-size: 3rem"></i>
                            <p class="mt-3 text-gray-600">No GWAS metadata has been entered for this cohort yet.</p>
                        </div>
                        <SGCGWASCohortForm
                            v-else
                            :initial-data="gwasMetadata"
                            :disabled="true"
                            :show-save-button="false"
                        />
                    </div>

                    <!-- GWAS Files Section -->
                    <div class="card">
                        <div class="flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0">GWAS Files</h5>
                            <Tag :value="gwasFiles.length + ' file' + (gwasFiles.length !== 1 ? 's' : '')" severity="info" />
                        </div>

                        <div v-if="loadingGwasFiles" class="text-center p-4">
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
                            <Column field="phenotype" header="Phenotype" :sortable="true">
                                <template #body="{ data }">
                                    <span>{{ data.phenotype }}</span>
                                </template>
                            </Column>
                            <Column field="ancestry" header="Ancestry" :sortable="true">
                                <template #body="{ data }">
                                    <Tag :value="data.ancestry" severity="secondary" />
                                </template>
                            </Column>
                            <Column field="metadata.sex" header="Sex" :sortable="false">
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
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
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
                            <Column header="Actions" style="width: 10rem">
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
                </TabPanel>

            </TabView>
        </div>
    </div>

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
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                @click="deleteGWASDialog = false"
                class="mr-2"
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                @click="handleDeleteGWAS"
            />
        </template>
    </Dialog>

    <Toast position="top-center" />
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDatasetStore } from "~/stores/DatasetStore";

definePageMeta({
  layout: 'sgc'
});

const toast = useToast();
const route = useRoute();
const store = useDatasetStore();

// Get the cohort ID from the route
const cohortId = route.params.id;

// Reactive data
const loading = ref(true);
const cohortData = ref(null);
const validationPassed = ref(false);
const uploadedFiles = ref([]);
const gwasFiles = ref([]);
const loadingGwasFiles = ref(true);
const gwasMetadata = ref(null);
const loadingGwasMetadata = ref(true);
const deleteGWASDialog = ref(false);
const gwasFileToDelete = ref(null);

// File types mapping for display
const fileTypeLabels = {
    'cases_controls_male': 'Male Cases/Controls',
    'cases_controls_female': 'Female Cases/Controls',
    'cooccurrence_male': 'Male Co-occurrence',
    'cooccurrence_female': 'Female Co-occurrence',
    'cohort_description': 'Cohort Description'
};

// Computed property for files list
const filesList = computed(() => {
    const fileTypes = [
        'cases_controls_male',
        'cases_controls_female',
        'cooccurrence_male',
        'cooccurrence_female',
        'cohort_description'
    ];

    return fileTypes.map(fileType => {
        const file = uploadedFiles.value.find(f => f.file_type === fileType);
        return {
            fileType: fileType,
            label: fileTypeLabels[fileType],
            fileName: file?.file_name || null,
            uploadedAt: file?.uploaded_at || null,
            fileId: file?.id || null,
            uploaded: !!file
        };
    });
});

onMounted(async () => {
    try {
        // Load cohort data by ID from the API
        const response = await store.fetchSGCCohort(cohortId);
        
        if (response && response.length > 0) {
            const cohortInfo = response[0];
            cohortData.value = {
                id: cohortInfo.cohort_id,
                name: cohortInfo.name,
                total_sample_size: cohortInfo.total_sample_size,
                number_of_males: cohortInfo.number_of_males,
                number_of_females: cohortInfo.number_of_females,
                uploaded_by: cohortInfo.uploaded_by,
                created_at: cohortInfo.created_at,
                ...(cohortInfo.cohort_metadata ? {
                    phenotype_coding_system: cohortInfo.cohort_metadata.phenotype_coding_system || '',
                    phenotype_mapping_issues: cohortInfo.cohort_metadata.phenotype_mapping_issues || '',
                    cohort_approval_requirements: cohortInfo.cohort_metadata.cohort_approval_requirements || '',
                    summary_stats_restrictions: cohortInfo.cohort_metadata.summary_stats_restrictions || '',
                    summary_stats_publication_availability: cohortInfo.cohort_metadata.summary_stats_publication_availability || null,
                    summary_stats_consortium_availability: cohortInfo.cohort_metadata.summary_stats_consortium_availability || null,
                    other_notes: cohortInfo.cohort_metadata.other_notes || ''
                } : {
                    phenotype_coding_system: '',
                    phenotype_mapping_issues: '',
                    cohort_approval_requirements: '',
                    summary_stats_restrictions: '',
                    summary_stats_publication_availability: null,
                    summary_stats_consortium_availability: null,
                    other_notes: ''
                })
            };
            
            // Extract uploaded files (excluding derived 'both' files)
            uploadedFiles.value = response
                .filter(row => row.file_type && row.file_name)
                .filter(row => row.file_type !== 'cases_controls_both' && row.file_type !== 'cooccurrence_both')
                .map(row => ({
                    id: row.file_id,
                    file_type: row.file_type,
                    file_name: row.file_name,
                    uploaded_at: row.uploaded_at
                }));
            
            // Set validation status
            validationPassed.value = !!cohortInfo.validation_status;
        } else {
            throw new Error('Cohort not found');
        }
        
    } catch (error) {
        console.error('Error loading cohort:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load cohort information. Cohort may not exist.',
            life: 5000
        });
        // Redirect back to index if cohort not found
        setTimeout(() => {
            navigateTo('/sgc');
        }, 2000);
    } finally {
        loading.value = false;
    }

    // Load GWAS files and metadata in parallel
    await Promise.allSettled([
        (async () => {
            try {
                gwasFiles.value = await store.fetchSGCGWASFiles(cohortId);
            } catch (error) {
                console.error('Error loading GWAS files:', error);
                toast.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Failed to load GWAS files for this cohort.',
                    life: 3000
                });
                gwasFiles.value = [];
            } finally {
                loadingGwasFiles.value = false;
            }
        })(),
        (async () => {
            try {
                const gwas = await store.fetchSGCGWASCohort(cohortId);
                gwasMetadata.value = gwas ? (gwas.metadata || {}) : null;
            } catch (error) {
                console.error('Error loading GWAS metadata:', error);
                gwasMetadata.value = null;
            } finally {
                loadingGwasMetadata.value = false;
            }
        })()
    ]);
});

// Download file
async function downloadFile(fileId) {
    try {
        await store.downloadSGCFile(fileId);
    } catch (error) {
        console.error('Error downloading file:', error);
        toast.add({
            severity: 'error',
            summary: 'Download Error',
            detail: 'Failed to download file. Please try again.',
            life: 5000
        });
    }
}

// Download GWAS file
async function downloadGWASFile(fileId) {
    try {
        await store.downloadSGCGWASFile(fileId);
    } catch (error) {
        console.error('Error downloading GWAS file:', error);
        toast.add({
            severity: 'error',
            summary: 'Download Error',
            detail: 'Failed to download GWAS file. Please try again.',
            life: 5000
        });
    }
}

// Delete GWAS file
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
        toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'GWAS file deleted successfully.',
            life: 3000
        });
    } catch (error) {
        console.error('Error deleting GWAS file:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete GWAS file. Please try again.',
            life: 5000
        });
    }
}

// Format metadata blob as readable key: value lines for tooltip
function formatMetadataTooltip(metadata) {
    if (!metadata) return '';
    return Object.entries(metadata)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
}

// Format file size helper
function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>

<style scoped>
.field label {
    font-weight: 600;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.field p {
    margin: 0;
    font-size: 1rem;
}
</style>
