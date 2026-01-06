<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: 'mskkp'
});

const store = useDatasetStore();
const toast = useToast();
const router = useRouter();

// Form fields
const dataSetName = ref("");
const ancestry = ref("");
const phenotype = ref("");
const effectiveN = ref("");
const genomeBuild = ref("");

// File upload
const fileInfo = ref({});
const file = ref(null);
const fileName = ref(null);
const selectedFields = ref({});

// Options
const ancestryOptions = ref([
    { name: "European", value: "EUR" },
    { name: "African", value: "AFR" },
    { name: "East Asian", value: "EAS" },
    { name: "South Asian", value: "SAS" },
    { name: "Ad Mixed American", value: "AMR" },
    { name: "Mixed", value: "MIX" },
]);

const genomeBuildOptions = ref([
    { name: "GRCh37", value: "GRCh37" },
    { name: "GRCh38", value: "GRCh38" },
]);

const colOptions = [
    { name: "chromosome", value: "chromosome" },
    { name: "position", value: "position" },
    { name: "reference", value: "reference" },
    { name: "alt", value: "alt" },
    { name: "pValue", value: "pValue" },
    { name: "beta", value: "beta" },
    { name: "oddsRatio", value: "oddsRatio" },
    { name: "n", value: "n" },
];

const requiredFields = ["chromosome", "position", "reference", "alt", "pValue"];

// Computed
const colMap = computed(() => {
    const filteredSelectedFields = Object.fromEntries(
        Object.entries(selectedFields.value).filter(
            ([key, value]) => value !== null,
        ),
    );
    return Object.fromEntries(
        Object.entries(filteredSelectedFields).map(([key, value]) => [
            value,
            key,
        ]),
    );
});

const tableRows = computed(() => {
    return fileInfo.value.columns
        ? fileInfo.value.columns.map((value) => ({ column: value }))
        : [];
});

const requiredEffectFields = computed(() => {
    return (
        colMap.value["beta"] !== undefined ||
        colMap.value["oddsRatio"] !== undefined
    );
});

const formIncomplete = computed(() => {
    return (
        !file.value ||
        !dataSetName.value ||
        !requiredFields.every(
            (field) => field in colMap.value && colMap.value[field],
        ) ||
        !("beta" in colMap.value || "oddsRatio" in colMap.value) ||
        !ancestry.value ||
        !genomeBuild.value ||
        !("n" in colMap.value || effectiveN.value)
    );
});

const validationMessages = computed(() => {
    const messages = [];
    if (!file.value) messages.push("Upload a file");
    if (!dataSetName.value) messages.push("Enter a dataset name");
    if (!ancestry.value) messages.push("Select ancestry");
    if (!genomeBuild.value) messages.push("Select genome build");
    return messages;
});

// Methods
async function sampleFile(e) {
    file.value = e.files[0];
    fileName.value = e.files[0].name;
    try {
        fileInfo.value = await store.sampleTextFile(e.files[0]);
        fileInfo.value.columns.forEach((col) => {
            selectedFields.value[col] = null;
        });
    } catch (error) {
        console.log(error);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Could not parse file. Please ensure it is comma or tab delimited.",
        });
        fileInfo.value = {};
        selectedFields.value = {};
    }
}

function resetFile() {
    fileInfo.value = {};
    selectedFields.value = {};
    file.value = null;
    fileName.value = null;
}

function resetMapping() {
    Object.keys(selectedFields.value).forEach((key) => {
        selectedFields.value[key] = null;
    });
}

async function uploadData() {
    try {
        // Prepare metadata
        const metadata = {
            name: dataSetName.value,
            ancestry: ancestry.value,
            phenotype: phenotype.value || null,
            effective_n: effectiveN.value ? parseInt(effectiveN.value) : null,
            genome_build: genomeBuild.value,
            column_map: colMap.value
        };

        // Upload the dataset
        const result = await store.uploadMSKKPDataset(
            file.value,
            fileName.value,
            dataSetName.value,
            metadata
        );

        toast.add({
            severity: "success",
            summary: "Success",
            detail: "Dataset uploaded successfully!",
            life: 5000,
        });

        // Optionally redirect or reset form
        // router.push('/mskkp');
    } catch (error) {
        console.error("Upload error:", error);
        
        // Check for specific error types
        let errorDetail = "An error occurred during upload";
        let errorSummary = "Upload Failed";
        
        if (error.response?.status === 409) {
            // Duplicate dataset name
            errorDetail = error.response.data?.detail || "A dataset with this name already exists. Please choose a different name.";
            errorSummary = "Duplicate Dataset Name";
        } else if (error.response?.data?.detail) {
            errorDetail = error.response.data.detail;
        } else if (error.message) {
            errorDetail = error.message;
        }
        
        toast.add({
            severity: "error",
            summary: errorSummary,
            detail: errorDetail,
            life: 7000,
        });
    }
}
</script>

