<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>GWAS Files Summary</h5>
                    <Tag :value="gwasFiles.length + ' file' + (gwasFiles.length !== 1 ? 's' : '')" severity="info" />
                </div>

                <DataTable 
                    :value="gwasFiles" 
                    :paginator="true" 
                    :rows="50"
                    :loading="loading"
                    responsiveLayout="scroll"
                    stripedRows
                    class="p-datatable-sm"
                    :globalFilterFields="['phenotype', 'ancestry', 'dataset']"
                    v-model:filters="filters"
                    filterDisplay="row"
                >
                    <Column field="phenotype" header="Phenotype" sortable :showFilterMenu="false" frozen>
                        <template #body="{ data }">
                            <span class="font-medium">{{ data.phenotype }}</span>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText 
                                v-model="filterModel.value" 
                                type="text" 
                                @input="filterCallback()" 
                                class="p-column-filter" 
                                placeholder="Search phenotype"
                            />
                        </template>
                    </Column>
                    
                    <Column field="ancestry" header="Ancestry" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <Tag :value="data.ancestry" severity="secondary" />
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText 
                                v-model="filterModel.value" 
                                type="text" 
                                @input="filterCallback()" 
                                class="p-column-filter" 
                                placeholder="Search ancestry"
                            />
                        </template>
                    </Column>

                    <Column field="cases" header="Cases" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span v-if="data.cases !== null" class="text-sm">{{ formatNumber(data.cases) }}</span>
                            <span v-else class="text-gray-400 text-sm">-</span>
                        </template>
                    </Column>

                    <Column field="controls" header="Controls" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span v-if="data.controls !== null" class="text-sm">{{ formatNumber(data.controls) }}</span>
                            <span v-else class="text-gray-400 text-sm">-</span>
                        </template>
                    </Column>

                    <Column field="dataset" header="Dataset" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.dataset }}</span>
                        </template>
                    </Column>

                    <Column field="file_name" header="File Name" :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.file_name }}</span>
                        </template>
                    </Column>

                    <Column field="uploaded_at" header="Uploaded" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">
                                {{ new Date(data.uploaded_at).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric'
                                }) }}
                            </span>
                        </template>
                    </Column>

                    <Column field="uploaded_by" header="Uploaded By" :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.uploaded_by }}</span>
                        </template>
                    </Column>
                </DataTable>

                <!-- Summary Statistics -->
                <div class="mt-6 pt-6" style="border-top: 1px solid var(--surface-300);">
                    <h6 class="mb-4">Summary Statistics</h6>
                    <div class="grid">
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="bg-blue-50 p-4" style="border-radius: 6px;">
                                <p class="text-sm text-gray-600 mb-1">Total Files</p>
                                <p class="text-2xl font-bold text-blue-700">{{ gwasFiles.length }}</p>
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="bg-green-50 p-4" style="border-radius: 6px;">
                                <p class="text-sm text-gray-600 mb-1">Unique Phenotypes</p>
                                <p class="text-2xl font-bold text-green-700">{{ uniquePhenotypes.size }}</p>
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="bg-purple-50 p-4" style="border-radius: 6px;">
                                <p class="text-sm text-gray-600 mb-1">Unique Ancestries</p>
                                <p class="text-2xl font-bold text-purple-700">{{ uniqueAncestries.size }}</p>
                            </div>
                        </div>
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="bg-orange-50 p-4" style="border-radius: 6px;">
                                <p class="text-sm text-gray-600 mb-1">Total Cases</p>
                                <p class="text-2xl font-bold text-orange-700">{{ formatNumber(totalCases) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

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

// Reactive data
const loading = ref(false);

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phenotype: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ancestry: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dataset: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// GWAS files data from API
const gwasFiles = ref([]);

// Computed properties for summary statistics
const uniquePhenotypes = computed(() => {
    return new Set(gwasFiles.value.map(f => f.phenotype));
});

const uniqueAncestries = computed(() => {
    return new Set(gwasFiles.value.map(f => f.ancestry));
});

const totalCases = computed(() => {
    return gwasFiles.value
        .filter(f => f.cases !== null)
        .reduce((sum, f) => sum + f.cases, 0);
});

// Methods
async function loadGWASSummary() {
    loading.value = true;
    
    try {
        const data = await store.fetchGWASSummary();
        gwasFiles.value = data;
    } catch (error) {
        console.error('Error loading GWAS summary:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load GWAS summary. Please try again.',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
}

// Utility function to format numbers with commas
function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US').format(num);
}

// Load GWAS summary when component mounts
onMounted(() => {
    loadGWASSummary();
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
