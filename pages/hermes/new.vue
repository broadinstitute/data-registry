<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";
import { useUserStore } from "~/stores/UserStore";
import { ref, onMounted, computed } from "vue";

const store = useDatasetStore();
const userStore = useUserStore();
const route = useRouter();
const fileInfo = ref({});
let file = null;
let fileName = null;
let phenotypes = {};
let previousMapping = {};
const selectedPhenotype = ref({});
const filteredPhenotypes = ref([]);
const cases = ref(0);
const subjects = ref(0);
const controls = ref(0);
const dataSetName = ref("");
const colOptions = ref([]);
const requiredFields = ref([]);
const selectedFields = ref({});

onMounted(async () => {
    let params = {
        uploader: userStore.user.user_name,
        limit: 1,
    };
    let fileInfos = await store.fetchFileUploads(paramsToString(params));
    if (fileInfos.length > 0) {
        let map = fileInfos[0]?.metadata?.column_map;
        //transpose the object to have the value as the key and the key as the value
        previousMapping = Object.fromEntries(
            Object.entries(map).map(([key, value]) => [value, key]),
        );
    }

    await store.fetchPhenotypes();
    const { required, optional } = await store.fetchColumnOptions();
    //list of objects with required fields with an asterisk at the end
    const requiredAnnotated = required.map((r) => ({
        name: `${r}*`,
        value: r,
    }));
    const optionalFields = optional.map((o) => ({
        name: o === "maf" || o === "eaf" ? `${o}^` : o,
        value: o,
    }));
    colOptions.value = requiredAnnotated.concat(optionalFields);
    phenotypes = store.phenotypes;
    requiredFields.value = required;
});

const colMap = computed(() => {
    //remove any null values from selectedFields
    const filteredSelectedFields = Object.fromEntries(
        Object.entries(selectedFields.value).filter(
            ([key, value]) => value !== null,
        ),
    );
    //transpose the object to have the value as the key and the key as the value
    //this is the format that the backend expects
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
    return (
        requiredFields.value.every((field) =>
            Object.values(selectedFields.value).includes(field),
        ) && requiredAF.value
    );
});
const requiredAF = computed(() => {
    //check if selectedFields contains either maf or eaf
    const words = ["maf", "eaf"];
    return Object.values(selectedFields.value).some((field) =>
        words.includes(field),
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

function loadMapping() {
    //for each key in selectedFields, find the corresponding value in previousMapping
    //and set the value of selectedFields to the value of previousMapping
    Object.keys(selectedFields.value).forEach((key) => {
        if (previousMapping[key]) {
            selectedFields.value[key] = previousMapping[key];
        }
    });
}

function resetMapping() {
    //reset all values in selectedFields to null
    Object.keys(selectedFields.value).forEach((key) => {
        selectedFields.value[key] = null;
    });
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
            await route.push({ path: "/hermes" });
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
            <h2 class="text-center mb-4">
                Upload GWAS for Quality Control (QC)
            </h2>
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
                        :dropdown="filteredPhenotypes?.length > 0"
                        dropdownMode="current"
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
                    >, allele frequency (maf or eaf)<span style="color: darkred"
                        >^</span
                    >, and any optional field to upload file.</small
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
                    <Chip
                        v-if="requiredAF"
                        icon="bi-check"
                        label="maf | eaf"
                        class="selected-chip"
                    />
                    <Chip v-else label="maf | eaf" />
                </div>
                <div v-if="fileInfo.columns" class="grid">
                    <div class="col">
                        <Button
                            v-if="Object.keys(previousMapping).length > 0"
                            type="button"
                            label="Load Previous Mapping"
                            icon="bi-arrow-counterclockwise"
                            @click="loadMapping"
                            severity="help"
                            text
                            outlined
                        ></Button>
                    </div>
                    <div class="col text-right">
                        <Button
                            type="button"
                            label="Reset Mapping"
                            icon="bi-arrow-repeat"
                            @click="resetMapping"
                            severity="help"
                            text
                            outlined
                        ></Button>
                    </div>
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
