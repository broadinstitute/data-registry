<script setup>

import { useDatasetStore } from "~/stores/DatasetStore";
import { useUserStore } from "~/stores/UserStore";
import { useToast } from "primevue/usetoast";
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const formSchema = yup.object({
  dataSetName: yup.string().label('Dataset Name').required(),
  cohort: yup.string().label('Cohort').required(),
  dataCollectionStart: yup.date().label('Data Collection Start').required()
      .max(yup.ref('dataCollectionEnd'),
          'Data Collection Start must be on or before Data Collection End'),
  dataCollectionEnd: yup.date().label('Data Collection End').required().min(yup.ref('dataCollectionStart'),
      'Data Collection End must be on or after Data Collection Start'),
  contactPerson: yup.string().label('Contact Person').required(),
  acknowledgements: yup.string().label('Acknowledgements'),
  references: yup.string().label('References'),
  phenotype: yup.string().label('Phenotype').required(),
  caseAscertainment: yup.string().label('Case Ascertainment').required(),
  caseDefinition: yup.string().label('Case Definition').required(),
  caseType: yup.string().label('Case Type'),
  sex: yup.string().label('Sex Stratification').required(),
  ancestry: yup.string().label('Ancestry').required(),
  totalSampleSize: yup.number().integer('Sample size must be an integer')
      .positive('Sample size must be positive').label('Total Sample Size').required(),
  cases: yup.number().integer('Cases must be an integer').positive('Cases must be positive')
      .label('Cases').transform(value => (isNaN(value) ? undefined : value)),
  maleProportionCohort: yup.number().min(0).max(1).required()
      .label('Male propoportion (total cohort)'),
  maleProportionCases: yup.number().min(0).max(1).label('Male proportion (cases)').when("cases", {
    is: (value) => value > 0,
    then: (schema) => schema.required('You must specifiy Male proportion (cases) when you specify cases'),
    otherwise: (schema) => schema,
  }),
  maleProportionControls: yup.number().min(0).max(1).label('Male proportion (controls)').when("cases", {
    is: (value) => value > 0,
    then: (schema) => schema.required('You must specifiy Male proportion (controls) when you specify cases'),
    otherwise: (schema) => schema,
  }),
  meanAgeCohort: yup.number().positive('Mean age for cohort must be positive').label('Mean Age (cohort)')
      .transform(value => (isNaN(value) ? undefined : value)),
  sdAgeCohort: yup.number().positive('Standard deviation for cohort age must be positive')
      .label('Standard Deviation (cohort, years)').transform(value => (isNaN(value) ? undefined : value)),
  meanAgeCases: yup.number().positive('Mean age (cases, years) must be positive').label('Mean Age (cases, years)')
      .transform(value => (isNaN(value) ? undefined : value)).when("cases", {
        is: (value) => value > 0,
        then: (schema) => schema.required('You must specifiy mean age (cases) when you specify cases'),
        otherwise: (schema) => schema,
      }),
  sdAgeCases: yup.number().positive('Age standard deviation for cases must be positive')
      .label('Standard Deviation (cases, years)').transform(value => (isNaN(value) ? undefined : value)).when("cases", {
        is: (value) => value > 0,
        then: (schema) => schema.required('You must specifiy standard deviation age (cases) when you specify cases'),
        otherwise: (schema) => schema,
      }),
  meanAgeControls: yup.number().positive('Mean age (controls, years) must be positive').label('Mean Age (controls, years)')
      .transform(value => (isNaN(value) ? undefined : value)).when("cases", {
        is: (value) => value > 0,
        then: (schema) => schema.required('You must specifiy mean age (controls) when you specify cases'),
        otherwise: (schema) => schema,
      }),
  sdAgeControls: yup.number().positive('Age standard deviation for controls must be positive')
      .label('Standard Deviation (controls, years)').transform(value => (isNaN(value) ? undefined : value)).when("cases", {
        is: (value) => value > 0,
        then: (schema) => schema.required('You must specifiy standard deviation age (controls) when you specify cases'),
        otherwise: (schema) => schema,
      }),
  meanDiagnosisAge: yup.number().positive('Mean diagnosis age must be positive')
      .label('Mean diagnosis age').transform(value => (isNaN(value) ? undefined : value)).when("cases", {
        is: (value) => value > 0,
        then: (schema) => schema.required('You must mean diagnosis age when you specify cases'),
        otherwise: (schema) => schema,
    }),
  sdDiagnosisAge: yup.number().positive('Standard deviation diagnosis age must be positive')
      .label('Standard Deviation diagnosis age').transform(value => (isNaN(value) ? undefined : value)).when("cases", {
        is: (value) => value > 0,
        then: (schema) => schema.required('You must mean diagnosis age when you specify cases'),
        otherwise: (schema) => schema,
      }),
});


