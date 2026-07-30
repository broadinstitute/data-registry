<template>
    <div class="grid">
        <div v-if="isReviewer" class="col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-4">
                    <h5>Meta-Analysis Ignore List</h5>
                    <Tag :value="entries.length + ' entr' + (entries.length !== 1 ? 'ies' : 'y')" severity="info" />
                </div>

                <p class="text-sm text-gray-600 mb-3">
                    Cohorts on this list are excluded from the meta-analysis for the given phenotype
                    and ancestry, and appear in each run's summary as "Ignored" with the reason below.
                </p>

                <!-- Add form -->
                <div class="surface-100 p-3 mb-4" style="border-radius: 6px;">
                    <div class="grid formgrid">
                        <div class="col-12 md:col-4 field">
                            <label class="text-sm font-medium block mb-1">Cohort &amp; phenotype</label>
                            <Dropdown
                                v-model="form.candidate"
                                :options="candidates"
                                :optionLabel="labelFor"
                                filter
                                placeholder="Pick any GWAS of the cohort/phenotype"
                                class="w-full"
                                :loading="loadingCandidates"
                            />
                        </div>
                        <div class="col-12 md:col-3 field">
                            <label class="text-sm font-medium block mb-1">Analysis</label>
                            <Dropdown
                                v-model="form.target"
                                :options="MA_TARGET_GROUPS"
                                optionGroupLabel="group" optionGroupChildren="items"
                                optionLabel="label" optionValue="value"
                                placeholder="Select analysis"
                                class="w-full"
                            />
                        </div>
                        <div class="col-12 md:col-5 field">
                            <label class="text-sm font-medium block mb-1">Reason</label>
                            <Textarea
                                v-model="form.reason"
                                rows="2"
                                class="w-full"
                                placeholder="e.g. lambda_gc 1.42 > inflation threshold"
                            />
                        </div>
                    </div>
                    <div class="flex justify-content-end">
                        <Button
                            label="Add to ignore list"
                            icon="pi pi-plus"
                            size="small"
                            :disabled="!canSubmit || submitting"
                            :loading="submitting"
                            @click="addEntry"
                        />
                    </div>
                </div>

                <!-- Bulk upload -->
                <div class="surface-100 p-3 mb-4" style="border-radius: 6px;">
                    <div class="flex justify-content-between align-items-center mb-2">
                        <label class="text-sm font-medium">Bulk upload (CSV / TSV)</label>
                        <Button label="Download sample" icon="pi pi-download" text size="small" @click="downloadSample" />
                    </div>
                    <p class="text-xs text-gray-600 mb-2">
                        Columns: <code>code, phenotype, ancestry, sex, reason</code>.
                        <code>sex</code> defaults to <code>All</code>. One row per (cohort code, analysis).
                    </p>
                    <div class="flex align-items-center gap-2">
                        <input ref="bulkFileInput" type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values"
                               @change="onBulkFileChange" />
                        <Button label="Upload" icon="pi pi-upload" size="small"
                                :disabled="!bulkFile || bulkUploading" :loading="bulkUploading" @click="uploadBulk" />
                    </div>
                    <div v-if="bulkResult" class="mt-3">
                        <Tag :value="`Added ${bulkResult.added}`" severity="success" class="mr-2" />
                        <Tag :value="`Skipped ${bulkResult.skipped_count}`"
                             :severity="bulkResult.skipped_count ? 'warning' : 'secondary'" />
                        <DataTable v-if="bulkResult.skipped && bulkResult.skipped.length"
                                   :value="bulkResult.skipped" class="p-datatable-sm mt-2" responsiveLayout="scroll">
                            <Column field="code" header="Code">
                                <template #body="{ data: s }"><span class="text-sm">{{ s.code }}</span></template>
                            </Column>
                            <Column field="reason" header="Skipped because">
                                <template #body="{ data: s }"><span class="text-sm">{{ s.reason }}</span></template>
                            </Column>
                        </DataTable>
                    </div>
                </div>

                <!-- List -->
                <DataTable
                    :value="entries"
                    :loading="loading"
                    class="p-datatable-sm"
                    responsiveLayout="scroll"
                    stripedRows
                    :paginator="entries.length > 25"
                    :rows="25"
                >
                    <Column header="Cohort">
                        <template #body="{ data: e }">
                            <span class="text-sm font-medium">{{ cohortNameFor(nameMap, e.cohort_id) }}</span>
                        </template>
                    </Column>
                    <Column field="phenotype" header="Phenotype" sortable>
                        <template #body="{ data: e }"><span class="text-sm">{{ e.phenotype }}</span></template>
                    </Column>
                    <Column header="Target" sortable>
                        <template #body="{ data: e }"><Tag :value="targetLabel(e.ancestry, e.sex)" severity="secondary" /></template>
                    </Column>
                    <Column field="reason" header="Reason">
                        <template #body="{ data: e }"><span class="text-sm">{{ e.reason }}</span></template>
                    </Column>
                    <Column field="excluded_by" header="Excluded by">
                        <template #body="{ data: e }"><span class="text-sm">{{ e.excluded_by }}</span></template>
                    </Column>
                    <Column field="created_at" header="Created" sortable>
                        <template #body="{ data: e }">
                            <span class="text-sm">{{ e.created_at ? new Date(e.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—' }}</span>
                        </template>
                    </Column>
                    <Column header="" style="width: 4rem">
                        <template #body="{ data: e }">
                            <Button icon="pi pi-trash" severity="danger" text rounded size="small" @click="confirmDelete(e)" />
                        </template>
                    </Column>
                    <template #empty>
                        <span class="text-sm text-gray-500">No cohorts are being ignored.</span>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="deleteVisible" modal header="Remove ignore entry" :style="{ width: '28rem' }">
        <p class="text-sm" v-if="deleteTarget">
            Re-include <span class="font-medium">{{ cohortNameFor(nameMap, deleteTarget.cohort_id) }}</span>
            for {{ deleteTarget.phenotype }} / {{ targetLabel(deleteTarget.ancestry, deleteTarget.sex) }} in future meta-analyses?
        </p>
        <template #footer>
            <Button label="Cancel" text @click="deleteVisible = false" />
            <Button label="Remove" severity="danger" :loading="deleting" @click="deleteEntry" />
        </template>
    </Dialog>

    <Toast position="top-center" />
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { useUserStore } from "~/stores/UserStore";

definePageMeta({ layout: 'sgc' });

const toast = useToast();
const config = useRuntimeConfig();
const userStore = useUserStore();
const router = useRouter();

const sgcAxios = useSGCAxios(config, undefined, (error) => Promise.reject(error));

const isReviewer = computed(() => {
    const user = userStore.user;
    if (!user) return false;
    const roleNames = user.roles?.map(role => role.name || role) || [];
    return roleNames.includes('sgc-reviewer') || roleNames.includes('admin');
});

const entries = ref([]);
const candidates = ref([]);
const nameMap = ref({});
const loading = ref(false);
const loadingCandidates = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const deleteVisible = ref(false);
const deleteTarget = ref(null);
const form = ref({ candidate: null, target: '', reason: '' });
const bulkFileInput = ref(null);
const bulkFile = ref(null);
const bulkUploading = ref(false);
const bulkResult = ref(null);

const canSubmit = computed(() =>
    !!form.value.candidate && !!form.value.target && form.value.reason.trim().length > 0);

function labelFor(gwas) {
    return gwasCandidateLabel(gwas, nameMap.value);
}

async function loadEntries() {
    loading.value = true;
    try {
        const { data } = await sgcAxios.get('/api/sgc/ma/ignore');
        entries.value = data;
    } catch (error) {
        console.error('Error loading ignore list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load the ignore list.', life: 5000 });
    } finally {
        loading.value = false;
    }
}

async function loadCandidates() {
    loadingCandidates.value = true;
    try {
        const [gwasResp, cohortsResp] = await Promise.all([
            sgcAxios.get('/api/sgc/gwas-summary'),
            sgcAxios.get('/api/sgc/cohorts'),
        ]);
        nameMap.value = cohortNameMap(cohortsResp.data);
        candidates.value = gwasResp.data;
    } catch (error) {
        console.error('Error loading candidates:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cohorts/GWAS for the add form.', life: 5000 });
    } finally {
        loadingCandidates.value = false;
    }
}

async function addEntry() {
    if (!canSubmit.value) return;
    submitting.value = true;
    const g = form.value.candidate;
    const { ancestry, sex } = targetFromValue(form.value.target);
    try {
        await sgcAxios.post('/api/sgc/ma/ignore', {
            cohort_id: g.cohort_id,
            phenotype: g.phenotype,
            ancestry,
            sex,
            reason: form.value.reason.trim(),
        });
        toast.add({ severity: 'success', summary: 'Added', detail: 'Cohort added to the ignore list.', life: 4000 });
        form.value = { candidate: null, target: '', reason: '' };
        await loadEntries();
    } catch (error) {
        const detail = error?.response?.status === 400
            ? 'That cohort could not be found (unknown cohort_id).'
            : 'Failed to add the ignore entry.';
        console.error('Error adding ignore entry:', error);
        toast.add({ severity: 'error', summary: 'Error', detail, life: 5000 });
    } finally {
        submitting.value = false;
    }
}

function confirmDelete(entry) {
    deleteTarget.value = entry;
    deleteVisible.value = true;
}

async function deleteEntry() {
    if (!deleteTarget.value) return;
    deleting.value = true;
    try {
        await sgcAxios.delete(`/api/sgc/ma/ignore/${deleteTarget.value.id}`);
        toast.add({ severity: 'success', summary: 'Removed', detail: 'Ignore entry removed.', life: 4000 });
        deleteVisible.value = false;
        deleteTarget.value = null;
        await loadEntries();
    } catch (error) {
        console.error('Error removing ignore entry:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove the ignore entry.', life: 5000 });
    } finally {
        deleting.value = false;
    }
}

