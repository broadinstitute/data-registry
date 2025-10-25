<template>

    <div class="grid" v-if="showNotification">
        <div class="col-6 col-offset-3">
            <Message
                :severity="notificationSeverity"
                :closable="false"
                :sticky="true"
            >{{ notificationMessage }}</Message>
        </div>
    </div>

    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>Manage Phenotypes</h5>
                    <div class="flex gap-2">
                        <Button
                            label="Download Table"
                            icon="pi pi-download"
                            class="p-button-secondary"
                            outlined
                            @click="downloadPhenotypes"
                        />
                        <Button
                            v-can="'sgc-review-data'"
                            label="Add New Phenotype"
                            icon="pi pi-plus"
                            class="p-button-primary"
                            @click="showAddDialog = true"
                        />
                    </div>
                </div>

                <DataTable 
                    :value="phenotypes" 
                    :paginator="true" 
                    :rows="50"
                    :loading="loading"
                    responsiveLayout="scroll"
                    stripedRows
                    class="p-datatable-sm"
                    :globalFilterFields="['phenotype_code', 'description']"
                    v-model:filters="filters"
                    filterDisplay="row"
                >
                    <Column field="phenotype_code" header="Phenotype Code" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="font-medium">{{ data.phenotype_code }}</span>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText 
                                v-model="filterModel.value" 
                                type="text" 
                                @input="filterCallback()" 
                                class="p-column-filter" 
                                placeholder="Search by code"
                            />
                        </template>
                    </Column>
                    <Column field="description" header="Description" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span>{{ data.description }}</span>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText 
                                v-model="filterModel.value" 
                                type="text" 
                                @input="filterCallback()" 
                                class="p-column-filter" 
                                placeholder="Search by description"
                            />
                        </template>
                    </Column>
                    <Column :exportable="false" :showFilterMenu="false" :sortable="false">
                        <template #body="{ data }">
                            <Button 
                                v-can="'sgc-review-data'"
                                icon="pi pi-trash" 
                                class="p-button-rounded p-button-text p-button-danger p-button-sm" 
                                @click="confirmDelete(data)"
                                v-tooltip="'Delete phenotype'"
                            />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <!-- Add New Phenotype Dialog -->
    <Dialog 
        :visible="showAddDialog" 
        :modal="true" 
        header="Add New Phenotype" 
        :closable="true"
        @hide="closeDialog"
        :style="{ width: '450px' }"
    >
        <div class="field">
            <label for="phenotype-code" class="block text-900 font-medium mb-2">Phenotype Code *</label>
            <InputText 
                id="phenotype-code"
                v-model="formData.code" 
                class="w-full" 
                placeholder="e.g., T2D, CAD, etc."
                :class="{ 'p-invalid': formErrors.code }"
            />
            <small v-if="formErrors.code" class="p-error">{{ formErrors.code }}</small>
        </div>
        
        <div class="field">
            <label for="phenotype-description" class="block text-900 font-medium mb-2">Description *</label>
            <Textarea 
                id="phenotype-description"
                v-model="formData.description" 
                class="w-full" 
                rows="3"
                placeholder="Enter phenotype description"
                :class="{ 'p-invalid': formErrors.description }"
            />
            <small v-if="formErrors.description" class="p-error">{{ formErrors.description }}</small>
        </div>

        <template #footer>
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                class="p-button-text" 
                @click="closeDialog"
            />
            <Button 
                label="Create" 
                icon="pi pi-plus"
                class="p-button-primary" 
                @click="savePhenotype"
                :loading="saving"
            />
        </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
        :visible="showDeleteDialog" 
        :modal="true" 
        header="Confirm Deletion" 
        :closable="true"
        @hide="showDeleteDialog = false"
        :style="{ width: '450px' }"
    >
        <div class="flex align-items-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--yellow-500)"></i>
            <span>Are you sure you want to delete the phenotype <strong>{{ phenotypeToDelete?.phenotype_code }}</strong>? This action cannot be undone.</span>
        </div>

        <template #footer>
            <Button 
                label="Cancel" 
                icon="pi pi-times" 
                class="p-button-text" 
                @click="showDeleteDialog = false"
            />
            <Button 
                label="Delete" 
                icon="pi pi-trash"
                class="p-button-danger" 
                @click="deletePhenotype"
                :loading="deleting"
            />
        </template>
    </Dialog>

    <Toast position="top-center" />
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';
import { useDatasetStore } from "~/stores/DatasetStore";

definePageMeta({
  layout: 'sgc'
});

