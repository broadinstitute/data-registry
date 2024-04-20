<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";

const store = useDatasetStore();
const route = useRouter();
const fileInfo = ref({});
let file = null;
let fileName = null;
let phenotypes = {};
const selectedPhenotype = ref({});
const filteredPhenotypes = ref();
const cases = ref(0);
const subjects = ref(0);
const controls = ref(0);
const dataSetName = ref("");
const colOptions = ref([]);
const requiredFields = ref([]);
const selectedFields = ref({});

onMounted(async () => {
    await store.fetchPhenotypes();
    const { required, optional } = await store.fetchColumnOptions();
    //create a list of objects with required fields with an asterisk at the end, and add optional fields with keys name and value
    const requiredAnnotated = required.map((r) => ({
        name: `${r}*`,
        value: r,
    }));
    const optionalFields = optional.map((o) => ({ name: o, value: o }));
    colOptions.value = requiredAnnotated.concat(optionalFields);
    phenotypes = store.phenotypes;
    requiredFields.value = required;
});
const availableOptions = computed(() => {
    return colOptions.value.filter(
        (option) => !Object.keys(colMap.value).includes(option.value),
    );
});

const colMap = computed(() => {
    return Object.fromEntries(
        Object.entries(selectedFields.value).filter(([key, value]) => value),
    );
});

const tableRows = computed(() => {
    return (
        Object.entries(fileInfo.value?.columns).map(([index, value]) => ({
            index: index,
            column: value,
        })) || []
    );
});
const steps = ref([
    { label: "Enter Metadata" },
    { label: "Select File" },
    { label: "Map Columns" },
    { label: "Upload" },
]);

const activeStep = ref(0);

async function sampleFile(e) {
    store.showNotification = false;
    file = e.files[0];
    fileName = e.files[0].name;
    try {
        fileInfo.value = await store.sampleTextFile(e.files[0]);
        //copy fileInfo.columns to selectedFields
        fileInfo.value.columns.forEach((col) => {
            selectedFields.value[col] = null;
        });
    } catch (e) {
        console.log(e);
        fileInfo.value = {};
        selectedFields.value = {};
    }
}

function ptypeBlur(event) {
    if (!event.value) {
        return;
    }
    selectedPhenotype.value.name = event.value.name;
    selectedPhenotype.value.description = event.value.description;
    selectedPhenotype.value.dichotomous = event.value.dichotomous;
}

function filterFunc(q) {
    return Object.values(phenotypes).filter((p) => {
        if (q.length < 2) {
            return false;
        }
        const words = q.split(" ");
        let matches = 0;
        words.forEach((word) => {
            if (p.description.toLowerCase().includes(word.toLowerCase())) {
                matches++;
            }
        });
        return matches === words.length;
    });
}

function matchPhenotypes(event) {
    setTimeout(() => {
        if (!event.query.trim().length || event.query.trim().length < 2) {
            filteredPhenotypes.value = phenotypes.value;
        } else {
            filteredPhenotypes.value = Object.values(phenotypes)
                .filter((p) => {
                    return p.description
                        .toLowerCase()
                        .includes(event.query.toLowerCase());
                })
                .sort((a, b) => a.description.length - b.description.length);
        }
    }, 250);
}

async function upload() {
    if (!useFormValidation("uploadGwasForm")) {
        return;
    }

    const metadata = {
        original_data: fileName,
        phenotype: selectedPhenotype.value.name,
        dataset: dataSetName.value,
        cases: cases.value,
        controls: controls.value,
        subjects: subjects.value,
        column_map: colMap.value,
        dichotomous: selectedPhenotype.value.dichotomous,
    };

    const errors = await store.validateMetadata(metadata);
    if (errors.length > 0) {
        store.showNotification = true;
        store.errorMessage = `<ul class="dotted">${errors
            .map((e) => `<li>${e}</li>`)
            .join("")}</ul>`;
    } else {
        store.showNotification = false;
        try {
            await store.uploadFileForHermes(
                file,
                fileName,
                dataSetName.value,
                metadata,
            );
            await route.push({ path: "/hermes" });
        } catch (e) {
            console.log(e);
        }
    }
}
</script>