<template>
    <!-- Upload Progress Dialog -->
    <Dialog
        v-if="store.processing"
        :visible="true"
        :header="store.modalMsg"
        :closable="false"
        :modal="true"
        :draggable="false"
        :resizable="false"
    >
        <div v-if="store.showProgressBar && store.uploadProgress > 0" class="flex flex-column gap-2">
            <ProgressBar :value="store.uploadProgress" :showValue="true" />
            <small class="text-center">{{ store.uploadProgress }}% complete</small>
        </div>
        <ProgressSpinner
            v-else
            style="width: 50px; height: 50px"
            stroke-width="4"
            animation-duration="1s"
        />
    </Dialog>

    <div class="grid">
        <div class="col-12">
            <h2>Upload GWAS Dataset</h2>
        </div>
        <div class="col-6">
            <Card>
                <template #header>
                    <div class="p-3">
                        <h4>Metadata</h4>
                    </div>
                </template>
                <template #content>
                    <div class="field">
                        <label for="dataSetName">Dataset Name <span style="color: darkred">*</span></label>
                        <InputText id="dataSetName" v-model="dataSetName" class="w-full" />
                    </div>

                    <div class="field">
                        <label for="ancestry">Ancestry <span style="color: darkred">*</span></label>
                        <Dropdown 
                            id="ancestry" 
                            v-model="ancestry" 
                            :options="ancestryOptions" 
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Select ancestry" 
                            class="w-full" 
                        />
                    </div>

                    <div class="field">
                        <label for="phenotype">Phenotype</label>
                        <InputText id="phenotype" v-model="phenotype" class="w-full" />
                    </div>

                    <div class="field">
                        <label for="effectiveN">Effective N</label>
                        <InputText id="effectiveN" v-model="effectiveN" type="number" class="w-full" />
                        <small>Optional if already in data file</small>
                    </div>

                    <div class="field">
                        <label for="genomeBuild">Genome Build <span style="color: darkred">*</span></label>
                        <Dropdown 
                            id="genomeBuild" 
                            v-model="genomeBuild" 
                            :options="genomeBuildOptions" 
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Select genome build" 
                            class="w-full" 
                        />
                    </div>
                </template>
            </Card>

            <Card class="mt-3">
                <template #header>
                    <div class="p-3">
                        <h4>File Upload</h4>
                    </div>
                </template>
                <template #content>
                    <div class="field">
                        <label>Select a delimited file (comma or tab separated, optionally .gz compressed)</label>
                        <FileUpload
                            mode="basic"
                            :auto="false"
                            @select="sampleFile"
                            @clear="resetFile"
                            accept=".csv,.tsv,.txt,.gz"
                        />
                    </div>
                </template>
            </Card>
        </div>

        <div class="col-6">
            <Card>
                <template #header>
                    <div class="p-3">
                        <h4>Column Mapping</h4>
                    </div>
                </template>
                <template #content>
                    <p>Map column names to their representations.</p>
                    <small>Match all the required fields<span style="color: darkred">*</span>, n (or manually entered effective n), and either beta or oddsRatio to upload file.</small>
                    
                    <div class="required-card mt-3">
                        <h6>Required fields:</h6>
                        <div class="flex flex-wrap gap-1 mt-2">
                        <template v-for="field in requiredFields" :key="field">
                            <Chip
                                v-if="Object.values(selectedFields).includes(field)"
                                icon="pi pi-check"
                                :label="field"
                                class="selected-chip"
                            />
                            <Chip v-else :label="field" />
                        </template>
                        <Chip
                            v-if="requiredEffectFields"
                            icon="pi pi-check"
                            label="beta | oddsRatio"
                            class="selected-chip"
                        />
                        <Chip v-else label="beta | oddsRatio" />
                        <Chip
                            v-if="effectiveN || colMap.n"
                            label="n"
                            icon="pi pi-check"
                            class="selected-chip"
                        />
                        <Chip v-else label="n (or manual)" />
                        </div>
                    </div>

                    <div v-if="fileInfo.columns" class="flex mt-3">
                        <Button
                            label="Reset Mapping"
                            icon="pi pi-refresh"
                            @click="resetMapping"
                            class="p-button-help p-button-outlined p-button-sm"
                        />
                    </div>

                    <DataTable
                        v-if="fileInfo.columns"
                        :value="tableRows"
                        class="w-full mt-3"
                    >
                        <Column field="column" header="Column" style="width: 40%"></Column>
                        <Column header="Represents" style="width: 60%">
                            <template #body="{ data }">
                                <Dropdown
                                    class="w-full"
                                    :options="colOptions"
                                    optionLabel="name"
                                    optionValue="value"
                                    :optionDisabled="
                                        (option) => {
                                            return (
                                                Object.values(selectedFields).includes(option.value) &&
                                                option.value !== selectedFields[data.column]
                                            );
                                        }
                                    "
                                    v-model="selectedFields[data.column]"
                                    showClear
                                />
                            </template>
                        </Column>
                    </DataTable>

                    <div v-if="!fileInfo.columns" class="p-4 text-center text-gray-500">
                        <i class="pi pi-file text-3xl mb-2"></i>
                        <p>Upload a file to map columns</p>
                    </div>

                    <!-- Validation Messages -->
                    <Message v-if="validationMessages.length > 0" severity="warn" class="mt-3">
                        <div>
                            <strong>To enable upload, please:</strong>
                            <ul class="mb-0 mt-2" style="padding-left: 1.5rem;">
                                <li v-for="(msg, index) in validationMessages" :key="index">{{ msg }}</li>
                            </ul>
                        </div>
                    </Message>

                    <div class="field mt-4">
                        <Button
                            label="Upload Dataset"
                            class="w-full"
                            icon="pi pi-upload"
                            :disabled="formIncomplete"
                            @click="uploadData"
                        />
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <Toast position="top-center" />
</template>

<style scoped>
.required-card {
    border: 1px dashed #ccc;
    padding: 0.5rem;
}

.required-card h6 {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
}

.selected-chip {
    background-color: #24cb67;
    color: white;
}

:deep(.selected-chip .p-chip-icon) {
    color: white;
}
</style>