const toast = useToast();
const store = useDatasetStore();
const config = useRuntimeConfig();

// Reactive data
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const showAddDialog = ref(false);
const showDeleteDialog = ref(false);
const showNotification = ref(false);
const notificationSeverity = ref('info');
const notificationMessage = ref('');

const editingPhenotype = ref(null);
const phenotypeToDelete = ref(null);

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phenotype_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Form data
const formData = ref({
    code: '',
    description: ''
});

const formErrors = ref({
    code: '',
    description: ''
});

// Phenotypes data from API
const phenotypes = ref([]);

// Methods
async function loadPhenotypes() {
    loading.value = true;
    
    try {
        const data = await store.fetchSGCPhenotypes();
        phenotypes.value = data;
    } catch (error) {
        console.error('Error loading phenotypes:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load phenotypes. Please try again.',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
}

function confirmDelete(phenotype) {
    phenotypeToDelete.value = phenotype;
    showDeleteDialog.value = true;
}

async function deletePhenotype() {
    deleting.value = true;
    
    try {
        await store.deleteSGCPhenotype(phenotypeToDelete.value.phenotype_code);
        
        // Remove from local data
        const index = phenotypes.value.findIndex(p => p.phenotype_code === phenotypeToDelete.value.phenotype_code);
        if (index !== -1) {
            phenotypes.value.splice(index, 1);
        }
        
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Phenotype "${phenotypeToDelete.value.phenotype_code}" deleted successfully`,
            life: 3000
        });
        
        showDeleteDialog.value = false;
        phenotypeToDelete.value = null;
        
    } catch (error) {
        console.error('Error deleting phenotype:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete phenotype. Please try again.',
            life: 5000
        });
    } finally {
        deleting.value = false;
    }
}

function validateForm() {
    clearFormErrors();
    let isValid = true;
    
    if (!formData.value.code.trim()) {
        formErrors.value.code = 'Phenotype code is required';
        isValid = false;
    } else if (formData.value.code.length > 20) {
        formErrors.value.code = 'Phenotype code must be 20 characters or less';
        isValid = false;
    } else {
        // Check for duplicate codes
        const existingPhenotype = phenotypes.value.find(p => 
            p.phenotype_code.toLowerCase() === formData.value.code.toLowerCase()
        );
        if (existingPhenotype) {
            formErrors.value.code = 'This phenotype code already exists';
            isValid = false;
        }
    }
    
    if (!formData.value.description.trim()) {
        formErrors.value.description = 'Description is required';
        isValid = false;
    } else if (formData.value.description.length > 500) {
        formErrors.value.description = 'Description must be 500 characters or less';
        isValid = false;
    }
    
    return isValid;
}

function clearFormErrors() {
    formErrors.value = {
        code: '',
        description: ''
    };
}

async function savePhenotype() {
    if (!validateForm()) {
        return;
    }
    
    saving.value = true;
    
    try {
        const phenotypeData = {
            phenotype_code: formData.value.code,
            description: formData.value.description
        };
        
        const newPhenotype = await store.createSGCPhenotype(phenotypeData);
        
        const localPhenotype = {
            phenotype_code: newPhenotype.phenotype_code || phenotypeData.phenotype_code,
            description: newPhenotype.description || phenotypeData.description
        };
        
        phenotypes.value.unshift(localPhenotype);
        
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Phenotype created successfully',
            life: 3000
        });
        
        closeDialog();
        
    } catch (error) {
        console.error('Error saving phenotype:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save phenotype. Please try again.',
            life: 5000
        });
    } finally {
        saving.value = false;
    }
}

function closeDialog() {
    showAddDialog.value = false;
    editingPhenotype.value = null;
    formData.value = {
        code: '',
        description: ''
    };
    clearFormErrors();
}

function downloadPhenotypes() {
    const apiBaseUrl = config.public.apiBaseUrl;
    const downloadUrl = `${apiBaseUrl}/api/sgc/phenotypes/download`;
    window.open(downloadUrl, '_blank');
}

// Load phenotypes when component mounts
onMounted(() => {
    loadPhenotypes();
});

// Hide notification after 5 seconds
watch(showNotification, (newValue) => {
    if (newValue) {
        setTimeout(() => {
            showNotification.value = false;
        }, 5000);
    }
});
</script>

<style scoped>
.p-error {
    color: var(--red-500);
    font-size: 0.875rem;
}

.field {
    margin-bottom: 1.5rem;
}

.p-invalid {
    border-color: var(--red-500);
}
</style>