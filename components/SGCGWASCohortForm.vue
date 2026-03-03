<template>
    <div class="card p-fluid">

        <!-- Section 1: General Information -->
        <h6 class="mb-3">General Information</h6>

        <div class="formgrid grid">
            <div class="field col-12 md:col-4">
                <label for="countryOfAscertainment">Country/Countries of Ascertainment <span class="text-red-500">*</span></label>
                <InputText v-model="formData.country_of_ascertainment" id="countryOfAscertainment" type="text" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-4">
                <label for="dataFreezeDate">Data Freeze Date <span class="text-red-500">*</span></label>
                <Calendar v-model="formData.data_freeze_date" id="dataFreezeDate" dateFormat="yy-mm-dd" :showIcon="true" :disabled="disabled" />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="contactPerson">Contact Person and Email <span class="text-red-500">*</span></label>
                <InputText
                    v-model="formData.contact_person" id="contactPerson" type="text"
                    placeholder="Name <email@example.com>"
                    v-tooltip="{value: 'Should be analyst or uploader', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-12 md:col-6">
                <label for="leadCollaborator">Lead Collaborator <span class="text-red-500">*</span></label>
                <InputText
                    v-model="formData.lead_collaborator" id="leadCollaborator" type="text"
                    v-tooltip="{value: 'e.g. study PI or senior contact', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
        </div>

        <Divider />
        <h6 class="mb-3">Contributors &amp; Publication</h6>

        <div class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="otherContributors">Other Contributors to Include as Authors</label>
                <Textarea
                    v-model="formData.other_contributors" id="otherContributors" rows="2"
                    v-tooltip="{value: 'There will be further opportunities to add authors prior to any publication', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-12 md:col-6">
                <label for="otherPublicationRequirements">Other Publication Requirements</label>
                <Textarea
                    v-model="formData.other_publication_requirements" id="otherPublicationRequirements" rows="2"
                    placeholder="e.g. whether approval is needed by study steering committee"
                    :disabled="disabled"
                />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-12">
                <label for="acknowledgements">Acknowledgements and Funding Information <span class="text-red-500">*</span></label>
                <Textarea v-model="formData.acknowledgements" id="acknowledgements" rows="2" :disabled="disabled" />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-12 md:col-4">
                <label for="summaryStatsPublicAvailability">Summary Stats Publicly Available? <span class="text-red-500">*</span></label>
                <Dropdown
                    v-model="formData.summary_stats_public_availability" id="summaryStatsPublicAvailability"
                    :options="publicAvailabilityOptions" optionLabel="label" optionValue="value"
                    placeholder="Select" :disabled="disabled"
                />
            </div>
            <div class="field col-12 md:col-8">
                <label for="relevantReferences">Relevant References (PMIDs or URLs) <span class="text-red-500">*</span></label>
                <InputText v-model="formData.relevant_references" id="relevantReferences" type="text" :disabled="disabled" />
            </div>
        </div>

        <Divider />
        <h6 class="mb-3">Ethics &amp; Study Design</h6>

        <div class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="ethicsApproval">Details of Ethics Approval <span class="text-red-500">*</span></label>
                <Textarea v-model="formData.ethics_approval" id="ethicsApproval" rows="3" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="studyAscertainment">Details of Study Ascertainment <span class="text-red-500">*</span></label>
                <Textarea
                    v-model="formData.study_ascertainment" id="studyAscertainment" rows="3"
                    v-tooltip="{value: 'How were participants recruited?', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-12 md:col-4">
                <label for="codingSystem">Coding System to Define Cases <span class="text-red-500">*</span></label>
                <InputText v-model="formData.coding_system" id="codingSystem" type="text" placeholder="e.g. ICD-10, SNOMED – list all" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-4">
                <label for="meanAgeStudyEntry">Mean Age at Study Entry <span class="text-red-500">*</span></label>
                <InputNumber v-model="formData.mean_age_study_entry" id="meanAgeStudyEntry" :minFractionDigits="0" :maxFractionDigits="2" :min="0" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-4">
                <label for="sdAgeStudyEntry">SD of Age at Study Entry <span class="text-red-500">*</span></label>
                <InputNumber v-model="formData.sd_age_study_entry" id="sdAgeStudyEntry" :minFractionDigits="0" :maxFractionDigits="2" :min="0" :disabled="disabled" />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-12">
                <label for="ancestryApproach">Approach to Determine Participant Ancestry and Remove Outliers <span class="text-red-500">*</span></label>
                <Textarea v-model="formData.ancestry_approach" id="ancestryApproach" rows="2" :disabled="disabled" />
            </div>
        </div>

        <Divider />
        <h6 class="mb-3">Genotyping &amp; Imputation</h6>

        <div class="formgrid grid">
            <div class="field col-12 md:col-4">
                <label for="genomeBuild">Genome Build <span class="text-red-500">*</span></label>
                <InputText v-model="formData.genome_build" id="genomeBuild" type="text" placeholder="e.g. GRCh37, GRCh38" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-4">
                <label for="genotypingTechnology">Genotyping Technology <span class="text-red-500">*</span></label>
                <InputText v-model="formData.genotyping_technology" id="genotypingTechnology" type="text" placeholder="e.g. imputed array, WGS" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-4">
                <label for="genotypingArray">Genotyping Array <span class="text-red-500">*</span></label>
                <InputText
                    v-model="formData.genotyping_array" id="genotypingArray" type="text"
                    v-tooltip="{value: 'Enter N/A for sequencing-based study', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-12 md:col-9">
                <label for="genotypingMethodsOverview">Genotyping and Imputation / Genome Sequencing Methods Overview <span class="text-red-500">*</span></label>
                <Textarea
                    v-model="formData.genotyping_methods_overview" id="genotypingMethodsOverview" rows="3"
                    v-tooltip="{value: 'Please give details to be included in publication Methods', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-12 md:col-3">
                <label for="genotypeCallingAlgorithm">Genotype Calling Algorithm</label>
                <InputText v-model="formData.genotype_calling_algorithm" id="genotypeCallingAlgorithm" type="text" :disabled="disabled" />
            </div>
        </div>

        <p class="text-sm font-medium mb-2 mt-1">Pre-imputation QC</p>
        <div class="formgrid grid">
            <div class="field col-12 md:col-3">
                <label for="preImputationVariantCallRate">Variant Call Rate</label>
                <InputNumber v-model="formData.pre_imputation_variant_call_rate" id="preImputationVariantCallRate" :minFractionDigits="0" :maxFractionDigits="4" :min="0" :max="1" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-3">
                <label for="preImputationSampleCallRate">Sample Call Rate</label>
                <InputNumber v-model="formData.pre_imputation_sample_call_rate" id="preImputationSampleCallRate" :minFractionDigits="0" :maxFractionDigits="4" :min="0" :max="1" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-3">
                <label for="preImputationHwePvalue">HWE p-value</label>
                <InputNumber v-model="formData.pre_imputation_hwe_pvalue" id="preImputationHwePvalue" :minFractionDigits="0" :maxFractionDigits="10" :min="0" :max="1" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-3">
                <label for="preImputationMaf">MAF</label>
                <InputNumber v-model="formData.pre_imputation_maf" id="preImputationMaf" :minFractionDigits="0" :maxFractionDigits="4" :min="0" :max="1" :disabled="disabled" />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-12">
                <label for="preImputationOtherFilters">Pre-imputation QC: Other Filters Applied</label>
                <Textarea v-model="formData.pre_imputation_other_filters" id="preImputationOtherFilters" rows="2" :disabled="disabled" />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-12 md:col-4">
                <label for="imputationSoftware">Imputation Software and Version <span class="text-red-500">*</span></label>
                <InputText v-model="formData.imputation_software" id="imputationSoftware" type="text" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-4">
                <label for="imputationReferencePanel">Imputation Reference Panel <span class="text-red-500">*</span></label>
                <InputText v-model="formData.imputation_reference_panel" id="imputationReferencePanel" type="text" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-4">
                <label for="imputationQualityMeasure">Imputation Quality Measure <span class="text-red-500">*</span></label>
                <InputText
                    v-model="formData.imputation_quality_measure" id="imputationQualityMeasure" type="text"
                    v-tooltip="{value: 'e.g. INFO score', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
        </div>

        <p class="text-sm font-medium mb-2 mt-1">Post-imputation QC</p>
        <div class="formgrid grid">
            <div class="field col-12 md:col-3">
                <label for="postImputationQualityThreshold">Quality Threshold <span class="text-red-500">*</span></label>
                <InputNumber v-model="formData.post_imputation_quality_threshold" id="postImputationQualityThreshold" :minFractionDigits="0" :maxFractionDigits="4" :min="0" :max="1" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-3">
                <label for="postImputationMaf">MAF Threshold <span class="text-red-500">*</span></label>
                <InputNumber v-model="formData.post_imputation_maf" id="postImputationMaf" :minFractionDigits="0" :maxFractionDigits="4" :min="0" :max="1" :disabled="disabled" />
            </div>
            <div class="field col-12 md:col-6">
                <label for="postImputationOtherFilters">Other Filters Applied</label>
                <Textarea v-model="formData.post_imputation_other_filters" id="postImputationOtherFilters" rows="1" :disabled="disabled" />
            </div>
        </div>

        <Divider />
        <h6 class="mb-3">Association Testing</h6>

        <div class="formgrid grid">
            <div class="field col-12 md:col-9">
                <label for="assocTestingMethodsOverview">Association Testing Methods Overview <span class="text-red-500">*</span></label>
                <Textarea
                    v-model="formData.assoc_testing_methods_overview" id="assocTestingMethodsOverview" rows="3"
                    v-tooltip="{value: 'Please give details to be included in publication Methods; specific software and model is asked at dataset level', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-12 md:col-3">
                <label for="relatedIndividualsRemoved">Related Individuals Removed? <span class="text-red-500">*</span></label>
                <Dropdown
                    v-model="formData.related_individuals_removed" id="relatedIndividualsRemoved"
                    :options="yesNoOptions" optionLabel="label" optionValue="value"
                    placeholder="Select" :disabled="disabled"
                />
            </div>
        </div>

        <Divider />
        <h6 class="mb-1">Summary Statistics Column Headings</h6>
        <p class="text-sm text-color-secondary mb-3">Provide the column heading names used in your summary statistics files.</p>

        <div class="formgrid grid">
            <div class="field col-6 md:col-2">
                <label for="colChromosome">Chromosome <span class="text-red-500">*</span></label>
                <InputText v-model="formData.col_chromosome" id="colChromosome" type="text" :disabled="disabled" />
            </div>
            <div class="field col-6 md:col-2">
                <label for="colPosition">Position <span class="text-red-500">*</span></label>
                <InputText v-model="formData.col_position" id="colPosition" type="text" :disabled="disabled" />
            </div>
            <div class="field col-6 md:col-2">
                <label for="colEffectAllele">Effect Allele <span class="text-red-500">*</span></label>
                <InputText v-model="formData.col_effect_allele" id="colEffectAllele" type="text" :disabled="disabled" />
            </div>
            <div class="field col-6 md:col-2">
                <label for="colNonEffectAllele">Non-Effect Allele <span class="text-red-500">*</span></label>
                <InputText v-model="formData.col_non_effect_allele" id="colNonEffectAllele" type="text" :disabled="disabled" />
            </div>
            <div class="field col-6 md:col-2">
                <label for="colBeta">Beta (log OR) <span class="text-red-500">*</span></label>
                <InputText v-model="formData.col_beta" id="colBeta" type="text" :disabled="disabled" />
            </div>
            <div class="field col-6 md:col-2">
                <label for="colSe">SE <span class="text-red-500">*</span></label>
                <InputText v-model="formData.col_se" id="colSe" type="text" :disabled="disabled" />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col-6 md:col-2">
                <label for="colPvalue">P-value <span class="text-red-500">*</span></label>
                <InputText v-model="formData.col_pvalue" id="colPvalue" type="text" :disabled="disabled" />
            </div>
            <div class="field col-6 md:col-2">
                <label for="colEffectAlleleFreq">Effect AF <span class="text-red-500">*</span></label>
                <InputText v-model="formData.col_effect_allele_freq" id="colEffectAlleleFreq" type="text" :disabled="disabled" />
            </div>
            <div class="field col-6 md:col-2">
                <label for="colImputationQuality">Imputation Quality <span class="text-red-500">*</span></label>
                <InputText v-model="formData.col_imputation_quality" id="colImputationQuality" type="text" :disabled="disabled" />
            </div>
            <div class="field col-6 md:col-2">
                <label for="colVariantId">Variant ID</label>
                <InputText v-model="formData.col_variant_id" id="colVariantId" type="text" placeholder="e.g. rsID" :disabled="disabled" />
            </div>
        </div>

        <!-- Save button -->
        <div class="flex flex-column align-items-center mt-4" v-if="showSaveButton">
            <Button
                type="button"
                :label="saveButtonLabel"
                class="p-button-primary"
                @click="handleSave"
                :loading="saving"
                :disabled="!canSave"
            />
            <div v-if="!canSave" class="mt-2 text-center">
                <small class="text-color-secondary">
                    {{ validationMessage }}
                </small>
            </div>
        </div>

    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({})
    },
    disabled: {
        type: Boolean,
        default: false
    },
    showSaveButton: {
        type: Boolean,
        default: true
    },
    saveButtonLabel: {
        type: String,
        default: 'Submit'
    }
});