const { defineField, errors, values, validate } = useForm({
  validationSchema: formSchema,
});

const [dataSetName] = defineField('dataSetName');
const [cohort] = defineField('cohort');
const [dataCollectionStart] = defineField('dataCollectionStart');
const [dataCollectionEnd] = defineField('dataCollectionEnd');
const [contactPerson] = defineField('contactPerson');
const [acknowledgements] = defineField('acknowledgements');
const [references] = defineField('references');
const [phenotype] = defineField('phenotype');
const [caseAscertainment] = defineField('caseAscertainment');
const [caseDefinition] = defineField('caseDefinition');
const [caseType] = defineField('caseType');
const [sex] = defineField('sex');
const [ancestry] = defineField('ancestry');
const [totalSampleSize] = defineField('totalSampleSize');
const [cases] = defineField('cases');
const [maleProportionCohort] = defineField('maleProportionCohort');
const [maleProportionCases] = defineField('maleProportionCases');
const [maleProportionControls] = defineField('maleProportionControls');
const [meanAgeCohort] = defineField('meanAgeCohort');
const [sdAgeCohort] = defineField('sdAgeCohort');
const [meanAgeCases] = defineField('meanAgeCases');
const [sdAgeCases] = defineField('sdAgeCases');
const [meanAgeControls] = defineField('meanAgeControls');
const [sdAgeControls] = defineField('sdAgeControls');
const [meanDiagnosisAge] = defineField('meanDiagnosisAge');
const [sdDiagnosisAge] = defineField('sdDiagnosisAge');

