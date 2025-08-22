<template>
    <div class="grid">
        <div class="col mb-4">
            <h2 class="text-center mb-4">
                Edit SGC Upload Set
            </h2>
        </div>
    </div>

    <div class="grid" v-if="store.showNotification">
        <div class="col-6 col-offset-3">
            <Message
                severity="success"
                :closable="true"
                :sticky="true"
                @close="store.showNotification = false"
            >Metadata saved successfully. You can now upload files.</Message>
        </div>
    </div>

    <!-- Cohort Metadata Form -->
    <div class="grid">
        <div class="col-12">
            <div v-if="loading" class="text-center p-4">
                <ProgressSpinner />
                <p>Loading cohort information...</p>
            </div>
            <SGCMetadataForm 
                v-else
                title="Cohort Information"
                :initial-data="cohortData"
                :redirect-after-save="false"
                save-button-label="Update Metadata"
                save-button-icon="bi-pencil"
                success-message="Metadata updated successfully"
                @updated="handleMetadataUpdated"
            />
        </div>
    </div>

    <!-- File Upload Section - Copy from new.vue but simplified -->
    <div class="grid" v-if="cohortData">
        <div class="col-12">
            <div class="card p-fluid">
                <h5>Upload Files</h5>
                <p class="text-sm mb-4">
                    Upload all three required files for this cohort. All files must be tab-delimited .txt files.
                </p>
                
                <!-- TODO: Copy the accordion and file upload sections from new.vue -->
                <div class="text-center p-4">
                    <i class="pi pi-upload" style="font-size: 3rem; color: var(--primary-color)"></i>
                    <h6 class="mt-3">File upload functionality coming soon</h6>
                    <p class="text-gray-600">The file upload sections will be implemented here</p>
                </div>
            </div>
        </div>
    </div>

    <Toast position="top-center" group="default"/>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDatasetStore } from "~/stores/DatasetStore";

definePageMeta({
  layout: 'sgc'
});

const toast = useToast();
const route = useRoute();
const store = useDatasetStore();

// Get the cohort ID from the route
const cohortId = route.params.id;

// Reactive data
const loading = ref(true);
const cohortData = ref(null);

// Show success message if coming from new page
onMounted(async () => {
    // Show success notification
    store.showNotification = true;
    
    try {
        // TODO: Load cohort data by ID
        // cohortData.value = await store.fetchSGCCohort(cohortId);
        
        // Simulate API call for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        cohortData.value = {
            name: "Sample Cohort",
            total_sample_size: 1000,
            number_of_males: 450,
            number_of_females: 550
        };
        
    } catch (error) {
        console.error('Error loading cohort:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load cohort information',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
});

// Handle metadata update
function handleMetadataUpdated(response) {
    console.log('Metadata updated:', response);
    // Optionally reload cohort data or update local state
    cohortData.value = {
        ...cohortData.value,
        name: response.name,
        // Add other fields as needed
    };
}
</script>

<style scoped>
.field label {
    font-weight: 600;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.field p {
    margin: 0;
    font-size: 1rem;
}
</style>