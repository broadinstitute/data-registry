<script setup>

import { useDatasetStore } from "~/stores/DatasetStore";
import { useUserStore } from "~/stores/UserStore";
import { useToast } from "primevue/usetoast";
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const formSchema = yup.object({
  dataSetName: yup.string().label('Dataset Name').required(),
  cohort: yup.string().label('Cohort').required(),
  dataCollectionStart: yup.date().label('Data Collection Start').required(),
  dataCollectionEnd: yup.date().label('Data Collection End').required(),
  contactPerson: yup.string().label('Contact Person').required(),
});


const { defineField, handleSubmit, errors } = useForm({
  validationSchema: formSchema,
});

const [dataSetName] = defineField('dataSetName');
const [cohort] = defineField('cohort');
const [dataCollectionStart] = defineField('dataCollectionStart');
const [dataCollectionEnd] = defineField('dataCollectionEnd');
const [contactPerson] = defineField('contactPerson');

const store = useDatasetStore();
const userStore = useUserStore();
const route = useRouter();
const toast = useToast();
const fileInfo = ref({});
let file = null;
let fileName = null;
let previousMapping = {};
const selectedGenomeBuild = ref('');
const selectedAncestry = ref('');
const caseAscertainment = ref('');
const caseType = ref('');
const caseAscertainmentOptions = ref([
    { name: "Electronic Health Records", value: "Electronic Health Records" },
    { name: "Research Study", value: "Research Study" }
]);
const caseTypeOptions = ref([
    { name: "Prevalent", value: "Prevalent" },
    { name: "Incident", value: "Incident" },
    { name: "Prevalent+Incident", value: "Prevalent+Incident" },
]);
const ancestryOptions = ref([
    { name: "African", value: "AF" },
    { name: "African American", value: "AA" },
    { name: "Sub-Sahara African", value: "SSAF" },
    { name: "East Asian", value: "EA" },
    { name: "European", value: "EU" },
    { name: "Hispanic", value: "HS" },
    { name: "South Asian", value: "SA" },
    { name: "Mixed", value: "Mixed" },
    { name: "Greater Middle Eastern", value: "GME" },
]);
const genomeBuildOptions = ref([
    { name: "GRCh38/hg38", value: "GRCh38/hg38" },
    { name: "GRCh37/b37", value: "GRCh37/b37" },
]);
const cohortOptions = ref([
  { name: "UK Biobank", value: "UK Biobank" },
  { name: "23andMe", value: "23andMe" },
  { name: "AncestryDNA", value: "AncestryDNA" }
]);
const subjects = ref(0);
const references = ref(null);
const phenotype = ref("");
const participants = ref(null);
const cases = ref(null);
const sexProportion = ref(null);
const age = ref(null);
const acknowledgements = ref("");
const keyReferences = ref("");
const analysisSoftware = ref("");
const statisticalModel = ref("");
const covariates = ref("");
const arrayName = ref("");
const callingAlgorithm = ref("");
const variantCallRate = ref(null);
const sampleCallRate = ref(null);
const hwePValue = ref(null);
const maf = ref(null);
const otherQCFilters = ref("");
const nVariantsForImputation = ref("");
const prephasingAndImputationSoftware = ref("");
const imputationReference = ref("");
const imputationQualityMeasure = ref("");
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
    return Boolean(dataSetName.value);
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

    //if the selectedFields does not contain any of the previous mapping, set alert toasts
    if (Object.values(selectedFields.value).every((value) => value === null)) {
        toast.add({
            severity: "warn",
            summary: "Alert",
            detail: "Previous mapping does not match any column for this file.",
            life: 5000,
        });
    }
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

const onSubmit = handleSubmit((values) => {
  console.log(values);
});

