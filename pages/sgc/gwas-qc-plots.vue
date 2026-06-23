<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>GWAS QC Plots</h5>
                    <Tag :value="rows.length + ' file' + (rows.length !== 1 ? 's' : '')" severity="info" />
                </div>

                <DataTable
                    :value="rows"
                    :paginator="true"
                    :rows="50"
                    :loading="loading"
                    responsiveLayout="scroll"
                    stripedRows
                    class="p-datatable-sm"
                    v-model:expandedRows="expanded"
                    v-model:filters="filters"
                    filterDisplay="row"
                    dataKey="file_id"
                    :globalFilterFields="['phenotype', 'ancestry', 'dataset', 'file_name']"
                    @row-expand="onRowExpand"
                    @row-collapse="onRowCollapse"
                >
                    <Column :expander="true" style="width: 3rem" />

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

                    <Column field="dataset" header="Dataset" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.dataset }}</span>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText
                                v-model="filterModel.value"
                                type="text"
                                @input="filterCallback()"
                                class="p-column-filter"
                                placeholder="Search dataset"
                            />
                        </template>
                    </Column>

                    <Column field="file_name" header="File" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.file_name }}</span>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputText
                                v-model="filterModel.value"
                                type="text"
                                @input="filterCallback()"
                                class="p-column-filter"
                                placeholder="Search file"
                            />
                        </template>
                    </Column>

                    <Column field="status" header="Status" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <Tag :value="data.status" :severity="statusSeverity(data.status)" />
                        </template>
                    </Column>

                    <Column field="cases" header="Cases" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.cases != null ? data.cases.toLocaleString() : '—' }}</span>
                        </template>
                    </Column>

                    <Column field="controls" header="Controls" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.controls != null ? data.controls.toLocaleString() : '—' }}</span>
                        </template>
                    </Column>

                    <Column field="lambda_gc" header="λ_GC" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span :class="lambdaClass(data.lambda_gc)">
                                {{ data.lambda_gc != null ? data.lambda_gc.toFixed(3) : '—' }}
                            </span>
                        </template>
                    </Column>

                    <Column field="lambda_1000" header="λ₁₀₀₀" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span :class="lambdaClass(data.lambda_1000)">
                                {{ data.lambda_1000 != null ? data.lambda_1000.toFixed(3) : '—' }}
                            </span>
                        </template>
                    </Column>

                    <Column field="lambda_maf01" header="λ (MAF≥1%)" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span :class="lambdaClass(data.lambda_maf01)">
                                {{ data.lambda_maf01 != null ? data.lambda_maf01.toFixed(3) : '—' }}
                            </span>
                        </template>
                    </Column>

                    <Column field="ldsc_intercept" sortable :showFilterMenu="false">
                        <template #header>
                            <span
                                title="Univariate LDSC intercept. ≈1: no confounding; >1: residual confounding/stratification. Distinguishes confounding from polygenicity, which inflates λ but leaves the intercept near 1."
                            >
                                LDSC Intercept
                            </span>
                        </template>
                        <template #body="{ data }">
                            <span :class="interceptClass(data.ldsc_intercept)">
                                {{ data.ldsc_intercept != null ? data.ldsc_intercept.toFixed(3) : '—' }}
                            </span>
                        </template>
                    </Column>

                    <Column field="ldsc_n_snps" sortable :showFilterMenu="false">
                        <template #header>
                            <span
                                title="Number of variants that entered the univariate LDSC regression — after merging with the LD reference panel and filtering (N ≥ 90th-percentile and χ² outlier removal). Distinct from total N variants in the file."
                            >
                                LDSC N variants
                            </span>
                        </template>
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.ldsc_n_snps != null ? data.ldsc_n_snps.toLocaleString() : '—' }}</span>
                        </template>
                    </Column>

                    <Column field="n_variants" header="N variants" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.n_variants != null ? data.n_variants.toLocaleString() : '—' }}</span>
                        </template>
                    </Column>

                    <Column field="n_sig_5e8" header="n p≤5e-8" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.n_sig_5e8 != null ? data.n_sig_5e8 : '—' }}</span>
                        </template>
                    </Column>

                    <Column field="n_sig_1e5" header="n p≤1e-5" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.n_sig_1e5 != null ? data.n_sig_1e5 : '—' }}</span>
                        </template>
                    </Column>

                    <template #expansion="{ data }">
                        <div v-if="data.status === 'SUCCEEDED'" class="grid p-3">
                            <div class="col-12 md:col-8">
                                <h6>Manhattan</h6>
                                <div v-if="plotUrls[data.file_id]?.manhattan">
                                    <Image
                                        :src="plotUrls[data.file_id].manhattan"
                                        :alt="`Manhattan ${data.file_name}`"
                                        preview
                                        image-class="qc-plot-img"
                                    />
                                </div>
                                <div v-else-if="plotUrls[data.file_id]?.loading" class="text-gray-500 text-sm">
                                    Loading Manhattan plot...
                                </div>
                                <div v-else-if="plotUrls[data.file_id]?.error" class="text-red-500 text-sm">
                                    Failed to load Manhattan plot.
                                </div>
                            </div>
                            <div class="col-12 md:col-4">
                                <h6>QQ</h6>
                                <div v-if="plotUrls[data.file_id]?.qq">
                                    <Image
                                        :src="plotUrls[data.file_id].qq"
                                        :alt="`QQ ${data.file_name}`"
                                        preview
                                        image-class="qc-plot-img"
                                    />
                                </div>
                                <div v-else-if="plotUrls[data.file_id]?.loading" class="text-gray-500 text-sm">
                                    Loading QQ plot...
                                </div>
                                <div v-else-if="plotUrls[data.file_id]?.error" class="text-red-500 text-sm">
                                    Failed to load QQ plot.
                                </div>
                            </div>
                        </div>
                        <div v-else class="p-3">
                            <p class="text-gray-500 text-sm">{{ data.error_message || 'No plots available yet.' }}</p>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>

    <Toast position="top-center" />
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';