function onBulkFileChange(e) {
    bulkFile.value = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    bulkResult.value = null;
}

function downloadSample() {
    const csv = 'code,phenotype,ancestry,sex,reason\n'
        + 'BV,PSOR,Combined,Male,lambda_gc too high\n'
        + 'HUNT,PSOR,EUR,All,low effective N\n';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ma-ignore-sample.csv';
    a.click();
    URL.revokeObjectURL(url);
}

async function uploadBulk() {
    if (!bulkFile.value || bulkUploading.value) return;
    bulkUploading.value = true;
    bulkResult.value = null;
    try {
        const fd = new FormData();
        fd.append('file', bulkFile.value);
        const { data } = await sgcAxios.post('/api/sgc/ma/ignore/bulk', fd);
        bulkResult.value = data;
        toast.add({
            severity: data.skipped_count ? 'warn' : 'success',
            summary: 'Bulk upload complete',
            detail: `${data.added} added, ${data.skipped_count} skipped.`,
            life: 5000,
        });
        bulkFile.value = null;
        if (bulkFileInput.value) bulkFileInput.value.value = '';
        await loadEntries();
    } catch (error) {
        const detail = error?.response?.status === 400
            ? 'No valid rows found in the uploaded file.'
            : 'Bulk upload failed.';
        console.error('Error bulk-uploading ignore entries:', error);
        toast.add({ severity: 'error', summary: 'Error', detail, life: 5000 });
    } finally {
        bulkUploading.value = false;
    }
}

onMounted(() => {
    if (!isReviewer.value) {
        router.push('/sgc');
        return;
    }
    loadEntries();
    loadCandidates();
});
</script>
