import { describe, it, expect } from 'vitest';
import {
    maSkipTag, maSkipReason, cohortNameMap, cohortNameFor, gwasCandidateLabel,
    runLabel,
    MA_TARGET_GROUPS, targetValue, targetFromValue, targetLabel,
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

describe('MA target model', () => {
    it('has three ordered groups and nine unique targets', () => {
        expect(MA_TARGET_GROUPS.map(g => g.group)).toEqual(
            ['All individuals', 'Sex-stratified', 'Ancestry-stratified']);
        const items = MA_TARGET_GROUPS.flatMap(g => g.items);
        expect(items).toHaveLength(9);
        expect(new Set(items.map(i => i.value)).size).toBe(9);
    });
    it('round-trips value <-> (ancestry, sex) for every target', () => {
        for (const i of MA_TARGET_GROUPS.flatMap(g => g.items)) {
            const { ancestry, sex } = targetFromValue(i.value);
            expect(targetValue(ancestry, sex)).toBe(i.value);
        }
    });
    it('maps the sex-stratified targets to the Combined bucket', () => {
        const items = MA_TARGET_GROUPS.flatMap(g => g.items);
        const male = items.find(i => i.label === 'Male');
        expect(targetFromValue(male.value)).toEqual({ ancestry: 'Combined', sex: 'Male' });
    });
    it('labels each bucket, with a defensive fallback', () => {
        expect(targetLabel('Combined', 'All')).toBe('Combined (all individuals)');
        expect(targetLabel('Combined', 'Male')).toBe('Male');
        expect(targetLabel('Combined', 'Female')).toBe('Female');
        expect(targetLabel('EUR', 'All')).toBe('EUR');
        expect(targetLabel('EUR', 'Male')).toBe('EUR · Male');   // not a real target
        expect(targetLabel(undefined, undefined)).toBe('? · ?');
    });
});
