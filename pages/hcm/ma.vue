<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <div class="flex align-items-center gap-3">
                        <h5 class="m-0">Launch Meta-Analysis</h5>
                        <Tag :value="files.length + ' file' + (files.length !== 1 ? 's' : '')" severity="info" />
                    </div>
                </div>

                <DataTable
                    :value="files"
                    :paginator="true"
                    :rows="50"
                    :loading="loadingFiles"
                    responsiveLayout="scroll"
                    stripedRows
                    class="p-datatable-sm mb-4"
                    dataKey="file_id"
                    :rowClass="fileRowClass"
                >
                    <Column headerStyle="width: 3rem">
                        <template #body="{ data }">
                            <Checkbox
                                :modelValue="selectedIds.includes(data.file_id)"
                                :binary="true"
                                :disabled="disabledIds.has(data.file_id)"
                                @update:modelValue="checked => toggleFile(data.file_id, checked)"
                            />
                        </template>
                    </Column>

                    <Column field="cohort_name" header="Cohort" sortable>
                        <template #body="{ data }">
                            <span class="font-medium">{{ data.cohort_name }}</span>
                        </template>
                    </Column>

                    <Column field="sarc" header="SARC" sortable>
                        <template #body="{ data }">
                            <Tag v-if="data.sarc" :value="data.sarc" severity="secondary" />
                            <span v-else class="text-gray-400 text-sm">&mdash;</span>
                        </template>
                    </Column>

                    <Column field="ancestry" header="Ancestry" sortable>
                        <template #body="{ data }">
                            <Tag v-if="data.ancestry" :value="data.ancestry" severity="info" />
                            <span v-else class="text-gray-400 text-sm">&mdash;</span>
                        </template>
                    </Column>

                    <Column field="sex" header="Sex" sortable>
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.sex ?? '&mdash;' }}</span>
                        </template>
                    </Column>

                    <Column field="genome_build" header="Build" sortable>
                        <template #body="{ data }">
                            <div class="flex align-items-center gap-2">
                                <span class="text-sm">{{ data.genome_build ?? 'unknown' }}</span>
                                <Tag
                                    v-if="!data.eligible"
                                    value="needs liftover — coming soon"
                                    severity="warning"
                                />
                            </div>
                        </template>
                    </Column>

                    <Column header="Cases / Controls">
                        <template #body="{ data }">
                            <span class="text-sm">
                                {{ data.cases != null ? data.cases.toLocaleString() : '—' }}
                                /
                                {{ data.controls != null ? data.controls.toLocaleString() : '—' }}
                            </span>
                        </template>
                    </Column>
                </DataTable>

                <div class="formgrid grid">
                    <div class="field col-12 md:col-6">
                        <label class="text-sm font-medium block mb-1">Run label (optional)</label>
                        <InputText v-model="runLabel" class="w-full" placeholder="e.g. core cohorts, GRCh38 only" />
                    </div>
                </div>

                <Panel header="Advanced" toggleable v-model:collapsed="advancedCollapsed" class="mb-4">
                    <div class="formgrid grid">
                        <div class="field col-6 md:col-3">
                            <label class="text-sm font-medium block mb-1">MAF min</label>
                            <InputNumber v-model="mafMin" class="w-full" :minFractionDigits="0" :maxFractionDigits="4" :min="0" :max="1" />
                        </div>
                        <div class="field col-6 md:col-3">
                            <label class="text-sm font-medium block mb-1">INFO min</label>
                            <InputNumber v-model="infoMin" class="w-full" :minFractionDigits="0" :maxFractionDigits="4" :min="0" :max="1" />
                        </div>
                    </div>
                </Panel>

                <div class="flex align-items-center gap-3">
                    <Button
                        label="Run meta-analysis"
                        icon="pi pi-play"
                        :disabled="selectedCohortCount < 2 || launching"
                        :loading="launching"
                        @click="launchRun"
                    />
                    <span class="text-sm text-gray-500">
                        {{ selectedCohortCount }} distinct cohort{{ selectedCohortCount === 1 ? '' : 's' }} selected
                        (need at least 2)
                    </span>
                </div>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <div class="flex align-items-center gap-3">
                        <h5 class="m-0">Meta-Analysis Results</h5>
                        <Tag :value="rows.length + ' result' + (rows.length !== 1 ? 's' : '')" severity="info" />
                    </div>
                </div>

                <DataTable
                    :value="rows"
                    :paginator="true"
                    :rows="50"
                    :loading="loadingResults"
                    responsiveLayout="scroll"
                    stripedRows
                    class="p-datatable-sm"
                    v-model:expandedRows="expanded"
                    dataKey="id"
                    @row-expand="onRowExpand"
                    @row-collapse="onRowCollapse"
                >
                    <Column :expander="true" style="width: 3rem" />

                    <Column header="Run" style="min-width: 15rem">
                        <template #body="{ data }">
                            <div class="flex flex-column gap-1">
                                <span class="text-sm font-medium">{{ maRunLabel(data) }}</span>
                                <span class="text-xs text-gray-500">
                                    {{ data.dataset_file_ids?.length ?? '—' }} cohort{{ (data.dataset_file_ids?.length ?? 0) === 1 ? '' : 's' }}
                                </span>
                            </div>
                        </template>
                    </Column>

                    <Column field="status" header="Status" sortable>
                        <template #body="{ data }">
                            <Tag :value="data.status" :severity="maStatusSeverity(data.status)" />
                        </template>
                    </Column>

                    <Column header="MAF / INFO">
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.maf_min ?? '—' }} / {{ data.info_min ?? '—' }}</span>
                        </template>
                    </Column>

                    <Column field="meta_lambda_gc" header="λ (meta)" sortable>
                        <template #body="{ data }">
                            <span :class="lambdaClass(data.meta_lambda_gc)">
                                {{ data.meta_lambda_gc != null ? data.meta_lambda_gc.toFixed(3) : '—' }}
                            </span>
                        </template>
                    </Column>

                    <Column field="n_meta_variants" header="N meta variants" sortable>
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.n_meta_variants != null ? data.n_meta_variants.toLocaleString() : '—' }}</span>
                        </template>
                    </Column>

                    <Column field="n_genome_wide_sig" header="n p≤5e-8" sortable>
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.n_genome_wide_sig != null ? data.n_genome_wide_sig : '—' }}</span>
                        </template>
                    </Column>

                    <Column field="n_cohorts_used" header="Cohorts used" sortable>
                        <template #body="{ data }">
                            <span class="text-sm">
                                {{ data.n_cohorts_used != null ? data.n_cohorts_used : '—' }} / {{ data.n_cohorts != null ? data.n_cohorts : '—' }}
                            </span>
                        </template>
                    </Column>

                    <Column field="created_at" header="Created" sortable>
                        <template #body="{ data }">
                            <span class="text-sm">{{ formatDate(data.created_at, true) }}</span>
                        </template>
                    </Column>

                    <template #expansion="{ data }">
                        <div v-if="data.status === 'SUCCEEDED'" class="p-3">
                            <div class="grid">
                                <div class="col-12 md:col-6">
                                    <h6>Manhattan</h6>
                                    <div v-if="resultData[data.id]?.manhattan">
                                        <Image
                                            :src="resultData[data.id].manhattan"
                                            :alt="`Manhattan plot for run ${data.id}`"
                                            preview
                                            image-class="ma-plot-img"
                                        />
                                    </div>
                                    <div v-else-if="resultData[data.id]?.loading" class="text-gray-500 text-sm">
                                        Loading Manhattan plot...
                                    </div>
                                    <div v-else-if="resultData[data.id]?.error" class="text-red-500 text-sm">
                                        Failed to load Manhattan plot.
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <h6>QQ</h6>
                                    <div v-if="resultData[data.id]?.qq">
                                        <Image
                                            :src="resultData[data.id].qq"
                                            :alt="`QQ plot for run ${data.id}`"
                                            preview
                                            image-class="ma-plot-img"
                                        />
                                    </div>
                                    <div v-else-if="resultData[data.id]?.loading" class="text-gray-500 text-sm">
                                        Loading QQ plot...
                                    </div>
                                    <div v-else-if="resultData[data.id]?.error" class="text-red-500 text-sm">
                                        Failed to load QQ plot.
                                    </div>
                                </div>
                            </div>

                            <div v-if="resultData[data.id]?.summary" class="mt-4">
                                <h6 v-if="resultData[data.id].summary.per_cohort?.length">Per-cohort inputs</h6>
                                <DataTable
                                    v-if="resultData[data.id].summary.per_cohort?.length"
                                    :value="resultData[data.id].summary.per_cohort"
                                    :rowClass="perCohortRowClass"
                                    class="p-datatable-sm mb-3"
                                    responsiveLayout="scroll"
                                    stripedRows
                                >
                                    <Column field="cohort" header="Cohort">
                                        <template #body="{ data: cohort }">
                                            <span class="text-sm font-medium">{{ cohort.cohort || '—' }}</span>
                                        </template>
                                    </Column>
                                    <Column field="dataset" header="Dataset">
                                        <template #body="{ data: cohort }">
                                            <span class="text-sm">{{ cohort.dataset || '—' }}</span>
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
                                    <Column header="Status">
                                        <template #body="{ data: cohort }">
                                            <span v-if="cohort.skipped">
                                                <Tag value="Skipped" severity="warning" />
                                                <span class="ml-2 text-sm text-gray-600">{{ cohort.reason }}</span>
                                            </span>
                                            <span v-else class="text-sm text-green-700">Used</span>
                                        </template>
                                    </Column>
                                </DataTable>

                                <div v-if="resultData[data.id].summary.caveats?.length" class="mb-3">
                                    <h6>Caveats</h6>
                                    <ul class="pl-4 text-sm text-gray-600">
                                        <li v-for="(caveat, idx) in resultData[data.id].summary.caveats" :key="idx">{{ caveat }}</li>
                                    </ul>
                                </div>
                            </div>

                            <div v-if="resultData[data.id]?.topLoci?.length" class="mt-3">
                                <h6>Lead loci</h6>
                                <DataTable
                                    :value="resultData[data.id].topLoci"
                                    class="p-datatable-sm"
                                    responsiveLayout="scroll"
                                    stripedRows
                                    :paginator="resultData[data.id].topLoci.length > 20"
                                    :rows="20"
                                    sortField="pvalue"
                                    :sortOrder="1"
                                >
                                    <Column field="chromosome" header="Chr" sortable>
                                        <template #body="{ data: locus }"><span class="text-sm">{{ locus.chromosome }}</span></template>
                                    </Column>
                                    <Column field="position" header="Position" sortable>
                                        <template #body="{ data: locus }"><span class="text-sm">{{ locus.position != null ? locus.position : '—' }}</span></template>
                                    </Column>
                                    <Column field="ref" header="Ref">
                                        <template #body="{ data: locus }"><span class="text-sm">{{ locus.ref }}</span></template>
                                    </Column>
                                    <Column field="alt" header="Alt">
                                        <template #body="{ data: locus }"><span class="text-sm">{{ locus.alt }}</span></template>
                                    </Column>
                                    <Column field="beta" header="Beta" sortable>
                                        <template #body="{ data: locus }"><span class="text-sm">{{ locus.beta != null ? locus.beta.toFixed(4) : '—' }}</span></template>
                                    </Column>
                                    <Column field="pvalue" header="P-value" sortable>
                                        <template #body="{ data: locus }"><span class="text-sm">{{ locus.pvalue != null ? locus.pvalue.toExponential(2) : '—' }}</span></template>
                                    </Column>
                                    <Column field="n_cohorts" header="N cohorts" sortable>
                                        <template #body="{ data: locus }"><span class="text-sm">{{ locus.n_cohorts != null ? locus.n_cohorts : '—' }}</span></template>
                                    </Column>
                                    <Column field="dir_concordance" header="Dir. concordance" sortable>
                                        <template #body="{ data: locus }"><span class="text-sm">{{ locus.dir_concordance != null ? (locus.dir_concordance * 100).toFixed(0) + '%' : '—' }}</span></template>
                                    </Column>
                                </DataTable>
                            </div>

                            <div class="mt-4 flex gap-2 flex-wrap">
                                <Button
                                    label="Download meta.tsv.gz"
                                    icon="pi pi-download"
                                    severity="secondary"
                                    outlined
                                    size="small"
                                    :disabled="downloading[`${data.id}:meta`]"
                                    @click="downloadArtifact(data, 'meta')"
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

