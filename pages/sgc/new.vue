<template>
    <div class="grid">
        <div class="col mb-4">
            <h2 class="text-center mb-4">
                Create New SGC Upload Set
            </h2>
        </div>
    </div>

    <div class="grid">
        <div class="col-12">
            <SGCMetadataForm 
                title="Upload Information"
                :redirect-after-save="true"
                save-button-label="Create Upload Set"
                save-button-icon="bi-plus-circle"
                @saved="handleMetadataSaved"
            />
        </div>
    </div>

    <Toast position="top-center" group="default"/>
</template>

<script setup>
definePageMeta({
  layout: 'sgc'
});

// Handle metadata saved event (for any additional logic if needed)
function handleMetadataSaved(response) {
    console.log('Metadata saved:', response);
    // The SGCMetadataForm will handle the redirect
}
</script>