const store = useDatasetStore();
const userStore = useUserStore();
const route = useRouter();
const toast = useToast();
const fileInfo = ref({});
let file = null;
const missingFileError = ref('');
const missingMappingError = ref('');
let fileName = null;
let previousMapping = {};
const selectedGenomeBuild = ref('');
const caseAscertainmentOptions = ref([
    { name: "Electronic Health Records", value: "Electronic Health Records" },
    { name: "Research Study", value: "Research Study" }
]);
const sexOptions = ref([
  { name: "Not sex stratified", value: "Not sex stratified" },
  { name: "Male only", value: "Male only" },
  { name: "Female only", value: "Female only" },

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

const subjects = ref(0);
const participants = ref(null);
const sexProportion = ref(null);
const age = ref(null);
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
        if(map){
          previousMapping = Object.fromEntries(
              Object.entries(map).map(([key, value]) => [value, key]),
          );
        }
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
  return requiredFields.value.every((field) =>
      selectedFields.value && Object.values(selectedFields.value).includes(field)
  ) && requiredAF.value;
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
    missingFileError.value = '';
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
    missingMappingError.value = '';
    file = null;
    fileName = null;
}

watch(step3Complete, () => {
  if(step3Complete.value){
    missingMappingError.value = '';
  } else {
    missingMappingError.value = "Please map all required fields to your file's columns";
  }
});

async function uploadSubmit(){
  const isValid = await validate();

  if(!file){
    missingFileError.value = "Please upload your file"
  } else {
    missingFileError.value = '';
  }
  if(file && !step3Complete.value){
    missingMappingError.value = "Please map all required fields to your file's columns";
  }
  if(!!missingMappingError.value || !!missingFileError.value || !isValid.valid){
    return;
  }
  const metadata = JSON.parse(JSON.stringify(values));
  metadata.column_map = colMap.value;
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
            stroke-width="4"
            animation-duration="0"
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

  <form @submit.prevent="uploadSubmit" id="metadataForm" novalidate class="needs-validation">
    <div class="grid">
        <div class="col-12 md:col-6">
            <div class="card p-fluid">
                <h5>Enter File Metadata</h5>
                <Fieldset legend="Study Metadata">
                  <div class="field">
                      <label for="dataSetName">Dataset Name</label>
                      <div v-tooltip="'e.g. “UKBB Heart Failure (female)”'">
                      <InputText
                          v-model="dataSetName"
                          id="dataSetName" :class="{ 'p-invalid': errors.dataSetName }"
                                 aria-describedby="dataSetName-help"
                          placeholder="Enter Dataset Name"
                        />
                        </div>
                    <small id="dataSetName-help" class="p-error">
                      {{ errors.dataSetName }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="cohort">Cohort</label>
                    <div v-tooltip="'e.g. “UKBiobank”'">
                    <InputText v-model="cohort"  id="cohort" :class="{ 'p-invalid': errors.cohort }"
                              aria-describedby="cohort-help" />
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
                        v-tooltip="'Name and email address of the person to contact for follow up questions'"
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
                <Fieldset legend="Participants">
                  <div class="field">
                    <label for="phenotype">Phenotype</label>
                    <div v-tooltip="'The phenotype description e.g. “all-cause heart failure”'">
                      <InputText v-model="phenotype" id="phenotype" type="text"
                      aria-describedby="phenotype-help"
                      :class="{ 'p-invalid': errors.phenotype }"
                      />
                    </div>
                    <small id="phenotype-help" class="p-error">
                      {{ errors.phenotype }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="caseAscertainment">Case Ascertainment</label>
                    <Dropdown
                        id="caseAscertainment"
                        v-model="caseAscertainment"
                        :options="caseAscertainmentOptions"
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Select Case Ascertainment" data-cy="case-ascertainment"
                        aria-describedby="caseAscertainment-help"
                        :class="{ 'p-invalid': errors.caseAscertainment }"
                        />
                    <small id="caseAscertainment-help" class="p-error">
                      {{ errors.caseAscertainment }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="caseDefinition">Case Definition</label>
                    <Textarea
                        v-model="caseDefinition"
                        id="caseDefinition"
                        type="text"
                        v-tooltip="'The process used to define the cohort e.g., ICD10 codes I500, I509 and ICD9 codes XYZ; excluding codes #1, #2 , etc.'"
                        aria-describedby="caseDefinition-help"
                        :class="{ 'p-invalid': errors.caseDefinition }"
                    />
                    <small id="caseDefinition-help" class="p-error">
                      {{ errors.caseDefinition }}
                    </small>
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
                    <label for="sex">Sex</label>
                    <Dropdown id="sex" v-model="sex" :options="sexOptions"
                              optionLabel="name" optionValue="value"
                              placeholder="Select Sex Stratification"
                              aria-describedby="sex-help"
                              data-cy="sex"
                              :class="{'p-invalid': errors.sex}"
                    />
                    <small id="sex-help" class="p-error">
                      {{ errors.sex }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="ancestry">Ancestry</label>
                    <Dropdown id="ancestry" v-model="ancestry" :options="ancestryOptions"
                              optionLabel="name" optionValue="value" placeholder="Select Ancestry"
                              data-cy="ancestry"
                              aria-labelledby="ancestry-help"
                              :class="{'p-invalid': errors.ancestry}"
                    />
                    <small id="ancestry-help" class="p-error">
                      {{ errors.ancestry }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="totalSampleSize">Total Sample Size</label>
                    <InputText v-model="totalSampleSize" id="totalSampleSize" type="number" min="1"
                    v-tooltip="'The total number of participants (e.g. cases + controls)'"
                               aria-labelledby="totalSampleSize-help"
                               :class="{'p-invalid': errors.totalSampleSize}"
                    />
                    <small id="totalSampleSize-help" class="p-error">
                      {{ errors.totalSampleSize }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="cases">Number of Cases</label>
                    <InputText v-model="cases" id="cases" type="number" min="1"
                    v-tooltip="'(optional) The number of cases in the cohort if a case-control design'"
                    aria-labelledby="cases-help" :class="{'p-invalid': errors.cases}"
                    />
                    <small id="cases-help" class="p-error">
                      {{ errors.cases }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="maleProportionCohort">Male Proportion Cohort</label>
                    <InputText v-model="maleProportionCohort" id="maleProportionCohort" type="number" min="0" max="1"
                               v-tooltip="'The fraction of the total cohort that are male (e.g. 0.51)'"
                               aria-labelledby="maleProportionCohort-help"
                               :class="{'p-invalid': errors.maleProportionCohort}"
                    />
                    <small id="maleProportionCohort-help" class="p-error">
                      {{ errors.maleProportionCohort }}
                    </small>
                  </div>
                  <div class="field" v-if="cases">
                    <label for="maleProportionCases" >Male Proportion Cases</label>
                    <InputText v-model="maleProportionCases" id="maleProportionCases" type="number" min="0" max="1"
                    v-tooltip="'The fraction of the cases that are male (e.g. 0.51)'"
                               aria-labelledby="maleProportionCases-help"
                               :class="{'p-invalid': errors.maleProportionCases}"
                    />
                    <small id="maleProportionCases-help" class="p-error">
                      {{ errors.maleProportionCases }}
                    </small>
                  </div>
                  <div class="field" v-if="cases">
                    <label for="maleProportionControls">Male Proportion Controls</label>
                    <InputText v-model="maleProportionControls" id="maleProportionControls" type="number" min="0" max="1"
                               v-tooltip="'The fraction of the controls that are male (e.g. 0.51)'"
                               aria-labelledby="maleProportionControls-help"
                               :class="{'p-invalid': errors.maleProportionControls}"
                    />
                    <small id="maleProportionControls-help" class="p-error">
                      {{ errors.maleProportionControls }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="meanAgeCohort">Mean Age (total cohort, years)</label>
                    <InputText v-model="meanAgeCohort" id="meanAgeCohort" type="number" min="0"
                               v-tooltip="'The mean age of the total cohort at first documented study phenotype (e.g. 54.2)'"
                               aria-labelledby="meanAgeCohort-help"
                               :class="{'p-invald': errors.meanAgeCohort}"
                    />
                    <small id="meanAgeCohort-help" class="p-error">
                      {{ errors.meanAgeCohort }}
                    </small>
                  </div>
                  <div class="field">
                    <label for="sdAgeCohort">Standard Deviation Age (total cohort, years)</label>
                    <InputText v-model="sdAgeCohort" id="sdAgeCohort" type="number" min="0"
                               v-tooltip="'The age standard deviation of the total cohort  at first documented study phenotype (e.g. 10.2)'"
                               aria-labelledby="sdAgeCohort-help"
                               :class="{'p-invalid': errors.sdAgeCohort}"
                    />
                    <small id="sdAgeCohort-help" class="p-error">
                      {{ errors.sdAgeCohort }}
                    </small>
                  </div>
                  <div class="field" v-if="cases">
                    <label for="meanAgeCases">Mean Age (cases, years)</label>
                    <InputText v-model="meanAgeCases" id="meanAgeCases" type="number" min="0"
                               v-tooltip="'The mean age of the cases at first documented study phenotype (e.g. 54.2)'"
                               aria-labelledby="meanAgeCases-help"
                               :class="{'p-invalid': errors.meanAgeCases}"
                    />
                    <small id="meanAgeCases-help" class="p-error">
                      {{ errors.meanAgeCases }}
                    </small>
                  </div>
                  <div class="field" v-if="cases">
                    <label for="sdAgeCases">Standard Deviation Age (cases, years)</label>
                    <InputText v-model="sdAgeCases" id="sdAgeCases" type="number" min="0"
                               v-tooltip="'The age standard deviation of the cases at first documented study phenotype (e.g. 10.2)'"
                               aria-labelledby="sdAgeCases-help"
                               :class="{'p-invalid': errors.sdAgeCases}"
                    />
                    <small id="sdAgeCases-help" class="p-error">
                      {{ errors.sdAgeCases }}
                    </small>
                  </div>
                  <div class="field" v-if="cases">
                    <label for="meanAgeControls">Mean Age (controls, years)</label>
                    <InputText v-model="meanAgeControls" id="meanAgeControls" type="number" min="0"
                               v-tooltip="'The mean age of the controls at first documented study phenotype (e.g. 54.2)'"
                               aria-labelledby="meanAgeControls-help"
                               :class="{'p-invalid': errors.meanAgeControls}"
                    />
                    <small id="meanAgeControls-help" class="p-error">
                      {{ errors.meanAgeControls }}
                    </small>
                  </div>
                  <div class="field" v-if="cases">
                    <label for="sdAgeControls">Standard Deviation Age (controls, years)</label>
                    <InputText v-model="sdAgeControls" id="sdAgeControls" type="number" min="0"
                               v-tooltip="'The age standard deviation of the controls at first documented study phenotype (e.g. 10.2)'"
                               aria-labelledby="sdAgeControls-help"
                               :class="{'p-invalid': errors.sdAgeControls}"
                    />
                    <small id="sdAgeControls-help" class="p-error">
                      {{ errors.sdAgeControls }}
                    </small>
                  </div>

                  <div class="field" v-if="cases">
                    <label for="meanDiagnosisAge">Mean diagnosis age (cases, years)</label>
                    <InputText v-model="meanDiagnosisAge" id="meanDiagnosisAge" type="number" min="0"
                               v-tooltip="'The mean age of the total cohort at first documented study phenotype (e.g. 54.2)'"
                               aria-labelledby="meanDiagnosisAge-help"
                               :class="{'p-invalid': errors.meanDiagnosisAge}"
                    />
                    <small id="meanDiagnosisAge-help" class="p-error">
                      {{ errors.meanDiagnosisAges }}
                    </small>
                  </div>
                  <div class="field" v-if="cases">
                    <label for="sdDiagnosisAge">Standard Deviation Age (controls, years)</label>
                    <InputText v-model="sdDiagnosisAge" id="sdDiagnosisAge" type="number" min="0"
                               v-tooltip="'The age standard deviation of the total cohort  at first documented study phenotype (e.g. 10.2)'"
                               aria-labelledby="sdDiagnosisAge-help"
                               :class="{'p-invalid': errors.sdDiagnosisAge}"
                    />
                    <small id="sdDiagnosisAge-help" class="p-error">
                      {{ errors.sdDiagnosisAge }}
                    </small>
                  </div>

                </Fieldset>



            </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="card p-fluid" >
            <h5>Select file to upload</h5>
            <div class="field" :class="{ 'p-invalid-file':  missingFileError}">
            <FileUpload
                name="file"
                id="fileInput"
                accept=".csv, .tsv, .gz, .bgzip, .gzip"
                :showUploadButton="false"
                :previewWidth="0"
                @select="sampleFile"
                @clear="resetFile"
                @remove="resetFile"
                aria-describedby="fileInput-help"
            >
              <template #empty>
                <p>
                  Drag and drop files to here to upload. (.csv, .tsv,
                  .gz, .bgzip, .gzip)
                </p>
              </template>
            </FileUpload>

            </div>
            <small id="fileInput-help" class="p-error">
              {{ missingFileError }}
            </small>
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
                <div class="field" :class="{'p-invalid-file': missingMappingError}">
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
                </div>
                <small class="p-error" v-if="missingMappingError">
                  {{ missingMappingError }}
                </small>
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

.p-invalid-file {
  border: solid 1px #f87171;
}

</style>