definePageMeta({
    layout: 'hcm'
});

const toast = useToast();
const config = useRuntimeConfig();

// Set up authenticated axios instance for HCM (mirrors sgc/ma.vue's pattern)
const hcmAxios = useHCMAxios(config, undefined, (error) => {
    return Promise.reject(error);
});

// --- Eligible files + launch form --------------------------------------

const files = ref([]);
const loadingFiles = ref(false);
const selectedIds = ref([]);
const runLabel = ref('');
const advancedCollapsed = ref(true);
const mafMin = ref(0.005);
const infoMin = ref(0.3);
const launching = ref(false);

// disabledFileIds/maStatusSeverity/maRunLabel are auto-imported from utils/hcmMa.js
const disabledIds = computed(() => disabledFileIds(files.value, selectedIds.value));

const selectedCohortCount = computed(() => {
    const idSet = new Set(selectedIds.value);
    return new Set(files.value.filter(f => idSet.has(f.file_id)).map(f => f.cohort_name)).size;
});

function fileRowClass(data) {
    return data.eligible ? '' : 'text-gray-400';
}

function toggleFile(fileId, checked) {
    if (checked) {
        if (!selectedIds.value.includes(fileId)) selectedIds.value = [...selectedIds.value, fileId];
    } else {
        selectedIds.value = selectedIds.value.filter(id => id !== fileId);
    }
}

