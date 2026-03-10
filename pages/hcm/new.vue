<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: 'hcm'
});

const store = useDatasetStore();
const toast = useToast();
const router = useRouter();

// Form fields — HCM-specific metadata
const cohortName = ref("");
const sarc = ref("");
const ancestry = ref("");
const sex = ref("");
const genomeBuild = ref("");
const software = ref("");
const analyst = ref("");
const cases = ref(null);
const controls = ref(null);

// File upload
const fileInfo = ref({});
const file = ref(null);
const fileName = ref(null);
const selectedFields = ref({});

// Options — controlled vocabularies from the HCM GWAS analysis plan
const sarcOptions = ref([
    { name: "ALL — All sarcomere", value: "ALL" },
    { name: "SP — Sarcomere Positive", value: "SP" },
    { name: "SN — Sarcomere Negative", value: "SN" },
]);

const ancestryOptions = ref([
    { name: "European", value: "EUR" },
    { name: "African", value: "AFR" },
    { name: "East Asian", value: "EAS" },
    { name: "South Asian", value: "SAS" },
    { name: "Ad Mixed American", value: "AMR" },
    { name: "ALL (combined)", value: "ALL" },
]);

const sexOptions = ref([
    { name: "ALL", value: "ALL" },
    { name: "Male", value: "MALE" },
    { name: "Female", value: "FEMALE" },
]);

const genomeBuildOptions = ref([
    { name: "GRCh37", value: "GRCh37" },
    { name: "GRCh38", value: "GRCh38" },
]);

// HCM required summary statistics target fields (Section 9.1 of analysis plan)
const colOptions = [
    { name: "variant_id", value: "variant_id" },
    { name: "chromosome", value: "chromosome" },
    { name: "position", value: "position" },
    { name: "effect_allele", value: "effect_allele" },
    { name: "non_effect_allele", value: "non_effect_allele" },
    { name: "beta", value: "beta" },
    { name: "standard_error", value: "standard_error" },
    { name: "p_value", value: "p_value" },
    { name: "effect_allele_frequency", value: "effect_allele_frequency" },
    { name: "sample_size", value: "sample_size" },
    { name: "cases", value: "cases" },
    { name: "controls", value: "controls" },
    { name: "imputation_quality", value: "imputation_quality" },
];

const alwaysRequiredFields = [
    "variant_id", "chromosome", "position", "effect_allele", "non_effect_allele",
    "beta", "standard_error", "p_value", "effect_allele_frequency",
    "sample_size", "imputation_quality"
];

const requiredFields = computed(() => {
    const fields = [...alwaysRequiredFields];
    if (!cases.value) fields.push("cases");
    if (!controls.value) fields.push("controls");
    return fields;
});

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

// Generate filename from metadata: HCM_{SARC}_{STUDY}_{ANCESTRY}_{SEX}_{BUILD}_{SOFTWARE}_{ANALYST}_{DDMMYY}.gz
const generatedFilename = computed(() => {
    if (!cohortName.value || !sarc.value || !ancestry.value || !sex.value || !genomeBuild.value || !software.value || !analyst.value) {
        return null;
    }
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    return `HCM_${sarc.value}_${cohortName.value}_${ancestry.value}_${sex.value}_${genomeBuild.value}_${software.value}_${analyst.value}_${dd}${mm}${yy}.gz`;
});

const matchedRequiredCount = computed(() => {
    return requiredFields.value.filter(f => Object.values(selectedFields.value).includes(f)).length;
});

const formIncomplete = computed(() => {
    return (
        !file.value ||
        !cohortName.value ||
        !sarc.value ||
        !ancestry.value ||
        !sex.value ||
        !genomeBuild.value ||
        !software.value ||
        !analyst.value ||
        !generatedFilename.value ||
        matchedRequiredCount.value < requiredFields.value.length
    );
});

