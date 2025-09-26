<template>
    <div class="card p-fluid">
        <div class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="uploadSetName">Cohort Name</label>
                <InputText
                    v-model="formData.name"
                    id="uploadSetName"
                    type="text"
                    v-tooltip="{value: 'A unique name to identify cohort', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-12 md:col-6">
                <label for="totalSampleSize">Total Sample Size</label>
                <InputNumber
                    v-model="formData.total_sample_size"
                    id="totalSampleSize"
                    :min="0"
                    v-tooltip="{value: 'Total number of individuals in the study', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
        </div>
        
        <div class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="numberOfMales">Number of Males</label>
                <InputNumber
                    v-model="formData.number_of_males"
                    id="numberOfMales"
                    :min="0"
                    v-tooltip="{value: 'Total number of male participants', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-12 md:col-6">
                <label for="numberOfFemales">Number of Females</label>
                <InputNumber
                    v-model="formData.number_of_females"
                    id="numberOfFemales"
                    :min="0"
                    v-tooltip="{value: 'Total number of female participants', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
        </div>
        
        <div class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="phenotypeCodingSystem">Phenotype coding system used by cohort</label>
                <InputText
                    v-model="formData.phenotype_coding_system"
                    id="phenotypeCodingSystem"
                    type="text"
                    v-tooltip="{value: 'The coding system used for phenotype data (e.g., ICD-10, SNOMED CT, etc.)', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-12 md:col-6">
                <label for="industryAuthorship">Will industry partners be authors on any resulting publication</label>
                <Dropdown 
                    v-model="formData.industry_authorship" 
                    id="industryAuthorship" 
                    :options="yesNoOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Yes or No"
                    :disabled="disabled"
                />
            </div>
        </div>
        
        <div class="formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="phenotypeMappingIssues">Were there any issues during phenotype mapping. If yes please explain</label>
                <Textarea
                    v-model="formData.phenotype_mapping_issues"
                    id="phenotypeMappingIssues"
                    rows="2"
                    v-tooltip="{value: 'Describe any issues encountered during phenotype mapping or enter None if no issues', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-12 md:col-6">
                <label for="industryInvolvement">Is there any industry involvement in your data generation/project. If yes, please describe</label>
                <Textarea
                    v-model="formData.industry_involvement"
                    id="industryInvolvement"
                    rows="2"
                    v-tooltip="{value: 'Describe any industry partnerships or involvement, or enter None if no industry involvement', position: 'top'}"
                    :disabled="disabled"
                />
            </div>
        </div>
        
        <div class="field">
            <label for="dataRestrictions">Are there any restrictions on this data being made publicly available either before or after publication. If yes please describe</label>
            <Textarea
                v-model="formData.data_restrictions"
                id="dataRestrictions"
                rows="2"
                v-tooltip="{value: 'Describe any restrictions on public data availability, or enter None if no restrictions', position: 'top'}"
                :disabled="disabled"
            />
        </div>
        
        <div class="flex flex-column align-items-center mt-4" v-if="showSaveButton">
            <div v-if="!metadataSaved">
                <Button
                    type="button"
                    :label="saveButtonLabel"
                    class="p-button-primary"
                    @click="handleSave"
                    :loading="saving"
                    :disabled="!canSave"
                />
                <div v-if="!canSave" class="mt-2 text-center">
                    <small class="text-gray-500">
                        {{ validationMessage }}
                    </small>
                </div>
            </div>
            <div v-else class="flex align-items-center justify-content-center">
                <i class="pi pi-check-circle text-green-500 mr-2" style="font-size: 1.2rem"></i>
                <span class="text-green-600 font-medium">{{ successMessage }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDatasetStore } from "~/stores/DatasetStore";
import { nextTick } from 'vue';

