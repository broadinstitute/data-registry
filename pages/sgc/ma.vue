<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>SGC Meta-Analysis Results</h5>
                    <Tag :value="rows.length + ' result' + (rows.length !== 1 ? 's' : '')" severity="info" />
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
                    dataKey="key"
                    :globalFilterFields="['phenotype', 'ancestry']"
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

                    <Column field="status" header="Status" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <Tag :value="data.status" :severity="statusSeverity(data.status)" />
                        </template>
                    </Column>

                    <Column field="meta_lambda_gc" header="λ (meta)" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span :class="lambdaClass(data.meta_lambda_gc)">
                                {{ data.meta_lambda_gc != null ? data.meta_lambda_gc.toFixed(3) : '—' }}
                            </span>
                        </template>
                    </Column>

                    <Column field="n_meta_variants" header="N meta variants" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.n_meta_variants != null ? data.n_meta_variants.toLocaleString() : '—' }}</span>
                        </template>
                    </Column>

                    <Column field="n_genome_wide_sig" header="n p≤5e-8" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.n_genome_wide_sig != null ? data.n_genome_wide_sig : '—' }}</span>
                        </template>
                    </Column>

                    <Column field="n_cohorts_used" header="Cohorts used" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">
                                {{ data.n_cohorts_used != null ? data.n_cohorts_used : '—' }} / {{ data.n_cohorts != null ? data.n_cohorts : '—' }}
                            </span>
                        </template>
                    </Column>

                    <Column field="updated_at" header="Updated" sortable :showFilterMenu="false">
                        <template #body="{ data }">
                            <span class="text-sm">
                                {{ data.updated_at ? new Date(data.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : '—' }}
                            </span>
                        </template>
                    </Column>

                    <template #expansion="{ data }">
                        <div v-if="data.status === 'SUCCEEDED'" class="p-3">
                            <div class="grid">
                                <div class="col-12 md:col-8">
                                    <h6>Manhattan</h6>
                                    <div v-if="resultData[data.key]?.manhattan">
                                        <Image
                                            :src="resultData[data.key].manhattan"
                                            :alt="`Manhattan ${data.phenotype} ${data.ancestry}`"
                                            preview
                                            image-class="ma-plot-img"
                                        />
                                    </div>
                                    <div v-else-if="resultData[data.key]?.loading" class="text-gray-500 text-sm">
                                        Loading Manhattan plot...
                                    </div>
                                    <div v-else-if="resultData[data.key]?.error" class="text-red-500 text-sm">
                                        Failed to load Manhattan plot.
                                    </div>
                                </div>
                                <div class="col-12 md:col-4">
                                    <h6>QQ</h6>
                                    <div v-if="resultData[data.key]?.qq">
                                        <Image
                                            :src="resultData[data.key].qq"
                                            :alt="`QQ ${data.phenotype} ${data.ancestry}`"
                                            preview
                                            image-class="ma-plot-img"
                                        />
                                    </div>
                                    <div v-else-if="resultData[data.key]?.loading" class="text-gray-500 text-sm">
                                        Loading QQ plot...
                                    </div>
                                    <div v-else-if="resultData[data.key]?.error" class="text-red-500 text-sm">
                                        Failed to load QQ plot.
                                    </div>
                                </div>
                            </div>

                            <div v-if="resultData[data.key]?.summary" class="mt-4">
                                <h6>Summary</h6>
                                <div class="grid mb-3">
                                    <div class="col-6 md:col-3">
                                        <div class="bg-blue-50 p-3" style="border-radius: 6px;">
                                            <p class="text-sm text-gray-600 mb-1">λ (meta)</p>
                                            <p class="text-xl font-bold" :class="lambdaClass(resultData[data.key].summary.meta_lambda_gc)">
                                                {{ resultData[data.key].summary.meta_lambda_gc != null ? resultData[data.key].summary.meta_lambda_gc.toFixed(3) : '—' }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-6 md:col-3">
                                        <div class="bg-green-50 p-3" style="border-radius: 6px;">
                                            <p class="text-sm text-gray-600 mb-1">N meta variants</p>
                                            <p class="text-xl font-bold text-green-700">
                                                {{ resultData[data.key].summary.n_meta_variants != null ? resultData[data.key].summary.n_meta_variants.toLocaleString() : '—' }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-6 md:col-3">
                                        <div class="bg-purple-50 p-3" style="border-radius: 6px;">
                                            <p class="text-sm text-gray-600 mb-1">n p≤5e-8</p>
                                            <p class="text-xl font-bold text-purple-700">
                                                {{ resultData[data.key].summary.n_genome_wide_sig != null ? resultData[data.key].summary.n_genome_wide_sig : '—' }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-6 md:col-3">
                                        <div class="bg-orange-50 p-3" style="border-radius: 6px;">
                                            <p class="text-sm text-gray-600 mb-1">Cohorts used</p>
                                            <p class="text-xl font-bold text-orange-700">
                                                {{ resultData[data.key].summary.n_cohorts_used != null ? resultData[data.key].summary.n_cohorts_used : '—' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <h6 v-if="resultData[data.key].summary.per_cohort?.length">Per-cohort inputs</h6>
                                <DataTable
                                    v-if="resultData[data.key].summary.per_cohort?.length"
                                    :value="resultData[data.key].summary.per_cohort"
                                    class="p-datatable-sm mb-3"
                                    responsiveLayout="scroll"
                                    stripedRows
                                >
                                    <Column field="dataset" header="Dataset">
                                        <template #body="{ data: cohort }">
                                            <span class="text-sm">{{ cohort.dataset }}</span>
                                        </template>
                                    </Column>
                                    <Column field="cases" header="Cases">
                                        <template #body="{ data: cohort }">
                                            <span class="text-sm">{{ cohort.cases != null ? cohort.cases.toLocaleString() : '—' }}</span>
                                        </template>
                                    </Column>
                                    <Column field="controls" header="Controls">
                                        <template #body="{ data: cohort }">
                                            <span class="text-sm">{{ cohort.controls != null ? cohort.controls.toLocaleString() : '—' }}</span>
                                        </template>
                                    </Column>
                                    <Column field="n_variants_in" header="N variants in">
                                        <template #body="{ data: cohort }">
                                            <span class="text-sm">{{ cohort.n_variants_in != null ? cohort.n_variants_in.toLocaleString() : '—' }}</span>
                                        </template>
                                    </Column>
                                    <Column field="n_variants_used" header="N variants used">
                                        <template #body="{ data: cohort }">
                                            <span class="text-sm">{{ cohort.n_variants_used != null ? cohort.n_variants_used.toLocaleString() : '—' }}</span>
                                        </template>
                                    </Column>
                                </DataTable>

                                <div v-if="resultData[data.key].summary.caveats?.length" class="mb-3">
                                    <h6>Caveats</h6>
                                    <ul class="pl-4 text-sm text-gray-600">
                                        <li v-for="(caveat, idx) in resultData[data.key].summary.caveats" :key="idx">{{ caveat }}</li>
                                    </ul>
                                </div>
                            </div>
                            <div v-else-if="resultData[data.key]?.loading" class="text-gray-500 text-sm mt-3">
                                Loading summary...
                            </div>

                            <div v-if="resultData[data.key]?.topLoci?.length" class="mt-3">
                                <h6>Lead loci</h6>
                                <DataTable
                                    :value="resultData[data.key].topLoci"
                                    class="p-datatable-sm"
                                    responsiveLayout="scroll"
                                    stripedRows
                                    :paginator="resultData[data.key].topLoci.length > 20"
                                    :rows="20"
                                    sortField="pvalue"
                                    :sortOrder="1"
                                >
                                    <Column field="chromosome" header="Chr" sortable>
                                        <template #body="{ data: locus }">
                                            <span class="text-sm">{{ locus.chromosome }}</span>
                                        </template>
                                    </Column>
                                    <Column field="position" header="Position" sortable>
                                        <template #body="{ data: locus }">
                                            <span class="text-sm">{{ locus.position != null ? locus.position.toLocaleString() : '—' }}</span>
                                        </template>
                                    </Column>
                                    <Column field="ref" header="Ref">
                                        <template #body="{ data: locus }">
                                            <span class="text-sm">{{ locus.ref }}</span>
                                        </template>
                                    </Column>
                                    <Column field="alt" header="Alt">
                                        <template #body="{ data: locus }">
                                            <span class="text-sm">{{ locus.alt }}</span>
                                        </template>
                                    </Column>
                                    <Column field="beta" header="Beta" sortable>
                                        <template #body="{ data: locus }">
                                            <span class="text-sm">{{ locus.beta != null ? locus.beta.toFixed(4) : '—' }}</span>
                                        </template>
                                    </Column>
                                    <Column field="pvalue" header="P-value" sortable>
                                        <template #body="{ data: locus }">
                                            <span class="text-sm">{{ locus.pvalue != null ? locus.pvalue.toExponential(2) : '—' }}</span>
                                        </template>
                                    </Column>
                                    <Column field="n_cohorts" header="N cohorts" sortable>
                                        <template #body="{ data: locus }">
                                            <span class="text-sm">{{ locus.n_cohorts != null ? locus.n_cohorts : '—' }}</span>
                                        </template>
                                    </Column>
                                    <Column field="dir_concordance" header="Dir. concordance" sortable>
                                        <template #body="{ data: locus }">
                                            <span class="text-sm">{{ locus.dir_concordance != null ? (locus.dir_concordance * 100).toFixed(0) + '%' : '—' }}</span>
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                            <div v-else-if="resultData[data.key]?.loading" class="text-gray-500 text-sm mt-3">
                                Loading lead loci...
                            </div>

                            <div class="mt-4">
                                <Button
                                    :label="downloading[data.key] ? 'Preparing download...' : 'Download meta.tsv.gz'"
                                    icon="pi pi-download"
                                    severity="secondary"
                                    outlined
                                    size="small"
                                    :disabled="downloading[data.key]"
                                    @click="downloadMeta(data)"
                                />
                            </div>
                        </div>
                        <div v-else class="p-3">
                            <p class="text-gray-500 text-sm">{{ data.error_message || 'No meta-analysis results available yet.' }}</p>
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
const resultData = ref({});
const downloading = ref({});

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phenotype: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ancestry: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

// Top-loci rows come back from the API as dicts of strings (parsed straight off
// the TSV); coerce the numeric fields so sorting/formatting works correctly.
function parseLocusRow(row) {
    return {
        ...row,
        position: row.position !== null && row.position !== undefined ? Number(row.position) : null,
        beta: row.beta !== null && row.beta !== undefined ? Number(row.beta) : null,
        pvalue: row.pvalue !== null && row.pvalue !== undefined ? Number(row.pvalue) : null,
        n_cohorts: row.n_cohorts !== null && row.n_cohorts !== undefined ? Number(row.n_cohorts) : null,
        dir_concordance: row.dir_concordance !== null && row.dir_concordance !== undefined ? Number(row.dir_concordance) : null,
    };
}

function onRowCollapse(event) {
    delete resultData.value[event.data.key];
}

// Load plots + summary + top-loci when a row is expanded
async function onRowExpand(event) {
    const row = event.data;
    const key = row.key;
    if (row.status !== 'SUCCEEDED') return;
    if (resultData.value[key]?.loading) return;
    if (resultData.value[key]?.manhattan && resultData.value[key]?.qq && resultData.value[key]?.summary && resultData.value[key]?.topLoci) return;

    resultData.value[key] = { ...(resultData.value[key] ?? {}), loading: true, error: false };

    const { phenotype, ancestry } = row;
    try {
        const [manhattanResp, qqResp, summaryResp, topLociResp] = await Promise.all([
            sgcAxios.get(`/api/sgc/ma/results/${phenotype}/${ancestry}/manhattan`),
            sgcAxios.get(`/api/sgc/ma/results/${phenotype}/${ancestry}/qq`),
            sgcAxios.get(`/api/sgc/ma/results/${phenotype}/${ancestry}/summary`),
            sgcAxios.get(`/api/sgc/ma/results/${phenotype}/${ancestry}/top-loci`),
        ]);

        resultData.value[key] = {
            loading: false,
            error: false,
            manhattan: manhattanResp.data.url,
            qq:        qqResp.data.url,
            summary:   summaryResp.data,
            topLoci:   (topLociResp.data || []).map(parseLocusRow),
        };
    } catch (error) {
        console.error(`Error loading meta-analysis results for ${phenotype}/${ancestry}:`, error);
        resultData.value[key] = { ...(resultData.value[key] ?? {}), loading: false, error: true, manhattan: null, qq: null, summary: null, topLoci: null };
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load meta-analysis results. Please try again.',
            life: 5000
        });
    }
}

// Presign + open the meta.tsv.gz download in a new tab
async function downloadMeta(row) {
    const key = row.key;
    downloading.value[key] = true;
    try {
        const resp = await sgcAxios.get(`/api/sgc/ma/results/${row.phenotype}/${row.ancestry}/meta`);
        window.open(resp.data.url, '_blank');
    } catch (error) {
        console.error(`Error downloading meta.tsv.gz for ${row.phenotype}/${row.ancestry}:`, error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to generate download link. Please try again.',
            life: 5000
        });
    } finally {
        downloading.value[key] = false;
    }
}

// Load meta-analysis results list
async function loadMAResults() {
    loading.value = true;
    try {
        const { data } = await sgcAxios.get('/api/sgc/ma/results');
        rows.value = data.map(row => ({ ...row, key: `${row.phenotype}_${row.ancestry}` }));
    } catch (error) {
        console.error('Error loading meta-analysis results:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load meta-analysis results. Please try again.',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadMAResults();
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

:deep(.ma-plot-img) {
    max-width: 100%;
    height: auto;
    cursor: zoom-in;
}
</style>
