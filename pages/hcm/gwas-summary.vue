<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>HCM GWAS Files Summary</h5>
                    <div class="flex align-items-center gap-3">
                        <Button
                            v-if="isReviewer"
                            label="Lift GRCh37 → GRCh38"
                            icon="pi pi-refresh"
                            outlined
                            :loading="runningLiftover"
                            @click="runLiftoverAll"
                        />
                        <Tag :value="gwasFiles.length + ' file' + (gwasFiles.length !== 1 ? 's' : '')" severity="info" />
                    </div>
                </div>

                <DataTable
                    :value="gwasFiles"
                    :paginator="true"
                    :rows="50"
                    :loading="loading"
                    responsiveLayout="scroll"
                    stripedRows
                    class="p-datatable-sm"
                    :globalFilterFields="['cohort_name', 'sarc', 'ancestry', 'sex', 'genome_build', 'liftover_status', 'software', 'analyst', 'uploaded_by']"
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
                            <div class="flex align-items-center gap-2">
                                <span class="text-sm">{{ data.genome_build }}</span>
                                <Tag :value="data.liftover_status" :severity="hcmBuildStatusSeverity(data.liftover_status)" />
                                <Button
                                    v-if="data.liftover_status === 'Lifted to GRCh38'"
                                    icon="pi pi-download"
                                    label="Unmapped"
                                    text
                                    size="small"
                                    @click="downloadUnmapped(data.id)"
                                />
                            </div>
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
import { useUserStore } from "~/stores/UserStore";

definePageMeta({
  layout: 'hcm'
});

const toast = useToast();
const store = useDatasetStore();
const userStore = useUserStore();
const config = useRuntimeConfig();

// Set up authenticated axios instance for HCM (mirrors hcm/ma.vue's pattern)
const hcmAxios = useHCMAxios(config, undefined, (error) => {
    return Promise.reject(error);
});

const isReviewer = computed(() => {
    const user = userStore.user;
    if (!user) return false;
    const roleNames = user.roles?.map(role => role.name || role) || [];
    return roleNames.includes('hcm-reviewer') || roleNames.includes('admin');
});

// Reactive data
const loading = ref(false);
const runningLiftover = ref(false);

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

// Submit a wave of liftover jobs for all HCM files needing it, then refresh the table.
async function runLiftoverAll() {
    runningLiftover.value = true;
    try {
        const { data } = await hcmAxios.post('/api/hcm/liftover/run-all');
        const unrecognizedDetail = data.unrecognized ? `, ${data.unrecognized} unrecognized` : '';
        toast.add({
            severity: 'success',
            summary: 'Liftover submitted',
            detail: `Submitted ${data.submitted}, ${data.remaining} remaining${unrecognizedDetail}`,
            life: 6000,
        });
        await loadGWASSummary();  // submitted files now read as "In progress"
    } catch (error) {
        console.error('Error running HCM liftover:', error);
        if (error.response?.status === 403) {
            toast.add({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You need reviewer permissions to run liftover.',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to submit liftover jobs. Please try again.',
                life: 5000,
            });
        }
    } finally {
        runningLiftover.value = false;
    }
}

// Presign + open the unmapped-variants file for a lifted HCM GWAS file.
async function downloadUnmapped(fileId) {
    try {
        const { data } = await hcmAxios.get(`/api/hcm/liftover/${fileId}/unmapped-url`);
        if (data.presigned_url) window.open(data.presigned_url, '_blank');
    } catch (error) {
        console.error(`Error downloading unmapped variants for ${fileId}:`, error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to download unmapped variants. Please try again.',
            life: 5000,
        });
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
