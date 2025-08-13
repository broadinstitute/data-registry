<template>
    <div class="grid">
        <div class="col mb-4">
            <h2 class="text-center mb-4">
                Upload SGC Files
            </h2>
        </div>
    </div>

    <div class="grid" v-if="store.showNotification">
        <div class="col-6 col-offset-3">
            <Message
                severity="error"
                :closable="false"
                :sticky="true"
            >{{ store.errorMessage }}</Message>
        </div>
    </div>

    <form @submit.prevent="uploadSubmit" id="sgcUploadForm" novalidate class="needs-validation" autocomplete="off">
        <div class="grid">
            <div class="col-12">
                <div class="card p-fluid">
                    <h5>Upload Information</h5>
                    <div class="field">
                        <label for="uploadSetName">Upload Set Name *</label>
                        <InputText 
                            v-model="uploadSetName" 
                            id="uploadSetName" 
                            type="text"
                            v-tooltip="'A unique name to identify this set of uploads'"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="col-12">
                <div class="card p-fluid">
                    <h5>Select files to upload</h5>
                    <p class="text-sm mb-4">
                        Upload all three required files. All files must be tab-delimited .txt files.
                    </p>
                    
                    <Accordion :multiple="false" v-model:activeIndex="activeAccordionIndex">
                        <AccordionTab>
                            <template #header>
                                <div class="flex items-center gap-2">
                                    <span>Cases/Controls Data *</span>
                                    <i v-if="uploadStatus.casesControls" class="pi pi-check text-green-500"></i>
                                </div>
                            </template>
                            <FileUpload
                                name="casesControlsFile"
                                id="casesControlsFile"
                                accept=".txt"
                                :showUploadButton="false"
                                :previewWidth="0"
                                @select="handleCasesControlsFile"
                                @clear="resetCasesControlsFile"
                                @remove="resetCasesControlsFile"
                                customUpload
                                :multiple="false"
                            >
                                <template #empty>
                                    <p>Select Cases/Controls file (.txt)</p>
                                </template>
                            </FileUpload>
                        
                        <!-- Cases/Controls Column Mapping -->
                        <div v-if="casesControlsFileInfo.columns" class="mt-4">
                            <h6 class="mb-3">Map Cases/Controls Columns</h6>
                            <small class="mb-3 block">
                                Map the columns in your file to the required fields: Cases, Controls, and Phenotype.
                            </small>
                            
                            <div class="card flex flex-wrap gap-1 required-card mb-3">
                                <h6 class="w-full">Required fields:</h6>
                                <template v-for="field in requiredSGCFields">
                                    <Chip
                                        v-if="Object.values(casesControlsMapping).includes(field)"
                                        :key="field"
                                        icon="bi-check"
                                        :label="field"
                                        class="selected-chip"
                                    />
                                    <Chip v-else :label="field" :key="'else-' + field" />
                                </template>
                            </div>
                            
                            <DataTable :value="casesControlsTableRows" rowHover>
                                <Column field="column" header="Column" class="col-4">
                                </Column>
                                <Column header=">>" class="col-1"></Column>
                                <Column header="Represents" class="col-7">
                                    <template #body="{ data }">
                                        <Dropdown
                                            class="w-full"
                                            :options="columnMappingOptions"
                                            option-label="name"
                                            option-value="value"
                                            :option-disabled="
                                                (option) => {
                                                    return (
                                                        Object.values(casesControlsMapping).includes(option.value) &&
                                                        option.value !== casesControlsMapping[data.column]
                                                    );
                                                }
                                            "
                                            v-model="casesControlsMapping[data.column]"
                                            showClear
                                            placeholder="Select mapping"
                                        />
                                    </template>
                                </Column>
                            </DataTable>
                            
                            <div class="text-center mt-3">
                                <Button
                                    type="button"
                                    label="Upload Cases/Controls File"
                                    class="p-button-primary"
                                    icon="bi-upload"
                                    :disabled="!columnMappingComplete || !uploadSetName.trim()"
                                    @click="uploadCasesControlsFile"
                                    raised
                                />
                                <div v-if="!columnMappingComplete || !uploadSetName.trim()" class="text-sm text-gray-500 mt-2">
                                    {{ casesControlsUploadTooltip }}
                                </div>
                            </div>
                        </div>
                        </AccordionTab>
                        
                        <AccordionTab>
                            <template #header>
                                <div class="flex items-center gap-2">
                                    <span>Co-occurrence Data *</span>
                                    <i v-if="uploadStatus.cooccurrence" class="pi pi-check text-green-500"></i>
                                </div>
                            </template>
                            <FileUpload
                                name="cooccurrenceFile"
                                id="cooccurrenceFile"
                                accept=".txt"
                                :showUploadButton="false"
                                :previewWidth="0"
                                @select="handleCooccurrenceFile"
                                @clear="resetCooccurrenceFile"
                                @remove="resetCooccurrenceFile"
                                customUpload
                            >
                                <template #empty>
                                    <p>Select Co-occurrence file (.txt)</p>
                                </template>
                            </FileUpload>
                        
                        <!-- Co-occurrence Column Mapping -->
                        <div v-if="cooccurrenceFileInfo.columns" class="mt-4">
                            <h6 class="mb-3">Map Co-occurrence Columns</h6>
                            <small class="mb-3 block">
                                Map the columns in your file to the required fields: Phenotype 1, Phenotype 2, and Co-occurrence Count.
                            </small>
                            
                            <div class="card flex flex-wrap gap-1 required-card mb-3">
                                <h6 class="w-full">Required fields:</h6>
                                <template v-for="field in requiredCooccurrenceFields">
                                    <Chip
                                        v-if="Object.values(cooccurrenceMapping).includes(field)"
                                        :key="field"
                                        icon="bi-check"
                                        :label="field"
                                        class="selected-chip"
                                    />
                                    <Chip v-else :label="field" :key="'else-' + field" />
                                </template>
                            </div>
                            
                            <DataTable :value="cooccurrenceTableRows" rowHover>
                                <Column field="column" header="Column" class="col-4">
                                </Column>
                                <Column header=">>" class="col-1"></Column>
                                <Column header="Represents" class="col-7">
                                    <template #body="{ data }">
                                        <Dropdown
                                            class="w-full"
                                            :options="cooccurrenceMappingOptions"
                                            option-label="name"
                                            option-value="value"
                                            :option-disabled="
                                                (option) => {
                                                    return (
                                                        Object.values(cooccurrenceMapping).includes(option.value) &&
                                                        option.value !== cooccurrenceMapping[data.column]
                                                    );
                                                }
                                            "
                                            v-model="cooccurrenceMapping[data.column]"
                                            showClear
                                            placeholder="Select mapping"
                                        />
                                    </template>
                                </Column>
                            </DataTable>
                            
                            <div class="text-center mt-3">
                                <Button
                                    type="button"
                                    label="Upload Co-occurrence File"
                                    class="p-button-primary"
                                    icon="bi-upload"
                                    :disabled="!cooccurrenceMappingComplete || !uploadSetName.trim()"
                                    @click="uploadCooccurrenceFile"
                                    raised
                                />
                                <div v-if="!cooccurrenceMappingComplete || !uploadSetName.trim()" class="text-sm text-gray-500 mt-2">
                                    {{ cooccurrenceUploadTooltip }}
                                </div>
                            </div>
                        </div>
                        </AccordionTab>
                        
                        <AccordionTab>
                            <template #header>
                                <div class="flex items-center gap-2">
                                    <span>Cohort Description *</span>
                                    <i v-if="uploadStatus.cohortDescription" class="pi pi-check text-green-500"></i>
                                </div>
                            </template>
                            <FileUpload
                                name="cohortDescriptionFile"
                                id="cohortDescriptionFile"
                                accept=".txt"
                                :showUploadButton="false"
                                :previewWidth="0"
                                @select="handleCohortDescriptionFile"
                                @clear="resetCohortDescriptionFile"
                                @remove="resetCohortDescriptionFile"
                                customUpload
                            >
                                <template #empty>
                                    <p>Select Cohort Description file (.txt)</p>
                                </template>
                            </FileUpload>
                            
                            <div v-if="cohortDescriptionFile" class="text-center mt-3">
                                <Button
                                    type="button"
                                    label="Upload Cohort Description File"
                                    class="p-button-primary"
                                    icon="bi-upload"
                                    :disabled="!uploadSetName.trim()"
                                    @click="uploadCohortDescriptionFile"
                                    raised
                                />
                                <div v-if="!uploadSetName.trim()" class="text-sm text-gray-500 mt-2">
                                    {{ cohortUploadTooltip }}
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>
                </div>
            </div>
        </div>


        <div class="grid">
            <div class="col-12">
                <div class="w-full text-center mt-4">
                    <Button
                        type="submit"
                        label="Upload"
                        class="p-button-primary"
                        icon="bi-upload"
                        :disabled="!canUpload"
                        :loading="uploading"
                        raised
                    ></Button>
                </div>
            </div>
        </div>
    </form>

    <Dialog
        v-if="store.processing"
        :visible="true"
        :header="store.modalMsg"
        :closable="false"
        :modal="true"
        :draggable="false"
        :resizable="false"
    >
        <div class="flex justify-content-center align-items-center p-4">
            <ProgressSpinner
                v-if="store.showProgressBar"
                :value="store.uploadProgress"
                stroke-width="4"
                animation-duration="0"
            />
        </div>
    </Dialog>
    <Toast position="top-center" group="default"/>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDatasetStore } from "~/stores/DatasetStore";

