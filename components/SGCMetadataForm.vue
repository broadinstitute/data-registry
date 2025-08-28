<template>
    <div class="card p-fluid">
        <h5>{{ title }}</h5>
        <div class="field">
            <label for="uploadSetName">Name *</label>
            <InputText 
                v-model="formData.name" 
                id="uploadSetName" 
                type="text"
                v-tooltip="'A unique name to identify cohort'"
                :disabled="disabled"
            />
        </div>
        
        <div class="formgrid grid">
            <div class="field col-4">
                <label for="totalSampleSize">Total Sample Size *</label>
                <InputNumber 
                    v-model="formData.total_sample_size" 
                    id="totalSampleSize" 
                    :min="0"
                    v-tooltip="'Total number of individuals in the study'"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-4">
                <label for="numberOfMales">Number of Males *</label>
                <InputNumber 
                    v-model="formData.number_of_males" 
                    id="numberOfMales" 
                    :min="0"
                    v-tooltip="'Total number of male participants'"
                    :disabled="disabled"
                />
            </div>
            <div class="field col-4">
                <label for="numberOfFemales">Number of Females *</label>
                <InputNumber 
                    v-model="formData.number_of_females" 
                    id="numberOfFemales" 
                    :min="0"
                    v-tooltip="'Total number of female participants'"
                    :disabled="disabled"
                />
            </div>
        </div>
        
        <div class="text-center mt-4" v-if="showSaveButton">
            <div v-if="!metadataSaved">
                <Button
                    type="button"
                    :label="saveButtonLabel"
                    class="p-button-primary"
                    :icon="saveButtonIcon"
                    @click="handleSave"
                    :loading="saving"
                    :disabled="!canSave"
                />
                <small v-if="!canSave" class="block text-gray-500 mt-2">
                    {{ validationMessage }}
                </small>
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
            number_of_females: null
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

// Reactive data
const formData = ref({ ...props.initialData });
const saving = ref(false);
const metadataSaved = ref(false);
const originalData = ref({ ...props.initialData });

// Watch for prop changes
watch(() => props.initialData, (newData) => {
    formData.value = { ...newData };
    originalData.value = { ...newData };
}, { deep: true });

// Computed
// Check if form data has changed from original
const hasChanges = computed(() => {
    return formData.value.name?.trim() !== originalData.value.name?.trim() ||
           formData.value.total_sample_size !== originalData.value.total_sample_size ||
           formData.value.number_of_males !== originalData.value.number_of_males ||
           formData.value.number_of_females !== originalData.value.number_of_females;
});

const canSave = computed(() => {
    return hasChanges.value &&
           formData.value.name?.trim() &&
           formData.value.total_sample_size !== null && formData.value.total_sample_size > 0 &&
           formData.value.number_of_males !== null && formData.value.number_of_males >= 0 &&
           formData.value.number_of_females !== null && formData.value.number_of_females >= 0 &&
           (formData.value.number_of_males + formData.value.number_of_females === formData.value.total_sample_size);
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
            number_of_females: formData.value.number_of_females
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
