import { describe, it, expect } from 'vitest';
import {
    maSkipTag, maSkipReason, cohortNameMap, cohortNameFor, gwasCandidateLabel,
    groupRunsByPhenoAncestry, runLabel,
} from '../utils/sgcMa.js';

describe('maSkipTag', () => {
    it('flags ignore-list skips as Ignored/info', () => {
        expect(maSkipTag('MA ignore-list: lambda 1.4')).toEqual({ label: 'Ignored', severity: 'info' });
    });
    it('flags other skips as Skipped/warning', () => {
        expect(maSkipTag('bad column mapping')).toEqual({ label: 'Skipped', severity: 'warning' });
    });
    it('treats null as a plain Skipped', () => {
        expect(maSkipTag(null)).toEqual({ label: 'Skipped', severity: 'warning' });
    });
});

describe('maSkipReason', () => {
    it('strips the MA ignore-list prefix', () => {
        expect(maSkipReason('MA ignore-list: lambda 1.4')).toBe('lambda 1.4');
    });
    it('leaves other reasons untouched', () => {
        expect(maSkipReason('bad column mapping')).toBe('bad column mapping');
    });
    it('returns empty string for null', () => {
        expect(maSkipReason(null)).toBe('');
    });
});

describe('cohortNameMap / cohortNameFor', () => {
    const cohorts = [{ id: 'c1', name: 'GEL_v2' }, { id: 'c2', name: 'BioMe' }];
    it('maps id to name', () => {
        expect(cohortNameMap(cohorts)).toEqual({ c1: 'GEL_v2', c2: 'BioMe' });
    });
    it('resolves a name, falling back to the raw id when unmapped', () => {
        const m = cohortNameMap(cohorts);
        expect(cohortNameFor(m, 'c1')).toBe('GEL_v2');
        expect(cohortNameFor(m, 'unknown')).toBe('unknown');
    });
    it('handles an undefined cohort list', () => {
        expect(cohortNameMap(undefined)).toEqual({});
    });
});

describe('gwasCandidateLabel', () => {
    it('labels a candidate cohort-name-first', () => {
        const gwas = { cohort_id: 'c1', dataset: 'GEL_batch', phenotype: 'PSOR', ancestry: 'EUR' };
        expect(gwasCandidateLabel(gwas, { c1: 'GEL_v2' })).toBe('GEL_v2 · GEL_batch · PSOR / EUR');
    });
    it('falls back to cohort_id when the name is unknown', () => {
        const gwas = { cohort_id: 'cX', dataset: 'D', phenotype: 'P', ancestry: 'A' };
        expect(gwasCandidateLabel(gwas, {})).toBe('cX · D · P / A');
    });
});

describe('groupRunsByPhenoAncestry', () => {
    it('groups runs by (phenotype, ancestry), newest run first, groups sorted', () => {
        const runs = [
            { id: '1', phenotype: 'PSOR', ancestry: 'EUR', created_at: '2026-07-01' },
            { id: '2', phenotype: 'PSOR', ancestry: 'EUR', created_at: '2026-07-05' },
            { id: '3', phenotype: 'AD', ancestry: 'EAS', created_at: '2026-07-03' },
        ];
        const out = groupRunsByPhenoAncestry(runs);
        expect(out.map(g => `${g.phenotype}/${g.ancestry}`)).toEqual(['AD/EAS', 'PSOR/EUR']);
        const psor = out.find(g => g.phenotype === 'PSOR');
        expect(psor.runs.map(r => r.id)).toEqual(['2', '1']);   // newest created_at first
    });

    it('handles empty / null input', () => {
        expect(groupRunsByPhenoAncestry([])).toEqual([]);
        expect(groupRunsByPhenoAncestry(null)).toEqual([]);
    });
});

describe('runLabel', () => {
    it('uses the explicit label when present', () => {
        expect(runLabel({ label: 'core set', run_type: 'manual' })).toBe('core set');
    });
    it('falls back to type · N datasets · date', () => {
        expect(runLabel({ run_type: 'auto', dataset_file_ids: ['a', 'b', 'c'], created_at: '2026-07-05T12:00:00' }))
            .toBe('auto · 3 datasets · 2026-07-05');
    });
    it('singular dataset + missing pieces degrade gracefully', () => {
        expect(runLabel({ run_type: 'manual', dataset_file_ids: ['a'] })).toBe('manual · 1 dataset');
        expect(runLabel({})).toBe('run');
    });
});