definePageMeta({
  layout: 'sgc'
});

const toast = useToast();
const router = useRouter();
const store = useDatasetStore();

// Reactive variables
const uploadSetName = ref('');
const uploading = ref(false);
const activeAccordionIndex = ref(0);

const casesControlsFile = ref(null);
const cooccurrenceFile = ref(null);
const cohortDescriptionFile = ref(null);
const casesControlsFileName = ref('');
const cooccurrenceFileName = ref('');
const cohortDescriptionFileName = ref('');

// Upload status tracking
const uploadStatus = ref({
    casesControls: false,
    cooccurrence: false,
    cohortDescription: false
});

// Cases/Controls file sampling and mapping
const casesControlsFileInfo = ref({});
const casesControlsMapping = ref({});

// Co-occurrence file sampling and mapping
const cooccurrenceFileInfo = ref({});
const cooccurrenceMapping = ref({});

// Column mapping options for SGC cases/controls file
const columnMappingOptions = ref([
    { name: "Cases", value: "cases" },
    { name: "Controls", value: "controls" },
    { name: "Phenotype", value: "phenotype" }
]);

// Column mapping options for SGC co-occurrence file
const cooccurrenceMappingOptions = ref([
    { name: "Phenotype 1", value: "phenotype1" },
    { name: "Phenotype 2", value: "phenotype2" },
    { name: "Co-occurrence Count", value: "cooccurrence_count" }
]);

