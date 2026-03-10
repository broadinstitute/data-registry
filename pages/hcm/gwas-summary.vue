<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>HCM GWAS Files Summary</h5>
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
                    :globalFilterFields="['cohort_name', 'sarc', 'ancestry', 'sex', 'genome_build', 'software', 'analyst', 'uploaded_by']"
                    v-model:filters="filters"
                    filterDisplay="row"
                >
                    <Column field="cohort_name" header="Cohort" sortable :showFilterMenu="false" frozen>
                        <template #body="{ data }">
                            <span class="font-medium">{{ data.cohort_name }}</span>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText
                                v-model="filterModel.value"
                                type="text"
                                @input="filterCallback()"
                                class="p-column-filter"
                                placeholder="Search cohort"
                            />
                        </template>
                    </Column>

                    <Column field="sarc" header="SARC" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <Tag :value="data.sarc" severity="secondary" />
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText
                                v-model="filterModel.value"
                                type="text"
                                @input="filterCallback()"
                                class="p-column-filter"
                                placeholder="Search SARC"
                            />
                        </template>
                    </Column>

                    <Column field="ancestry" header="Ancestry" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <Tag :value="data.ancestry" severity="info" />
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

                    <Column field="sex" header="Sex" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.sex }}</span>
                        </template>
                    </Column>

                    <Column field="genome_build" header="Build" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.genome_build }}</span>
                        </template>
                    </Column>

                    <Column field="software" header="Software" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.software }}</span>
                        </template>
                    </Column>

                    <Column field="analyst" header="Analyst" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.analyst }}</span>
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

                    <Column field="file_name" header="File Name" :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm" style="word-break: break-all;">{{ data.file_name }}</span>
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

                    <Column field="uploaded_by" header="Uploaded By" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.uploaded_by }}</span>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText
                                v-model="filterModel.value"
                                type="text"
                                @input="filterCallback()"
                                class="p-column-filter"
                                placeholder="Search uploader"
                            />
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
                                <p class="text-sm text-gray-600 mb-1">Unique Cohorts</p>
                                <p class="text-2xl font-bold text-green-700">{{ uniqueCohorts.size }}</p>
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
  layout: 'hcm'
});

const toast = useToast();
const store = useDatasetStore();

// Reactive data
const loading = ref(false);

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cohort_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sarc: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ancestry: { value: null, matchMode: FilterMatchMode.CONTAINS },
    uploaded_by: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// GWAS files data from API
const gwasFiles = ref([]);

// Computed properties for summary statistics
const uniqueCohorts = computed(() => {
    return new Set(gwasFiles.value.map(f => f.cohort_name));
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
        const data = await store.fetchHCMGWASSummary();
        gwasFiles.value = data;
    } catch (error) {
        console.error('Error loading HCM GWAS summary:', error);

        if (error.response?.status === 403) {
            toast.add({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You need reviewer permissions to view the GWAS summary.',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load GWAS summary. Please try again.',
                life: 5000
            });
        }
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
