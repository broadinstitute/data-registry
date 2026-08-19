// Display helpers for the SGC meta-analysis views. Pure functions, unit-tested in
// test/sgcMa.spec.js and auto-imported into the .vue pages by Nuxt.

// Per-cohort summary records excluded from a meta-analysis carry `skipped: true`.
// Ignore-list exclusions prefix their reason with this marker; anything else is a
// runtime pipeline skip (e.g. an unreadable input).
const IGNORE_PREFIX = 'MA ignore-list:';

// A PrimeVue Tag descriptor distinguishing an intentional ignore from a pipeline skip.
export function maSkipTag(reason) {
    const isIgnore = typeof reason === 'string' && reason.startsWith(IGNORE_PREFIX);
    return isIgnore
        ? { label: 'Ignored', severity: 'info' }
        : { label: 'Skipped', severity: 'warning' };
}

// Reason text for display: strip the ignore-list marker; pass other reasons through.
// Null/undefined -> '' so the template renders nothing.
export function maSkipReason(reason) {
    if (typeof reason !== 'string') return '';
    if (reason.startsWith(IGNORE_PREFIX)) return reason.slice(IGNORE_PREFIX.length).trim();
    return reason;
}

// "1 entry" / "12 entries" for the ignore-list counts in warnings and toasts.
export function maIgnoreEntryCount(count) {
    const n = Number(count) || 0;
    return `${n} ${n === 1 ? 'entry' : 'entries'}`;
}

// Confirmation text for the "Delete all" control. Clearing the list silently re-admits
// every file on it, so say what the consequence is rather than just asking twice.
export function maIgnoreClearWarning(count) {
    return `Remove all ${maIgnoreEntryCount(count)} from the ignore list? `
        + 'Those files will be included in future meta-analyses again.';
}

// Build a { cohort_id: name } lookup from the /api/sgc/cohorts payload (each cohort
// object has `.id` and `.name`).
export function cohortNameMap(cohorts) {
    const map = {};
    for (const c of cohorts || []) {
        if (c.id !== null && c.id !== undefined) {
            map[c.id] = c.name;
        }
    }
    return map;
}

// Resolve a cohort_id to a display name, falling back to the raw id when unmapped.
export function cohortNameFor(nameMap, cohortId) {
    return (nameMap && nameMap[cohortId]) || cohortId;
}

// Two GWAS files can share a dataset label, cohort, phenotype, ancestry AND sex
// (a re-upload that superseded an earlier one). The short file id is the only
// thing that separates them in the UI.
export function datasetLabel(dataset, fileId) {
    if (!fileId) return dataset ?? '—';
    return `${dataset ?? '—'}-${String(fileId).slice(0, 6)}`;
}

// Label a GWAS candidate for the ignore-list add-form dropdown. Cohort name leads so
// that duplicated free-text `dataset` labels stay distinguishable.
export function gwasCandidateLabel(gwas, nameMap) {
    const cohortName = cohortNameFor(nameMap, gwas.cohort_id);
    return `${cohortName} · ${datasetLabel(gwas.dataset, gwas.id)} · ${gwas.phenotype} / ${gwas.ancestry}`;
}

// The nine valid MA analyses, presented to the user as one "target". Each maps to a
// backend (ancestry, sex); ancestry='Combined' is the pooled bucket.
const MA_TARGETS = [
    { group: 'All individuals',     label: 'Combined (all individuals)', ancestry: 'Combined', sex: 'All' },
    { group: 'Sex-stratified',      label: 'Male',                       ancestry: 'Combined', sex: 'Male' },
    { group: 'Sex-stratified',      label: 'Female',                     ancestry: 'Combined', sex: 'Female' },
    { group: 'Ancestry-stratified', label: 'AFR', ancestry: 'AFR', sex: 'All' },
    { group: 'Ancestry-stratified', label: 'AMR', ancestry: 'AMR', sex: 'All' },
    { group: 'Ancestry-stratified', label: 'EAS', ancestry: 'EAS', sex: 'All' },
    { group: 'Ancestry-stratified', label: 'EUR', ancestry: 'EUR', sex: 'All' },
    { group: 'Ancestry-stratified', label: 'MID', ancestry: 'MID', sex: 'All' },
    { group: 'Ancestry-stratified', label: 'SAS', ancestry: 'SAS', sex: 'All' },
];