// Required fields for SGC cases/controls mapping
const requiredSGCFields = ref(['cases', 'controls', 'phenotype']);

// Required fields for SGC co-occurrence mapping
const requiredCooccurrenceFields = ref(['phenotype1', 'phenotype2', 'cooccurrence_count']);

// Computed
const casesControlsTableRows = computed(() => {
    return casesControlsFileInfo.value.columns
        ? casesControlsFileInfo.value.columns.map((value) => ({
              column: value,
          }))
        : [];
});

const cooccurrenceTableRows = computed(() => {
    return cooccurrenceFileInfo.value.columns
        ? cooccurrenceFileInfo.value.columns.map((value) => ({
              column: value,
          }))
        : [];
});

const columnMappingComplete = computed(() => {
    if (!casesControlsFileInfo.value.columns) return true; // No mapping needed if no file
    
    const mappedValues = Object.values(casesControlsMapping.value).filter(v => v);
    
    return requiredSGCFields.value.every(mapping => mappedValues.includes(mapping));
});

// Create flipped mapping for API calls (dropdownValue -> columnName)
const flippedCasesControlsMapping = computed(() => {
    return Object.fromEntries(
        Object.entries(casesControlsMapping.value).map(([key, value]) => [
            value,
            key,
        ])
    );
});

const cooccurrenceMappingComplete = computed(() => {
    if (!cooccurrenceFileInfo.value.columns) return true; // No mapping needed if no file
    
    const mappedValues = Object.values(cooccurrenceMapping.value).filter(v => v);
    
    return requiredCooccurrenceFields.value.every(mapping => mappedValues.includes(mapping));
});

// Computed properties for button tooltips
const casesControlsUploadTooltip = computed(() => {
    const missing = [];
    if (!uploadSetName.value.trim()) missing.push('Upload Set Name');
    if (!columnMappingComplete.value) missing.push('Column Mapping');
    
    if (missing.length === 0) return 'Upload Cases/Controls file';
    return `Required: ${missing.join(', ')}`;
});