async function loadEligibleFiles() {
    loadingFiles.value = true;
    try {
        const { data } = await hcmAxios.get('/api/hcm/ma/eligible-files');
        files.value = data || [];
    } catch (error) {
        console.error('Error loading HCM MA eligible files:', error);
        if (error.response?.status === 403) {
            toast.add({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You need reviewer permissions to launch a meta-analysis.',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load eligible files. Please try again.',
                life: 5000
            });
        }
    } finally {
        loadingFiles.value = false;
    }
}

async function launchRun() {
    if (selectedCohortCount.value < 2 || launching.value) return;
    launching.value = true;
    try {
        const { data } = await hcmAxios.post('/api/hcm/ma/run', {
            file_ids: [...selectedIds.value],
            label: runLabel.value.trim() || undefined,
            maf_min: mafMin.value ?? 0.005,
            info_min: infoMin.value ?? 0.3,
        });
        toast.add({
            severity: 'success',
            summary: 'Launched',
            detail: `Meta-analysis launched (run ${data.run_id})`,
            life: 5000
        });
        selectedIds.value = [];
        runLabel.value = '';
        await loadResults();
    } catch (error) {
        console.error('Error launching HCM meta-analysis:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.response?.data?.detail || 'Failed to launch meta-analysis. Please try again.',
            life: 5000
        });
    } finally {
        launching.value = false;
    }
}