// Stable option key for a target.
export function targetValue(ancestry, sex) {
    return `${ancestry}|${sex}`;
}

// Grouped options for a PrimeVue Dropdown:
//   optionGroupLabel="group" optionGroupChildren="items" optionLabel="label" optionValue="value"
export const MA_TARGET_GROUPS = (() => {
    const order = ['All individuals', 'Sex-stratified', 'Ancestry-stratified'];
    const byGroup = {};
    for (const t of MA_TARGETS) {
        (byGroup[t.group] || (byGroup[t.group] = [])).push(
            { label: t.label, value: targetValue(t.ancestry, t.sex) });
    }
    return order.map(g => ({ group: g, items: byGroup[g] }));
})();

// "ancestry|sex" -> { ancestry, sex }.
export function targetFromValue(value) {
    const [ancestry, sex] = String(value || '').split('|');
    return { ancestry: ancestry || '', sex: sex || '' };
}

// (ancestry, sex) -> display label for one of the nine targets; defensive fallback.
export function targetLabel(ancestry, sex) {
    if (ancestry === 'Combined' && sex === 'All') return 'Combined (all individuals)';
    if (ancestry === 'Combined' && (sex === 'Male' || sex === 'Female')) return sex;
    if (sex === 'All' && ancestry) return ancestry;
    return `${ancestry || '?'} · ${sex || '?'}`;
}

// Statuses after which no Batch job is still running for a meta-analysis.
const MA_TERMINAL_STATUSES = ['SUCCEEDED', 'FAILED'];

// Confirmation text for deleting one run. Deleting an in-flight run also cancels its
// Batch job, which is a bigger deal than deleting a finished one — say which it is.
export function maRunDeleteWarning(run) {
    const what = `${run?.phenotype ?? '—'} · ${targetLabel(run?.ancestry, run?.sex)}`;
    if (run && run.status && !MA_TERMINAL_STATUSES.includes(run.status)) {
        return `Delete the ${what} meta-analysis? It is still ${String(run.status).toLowerCase()}`
            + ' — the running job will be cancelled and any partial results discarded.';
    }
    return `Delete the ${what} meta-analysis? Its plots, summary and meta.tsv.gz`
        + ' will be permanently removed. This cannot be undone.';
}

// Human label for one run: the explicit label if set, else "type · N datasets · date".
export function runLabel(run) {
    if (run && run.label) return run.label;
    const type = (run && run.run_type) || 'run';
    const n = Array.isArray(run && run.dataset_file_ids) ? run.dataset_file_ids.length : null;
    const date = run && run.created_at ? String(run.created_at).slice(0, 10) : '';
    const parts = [type];
    if (n !== null) parts.push(`${n} dataset${n === 1 ? '' : 's'}`);
    if (date) parts.push(date);
    return parts.join(' · ');
}

// --- MA permission gating ----------------------------------------------------
// The user-service grants sgc-review-ma to both SGC roles (reviewer + uploader)
// for read access to MA results; sgc-review-data stays reviewer-only and is a
// deliberate superset so reviewers keep access even before sgc-review-ma is
// attached to their role. Mirrors check_ma_read_permissions in the API.

export function canReviewSgcMa(permissions) {
    return !!(permissions?.includes('sgc-review-ma') || permissions?.includes('sgc-review-data'));
}

// Also gates the meta.tsv.gz download and run deletion, per tenant request:
// sgc-review-ma is view-only (plots, summary, top loci), not full results.
export function canRunSgcMa(permissions) {
    return !!permissions?.includes('sgc-review-data');
}
