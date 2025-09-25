<template>
    <div class="grid">
        <div class="col mb-4">
            <h2 class="text-center mb-4">
                Create New SGC Cohort
            </h2>
            <Message class="no-icon">
                This is the portal for upload of phase 0 data to the Skin Genetics Consortium. 
                In this phase, we are collecting meta-data regarding case numbers for diseases of interest 
                which will be used to decide which conditions are viable for GWAS. For guidance on how to 
                generate any of these files, please refer to our analysis plan or contact us at 
                <a href="mailto:info@skingeneticsconsortium.org">info@skingeneticsconsortium.org</a>
            </Message>
        </div>
    </div>

    <div class="grid">
        <div class="col-12">
            <SGCMetadataForm 
                title="Upload Information"
                :redirect-after-save="true"
                save-button-label="Create Cohort"
                @saved="handleMetadataSaved"
            />
        </div>
    </div>

    <!-- Error Modal -->
    <Dialog
        v-model:visible="store.showNotification"
        modal
        header="Error"
        :style="{ width: '500px' }"
        :closable="true"
        @hide="store.showNotification = false"
    >
        <div class="flex align-items-center">
            <i class="pi pi-exclamation-triangle text-red-500 mr-3" style="font-size: 2rem"></i>
            <span class="text-lg">{{ store.errorMessage }}</span>
        </div>
        
        <template #footer>
            <Button
                label="OK"
                icon="pi pi-check"
                @click="store.showNotification = false"
                autofocus
            />
        </template>
    </Dialog>

    <Toast position="top-center" group="default"/>
</template>

<script setup>
import { useDatasetStore } from "~/stores/DatasetStore";

definePageMeta({
  layout: 'sgc'
});

const store = useDatasetStore();

// Handle metadata saved event (for any additional logic if needed)
function handleMetadataSaved(response) {
    console.log('Metadata saved:', response);
    // The SGCMetadataForm will handle the redirect
}
</script>

<style scoped>
  .no-icon svg.p-message-icon {
    display: none !important;
  }
</style>