const cooccurrenceUploadTooltip = computed(() => {
    const missing = [];
    if (!uploadSetName.value.trim()) missing.push('Upload Set Name');
    if (!cooccurrenceMappingComplete.value) missing.push('Column Mapping');
    
    if (missing.length === 0) return 'Upload Co-occurrence file';
    return `Required: ${missing.join(', ')}`;
});

const cohortUploadTooltip = computed(() => {
    if (!uploadSetName.value.trim()) return 'Required: Upload Set Name';
    return 'Upload Cohort Description file';
});

// Create flipped mapping for API calls (dropdownValue -> columnName)
const flippedCooccurrenceMapping = computed(() => {
    return Object.fromEntries(
        Object.entries(cooccurrenceMapping.value).map(([key, value]) => [
            value,
            key,
        ])
    );
});

const canUpload = computed(() => {
    return uploadSetName.value.trim() && 
           casesControlsFile.value && 
           cooccurrenceFile.value && 
           cohortDescriptionFile.value &&
           columnMappingComplete.value &&
           cooccurrenceMappingComplete.value;
});

// File sampling using the store method (same as hermes)

// File handlers
async function handleCasesControlsFile(e) {
    store.showNotification = false;
    casesControlsFile.value = e.files[0];
    casesControlsFileName.value = e.files[0]?.name || '';
    
    try {
        casesControlsFileInfo.value = await store.sampleTextFile(e.files[0]);
        
        if (casesControlsFileInfo.value.columns) {
            casesControlsFileInfo.value.columns.forEach((col) => {
                casesControlsMapping.value[col] = null;
            });
            
            toast.add({
                severity: 'success',
                summary: 'File Loaded',
                detail: `Found ${casesControlsFileInfo.value.columns.length} columns. Please map them below.`,
                life: 3000
            });
        } else {
            throw new Error('No columns found in API response');
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'File Error',
            detail: 'Error processing the Cases/Controls file. Please check the file format.',
            life: 5000
        });
        casesControlsFileInfo.value = {};
        casesControlsMapping.value = {};
    }
}

async function handleCooccurrenceFile(e) {
    store.showNotification = false;
    cooccurrenceFile.value = e.files[0];
    cooccurrenceFileName.value = e.files[0]?.name || '';
    
    try {
        cooccurrenceFileInfo.value = await store.sampleTextFile(e.files[0]);
        
        if (cooccurrenceFileInfo.value.columns) {
            cooccurrenceFileInfo.value.columns.forEach((col) => {
                cooccurrenceMapping.value[col] = null;
            });
            
            toast.add({
                severity: 'success',
                summary: 'File Loaded',
                detail: `Found ${cooccurrenceFileInfo.value.columns.length} columns. Please map them below.`,
                life: 3000
            });
        } else {
            throw new Error('No columns found in API response');
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'File Error',
            detail: 'Error processing the Co-occurrence file. Please check the file format.',
            life: 5000
        });
        cooccurrenceFileInfo.value = {};
        cooccurrenceMapping.value = {};
    }
}

function handleCohortDescriptionFile(e) {
    cohortDescriptionFile.value = e.files[0];
    cohortDescriptionFileName.value = e.files[0]?.name || '';
}

async function uploadCohortDescriptionFile() {
    if (!validateUploadSetName()) return;
    
    if (!cohortDescriptionFile.value) {
        toast.add({
            severity: 'error',
            summary: 'File Required',
            detail: 'Please select a cohort description file',
            life: 3000
        });
        return;
    }
    
    try {
        // Step 1: Get pre-signed URL for S3 upload (no validation needed for cohort description)
        const { presigned_url } = await store.getSGCPresignedUrl(cohortDescriptionFileName.value, uploadSetName.value, 'cohort_description');
        
        // Step 2: Upload file to S3 with artificial delay for better UX
        store.processing = true;
        store.modalMsg = "Uploading Cohort Description file...";
        
        // Add artificial delay to show upload progress
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await store.uploadToPresignedUrl(presigned_url, cohortDescriptionFile.value);
        
        store.processing = false;
        
        // Mark as uploaded and update UI
        uploadStatus.value.cohortDescription = true;
        
        toast.add({
            severity: 'success',
            summary: 'Upload Successful',
            detail: 'Cohort Description file uploaded successfully',
            life: 3000
        });
        
    } catch (error) {
        store.processing = false;
        toast.add({
            severity: 'error',
            summary: 'Upload Error',
            detail: 'Failed to upload Cohort Description file',
            life: 5000
        });
    }
}

