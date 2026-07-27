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
                        <div class="col-12 md:col-6 field">
                            <label class="text-sm font-medium block mb-1">GWAS to ignore</label>
                            <Dropdown
                                v-model="form.candidate"
                                :options="candidates"
                                :optionLabel="labelFor"
                                filter
                                placeholder="Select cohort · dataset · phenotype / ancestry"
                                class="w-full"
                                :loading="loadingCandidates"
                            />
                        </div>
                        <div class="col-12 md:col-6 field">
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
                    <Column field="ancestry" header="Ancestry" sortable>
                        <template #body="{ data: e }"><Tag :value="e.ancestry" severity="secondary" /></template>
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
            for {{ deleteTarget.phenotype }} / {{ deleteTarget.ancestry }} in future meta-analyses?
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
const form = ref({ candidate: null, reason: '' });

const canSubmit = computed(() => !!form.value.candidate && form.value.reason.trim().length > 0);

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
    try {
        await sgcAxios.post('/api/sgc/ma/ignore', {
            cohort_id: g.cohort_id,
            phenotype: g.phenotype,
            ancestry: g.ancestry,
            reason: form.value.reason.trim(),
        });
        toast.add({ severity: 'success', summary: 'Added', detail: 'Cohort added to the ignore list.', life: 4000 });
        form.value = { candidate: null, reason: '' };
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

onMounted(() => {
    if (!isReviewer.value) {
        router.push('/sgc');
        return;
    }
    loadEntries();
    loadCandidates();
});
</script>