const emit = defineEmits(['save']);

const toast = useToast();

const publicAvailabilityOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
    { label: 'Conditional', value: 'conditional' }
];

const yesNoOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
];

const defaultFormData = {
    country_of_ascertainment: '',
    data_freeze_date: null,
    contact_person: '',
    lead_collaborator: '',
    other_contributors: '',
    acknowledgements: '',
    other_publication_requirements: '',
    summary_stats_public_availability: null,
    relevant_references: '',
    ethics_approval: '',
    study_ascertainment: '',
    coding_system: '',
    ancestry_approach: '',
    mean_age_study_entry: null,
    sd_age_study_entry: null,
    genome_build: '',
    genotyping_technology: '',
    genotyping_methods_overview: '',
    genotyping_array: '',
    genotype_calling_algorithm: '',
    pre_imputation_variant_call_rate: null,
    pre_imputation_sample_call_rate: null,
    pre_imputation_hwe_pvalue: null,
    pre_imputation_maf: null,
    pre_imputation_other_filters: '',
    imputation_software: '',
    imputation_reference_panel: '',
    imputation_quality_measure: '',
    post_imputation_quality_threshold: null,
    post_imputation_maf: null,
    post_imputation_other_filters: '',
    assoc_testing_methods_overview: '',
    related_individuals_removed: null,
    col_chromosome: '',
    col_position: '',
    col_effect_allele: '',
    col_non_effect_allele: '',
    col_beta: '',
    col_se: '',
    col_pvalue: '',
    col_effect_allele_freq: '',
    col_imputation_quality: '',
    col_variant_id: ''
};