definePageMeta({
    layout: 'sgc'
});

const toast = useToast();
const config = useRuntimeConfig();

// Set up authenticated axios instance for SGC (mirrors DatasetStore pattern)
const sgcAxios = useSGCAxios(config, undefined, (error) => {
    return Promise.reject(error);
});

// Reactive data
const rows = ref([]);
const expanded = ref([]);
const loading = ref(false);
const plotUrls = ref({});

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phenotype: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ancestry: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dataset: { value: null, matchMode: FilterMatchMode.CONTAINS },
    file_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Status severity mapping
function statusSeverity(status) {
    switch (status) {
        case 'SUCCEEDED': return 'success';
        case 'FAILED':    return 'danger';
        case 'RUNNING':   return 'info';
        default:          return 'warning';
    }
}

// Lambda GC conditional color: red+bold if outside 0.95–1.10, green otherwise
function lambdaClass(l) {
    if (l === null || l === undefined) return '';
    if (l < 0.95 || l > 1.10) return 'text-red-600 font-bold';
    return 'text-green-700';
}

// LDSC intercept color: ~1 is ideal; >1.10 flags residual confounding/stratification.
function interceptClass(v) {
    if (v === null || v === undefined) return '';
    if (v > 1.10) return 'text-red-600 font-bold';
    return 'text-green-700';
}

function onRowCollapse(event) {
    delete plotUrls.value[event.data.file_id];
}

// Load presigned plot URLs when a row is expanded
async function onRowExpand(event) {
    const fileId = event.data.file_id;
    if (event.data.status !== 'SUCCEEDED') return;
    if (plotUrls.value[fileId]?.loading) return;
    if (plotUrls.value[fileId]?.manhattan && plotUrls.value[fileId]?.qq) return;

    plotUrls.value[fileId] = { ...(plotUrls.value[fileId] ?? {}), loading: true, error: false };

    try {
        const [manhattanResp, qqResp] = await Promise.all([
            sgcAxios.get(`/api/sgc/qc/plots/${fileId}/manhattan`),
            sgcAxios.get(`/api/sgc/qc/plots/${fileId}/qq`),
        ]);

        plotUrls.value[fileId] = {
            loading: false,
            error: false,
            manhattan: manhattanResp.data.url,
            qq:        qqResp.data.url,
        };
    } catch (error) {
        console.error(`Error loading plots for file ${fileId}:`, error);
        plotUrls.value[fileId] = { ...(plotUrls.value[fileId] ?? {}), loading: false, error: true, manhattan: null, qq: null };
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load plots. Please try again.',
            life: 5000
        });
    }
}

// Load QC plot results list
async function loadQCPlots() {
    loading.value = true;
    try {
        const { data } = await sgcAxios.get('/api/sgc/qc/plots');
        rows.value = data;
    } catch (error) {
        console.error('Error loading GWAS QC plots:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load GWAS QC plots. Please try again.',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadQCPlots();
});
</script>

<style scoped>
/* PrimeVue <Image> renders the <img> inside a child component, so a plain
   scoped selector never reaches it — use :deep(). Its wrapper <span class="p-image">
   defaults to inline-block, which leaves the img at natural size; force it to
   block so the img's max-width:100% resolves against the column width. */
:deep(.p-image) {
    display: block;
    max-width: 100%;
}

:deep(.qc-plot-img) {
    max-width: 100%;
    height: auto;
    cursor: zoom-in;
}
</style>