// --- Results table + plots ----------------------------------------------

const rows = ref([]);
const expanded = ref([]);
const loadingResults = ref(false);
const resultData = ref({});
const downloading = ref({});

// Lambda GC conditional color: red+bold if outside 0.95–1.10, green otherwise
function lambdaClass(l) {
    if (l === null || l === undefined) return '';
    if (l < 0.95 || l > 1.10) return 'text-red-600 font-bold';
    return 'text-green-700';
}

function formatDate(value, withTime = false) {
    if (!value) return '—';
    const opts = { year: 'numeric', month: 'short', day: 'numeric' };
    if (withTime) {
        opts.hour = '2-digit';
        opts.minute = '2-digit';
    }
    return new Date(value).toLocaleDateString('en-US', opts);
}

function onRowCollapse(event) {
    delete resultData.value[event.data.id];
}

// Parse a top-loci row (the endpoint returns all-string cells) into typed numbers.
function parseLocusRow(row) {
    return {
        ...row,
        position: row.position != null ? Number(row.position) : null,
        beta: row.beta != null ? Number(row.beta) : null,
        pvalue: row.pvalue != null ? Number(row.pvalue) : null,
        n_cohorts: row.n_cohorts != null ? Number(row.n_cohorts) : null,
        dir_concordance: row.dir_concordance != null ? Number(row.dir_concordance) : null,
    };
}

