<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { ref, onMounted, computed } from "vue";

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

    //TODO: add either maf or eaf for required
    //required.push("maf | eaf");
    requiredFields.value = required;
});

const colMap = computed(() => {
    //remove any null values from selectedFields
    const filteredSelectedFields = Object.fromEntries(
        Object.entries(selectedFields.value).filter(
            ([key, value]) => value !== null,
        ),
    );
    //then transpose the object to have the value as the key and the key as the value
    const transposedSelectedFields = Object.fromEntries(
        Object.entries(filteredSelectedFields).map(([key, value]) => [
            value,
            key,
        ]),
    );
    return transposedSelectedFields;
});

const tableRows = computed(() => {
    return fileInfo.value.columns
        ? fileInfo.value.columns.map((value) => ({
              column: value,
          }))
        : [];
});
const steps = ref([
    { label: "Enter Metadata" },
    { label: "Select File" },
    { label: "Map Columns" },
    { label: "Upload" },
]);

const step1Complete = computed(() => {
    return Boolean(
        dataSetName.value &&
            selectedPhenotype.value?.name &&
            subjects.value &&
            (selectedPhenotype.value?.dichotomous
                ? cases.value && controls.value
                : true),
    );
});
const step2Complete = computed(() => {
    return Boolean(fileInfo.value.columns);
});
const step3Complete = computed(() => {
    //check if all items in requiredFields are in selectedFields
    return requiredFields.value.every((field) =>
        Object.values(selectedFields.value).includes(field),
    );
});

const currentStep = computed(() => {
    if (step1Complete.value && step2Complete.value && step3Complete.value) {
        return 3;
    } else if (step1Complete.value && step2Complete.value) {
        return 2;
    } else if (step1Complete.value) {
        return 1;
    } else {
        return 0;
    }
});

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

function resetFile() {
    fileInfo.value = {};
    selectedFields.value = {};
    file = null;
    fileName = null;
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
    // if (!useFormValidation("uploadGwasForm")) {
    //     return;
    // }

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
        // store.errorMessage = `<ul class="dotted">${errors
        //     .map((e) => `<li>${e}</li>`)
        //     .join("")}</ul>`;
        store.errorMessage = errors;
    } else {
        store.showNotification = false;
        try {
            await store.uploadFileForHermes(
                file,
                fileName,
                dataSetName.value,
                metadata,
            );
            await route.push({ path: "/data" });
        } catch (e) {
            console.log(e);
        }
    }
}
</script>

<template>
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
            <Steps id="steps" :activeStep="currentStep" :model="steps" />
        </div>
    </div>

    <div class="grid" v-if="store.showNotification">
        <div class="col-6 col-offset-3">
            <Message
                v-for="msg in store.errorMessage"
                severity="error"
                :closable="false"
                :sticky="true"
                :key="msg"
                >{{ msg }}</Message
            >
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
                        <InputNumber
                            id="cases"
                            type="number"
                            v-model="cases"
                            :min="0"
                        />
                    </div>
                    <div class="field col">
                        <label for="controls">Controls</label>
                        <InputNumber
                            id="controls"
                            type="number"
                            v-model="controls"
                            :min="0"
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
                        :min="0"
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
                    @clear="resetFile"
                    @remove="resetFile"
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
                                :options="colOptions"
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
                    <span
                        style="display: inline-block"
                        v-tooltip.top="
                            currentStep !== 3 &&
                            'Complete all required steps to upload.'
                        "
                    >
                        <Button
                            type="button"
                            label="Upload"
                            class="p-button-primary"
                            icon="bi-upload"
                            @click="upload"
                            raised
                            :disabled="currentStep !== 3"
                        ></Button>
                    </span>
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
* :deep(#steps span.p-menuitem-link) {
    background: transparent;
}
</style>