const formData = ref({ ...defaultFormData, ...props.initialData });
const saving = ref(false);

watch(() => props.initialData, (newData) => {
    Object.assign(formData.value, newData);
}, { deep: true });

const requiredFields = [
    'country_of_ascertainment', 'data_freeze_date',
    'contact_person', 'lead_collaborator', 'acknowledgements',
    'summary_stats_public_availability', 'relevant_references',
    'ethics_approval', 'study_ascertainment', 'coding_system',
    'ancestry_approach', 'mean_age_study_entry', 'sd_age_study_entry',
    'genome_build', 'genotyping_technology', 'genotyping_methods_overview',
    'genotyping_array', 'imputation_software', 'imputation_reference_panel',
    'imputation_quality_measure', 'post_imputation_quality_threshold',
    'post_imputation_maf', 'assoc_testing_methods_overview',
    'related_individuals_removed', 'col_chromosome', 'col_position',
    'col_effect_allele', 'col_non_effect_allele', 'col_beta', 'col_se',
    'col_pvalue', 'col_effect_allele_freq', 'col_imputation_quality'
];

const fieldLabels = {
    country_of_ascertainment: 'Country or Countries of Ascertainment',
    data_freeze_date: 'Data Freeze Date',
    contact_person: 'Contact Person and Email',
    lead_collaborator: 'Lead Collaborator',
    acknowledgements: 'Acknowledgements and Funding Information',
    summary_stats_public_availability: 'Summary Stats Public Availability',
    relevant_references: 'Relevant References',
    ethics_approval: 'Details of Ethics Approval',
    study_ascertainment: 'Details of Study Ascertainment',
    coding_system: 'Coding System Used to Define Cases',
    ancestry_approach: 'Approach to Determine Participant Ancestry',
    mean_age_study_entry: 'Mean Age at Study Entry',
    sd_age_study_entry: 'Standard Deviation of Age at Study Entry',
    genome_build: 'Genome Build',
    genotyping_technology: 'Genotyping Technology',
    genotyping_methods_overview: 'Genotyping and Imputation Methods Overview',
    genotyping_array: 'Genotyping Array',
    imputation_software: 'Imputation Software and Version',
    imputation_reference_panel: 'Imputation Reference Panel',
    imputation_quality_measure: 'Imputation Quality Measure',
    post_imputation_quality_threshold: 'Post-imputation Quality Threshold',
    post_imputation_maf: 'Post-imputation MAF Threshold',
    assoc_testing_methods_overview: 'Association Testing Methods Overview',
    related_individuals_removed: 'Related Individuals Removed',
    col_chromosome: 'Chromosome column heading',
    col_position: 'Position column heading',
    col_effect_allele: 'Effect Allele column heading',
    col_non_effect_allele: 'Non-Effect Allele column heading',
    col_beta: 'Beta column heading',
    col_se: 'SE column heading',
    col_pvalue: 'P-value column heading',
    col_effect_allele_freq: 'Effect Allele Frequency column heading',
    col_imputation_quality: 'Imputation Quality Score column heading'
};

const firstMissingField = computed(() => {
    for (const field of requiredFields) {
        const val = formData.value[field];
        if (val === null || val === undefined || val === '') return field;
    }
    return null;
});

const canSave = computed(() => firstMissingField.value === null);

const validationMessage = computed(() => {
    const field = firstMissingField.value;
    if (!field) return '';
    return `${fieldLabels[field] || field} is required`;
});

async function handleSave() {
    saving.value = true;
    try {
        emit('save', { ...formData.value });
    } finally {
        saving.value = false;
    }
}

defineExpose({ formData, canSave, handleSave });
</script>