const validationMessages = computed(() => {
    const messages = [];
    if (!file.value) messages.push("Upload a .gz file");
    if (!cohortName.value) messages.push("Enter a cohort/study name");
    if (!sarc.value) messages.push("Select SARC category");
    if (!ancestry.value) messages.push("Select ancestry");
    if (!sex.value) messages.push("Select sex");
    if (!genomeBuild.value) messages.push("Select genome build");
    if (!software.value) messages.push("Enter software used");
    if (!analyst.value) messages.push("Enter analyst name");
    const unmapped = requiredFields.value.filter(f => !Object.values(selectedFields.value).includes(f));
    if (unmapped.length > 0) messages.push(`Map all required columns (missing: ${unmapped.join(', ')})`);
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

        // Auto-suggest column mappings using the HCM endpoint
        const suggestions = await store.suggestHCMColumnMap(fileInfo.value.columns);
        Object.entries(suggestions.suggested_map).forEach(([col, target]) => {
            if (col in selectedFields.value) {
                selectedFields.value[col] = target;
            }
        });
    } catch (error) {
        console.log(error);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Could not parse file. Please ensure it is tab delimited and .gz compressed.",
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
        const metadata = {
            cohort_name: cohortName.value,
            sarc: sarc.value,
            ancestry: ancestry.value,
            sex: sex.value,
            genome_build: genomeBuild.value,
            software: software.value,
            analyst: analyst.value,
            filename: generatedFilename.value,
            column_mapping: colMap.value,
            cases: cases.value ? parseInt(cases.value) : null,
            controls: controls.value ? parseInt(controls.value) : null,
        };

        await store.uploadHCMGWAS(file.value, fileName.value, metadata);

        toast.add({
            severity: "success",
            summary: "Success",
            detail: "GWAS file uploaded successfully!",
            life: 5000,
        });

        // Redirect to file listing
        router.push('/hcm');
    } catch (error) {
        console.error("Upload error:", error);

        let errorDetail = "An error occurred during upload";
        let errorSummary = "Upload Failed";

        if (error.response?.status === 409) {
            errorDetail = error.response.data?.detail || "A file with this name already exists. Please delete the existing file first.";
            errorSummary = "Duplicate File";
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
            <h2>Upload HCM GWAS File</h2>
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
                        <label for="cohortName">Cohort / Study Name <span style="color: darkred">*</span></label>
                        <InputText id="cohortName" v-model="cohortName" class="w-full" placeholder="e.g. UKBiobank" />
                    </div>

                    <div class="field">
                        <label for="sarc">SARC (Sarcomere status) <span style="color: darkred">*</span></label>
                        <Dropdown
                            id="sarc"
                            v-model="sarc"
                            :options="sarcOptions"
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Select SARC"
                            class="w-full"
                        />
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
                        <label for="sex">Sex <span style="color: darkred">*</span></label>
                        <Dropdown
                            id="sex"
                            v-model="sex"
                            :options="sexOptions"
                            optionLabel="name"
                            optionValue="value"
                            placeholder="Select sex"
                            class="w-full"
                        />
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

                    <div class="field">
                        <label for="software">Software <span style="color: darkred">*</span></label>
                        <InputText id="software" v-model="software" class="w-full" placeholder="e.g. REGENIE, SAIGE" />
                    </div>

                    <div class="field">
                        <label for="analyst">Analyst <span style="color: darkred">*</span></label>
                        <InputText id="analyst" v-model="analyst" class="w-full" placeholder="Analyst name/initials" />
                    </div>

                    <div class="grid">
                        <div class="col-6">
                            <div class="field">
                                <label for="cases">Cases</label>
                                <InputText id="cases" v-model="cases" type="number" class="w-full" />
                                <small>Optional</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="field">
                                <label for="controls">Controls</label>
                                <InputText id="controls" v-model="controls" type="number" class="w-full" />
                                <small>Optional</small>
                            </div>
                        </div>
                    </div>

                    <!-- Generated filename preview -->
                    <div v-if="generatedFilename" class="mt-3 p-3 bg-blue-50" style="border-radius: 6px;">
                        <p class="text-sm text-gray-600 mb-1">Generated filename:</p>
                        <p class="font-medium text-sm" style="word-break: break-all;">{{ generatedFilename }}</p>
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
                        <label>Select a tab-delimited .gz compressed file</label>
                        <FileUpload
                            mode="basic"
                            :auto="false"
                            @select="sampleFile"
                            @clear="resetFile"
                            accept=".gz"
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
                    <p>Map column names to HCM GWAS summary statistics fields.</p>
                    <small>All 13 required fields must be matched to upload the file.</small>

                    <div class="required-card mt-3">
                        <h6>Required fields ({{ matchedRequiredCount }}/{{ requiredFields.length }}):</h6>
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
                            label="Upload GWAS File"
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
