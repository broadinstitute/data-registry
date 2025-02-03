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
      .transform(value => (isNaN(value) ? undefined : value))
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
  meanAgeControl: yup.number().positive('Mean age (controls, years) must be positive').label('Mean Age (controls, years)')
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
  referenceGenome: yup.string().label('Reference Genome').required(),
  genotypingArray: yup.string().label('Genotyping Array').required(),
  callingAlgorithm: yup.string().label('Calling Algorithm').required(),
  imputationSoftware: yup.string().label('Imputation Software').required(),
  imputationReference: yup.string().label('Imputation Reference').required(),
  numberOfVariantsForImputation: yup.number().positive("Number of variants for imputation must be positive")
      .transform(value => (isNaN(value) ? undefined : value))
      .integer("Number of variants should be a whole number")
      .label("Number of Variants for Imputation").required(),
  imputationQualityMeasure: yup.string().label("Imputation Quality Measure").required(),
  relatedIndividualsRemoved: yup.string().label("Related Individuals Removed").required(),
  variantCallRate: yup.number().min(0).max(1).transform(value => (isNaN(value) ? undefined : value))
      .label("Variant Call Rate").required(),
  sampleCallRate: yup.number().min(0).max(1).transform(value => (isNaN(value) ? undefined : value))
      .label("Sample Call Rate").required(),
  hwePValue: yup.number().min(0).max(1).transform(value => (isNaN(value) ? undefined : value))
      .label("HWE p-value").required(),
  maf: yup.number().min(0).max(1).transform(value => (isNaN(value) ? undefined : value))
      .label("MAF").required(),
  otherFilters: yup.string().label("Other QC Filters").required(),
  meanAgeRecruitment: yup.number().positive('Mean age (recruitment, years) must be positive')
      .label('Mean Age (recruitment, years)'),
  sdAgeRecruitment: yup.number().positive('Standard deviation age (recruitment, years) must be positive')
      .label('Standard deviation age (recruitment, years)'),
  maleProportionRecruitment: yup.number().min(0).max(1).label("Sex male (recruitment)"),

});


const { defineField, errors, values, validate } = useForm({
  validationSchema: formSchema,
});
const phenotypeObj = ref({});
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
const [maleProportionRecruitment] = defineField('maleProportionRecruitment');
const [maleProportionControls] = defineField('maleProportionControls');
const [meanAgeCohort] = defineField('meanAgeCohort');
const [sdAgeCohort] = defineField('sdAgeCohort');
const [sdAgeControls] = defineField('sdAgeControls');
const [referenceGenome] = defineField('referenceGenome');
const [genotypingArray] = defineField('genotypingArray');
const [callingAlgorithm] = defineField('callingAlgorithm');
const [imputationSoftware] = defineField('imputationSoftware');
const [imputationReference] = defineField('imputationReference');
const [numberOfVariantsForImputation] = defineField('numberOfVariantsForImputation');
const [imputationQualityMeasure] = defineField('imputationQualityMeasure');
const [relatedIndividualsRemoved] = defineField('relatedIndividualsRemoved');
const [variantCallRate] = defineField('variantCallRate');
const [sampleCallRate] = defineField('sampleCallRate');
const [hwePValue] = defineField('hwePValue');
const [maf] = defineField('maf');
const [otherFilters] = defineField('otherFilters');

const [meanAgeCases] = defineField('meanAgeCases');
const [meanAgeControl] = defineField('meanAgeControl');
const [meanAgeRecruitment] = defineField('meanAgeRecruitment');

