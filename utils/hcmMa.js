// Pure display + selection helpers for the HCM meta-analysis page.
// Unit-tested in test/hcmMa.spec.js; auto-imported by Nuxt into pages/hcm/ma.vue.

export function maStatusSeverity(status) {
  switch (status) {
    case 'SUCCEEDED': return 'success';
    case 'FAILED': return 'danger';
    case 'RUNNING': return 'info';
    default: return 'warning'; // PENDING / unknown
  }
}

export function maRunLabel(run) {
  if (run && run.label) return run.label;
  const n = Array.isArray(run && run.dataset_file_ids) ? run.dataset_file_ids.length : null;
  const date = run && run.created_at ? String(run.created_at).slice(0, 10) : '';
  const parts = [];
  if (n !== null) parts.push(`${n} cohort${n === 1 ? '' : 's'}`);
  if (date) parts.push(date);
  return parts.join(' · ') || 'run';
}

// The one-file-per-cohort UI rule: disable every ineligible file, plus every
// file that shares a cohort_name with an already-selected file (the selected
// file itself stays enabled so it can be unchecked).
export function disabledFileIds(eligibleFiles, selectedIds) {
  const selected = new Set(selectedIds || []);
  const selectedCohorts = new Set(
    (eligibleFiles || []).filter(f => selected.has(f.file_id)).map(f => f.cohort_name));
  const disabled = new Set();
  for (const f of eligibleFiles || []) {
    if (!f.eligible) { disabled.add(f.file_id); continue; }
    if (!selected.has(f.file_id) && selectedCohorts.has(f.cohort_name)) disabled.add(f.file_id);
  }
  return disabled;
}
