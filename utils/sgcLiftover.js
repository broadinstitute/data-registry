// Display helpers for the SGC liftover-output reviewer view. Pure functions,
// unit-tested in test/sgcLiftover.spec.js and auto-imported into the .vue pages by Nuxt.

// Map the worker `summary.per_chromosome` object
// ({ "<chr>": { input, lifted, unmapped, strand_flips } }) into an array of rows
// for a PrimeVue DataTable. Null-safe: returns [] when the summary or its
// per_chromosome map is missing; missing per-chromosome stat fields become null.
export function liftoverPerChromosomeRows(summary) {
    const perChr = summary && summary.per_chromosome;
    if (!perChr) return [];
    return Object.entries(perChr).map(([chr, stats]) => ({
        chromosome: chr,
        input: stats?.input ?? null,
        lifted: stats?.lifted ?? null,
        unmapped: stats?.unmapped ?? null,
        strand_flips: stats?.strand_flips ?? null,
    }));
}

// PrimeVue Tag severity for an SGC liftover job status.
// Job status vocabulary: PENDING, RUNNING, SUCCEEDED, FAILED.
export function liftoverStatusSeverity(status) {
    if (status === 'SUCCEEDED') return 'success';
    if (status === 'FAILED') return 'danger';
    return 'warning';
}

// Display order for the gwas-summary "Genome Build / Liftover" filter. These
// six strings are the cross-repo contract -- they MUST match the backend
// classify_liftover_status output (sgc_ma/select.py) byte-for-byte.
export const LIFTOVER_STATUS_OPTIONS = [
    'Needs liftover',
    'In progress',
    'Failed',
    'Lifted to GRCh38',
    'GRCh38 (native)',
    'Unknown build',
];

// PrimeVue Tag severity for each liftover-status label. Unknown/unexpected
// values fall back to 'secondary' (grey).
export function buildStatusSeverity(status) {
    switch (status) {
        case 'Needs liftover': return 'warning';
        case 'In progress': return 'info';
        case 'Failed': return 'danger';
        case 'Lifted to GRCh38': return 'success';
        case 'GRCh38 (native)': return 'success';
        default: return 'secondary';
    }
}