const [sdAgeCases] = defineField('sdAgeCases');
const [sdAgeRecruitment] = defineField('sdAgeRecruitment');

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
const caseAscertainmentOptions = ref([
    { name: "Electronic Health Records", value: "Electronic Health Records" },
    { name: "Research Study", value: "Research Study" }
]);
const referenceGenomeOptions = ref([
  { name: "Hg38", value: "Hg38" },
  { name: "Hg19", value: "Hg19" }
]);
const relatedIndividualsRemovedOptions = ref([
  {name: "Yes", value: "Yes"},
  {name: "No", value: "No"},
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

const colOptions = ref([]);
const requiredFields = ref([]);
const selectedFields = ref({});
const filteredPhenotypes = ref([]);

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
    await store.fetchHermesPhenolist();

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

const requiredEffectFields = computed(() => {
  const betaAndSe = selectedFields.value &&
      Object.values(selectedFields.value).includes('beta') &&
      Object.values(selectedFields.value).includes('se');

  const oddsRatioFields = selectedFields.value &&
      Object.values(selectedFields.value).includes('oddsRatio') &&
      Object.values(selectedFields.value).includes('oddsRatioLB') &&
      Object.values(selectedFields.value).includes('oddsRatioUB');

  return betaAndSe || oddsRatioFields;
});

const step1Complete = computed(() => {
    return Boolean(dataSetName.value);
});
const step2Complete = computed(() => {
    return Boolean(fileInfo.value.columns);
});
const step3Complete = computed(() => {
  return requiredFields.value.every((field) =>
      selectedFields.value && Object.values(selectedFields.value).includes(field)
  ) && requiredAF.value && requiredEffectFields.value;
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


function filterFunc (q) {
  filteredPhenotypes.value = Object.values(store.hermesPhenotypes).filter((p) => {
    if (q.length < 2) { return false; }
    const words = q.query.split(" ");
    let matches = 0;
    words.forEach((word) => {
      if (p.description.toLowerCase().includes(word.toLowerCase())) { matches++; }
    });
    return matches === words.length;
  });
}

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
            group: "default",
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

watch(phenotypeObj, (newValue) => {
  phenotype.value = newValue.name;
});

watch(step3Complete, () => {
  if(step3Complete.value){
    missingMappingError.value = '';
  } else {
    missingMappingError.value = "Please map all required fields to your file's columns";
  }
});

async function uploadSubmit(){
  console.log("Starting upload event handler");
  const isValid = await validate();
  console.log(`Validate isValue = ${isValid.valid}`);
  console.log(`Full validation result ${JSON.stringify(isValid)}`);

  if(!file){
    missingFileError.value = "Please upload your file";
  } else {
    missingFileError.value = '';
  }
  if(file && !step3Complete.value){
    missingMappingError.value = "Please map all required fields to your file's columns";
  }
  if(!!missingMappingError.value || !!missingFileError.value || !isValid.valid){
    console.log("Returning early due to missing mapping, missing file, or invalid data");
    return;
  }
  const metadata = JSON.parse(JSON.stringify(values));
  metadata.column_map = colMap.value;
  metadata.dataset = metadata.dataSetName;
  metadata.column_map.reference = metadata.column_map['non-effect allele'];
  metadata.column_map.alt = metadata.column_map['effect allele'];
  metadata.column_map.n = metadata.column_map['N total'];
  metadata.column_map.stdErr = metadata.column_map.se;
  try {
    const {presigned_url} = await store.getHermesPresignedUrl(fileName, dataSetName.value);
    await store.uploadToPresignedUrl(presigned_url, file);
    const validationRes = await store.validateHermesUpload(
        fileName,
        dataSetName.value,
        metadata,
        {'fd': .2}
    );
    if (validationRes.errors) {
      toast.add({
        severity: "error",
        summary: "Alert",
        group: "fileErrors",
        errors: validationRes.errors,
      });
    } else {
      await route.push({ path: "/hermes" });
    }
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
  <Toast position="top-center" group="default"/>
  <Toast position="top-center" group="fileErrors">
    <template #message="slotProps">
      <div class="flex flex-column items-start flex-auto">
        <div>
          <span>File data problems:</span>
        </div>
        <div>
          <ul>
            <li v-for="error in slotProps.message.errors" :key="error">
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
    </template>
    </Toast>

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
                  <HermesValidatedInput id="dataSetName" label="Dataset Name" v-model="dataSetName"
                                        tooltip='e.g. "UKBB Heart Failure (female)"'/>
                  <HermesValidatedInput id="cohort" tooltip='e.g. "UKBiobank"' v-model="cohort"
                                        label="Cohort" />
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
                  <HermesValidatedInput id="contactPerson" v-model="contactPerson" label="Contact Person"
                                        tooltip="Name and email address of the person to contact for follow up questions"/>
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
                    <AutoComplete
                        id="phenotype"
                        v-model="phenotypeObj"
                        :suggestions="filteredPhenotypes"
                        optionLabel="description"
                        placeholder="Phenotype Description"
                        @complete="filterFunc"
                        :class="{ 'p-invalid': errors.phenotype }"
                        aria-describedby="phenotype-help"
                    />
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
                  <HermesValidatedInput id="totalSampleSize" type="number" label="Total Sample Size"
                                        tooltip="The total number of participants (e.g. cases + controls)"
                                        v-model="totalSampleSize"/>
                  <HermesValidatedInput id="cases" v-model="cases" label="Number of Cases" type="number"
                                        tooltip="(optional) The number of cases in the cohort if a case-control design" />
                </Fieldset>

              <Fieldset legend="Genotyping Information">
                <div class="field">
                  <label for="reference">Reference Genome</label>
                  <Dropdown
                      id="referenceGenome"
                      v-model="referenceGenome"
                      :options="referenceGenomeOptions"
                      optionLabel="name"
                      optionValue="value"
                      placeholder="Select Reference Genome" data-cy="referenceGenome"
                      aria-describedby="referenceGenome-help"
                      :class="{ 'p-invalid': errors.referenceGenome }"

                  />
                  <small id="referenceGenome-help" class="p-error">
                    {{ errors.referenceGenome }}
                  </small>
                </div>
                <HermesValidatedInput id="genotypingArray" label="Genotyping Array" v-model="genotypingArray"
                                      tooltip="The genotyping array name and version used to generate the genetic data (e.g.  Illumina Omni2.5)" />
                <HermesValidatedInput id="callingAlgorithm" label="Calling Algorithm" v-model="callingAlgorithm"
                                      tooltip="The calling algorithm used (e.g. GATK HaplotypeCaller v4.1)" />

              </Fieldset>
              <Fieldset legend="Imputation Information">
                <HermesValidatedInput id="imputationSoftware" v-model="imputationSoftware"
                                      tooltip="The prephasing and imputation software and version used in the GWAS analysis (e.g. IMPUTE2 v2.3.2)"
                                      label="Imputation Software"/>
                <HermesValidatedInput id="imputationReference" v-model="imputationReference"
                                      label="Imputation Reference"
                                      tooltip="The imputation reference used (e.g. HRCr1.1)" />
                <HermesValidatedInput id="numberOfVariantsForImputation"
                                      v-model="numberOfVariantsForImputation" type="number"
                                      label="Number of Variants for Imputation"
                                      tooltip="The number of variants used for imputation (e.g. 10,000)"/>
                <HermesValidatedInput id="imputationQualityMeasure" v-model="imputationQualityMeasure"
                                      tooltip="The imputation quality measure used and any threshold applied (e.g. INFO > 0.98 / R^2 > 0.85 / MACH R^2 > 0.92)"
                                      label="Imputation Quality Measure"/>
              </Fieldset>
              <Fieldset legend="Genotyping Quality Control">
                <div class="field">
                    <label for="relatedIndividualsRemoved">Related Individuals Removed?</label>
                    <Dropdown
                        id="relatedIndividualsRemoved"
                        v-model="relatedIndividualsRemoved"
                        :options="relatedIndividualsRemovedOptions"
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Related Individuals Removed?" data-cy="relatedIndividualsRemoved"
                        aria-describedby="relatedIndividualsRemoved-help"
                        :class="{ 'p-invalid': errors.relatedIndividualsRemoved }"
                    />
                    <small id="relatedIndividualsRemoved-help" class="p-error">
                      {{ errors.relatedIndividualsRemoved }}
                    </small>
                </div>
                <HermesValidatedInput id="variantCallRate" label="Variant Call Rate" v-model="variantCallRate"
                                      tooltip="The variant call rate threshold used (e.g. 0.95)" type="number"/>
                <HermesValidatedInput id="sampleCallRate" label="Sample Call Rate" type="number"
                                      tooltip="The sample call rate threshold used (e.g. 0.97)"
                                      v-model="sampleCallRate" />
                <HermesValidatedInput id="hwePValue" type="number" v-model="hwePValue"
                                      label="HWE p-value"
                                      tooltip="The Hardy-Weinberg Equilibrium p-value threshold used (e.g. 0.05)" />
                <HermesValidatedInput id="maf" type="number" label="MAF Threshold"
                                      tooltip="The minor allele frequency threshold used (e.g. 0.01)"
                                      v-model="maf"/>
                <HermesValidatedInput id="otherFilters" label="Other QC Filters"
                    tooltip="Other quality control filters that may have been implemented"
                    v-model="otherFilters"
                />
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

                  <Chip
                      v-if="requiredEffectFields"
                      icon="bi-check"
                      label="beta, se | oddsRatio, oddsRatioLB, oddsRatioUB"
                      class="selected-chip"
                  />
                  <Chip v-else label="beta, se | oddsRatio, oddsRatioLB, oddsRatioUB" />
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
            <div class="card p-fluid">
              <Fieldset legend="Age and Sex Distribution">
                <div class="grid">
                  <div class="col-3"></div>
                  <div class="col-6 text-center">At Recruitment</div>
                  <div class="col-3 text-center">At Diagnosis</div>
                </div>
                <div class="grid">
                  <div class="col-3"></div>
                  <div class="col-2">Total</div>
                  <div class="col-2">Control</div>
                  <div class="col-2">Cases</div>
                  <div class="col-3">Cases</div>
                </div>

                <div class="grid align-items-start mb-2">
                  <div class="col-3 pt-2">Mean Age</div>
                  <div class="col-2">
                    <div class="field-wrapper">
                      <InputText id="meanAgeCohort" v-model="meanAgeCohort" :class="{ 'p-invalid': errors.meanAgeCohort }" type="number"/>
                      <small class="p-error">{{ errors.meanAgeCohort || ' ' }}</small>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="field-wrapper">
                      <InputText id="meanAgeControl" v-model="meanAgeControl" :class="{ 'p-invalid': errors.meanAgeControl }" type="number" />
                      <small class="p-error">{{ errors.meanAgeControl || ' ' }}</small>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="field-wrapper">
                      <InputText id="meanAgeCases" v-model="meanAgeCases" :class="{ 'p-invalid': errors.meanAgeCases }" type="number"/>
                      <small class="p-error">{{ errors.meanAgeCases || ' ' }}</small>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="field-wrapper">
                      <InputText id="meanAgeRecruitment" v-model="meanAgeRecruitment" :class="{ 'p-invalid': errors.meanAgeRecruitment }" type="number"/>
                      <small class="p-error">{{ errors.meanAgeRecruitment || ' ' }}</small>
                    </div>
                  </div>
                </div>

                <div class="grid align-items-start mb-2">
                  <div class="col-3 pt-2">SD Age</div>
                  <div class="col-2">
                    <div class="field-wrapper">
                      <InputText id="sdAgeCohort" v-model="sdAgeCohort" :class="{ 'p-invalid': errors.sdAgeCohort }" type="number"/>
                      <small class="p-error">{{ errors.sdAgeCohort || ' ' }}</small>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="field-wrapper">
                      <InputText id="sdAgeControls" v-model="sdAgeControls" :class="{ 'p-invalid': errors.sdAgeControls }" type="number" />
                      <small class="p-error">{{ errors.sdAgeControls || ' ' }}</small>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="field-wrapper">
                      <InputText id="sdAgeCases" v-model="sdAgeCases" :class="{ 'p-invalid': errors.sdAgeCases }" type="number"/>
                      <small class="p-error">{{ errors.sdAgeCases || ' ' }}</small>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="field-wrapper">
                      <InputText id="sdAgeRecruitment" v-model="sdAgeRecruitment" :class="{ 'p-invalid': errors.sdAgeRecruitment }" type="number" />
                      <small class="p-error">{{ errors.sdAgeRecruitment || ' ' }}</small>
                    </div>
                  </div>
                </div>

                <div class="grid align-items-start">
                  <div class="col-3 pt-2">Sex Male</div>
                  <div class="col-2">
                    <div class="field-wrapper">
                      <InputText id="maleProportionCohort" v-model="maleProportionCohort" :class="{ 'p-invalid': errors.maleProportionCohort }" type="number" />
                      <small class="p-error">{{ errors.maleProportionCohort || ' ' }}</small>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="field-wrapper">
                      <InputText id="maleProportionControls" v-model="maleProportionControls" :class="{ 'p-invalid': errors.maleProportionControls }" type="number" />
                      <small class="p-error">{{ errors.maleProportionControls || ' ' }}</small>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="field-wrapper">
                      <InputText id="maleProportionCases" v-model="maleProportionCases" :class="{ 'p-invalid': errors.maleProportionCases }" type="number" />
                      <small class="p-error">{{ errors.maleProportionCases || ' ' }}</small>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="field-wrapper">
                      <InputText id="maleProportionRecruitment" v-model="maleProportionRecruitment" :class="{ 'p-invalid': errors.maleProportionRecruitment }" type="number" />
                      <small class="p-error">{{ errors.maleProportionRecruitment || ' ' }}</small>
                    </div>
                  </div>
                </div>
              </Fieldset>
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

.p-inputnumber {
  width: 100%;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.field-wrapper .p-inputnumber {
  flex-grow: 0;
}

.field-wrapper small {
  flex-grow: 1;
  min-height: 1.5em; /* Adjust this value to match your design */
}

.pt-2 {
  padding-top: 0.5rem;
}

</style>