function resetCasesControlsFile() {
    casesControlsFile.value = null;
    casesControlsFileName.value = '';
    casesControlsFileInfo.value = {};
    casesControlsMapping.value = {};
    uploadStatus.value.casesControls = false;
}

function resetCooccurrenceFile() {
    cooccurrenceFile.value = null;
    cooccurrenceFileName.value = '';
    cooccurrenceFileInfo.value = {};
    cooccurrenceMapping.value = {};
    uploadStatus.value.cooccurrence = false;
}

function resetCohortDescriptionFile() {
    cohortDescriptionFile.value = null;
    cohortDescriptionFileName.value = '';
    uploadStatus.value.cohortDescription = false;
}

// Function to open next available accordion
function openNextAccordion() {
    // Close current accordion first
    activeAccordionIndex.value = null;
    
    // After a brief delay, open the next accordion
    setTimeout(() => {
        // If cases/controls is uploaded but co-occurrence isn't, open co-occurrence (tab 1)
        if (uploadStatus.value.casesControls && !uploadStatus.value.cooccurrence) {
            activeAccordionIndex.value = 1;
        }
        // If both cases/controls and co-occurrence are uploaded but cohort isn't, open cohort (tab 2)
        else if (uploadStatus.value.casesControls && uploadStatus.value.cooccurrence && !uploadStatus.value.cohortDescription) {
            activeAccordionIndex.value = 2;
        }
        // If all are uploaded, keep accordions closed
        console.log('Upload status:', uploadStatus.value);
        console.log('Setting activeAccordionIndex to:', activeAccordionIndex.value);
    }, 500);
}

// Validation
function validateFileTypes() {
    const txtExtensions = ['.txt'];
    const errors = [];
    
    if (casesControlsFile.value && !txtExtensions.some(ext => casesControlsFile.value.name.toLowerCase().endsWith(ext))) {
        errors.push('Cases/Controls file must be a .txt file');
    }
    
    if (cooccurrenceFile.value && !txtExtensions.some(ext => cooccurrenceFile.value.name.toLowerCase().endsWith(ext))) {
        errors.push('Co-occurrence file must be a .txt file');
    }
    
    if (cohortDescriptionFile.value && !txtExtensions.some(ext => cohortDescriptionFile.value.name.toLowerCase().endsWith(ext))) {
        errors.push('Cohort Description file must be a .txt file');
    }
    
    return errors;
}

// Validation helper function
function validateUploadSetName() {
    if (!uploadSetName.value.trim()) {
        toast.add({
            severity: 'error',
            summary: 'Upload Set Name Required',
            detail: 'Please enter an upload set name before uploading files',
            life: 3000
        });
        return false;
    }
    return true;
}

async function uploadCasesControlsFile() {
    console.log('uploadCasesControlsFile called');
    console.log('columnMappingComplete:', columnMappingComplete.value);
    console.log('casesControlsMapping:', casesControlsMapping.value);
    
    if (!validateUploadSetName()) return;
    
    if (!columnMappingComplete.value) {
        toast.add({
            severity: 'error',
            summary: 'Mapping Required',
            detail: 'Please map all required columns before uploading',
            life: 3000
        });
        return;
    }
    
    try {
        // Step 1: Validate the file and mapping
        const validationResult = await store.uploadSGCFile(casesControlsFile.value, 'cases_controls', flippedCasesControlsMapping.value);
        console.log('Validation result:', validationResult);
        
        // Step 2: Get pre-signed URL for S3 upload
        const { presigned_url } = await store.getSGCPresignedUrl(casesControlsFileName.value, uploadSetName.value, 'cases_controls');
        
        // Step 3: Upload file to S3 with artificial delay for better UX
        store.processing = true;
        store.modalMsg = "Uploading Cases/Controls file...";
        
        // Add artificial delay to show upload progress
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await store.uploadToPresignedUrl(presigned_url, casesControlsFile.value);
        
        store.processing = false;
        
        // Mark as uploaded and update UI
        uploadStatus.value.casesControls = true;
        
        toast.add({
            severity: 'success',
            summary: 'Upload Successful',
            detail: 'Cases/Controls file uploaded and processed successfully',
            life: 3000
        });
        
        // Close current accordion and open next
        openNextAccordion();
        
    } catch (error) {
        console.error('Upload error:', error);
        store.processing = false;
        toast.add({
            severity: 'error',
            summary: 'Upload Error',
            detail: `Failed to upload Cases/Controls file: ${error.message || error}`,
            life: 5000
        });
    }
}