<template>
    <div class="container-fluid">
        <form id="uploadGwasForm" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <h2 class="text-center mb-4">Upload GWAS for Analysis</h2>

                    <div class="form-group">
                        <label class="label" for="fileInput"
                            >Select file, must be text based or (b)gzip:</label
                        >
                        <input
                            id="fileInput"
                            type="file"
                            class="form-control-file form-control"
                            name="file"
                            required
                            accept=".csv, .tsv, .gz, .bgzip, .gzip"
                            @change="sampleFile"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="form-group">
                        <label class="label" for="datasetName"
                            >Dataset Name:</label
                        >
                        <input
                            v-model="dataSetName"
                            type="text"
                            placeholder="Dataset Name"
                            class="form-control input-default"
                            required
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="form-group">
                        <label class="label" for="phenotype">Phenotype:</label>
                        <AutoCompleteDialog
                            id="phenotype"
                            placeholder="Phenotype"
                            :items="Object.values(phenotypes)"
                            :filter-function="filterFunc"
                            :disabled="false"
                            :allow-only-list-values="true"
                            :item-display="(i) => i.description"
                            @blur="ptypeBlur"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="form-group">
                        <label class="label" for="subjects">Subjects:</label>
                        <input
                            v-model="subjects"
                            type="number"
                            placeholder="Subjects"
                            class="form-control input-default"
                            min="1"
                            required
                        />
                    </div>
                </div>
            </div>
            <div class="row" v-if="selectedPhenotype?.dichotomous">
                <div class="col-md-6 offset-md-3">
                    <div class="form-group">
                        <label class="label" for="cases">Cases:</label>
                        <input
                            v-model="cases"
                            type="number"
                            placeholder="Cases"
                            class="form-control input-default"
                            min="1"
                            required
                        />
                    </div>
                </div>
            </div>
            <div class="row" v-if="selectedPhenotype?.dichotomous">
                <div class="col-md-6 offset-md-3">
                    <div class="form-group">
                        <label class="label" for="cases">Controls:</label>
                        <input
                            v-model="controls"
                            type="number"
                            placeholder="Controls"
                            class="form-control input-default"
                            min="0"
                            required
                        />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="upload"
                    >
                        Upload
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <ServerNotification
                        :show-notification="store.showNotification"
                        :error-message="store.errorMessage"
                        :success="store.isServerSuccess"
                        :success-message="store.successMessage"
                        :auto-hide="false"
                    />
                </div>
            </div>
        </form>
    </div>
    <Dialog
        v-if="store.processing"
        :visible="true"
        :header="store.modalMsg"
        :closable="false"
        :modal="true"
        :draggable="false"
        :resizable="false"
    >
        <ProgressSpinner
            v-if="store.showProgressBar"
            :value="store.uploadProgress"
            :stroke-width="4"
            :animation-duration="0"
        />
    </Dialog>
    <div class="grid">
        <div class="col mb-4">
            <h2 class="text-center mb-4">Upload GWAS for Analysis</h2>
            <Steps :activeStep="activeStep" :model="steps" />
        </div>
    </div>
    <div class="grid">
        <div class="col-12 md:col-6">
            <div class="card p-fluid">
                <h5>Metadata</h5>
                <div class="field">
                    <label for="dataSetName">Dataset Name</label>
                    <InputText
                        v-model="dataSetName"
                        id="dataSetName"
                        type="text"
                    />
                </div>
                <div class="field">
                    <label for="phenotype">Phenotype</label>
                    <AutoComplete
                        id="phenotype"
                        v-model="selectedPhenotype"
                        optionLabel="description"
                        :suggestions="filteredPhenotypes"
                        @complete="matchPhenotypes"
                        dataKey="name"
                        dropdown
                        forceSelection
                        dropdown-mode="current"
                        auto-option-focus
                    />
                </div>
                <div
                    v-if="selectedPhenotype?.dichotomous"
                    class="formgrid grid"
                >
                    <div class="field col">
                        <label for="cases">Cases</label>
                        <InputText
                            id="cases"
                            type="number"
                            v-model="cases"
                            min="0"
                        />
                    </div>
                    <div class="field col">
                        <label for="controls">Controls</label>
                        <InputText
                            id="controls"
                            type="number"
                            v-model="controls"
                            min="0"
                        />
                    </div>
                </div>
                <div class="field">
                    <label for="subjects">Subjects/Samples</label>
                    <InputNumber
                        v-model="subjects"
                        id="subjects"
                        type="number"
                        inputId="withoutgrouping"
                        :useGrouping="false"
                        min="0"
                    />
                </div>
            </div>

            <div class="card p-fluid">
                <h5>Select file to upload</h5>
                <FileUpload
                    name="file"
                    id="fileInput"
                    accept=".csv, .tsv, .gz, .bgzip, .gzip"
                    :showUploadButton="false"
                    :previewWidth="0"
                    @select="sampleFile"
                >
                    <template #empty>
                        <p>
                            Drag and drop files to here to upload. (.csv, .tsv,
                            .gz, .bgzip, .gzip)
                        </p>
                    </template>
                </FileUpload>
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="card">
                <h5>Map column names to their representations.</h5>
                <small
                    >Match all the required fields<span style="color: darkred"
                        >*</span
                    >
                    and any optional field to upload file.</small
                >
                <div class="card flex flex-wrap gap-1 required-card">
                    <h6 class="w-full">Required fields:</h6>
                    <template v-for="field in requiredFields">
                        <Chip
                            v-if="Object.values(selectedFields).includes(field)"
                            :key="field"
                            icon="bi-check"
                            :label="field"
                            class="selected-chip"
                        />

                        <Chip v-else :label="field" :key="'else-' + field" />
                    </template>
                </div>
                <DataTable :value="tableRows" v-if="fileInfo.columns" rowHover>
                    <Column field="column" header="Column" class="col-4">
                    </Column>
                    <Column header=">>" class="col-1"></Column>
                    <Column header="Represents" class="col-7">
                        <template #body="{ data }">
                            <Dropdown
                                class="w-full"
                                :options="availableOptions"
                                option-label="name"
                                option-value="value"
                                :option-disabled="
                                    (option) => {
                                        return (
                                            Object.values(
                                                selectedFields,
                                            ).includes(option.value) &&
                                            option.value !==
                                                selectedFields[data.column]
                                        );
                                    }
                                "
                                v-model="selectedFields[data.column]"
                                showClear
                            />
                        </template>
                    </Column>
                </DataTable>
                <div class="w-full text-center mt-4">
                    <Button
                        type="button"
                        label="Upload"
                        class="p-button-primary"
                        icon="bi-upload"
                        @click="upload"
                        raised
                    ></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
