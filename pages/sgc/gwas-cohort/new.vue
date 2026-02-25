<template>
    <div class="grid">
        <div class="col mb-4">
            <h2 class="text-center mb-4">Register GWAS Cohort</h2>
            <Message class="no-icon">
                This form collects cohort-level information required for GWAS submission to the Skin Genetics Consortium.
                Please complete all required fields. For guidance, contact us at
                <a href="mailto:info@skingeneticsconsortium.org">info@skingeneticsconsortium.org</a>
            </Message>
        </div>
    </div>

    <div class="grid">
        <div class="col-12">
            <SGCGWASCohortForm
                save-button-label="Submit Cohort"
                @save="handleSave"
            />
        </div>
    </div>

    <Toast position="top-center" />
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useDatasetStore } from "~/stores/DatasetStore";

definePageMeta({
    layout: 'sgc'
});

const toast = useToast();
const router = useRouter();
const store = useDatasetStore();

async function handleSave(formData) {
    try {
        const payload = {
            name: formData.cohort_name,
            metadata: formData
        };
        await store.submitSGCGWASCohort(payload);
        toast.add({
            severity: 'success',
            summary: 'Cohort Submitted',
            detail: 'Your GWAS cohort has been saved successfully.',
            life: 4000
        });
        await router.push('/sgc');
    } catch (error) {
        const detail = error.response?.data?.detail || 'Failed to save cohort. Please try again.';
        toast.add({
            severity: 'error',
            summary: 'Submission Error',
            detail,
            life: 6000
        });
    }
}
</script>

<style scoped>
.no-icon svg.p-message-icon {
    display: none !important;
}
</style>