// Props
const props = defineProps({
    title: {
        type: String,
        default: 'Upload Information'
    },
    initialData: {
        type: Object,
        default: () => ({
            name: '',
            total_sample_size: null,
            number_of_males: null,
            number_of_females: null,
            phenotype_coding_system: '',
            phenotype_mapping_issues: '',
            industry_involvement: '',
            industry_authorship: null,
            data_restrictions: ''
        })
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
        default: 'Save Metadata'
    },
    saveButtonIcon: {
        type: String,
        default: 'bi-save'
    },
    successMessage: {
        type: String,
        default: 'Metadata saved successfully'
    },
    redirectAfterSave: {
        type: Boolean,
        default: false
    }
});

// Emits
const emit = defineEmits(['saved', 'updated']);

const toast = useToast();
const router = useRouter();
const store = useDatasetStore();

// Yes/No options for dropdowns
const yesNoOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
];

// Reactive data
const formData = ref({ ...props.initialData });
const saving = ref(false);
const metadataSaved = ref(false);
const originalData = ref({ ...props.initialData });

// Watch for prop changes
watch(() => props.initialData, (newData, oldData) => {
    console.log('SGCMetadataForm: Props changed, updating form data:', newData);
    console.log('SGCMetadataForm: Old data was:', oldData);
    
    // Only update if the data has actually changed
    if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
        // Use nextTick to ensure DOM updates properly
        nextTick(() => {
            // Update each property individually to avoid losing component state
            Object.keys(newData).forEach(key => {
                if (formData.value[key] !== newData[key]) {
                    console.log(`Updating ${key}: ${formData.value[key]} -> ${newData[key]}`);
                    formData.value[key] = newData[key];
                }
            });
            
            // Update original data
            originalData.value = { ...newData };
        });
    }
}, { deep: true });

// Computed
// Check if form data has changed from original
const hasChanges = computed(() => {
    return formData.value.name?.trim() !== originalData.value.name?.trim() ||
           formData.value.total_sample_size !== originalData.value.total_sample_size ||
           formData.value.number_of_males !== originalData.value.number_of_males ||
           formData.value.number_of_females !== originalData.value.number_of_females ||
           formData.value.phenotype_coding_system?.trim() !== originalData.value.phenotype_coding_system?.trim() ||
           formData.value.phenotype_mapping_issues?.trim() !== originalData.value.phenotype_mapping_issues?.trim() ||
           formData.value.industry_involvement?.trim() !== originalData.value.industry_involvement?.trim() ||
           formData.value.industry_authorship !== originalData.value.industry_authorship ||
           formData.value.data_restrictions?.trim() !== originalData.value.data_restrictions?.trim();
});

const canSave = computed(() => {
    return hasChanges.value &&
           formData.value.name?.trim() &&
           formData.value.total_sample_size !== null && formData.value.total_sample_size > 0 &&
           formData.value.number_of_males !== null && formData.value.number_of_males >= 0 &&
           formData.value.number_of_females !== null && formData.value.number_of_females >= 0 &&
           (formData.value.number_of_males + formData.value.number_of_females === formData.value.total_sample_size) &&
           formData.value.phenotype_coding_system?.trim() &&
           formData.value.phenotype_mapping_issues?.trim() &&
           formData.value.industry_involvement?.trim() &&
           formData.value.industry_authorship !== null &&
           formData.value.data_restrictions?.trim();
});

const validationMessage = computed(() => {
    if (!hasChanges.value) {
        return 'No changes to save';
    }
    if (!formData.value.name?.trim()) {
        return 'Upload Set Name is required';
    }
    if (formData.value.total_sample_size === null || formData.value.total_sample_size <= 0) {
        return 'Total Sample Size must be greater than 0';
    }
    if (formData.value.number_of_males === null || formData.value.number_of_males < 0) {
        return 'Number of Males is required and must be 0 or greater';
    }
    if (formData.value.number_of_females === null || formData.value.number_of_females < 0) {
        return 'Number of Females is required and must be 0 or greater';
    }
    if (formData.value.number_of_males !== null && formData.value.number_of_females !== null && formData.value.total_sample_size !== null) {
        if (formData.value.number_of_males + formData.value.number_of_females !== formData.value.total_sample_size) {
            return `Males (${formData.value.number_of_males}) + Females (${formData.value.number_of_females}) must equal Total Sample Size (${formData.value.total_sample_size})`;
        }
    }
    if (!formData.value.phenotype_coding_system?.trim()) {
        return 'Phenotype coding system is required';
    }
    if (!formData.value.phenotype_mapping_issues?.trim()) {
        return 'Phenotype mapping issues field is required';
    }
    if (!formData.value.industry_involvement?.trim()) {
        return 'Industry involvement field is required';
    }
    if (formData.value.industry_authorship === null) {
        return 'Industry authorship selection is required';
    }
    if (!formData.value.data_restrictions?.trim()) {
        return 'Data restrictions field is required';
    }
    return 'All fields are valid';
});

