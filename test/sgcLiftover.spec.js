import { describe, it, expect } from 'vitest';
import { liftoverPerChromosomeRows, liftoverStatusSeverity } from '../utils/sgcLiftover.js';

describe('liftoverPerChromosomeRows', () => {
    it('maps a per_chromosome object into DataTable rows', () => {
        const summary = { per_chromosome: {
            '1': { input: 100, lifted: 98, unmapped: 2, strand_flips: 1 },
            'X': { input: 50, lifted: 50, unmapped: 0, strand_flips: 0 },
        } };
        expect(liftoverPerChromosomeRows(summary)).toEqual([
            { chromosome: '1', input: 100, lifted: 98, unmapped: 2, strand_flips: 1 },
            { chromosome: 'X', input: 50, lifted: 50, unmapped: 0, strand_flips: 0 },
        ]);
    });
    it('returns [] when summary is null', () => {
        expect(liftoverPerChromosomeRows(null)).toEqual([]);
    });
    it('returns [] when per_chromosome is missing', () => {
        expect(liftoverPerChromosomeRows({ total_lifted: 10 })).toEqual([]);
    });
    it('fills missing per-chromosome stat fields with null', () => {
        expect(liftoverPerChromosomeRows({ per_chromosome: { '1': {} } })).toEqual([
            { chromosome: '1', input: null, lifted: null, unmapped: null, strand_flips: null },
        ]);
    });
});

describe('liftoverStatusSeverity', () => {
    it('maps SUCCEEDED to success', () => {
        expect(liftoverStatusSeverity('SUCCEEDED')).toBe('success');
    });
    it('maps FAILED to danger', () => {
        expect(liftoverStatusSeverity('FAILED')).toBe('danger');
    });
    it('maps in-progress and unknown states to warning', () => {
        expect(liftoverStatusSeverity('RUNNING')).toBe('warning');
        expect(liftoverStatusSeverity('PENDING')).toBe('warning');
        expect(liftoverStatusSeverity(undefined)).toBe('warning');
    });
});

import { buildStatusSeverity, LIFTOVER_STATUS_OPTIONS } from '../utils/sgcLiftover.js';

describe('buildStatusSeverity', () => {
    it('maps each of the six statuses to its severity', () => {
        expect(buildStatusSeverity('Needs liftover')).toBe('warning');
        expect(buildStatusSeverity('In progress')).toBe('info');
        expect(buildStatusSeverity('Failed')).toBe('danger');
        expect(buildStatusSeverity('Lifted to GRCh38')).toBe('success');
        expect(buildStatusSeverity('GRCh38 (native)')).toBe('success');
        expect(buildStatusSeverity('Unknown build')).toBe('secondary');
    });
    it('falls back to secondary for unexpected values', () => {
        expect(buildStatusSeverity('whatever')).toBe('secondary');
        expect(buildStatusSeverity(undefined)).toBe('secondary');
    });
});

describe('LIFTOVER_STATUS_OPTIONS', () => {
    it('lists exactly the six contract labels', () => {
        expect(LIFTOVER_STATUS_OPTIONS).toEqual([
            'Needs liftover', 'In progress', 'Failed',
            'Lifted to GRCh38', 'GRCh38 (native)', 'Unknown build',
        ]);
    });
});
