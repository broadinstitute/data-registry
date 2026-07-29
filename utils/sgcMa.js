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

// Label a GWAS candidate for the ignore-list add-form dropdown. Cohort name leads so
// that duplicated free-text `dataset` labels stay distinguishable.
export function gwasCandidateLabel(gwas, nameMap) {
    const cohortName = cohortNameFor(nameMap, gwas.cohort_id);
    return `${cohortName} · ${gwas.dataset} · ${gwas.phenotype} / ${gwas.ancestry}`;
}

// Group a flat MA-run list (from /api/sgc/ma/results) into
// [{ phenotype, ancestry, runs: [...] }], each group's runs newest-first,
// groups sorted by phenotype then ancestry.
export function groupRunsByPhenoAncestry(runs) {
    const groups = {};
    for (const r of runs || []) {
        const key = `${r.phenotype}||${r.ancestry}`;
        (groups[key] || (groups[key] = { phenotype: r.phenotype, ancestry: r.ancestry, runs: [] })).runs.push(r);
    }
    const out = Object.values(groups);
    for (const g of out) {
        g.runs.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    }
    out.sort((a, b) => a.phenotype.localeCompare(b.phenotype) || a.ancestry.localeCompare(b.ancestry));
    return out;
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
