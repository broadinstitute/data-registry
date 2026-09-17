import { describe, it, expect } from 'vitest';
import {
  PEG_REPORT_SECTIONS, MAX_ROWS_SHOWN, sectionStatus, formatRows,
  flattenEntry, flattenReport, reportSummary,
} from '../utils/pegValidationReport.js';

const fileOk = { path: 'list.tsv', status: 'success', errors: [], warnings: [], info: [{ step: 'a', message: 'ok' }], counts: { errors: 0, warnings: 0, info: 1 } };
const fileWarn = { ...fileOk, warnings: [{ step: 'w', message: 'careful' }], counts: { errors: 0, warnings: 1, info: 1 } };
const fileErr = {
  path: 'matrix.tsv', status: 'error', warnings: [], info: [],
  errors: [{ step: '4/4 - Fixed Column Validation', message: 'bad', column_errors: [{ column: 'PrimaryVariantID', check: 'str_matches(...)', rows: [1, 2], hint: 'Expected chr:pos:ref:alt' }] }],
  counts: { errors: 1, warnings: 0, info: 0 },
};
const cross = { path: null, status: 'success', errors: [], warnings: [{ step: 'Cross-validation skipped', message: 'Skipped' }], info: [], counts: { errors: 0, warnings: 1, info: 0 } };

const report = {
  status: 'error',
  summary: { total_files: 4, files_with_errors: 1, total_errors: 1, total_warnings: 2, total_info: 2 },
  files: { list: fileOk, matrix: fileErr, metadata: fileWarn, cross_validation: cross },
};

describe('sectionStatus', () => {
  it('is error when any errors', () => expect(sectionStatus(fileErr)).toBe('error'));
  it('is warning when only warnings', () => expect(sectionStatus(fileWarn)).toBe('warning'));
  it('is ok otherwise', () => expect(sectionStatus(fileOk)).toBe('ok'));
});

describe('formatRows', () => {
  it('joins short lists', () => expect(formatRows([1, 2, 3])).toBe('1, 2, 3'));
  it('truncates long lists', () => {
    const rows = Array.from({ length: MAX_ROWS_SHOWN + 5 }, (_, i) => i + 1);
    const out = formatRows(rows);
    expect(out.endsWith('(+5 more)')).toBe(true);
    expect(out.split(', ').length).toBe(MAX_ROWS_SHOWN);
  });
  it('handles empty', () => expect(formatRows([])).toBe(''));
});

describe('flattenEntry', () => {
  it('carries column errors through', () => {
    const e = flattenEntry(fileErr.errors[0], 'error');
    expect(e.level).toBe('error');
    expect(e.columnErrors).toEqual([{ column: 'PrimaryVariantID', check: 'str_matches(...)', rows: '1, 2', hint: 'Expected chr:pos:ref:alt' }]);
    expect(e.rowErrors).toEqual([]);
  });
  it('formats row errors', () => {
    const e = flattenEntry({ step: 's', message: 'm', row_errors: [{ row: 3, errors: [{ field: 'rsID', message: 'required' }] }, { row: 5, error: 'boom' }] }, 'error');
    expect(e.rowErrors).toEqual(['Row 3: rsID — required', 'Row 5: boom']);
  });
  it('formats single row detail', () => {
    const e = flattenEntry({ step: 's', message: 'm', row: 7, row_error: 'nope' }, 'error');
    expect(e.line).toBe('Row 7: nope');
  });
});

describe('flattenReport', () => {
  it('returns four sections in fixed order with labels and filenames', () => {
    const sections = flattenReport(report);
    expect(sections.map(s => s.key)).toEqual(PEG_REPORT_SECTIONS.map(s => s.key));
    expect(sections[0]).toMatchObject({ label: 'PEG List', fileName: 'list.tsv', status: 'ok', infoCount: 1 });
    expect(sections[3]).toMatchObject({ label: 'Cross-file checks', fileName: null, status: 'warning' });
  });
  it('orders errors before warnings inside a section', () => {
    const mixed = { ...fileErr, warnings: [{ step: 'w', message: 'x' }] };
    const [section] = flattenReport({ ...report, files: { ...report.files, matrix: mixed } }).filter(s => s.key === 'matrix');
    expect(section.entries.map(e => e.level)).toEqual(['error', 'warning']);
  });
  it('tolerates a missing section', () => {
    const sections = flattenReport({ status: 'success', summary: {}, files: { list: fileOk } });
    expect(sections.length).toBe(4);
    expect(sections[1]).toMatchObject({ key: 'matrix', status: 'ok', entries: [], fileName: null });
  });
});

describe('reportSummary', () => {
  it('counts errors and warnings', () => expect(reportSummary(report)).toBe('1 error, 2 warnings'));
  it('says all passed', () => expect(reportSummary({ status: 'success', summary: { total_errors: 0, total_warnings: 0 } })).toBe('All checks passed'));
  it('handles warnings only', () => expect(reportSummary({ status: 'success', summary: { total_errors: 0, total_warnings: 1 } })).toBe('No errors, 1 warning'));
});
