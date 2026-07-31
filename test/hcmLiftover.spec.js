import { describe, it, expect } from 'vitest';
import { hcmLiftoverPerChromosomeRows, hcmLiftoverStatusSeverity } from '../utils/hcmLiftover.js';

describe('hcmLiftoverPerChromosomeRows', () => {
    it('maps a per_chromosome object into DataTable rows', () => {
        const summary = { per_chromosome: {
            '1': { input: 100, lifted: 98, unmapped: 2, strand_flips: 1 },
            'X': { input: 50, lifted: 50, unmapped: 0, strand_flips: 0 },
        } };
        expect(hcmLiftoverPerChromosomeRows(summary)).toEqual([
            { chromosome: '1', input: 100, lifted: 98, unmapped: 2, strand_flips: 1 },
            { chromosome: 'X', input: 50, lifted: 50, unmapped: 0, strand_flips: 0 },
        ]);
    });
    it('returns [] when summary is null', () => {
        expect(hcmLiftoverPerChromosomeRows(null)).toEqual([]);
    });
    it('returns [] when per_chromosome is missing', () => {
        expect(hcmLiftoverPerChromosomeRows({ total_lifted: 10 })).toEqual([]);
    });
    it('fills missing per-chromosome stat fields with null', () => {
        expect(hcmLiftoverPerChromosomeRows({ per_chromosome: { '1': {} } })).toEqual([
            { chromosome: '1', input: null, lifted: null, unmapped: null, strand_flips: null },
        ]);
    });
});

describe('hcmLiftoverStatusSeverity', () => {
    it('maps SUCCEEDED to success', () => {
        expect(hcmLiftoverStatusSeverity('SUCCEEDED')).toBe('success');
    });
    it('maps FAILED to danger', () => {
        expect(hcmLiftoverStatusSeverity('FAILED')).toBe('danger');
    });
    it('maps in-progress and unknown states to warning', () => {
        expect(hcmLiftoverStatusSeverity('RUNNING')).toBe('warning');
        expect(hcmLiftoverStatusSeverity('PENDING')).toBe('warning');
        expect(hcmLiftoverStatusSeverity(undefined)).toBe('warning');
    });
});

import { hcmBuildStatusSeverity, HCM_LIFTOVER_STATUS_OPTIONS } from '../utils/hcmLiftover.js';

describe('hcmBuildStatusSeverity', () => {
    it('maps each of the six statuses to its severity', () => {
        expect(hcmBuildStatusSeverity('Needs liftover')).toBe('warning');
        expect(hcmBuildStatusSeverity('In progress')).toBe('info');
        expect(hcmBuildStatusSeverity('Failed')).toBe('danger');
        expect(hcmBuildStatusSeverity('Lifted to GRCh38')).toBe('success');
        expect(hcmBuildStatusSeverity('GRCh38 (native)')).toBe('success');
        expect(hcmBuildStatusSeverity('Unknown build')).toBe('secondary');
    });
    it('falls back to secondary for unexpected values', () => {
        expect(hcmBuildStatusSeverity('whatever')).toBe('secondary');
        expect(hcmBuildStatusSeverity(undefined)).toBe('secondary');
    });
});

describe('HCM_LIFTOVER_STATUS_OPTIONS', () => {
    it('lists exactly the six contract labels', () => {
        expect(HCM_LIFTOVER_STATUS_OPTIONS).toEqual([
            'Needs liftover', 'In progress', 'Failed',
            'Lifted to GRCh38', 'GRCh38 (native)', 'Unknown build',
        ]);
    });
});