async function upload() {
    const metadata = {
        original_data: fileName,
        phenotype: phenotype.value,
        dataset: dataSetName.value,
        cases: cases.value,
        subjects: subjects.value,
        column_map: colMap.value,
        ancestry: selectedAncestry.value,
        cohort: cohort.value,
        acknowledgements: acknowledgements.value,
        key_references: keyReferences.value,
        case_ascertainment: caseAscertainment.value,
        case_type: caseType.value,
        participants: participants.value,
        sex_proportion: sexProportion.value,
        age_at_first_documented_study_phenotype: age.value,
        statistical_model: statisticalModel.value,
        covariates: covariates.value,
        array_name_and_version: arrayName.value,
        variant_call_rate: variantCallRate.value,
        sample_call_rate: sampleCallRate.value,
        hwe_p_value: hwePValue.value,
        maf: maf.value,
        other_qc_filters: otherQCFilters.value,
        n_variants_for_imputation: nVariantsForImputation.value,
        prephasing_and_imputation_software: prephasingAndImputationSoftware.value,
        imputation_reference: imputationReference.value,
        imputation_quality_measure: imputationQualityMeasure.value,
        genome_build: selectedGenomeBuild.value,
        analysis_software: analysisSoftware.value,
        calling_algorithm: callingAlgorithm.value,
    };
    // handleSubmit(metadata);
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
    <Toast position="top-center" />

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

  <form @submit.prevent="onSubmit" id="metadataForm" novalidate class="needs-validation">
    <div class="grid">
        <div class="col-12 md:col-6">
            <div class="card p-fluid">
                <h5>Enter File Metadata</h5>
                <Fieldset legend="Study Metadata">
                  <div class="field">
                      <label for="dataSetName">Dataset Name</label>
                      <InputText v-tooltip="'e.g. “UKBB Heart Failure (female)'"
                          v-model="dataSetName"
                          id="dataSetName" :class="{ 'p-invalid': errors.dataSetName }"
                                 aria-describedby="dataSetName-help"
                          placeholder="Enter Dataset Name"
                      />
                    <small id="dataSetName-help" class="p-error">
                      {{ errors.dataSetName }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="cohort">Cohort</label>
                    <div v-tooltip="'e.g. “UKBiobank”'">
                    <Dropdown placeholder="Select Cohort" v-model="cohort" :options="cohortOptions" id="cohort" optionLabel="name"
                              optionValue="value" :class="{ 'p-invalid': errors.cohort }"
                              aria-describedby="cohort-help"

                    />
                    </div>
                    <small id="cohort-help" class="p-error">
                      {{ errors.cohort }}
                    </small>
                  </div>
                  <div class="field">
                      <label for="dataCollectionStart">Data Collection Start</label>
                      <Calendar v-model="dataCollectionStart" id="dataCollectionStart" placeholder="yyyy/mm/dd"
                                  showIcon fluid iconDisplay="input" date-format="yy/dd/mm"
                                v-tooltip="'Date of first data collection, approximate if not known e.g. 2006/01/01'"
                                :class="{ 'p-invalid': errors.dataCollectionStart }"
                      aria-describedby="dataCollectionStart-help"/>
                    <small id="dataCollectionStart-help" class="p-error">
                      {{errors.dataCollectionStart}}
                    </small>
                  </div>
                  <div class="field">
                    <label for="dataCollectionEnd">Data Collection End</label>
                    <Calendar v-model="dataCollectionEnd" id="dataCollectionEnd" placeholder="yyyy/mm/dd"
                              showIcon fluid iconDisplay="input" date-format="yy/dd/mm"
                              aria-describedby="dataCollectionEnd-help"
                              :class="{ 'p-invalid': errors.dataCollectionEnd }"
                              v-tooltip="'Date of last data collection, approximate if not known e.g. 2006/01/01'"/>
                    <small id="dataCollectionEnd-help" class="p-error">
                      {{errors.dataCollectionEnd}}
                    </small>
                  </div>
                  <div class="field">
                    <label for="contactPerson">Contact Person</label>
                    <InputText
                        v-model="contactPerson"
                        id="contactPerson"
                        type="text"
                        v-tooltip="'Name and email addresses of the person to contact for follow up questions'"
                        aria-describedby="contactPerson-help"
                        :class="{ 'p-invalid': errors.contactPerson }"
                    />
                    <small id="contactPerson-help" class="p-error">
                      {{ errors.contactPerson }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="references">References</label>
                    <InputText v-model="references" id="references" type="text"
                               v-tooltip="'Key references (URL or PMID) for the cohort description'"/>
                  </div>
                  <div class="field">
                    <label for="acknowledgements">Acknowledgements</label>
                    <InputText
                        v-model="acknowledgements"
                        id="acknowledgements"
                        type="text" v-tooltip="'Acknowledgments (e.g. funding sources)'"
                    />
                  </div>
                </Fieldset>
                <div class="field">
                  <label for="ancestry">Ancestry</label>
                  <Dropdown id="ancestry" v-model="selectedAncestry" :options="ancestryOptions"
                            optionLabel="name" optionValue="value" placeholder="Select Ancestry" data-cy="ancestry"/>
                </div>

                <div class="field">
                  <label for="keyReferences">Key References</label>
                  <InputText
                      v-model="keyReferences"
                      id="keyReferences"
                      type="text"
                  />
                </div>
                <div class="field">
                  <label for="caseAscertainment">Case Ascertainment</label>
                  <Dropdown
                      id="caseAscertainment"
                      v-model="caseAscertainment"
                      :options="caseAscertainmentOptions"
                      optionLabel="name"
                      optionValue="value"
                      placeholder="Select Case Ascertainment" data-cy="case-ascertainment" />
                </div>
                <div class="field">
                  <label for="caseType">Case Type</label>
                  <Dropdown
                      id="caseType"
                      v-model="caseType"
                      :options="caseTypeOptions"
                      optionLabel="name"
                      optionValue="value"
                      placeholder="Select Case Type" data-cy="case-type"/>
                </div>
                <div class="field">
                  <label for="phenotype">Phenotype</label>
                  <InputText v-model="phenotype" id="phenotype" type="text" />
                </div>
                <div class="field">
                  <label for="participants">Participants</label>
                  <InputText v-model="participants" id="participants" type="number" />
                </div>
                <div class="field">
                  <label for="cases">Cases</label>
                  <InputText v-model="cases" id="cases" type="number" />
                </div>
                <div class="field">
                  <label for="cases">Sex Proportion</label>
                  <InputText v-model="sexProportion" id="sexProportion" type="number" />
                </div>
                <div class="field">
                  <label for="age">Age At First Documented Study Phenotype</label>
                  <InputText v-model="age" id="age" type="number" />
                </div>
              <div class="field">
                <label for="analysisSoftware">Analysis Software</label>
                <InputText v-model="analysisSoftware" id="analysisSoftware" type="text" />
              </div>
              <div class="field">
                <label for="statisticalModel">Statistical Model</label>
                <InputText v-model="statisticalModel" id="statisticalModel" type="text" />
              </div>
              <div class="field">
                <label for="covariates">Covariates</label>
                <InputText v-model="covariates" id="covariates" type="text" />
              </div>
              <div class="field">
                <label for="arrayName">Array Name and Version</label>
                <InputText v-model="arrayName" id="arrayName" type="text" />
              </div>
              <div class="field">
                <label for="callingAlgorithm">Calling Algorithm</label>
                <InputText v-model="callingAlgorithm" id="callingAlgorithm" type="text" />
              </div>
              <div class="field">
                <label for="variantCallRate">Variant Call Rate</label>
                <InputText v-model="variantCallRate" id="variantCallRate" type="number" />
              </div>
              <div class="field">
                <label for="sampleCallRate">Sample Call Rate</label>
                <InputText v-model="sampleCallRate" id="sampleCallRate" type="number" />
              </div>
              <div class="field">
                <label for="hwePValue">HWE P-value</label>
                <InputText v-model="hwePValue" id="hwePValue" type="number" />
              </div>
              <div class="field">
                <label for="maf">MAF</label>
                <InputText v-model="maf" id="maf" type="number" />
              </div>
              <div class="field">
                <label for="otherQCFilters">Other QC Filters</label>
                <InputText v-model="otherQCFilters" id="otherQCFilters" type="text" />
              </div>
              <div class="field">
                <label for="nVariantsForImputation">N Variants For Imputation</label>
                <InputText v-model="nVariantsForImputation" id="nVariantsForImputation" type="number" />
              </div>
              <div class="field">
                <label for="prephasingAndImputationSoftware">Prephasing And Imputation Software</label>
                <InputText v-model="prephasingAndImputationSoftware" id="prephasingAndImputationSoftware" type="text" />
              </div>
              <div class="field">
                <label for="imputationReference">Imputation Reference</label>
                <InputText v-model="imputationReference" id="imputationReference" type="text" />
              </div>
              <div class="field">
                <label for="imputationQualityMeasure">Imputation Quality Measure</label>
                <InputText v-model="imputationQualityMeasure" id="imputationQualityMeasure" type="text" />
              </div>
            </div>


        </div>
        <div class="col-12 md:col-6">
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
                                data-cy="column-dropdown"
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
                            type="submit"
                            label="Upload"
                            class="p-button-primary"
                            icon="bi-upload"
                            raised
                        ></Button>
                    </span>
                </div>
            </div>
        </div>
    </div>
  </form>
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