async function uploadCooccurrenceFile() {
    if (!validateUploadSetName()) return;
    
    if (!cooccurrenceMappingComplete.value) {
        toast.add({
            severity: 'error',
            summary: 'Mapping Required',
            detail: 'Please map all required columns before uploading',
            life: 3000
        });
        return;
    }
    
    try {
        // Step 1: Validate the file and mapping
        const validationResult = await store.uploadSGCFile(cooccurrenceFile.value, 'cooccurrence', flippedCooccurrenceMapping.value);
        
        // Step 2: Get pre-signed URL for S3 upload
        const { presigned_url } = await store.getSGCPresignedUrl(cooccurrenceFileName.value, uploadSetName.value, 'cooccurrence');
        
        // Step 3: Upload file to S3 with artificial delay for better UX
        store.processing = true;
        store.modalMsg = "Uploading Co-occurrence file...";
        
        // Add artificial delay to show upload progress
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await store.uploadToPresignedUrl(presigned_url, cooccurrenceFile.value);
        
        store.processing = false;
        
        // Mark as uploaded and update UI
        uploadStatus.value.cooccurrence = true;
        
        toast.add({
            severity: 'success',
            summary: 'Upload Successful',
            detail: 'Co-occurrence file uploaded and processed successfully',
            life: 3000
        });
        
        // Close current accordion and open next
        openNextAccordion();
        
    } catch (error) {
        store.processing = false;
        toast.add({
            severity: 'error',
            summary: 'Upload Error',
            detail: 'Failed to upload Co-occurrence file',
            life: 5000
        });
    }
}

// Upload function
async function uploadSubmit() {
    if (!uploadSetName.value.trim()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Upload Set Name is required',
            life: 3000
        });
        return;
    }
    
    const fileTypeErrors = validateFileTypes();
    
    if (!casesControlsFile.value || !cooccurrenceFile.value || !cohortDescriptionFile.value) {
        toast.add({
            severity: 'error',
            summary: 'Missing Files',
            detail: 'Please upload all three required files',
            life: 3000
        });
        return;
    }
    
    if (!columnMappingComplete.value) {
        toast.add({
            severity: 'error',
            summary: 'Column Mapping Incomplete',
            detail: 'Please map all required columns for Cases/Controls file: Cases, Controls, and Phenotype',
            life: 3000
        });
        return;
    }
    
    if (!cooccurrenceMappingComplete.value) {
        toast.add({
            severity: 'error',
            summary: 'Column Mapping Incomplete',
            detail: 'Please map all required columns for Co-occurrence file: Phenotype 1, Phenotype 2, and Co-occurrence Count',
            life: 3000
        });
        return;
    }
    
    if (fileTypeErrors.length > 0) {
        toast.add({
            severity: 'error',
            summary: 'File Type Error',
            detail: fileTypeErrors.join(', '),
            life: 5000
        });
        return;
    }
    
    uploading.value = true;
    
    try {
        // Simulate upload for testing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Files uploaded successfully!',
            life: 3000
        });
        
        // Reset form
        uploadSetName.value = '';
        casesControlsFile.value = null;
        cooccurrenceFile.value = null;
        cohortDescriptionFile.value = null;
        casesControlsFileName.value = '';
        cooccurrenceFileName.value = '';
        cohortDescriptionFileName.value = '';
        casesControlsFileInfo.value = {};
        casesControlsMapping.value = {};
        
    } catch (error) {
        console.error('Error uploading:', error);
        toast.add({
            severity: 'error',
            summary: 'Upload Error',
            detail: 'There was an error uploading your files. Please try again.',
            life: 5000
        });
    } finally {
        uploading.value = false;
    }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.p-chip.selected-chip {
    background-color: #24cb67;
    color: white;
}

.required-card {
    border: 1px dashed #ccc;
    padding: 0.5rem;
    margin-top: 1rem;
}

.required-card h6 {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
}
</style>
