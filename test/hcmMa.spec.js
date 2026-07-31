import { describe, it, expect } from 'vitest';
import { maStatusSeverity, maRunLabel, disabledFileIds } from '../utils/hcmMa.js';

describe('maStatusSeverity', () => {
  it('maps statuses', () => {
    expect(maStatusSeverity('SUCCEEDED')).toBe('success');
    expect(maStatusSeverity('FAILED')).toBe('danger');
    expect(maStatusSeverity('RUNNING')).toBe('info');
    expect(maStatusSeverity('PENDING')).toBe('warning');
  });
});

describe('maRunLabel', () => {
  it('prefers explicit label', () => {
    expect(maRunLabel({ label: 'core', dataset_file_ids: ['a'] })).toBe('core');
  });
  it('falls back to count + date', () => {
    expect(maRunLabel({ dataset_file_ids: ['a', 'b'], created_at: '2026-07-30T10:00:00' }))
      .toBe('2 cohorts · 2026-07-30');
  });
});

describe('disabledFileIds (one file per cohort)', () => {
  const files = [
    { file_id: 'a', cohort_name: 'MGB', eligible: true },
    { file_id: 'b', cohort_name: 'MGB', eligible: true },
    { file_id: 'c', cohort_name: 'HUNT', eligible: true },
    { file_id: 'd', cohort_name: 'RBH', eligible: false },
  ];
  it('always disables ineligible files', () => {
    expect(disabledFileIds(files, []).has('d')).toBe(true);
  });
  it('disables same-cohort siblings once one is selected', () => {
    const dis = disabledFileIds(files, ['a']);
    expect(dis.has('b')).toBe(true);   // sibling of selected MGB file
    expect(dis.has('a')).toBe(false);  // the selected one stays enabled
    expect(dis.has('c')).toBe(false);  // different cohort, still selectable
  });
});