// Methods
function validateDemographicFields() {
    const errors = [];
    
    if (formData.value.total_sample_size === null || formData.value.total_sample_size <= 0) {
        errors.push('Total sample size is required and must be greater than 0');
    }
    
    if (formData.value.number_of_males === null || formData.value.number_of_males < 0) {
        errors.push('Number of males is required and must be 0 or greater');
    }
    
    if (formData.value.number_of_females === null || formData.value.number_of_females < 0) {
        errors.push('Number of females is required and must be 0 or greater');
    }
    
    if (formData.value.number_of_males !== null && formData.value.number_of_females !== null && formData.value.total_sample_size !== null) {
        if (formData.value.number_of_males + formData.value.number_of_females !== formData.value.total_sample_size) {
            errors.push('Number of males plus females must equal total sample size');
        }
    }
    
    if (errors.length > 0) {
        toast.add({
            severity: 'error',
            summary: 'Demographic Field Errors',
            detail: errors.join('; '),
            life: 5000
        });
        return false;
    }
    
    return true;
}

async function handleSave() {
    if (!validateDemographicFields()) return;
    
    saving.value = true;
    
    try {
        const cohortData = {
            name: formData.value.name.trim(),
            total_sample_size: formData.value.total_sample_size,
            number_of_males: formData.value.number_of_males,
            number_of_females: formData.value.number_of_females,
            cohort_metadata: {
                phenotype_coding_system: formData.value.phenotype_coding_system.trim(),
                phenotype_mapping_issues: formData.value.phenotype_mapping_issues.trim(),
                industry_involvement: formData.value.industry_involvement.trim(),
                industry_authorship: formData.value.industry_authorship,
                data_restrictions: formData.value.data_restrictions.trim()
            }
        };
        
        // Include the ID if we're updating an existing cohort
        if (formData.value.id) {
            cohortData.id = formData.value.id;
        }
        
        const response = await store.upsertSGCCohort(cohortData);
        metadataSaved.value = true;
        
        // Reset the success message after 2 seconds
        setTimeout(() => {
            metadataSaved.value = false;
        }, 2000);
        
        // Emit events for parent components
        emit('saved', response);
        
        if (props.redirectAfterSave) {
            // Redirect to edit page with the cohort ID
            await router.replace(`/sgc/edit/${response.cohort_id}`);
        } else {
            toast.add({
                severity: 'success',
                summary: 'Metadata Updated',
                detail: 'Cohort metadata has been updated successfully.',
                life: 3000
            });
            emit('updated', response);
        }
        
    } catch (error) {
        console.error('Error saving metadata:', error);
        console.error('Error structure:', {
            response: error.response,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            fullError: error
        });
        
        let errorDetail = 'Failed to save metadata. Please try again.';
        
        if (error.status === 400 || error.response?.status === 400) {
            // Server returned validation errors - check both error.data and error.response.data
            const errorData = error.data || error.response?.data;
            
            if (typeof errorData === 'string') {
                errorDetail = errorData;
            } else if (errorData?.detail) {
                errorDetail = errorData.detail;
            } else if (errorData?.message) {
                errorDetail = errorData.message;
            }
        } else if (error.message) {
            errorDetail = error.message;
        }
        
        console.log('Final error message:', errorDetail);
        
        toast.add({
            severity: 'error',
            summary: 'Save Error',
            detail: errorDetail,
            life: 5000
        });
    } finally {
        saving.value = false;
    }
}

// Expose form data for parent components
defineExpose({
    formData,
    canSave,
    handleSave
});
</script>
