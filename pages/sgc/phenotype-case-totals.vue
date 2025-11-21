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
                    <h5>Phenotype Case Totals</h5>
                </div>

                <DataTable 
                    :value="phenotypeCaseTotals" 
                    :paginator="true" 
                    :rows="50"
                    :loading="loading"
                    responsiveLayout="scroll"
                    stripedRows
                    class="p-datatable-sm"
                    :globalFilterFields="['phenotype_code']"
                    v-model:filters="filters"
                    filterDisplay="row"
                >
                    <Column field="phenotype_code" header="Phenotype Code" sortable :showFilterMenu="false" frozen>
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
                    
                    <!-- Male columns -->
                    <Column field="male_cases" header="Male Cases" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            {{ formatNumber(data.male_cases) }}
                        </template>
                    </Column>
                    <Column field="male_controls" header="Male Controls" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            {{ formatNumber(data.male_controls) }}
                        </template>
                    </Column>
                    <Column field="male_num_cohorts" header="Male Cohorts" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            {{ data.male_num_cohorts }}
                        </template>
                    </Column>
                    
                    <!-- Female columns -->
                    <Column field="female_cases" header="Female Cases" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            {{ formatNumber(data.female_cases) }}
                        </template>
                    </Column>
                    <Column field="female_controls" header="Female Controls" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            {{ formatNumber(data.female_controls) }}
                        </template>
                    </Column>
                    <Column field="female_num_cohorts" header="Female Cohorts" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            {{ data.female_num_cohorts }}
                        </template>
                    </Column>
                    
                    <!-- Both columns -->
                    <Column field="both_cases" header="Both Cases" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            {{ formatNumber(data.both_cases) }}
                        </template>
                    </Column>
                    <Column field="both_controls" header="Both Controls" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            {{ formatNumber(data.both_controls) }}
                        </template>
                    </Column>
                    <Column field="both_num_cohorts" header="Both Cohorts" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            {{ data.both_num_cohorts }}
                        </template>
                    </Column>
                </DataTable>
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
const showNotification = ref(false);
const notificationSeverity = ref('info');
const notificationMessage = ref('');

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phenotype_code: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Phenotype case totals data from API
const phenotypeCaseTotals = ref([]);

// Methods
async function loadPhenotypeCaseTotals() {
    loading.value = true;
    
    try {
        const data = await store.fetchSGCPhenotypeCaseCountsBySex();
        phenotypeCaseTotals.value = data;
    } catch (error) {
        console.error('Error loading phenotype case totals:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load phenotype case totals. Please try again.',
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

// Load phenotype case totals when component mounts
onMounted(() => {
    loadPhenotypeCaseTotals();
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