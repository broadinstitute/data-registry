// Pure helpers that turn the PEGASUS validation report (see
// data-registry-api docs/superpowers/specs/2026-09-17-peg-validation-design.md)
// into display-ready sections. No Vue here so it can be unit tested.

export const PEG_REPORT_SECTIONS = [
  { key: 'list', label: 'PEG List' },
  { key: 'matrix', label: 'PEG Matrix' },
  { key: 'metadata', label: 'PEG Metadata' },
  { key: 'cross_validation', label: 'Cross-file checks' },
];

export const MAX_ROWS_SHOWN = 20;

const EMPTY_FILE = { path: null, status: 'success', errors: [], warnings: [], info: [], counts: { errors: 0, warnings: 0, info: 0 } };

export function sectionStatus(fileInfo) {
  const f = fileInfo || EMPTY_FILE;
  if ((f.errors || []).length > 0) return 'error';
  if ((f.warnings || []).length > 0) return 'warning';
  return 'ok';
}

export function formatRows(rows) {
  const list = Array.isArray(rows) ? rows : [];
  if (list.length === 0) return '';
  const shown = list.slice(0, MAX_ROWS_SHOWN).join(', ');
  const extra = list.length - MAX_ROWS_SHOWN;
  return extra > 0 ? `${shown} (+${extra} more)` : shown;
}

export function flattenEntry(entry, level) {
  const columnErrors = (entry.column_errors || []).map(c => ({
    column: c.column || '',
    check: c.check || '',
    rows: formatRows(c.rows),
    hint: c.hint || '',
  }));
  const rowErrors = (entry.row_errors || []).map(r => {
    if (Array.isArray(r.errors)) {
      const parts = r.errors.map(e => (e.field ? `${e.field} — ${e.message}` : e.message));
      return `Row ${r.row}: ${parts.join('; ')}`;
    }
    return `Row ${r.row}: ${r.error}`;
  });
  const line = entry.row !== undefined && entry.row_error ? `Row ${entry.row}: ${entry.row_error}` : null;
  return { level, step: entry.step || '', message: entry.message || '', columnErrors, rowErrors, line };
}

export function flattenReport(report) {
  const files = (report && report.files) || {};
  return PEG_REPORT_SECTIONS.map(({ key, label }) => {
    const f = files[key] || EMPTY_FILE;
    const entries = [
      ...(f.errors || []).map(e => flattenEntry(e, 'error')),
      ...(f.warnings || []).map(w => flattenEntry(w, 'warning')),
    ];
    return {
      key,
      label,
      fileName: f.path || null,
      status: sectionStatus(f),
      entries,
      info: (f.info || []).map(i => flattenEntry(i, 'info')),
      infoCount: (f.info || []).length,
    };
  });
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

export function reportSummary(report) {
  const s = (report && report.summary) || {};
  const errors = s.total_errors || 0;
  const warnings = s.total_warnings || 0;
  if (errors === 0 && warnings === 0) return 'All checks passed';
  if (errors === 0) return `No errors, ${plural(warnings, 'warning')}`;
  return `${plural(errors, 'error')}, ${plural(warnings, 'warning')}`;
}
