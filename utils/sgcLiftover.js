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