// Mute skipped per-cohort rows so they read as excluded from the meta.
function perCohortRowClass(cohort) {
    return cohort.skipped ? 'text-gray-400' : '';
}

// Load Manhattan + QQ plots, per-cohort inputs, caveats, and lead loci when a SUCCEEDED row is expanded
async function onRowExpand(event) {
    const row = event.data;
    const id = row.id;
    if (row.status !== 'SUCCEEDED') return;
    if (resultData.value[id]?.loading) return;
    if (resultData.value[id]?.manhattan && resultData.value[id]?.qq
        && resultData.value[id]?.summary && resultData.value[id]?.topLoci) return;

    resultData.value[id] = { ...(resultData.value[id] ?? {}), loading: true, error: false };

    try {
        const [manhattanResp, qqResp, summaryResp, topLociResp] = await Promise.all([
            hcmAxios.get(`/api/hcm/ma/runs/${id}/manhattan`),
            hcmAxios.get(`/api/hcm/ma/runs/${id}/qq`),
            hcmAxios.get(`/api/hcm/ma/runs/${id}/summary`),
            hcmAxios.get(`/api/hcm/ma/runs/${id}/top-loci`),
        ]);
        resultData.value[id] = {
            loading: false,
            error: false,
            manhattan: manhattanResp.data.url,
            qq: qqResp.data.url,
            summary: summaryResp.data,
            topLoci: (topLociResp.data || []).map(parseLocusRow),
        };
    } catch (error) {
        console.error(`Error loading plots for HCM meta-analysis run ${id}:`, error);
        resultData.value[id] = { loading: false, error: true, manhattan: null, qq: null, summary: null, topLoci: null };
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load meta-analysis plots. Please try again.',
            life: 5000
        });
    }
}

// meta returns a presigned {url}; summary/top-loci return the artifact content
// directly, so those two are saved client-side as a JSON download.
async function downloadArtifact(row, kind) {
    const dlKey = `${row.id}:${kind}`;
    downloading.value[dlKey] = true;
    try {
        const { data } = await hcmAxios.get(`/api/hcm/ma/runs/${row.id}/${kind}`);
        if (kind === 'meta') {
            window.open(data.url, '_blank');
        } else {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hcm-ma-${row.id}-${kind}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error(`Error downloading ${kind} for HCM meta-analysis run ${row.id}:`, error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to download ${kind}. Please try again.`,
            life: 5000
        });
    } finally {
        downloading.value[dlKey] = false;
    }
}

async function loadResults() {
    loadingResults.value = true;
    try {
        const { data } = await hcmAxios.get('/api/hcm/ma/results');
        rows.value = data || [];
    } catch (error) {
        console.error('Error loading HCM meta-analysis results:', error);
        if (error.response?.status === 403) {
            toast.add({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You need reviewer permissions to view meta-analysis results.',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load meta-analysis results. Please try again.',
                life: 5000
            });
        }
    } finally {
        loadingResults.value = false;
    }
}

// Poll results every ~15s while any run is still PENDING/RUNNING.
let pollHandle = null;

onMounted(() => {
    loadEligibleFiles();
    loadResults();
    pollHandle = setInterval(() => {
        if (rows.value.some(r => r.status === 'PENDING' || r.status === 'RUNNING')) {
            loadResults();
        }
    }, 15000);
});

onBeforeUnmount(() => {
    if (pollHandle) clearInterval(pollHandle);
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
