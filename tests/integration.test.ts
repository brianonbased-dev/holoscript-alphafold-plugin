/**
 * Comprehensive tests for @holoscript/alphafold-plugin
 *
 * Validates all exported interfaces, type shapes, and version constant.
 */

import {
  AlphaFoldPredictionConfig,
  AlphaFoldMultimerConfig,
  AlphaFoldResult,
  PredictionConfig,
  MultimerConfig,
  Result,
  VERSION,
} from '../src/index';
import defaultExport from '../src/index';

// ============================================================================
// Version
// ============================================================================

describe('@holoscript/alphafold-plugin', () => {
  describe('VERSION', () => {
    it('should export a version string', () => {
      expect(VERSION).toBeDefined();
      expect(typeof VERSION).toBe('string');
    });

    it('should follow semver format', () => {
      expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should be 1.0.0', () => {
      expect(VERSION).toBe('1.0.0');
    });
  });

  describe('default export', () => {
    it('should export VERSION', () => {
      expect(defaultExport.VERSION).toBe('1.0.0');
    });
  });

  // --------------------------------------------------------------------------
  // AlphaFoldPredictionConfig
  // --------------------------------------------------------------------------

  describe('AlphaFoldPredictionConfig', () => {
    it('accepts minimal config (sequence only)', () => {
      const config: AlphaFoldPredictionConfig = {
        sequence: 'MKFLILLFNILCLFP',
      };
      expect(config.sequence).toBe('MKFLILLFNILCLFP');
      expect(config.mode).toBeUndefined();
      expect(config.num_models).toBeUndefined();
    });

    it('accepts full config with all options', () => {
      const config: AlphaFoldPredictionConfig = {
        sequence: 'MKFLILLFNILCLFPVQESQGA',
        job_name: 'test_protein_1',
        mode: 'api',
        num_models: 5,
        use_templates: true,
      };
      expect(config.sequence).toBe('MKFLILLFNILCLFPVQESQGA');
      expect(config.job_name).toBe('test_protein_1');
      expect(config.mode).toBe('api');
      expect(config.num_models).toBe(5);
      expect(config.use_templates).toBe(true);
    });

    it('supports api mode', () => {
      const config: AlphaFoldPredictionConfig = {
        sequence: 'MAEEE',
        mode: 'api',
      };
      expect(config.mode).toBe('api');
    });

    it('supports local mode', () => {
      const config: AlphaFoldPredictionConfig = {
        sequence: 'MAEEE',
        mode: 'local',
      };
      expect(config.mode).toBe('local');
    });

    it('allows num_models to be any positive integer', () => {
      const configs: AlphaFoldPredictionConfig[] = [
        { sequence: 'M', num_models: 1 },
        { sequence: 'M', num_models: 5 },
        { sequence: 'M', num_models: 25 },
      ];
      configs.forEach((config) => {
        expect(config.num_models).toBeGreaterThan(0);
      });
    });

    it('allows use_templates to be true or false', () => {
      const withTemplates: AlphaFoldPredictionConfig = {
        sequence: 'MKFL',
        use_templates: true,
      };
      const withoutTemplates: AlphaFoldPredictionConfig = {
        sequence: 'MKFL',
        use_templates: false,
      };
      expect(withTemplates.use_templates).toBe(true);
      expect(withoutTemplates.use_templates).toBe(false);
    });

    it('is assignable to PredictionConfig alias', () => {
      const config: PredictionConfig = {
        sequence: 'MKFLILLFNILCLFP',
        mode: 'api',
      };
      expect(config.sequence).toBe('MKFLILLFNILCLFP');
    });
  });

  // --------------------------------------------------------------------------
  // AlphaFoldMultimerConfig
  // --------------------------------------------------------------------------

  describe('AlphaFoldMultimerConfig', () => {
    it('accepts minimal config (sequences only)', () => {
      const config: AlphaFoldMultimerConfig = {
        sequences: ['MKFLILLFNILCLFP', 'MAEEEAAKEEE'],
      };
      expect(config.sequences).toHaveLength(2);
      expect(config.stoichiometry).toBeUndefined();
    });

    it('accepts full multimer config', () => {
      const config: AlphaFoldMultimerConfig = {
        sequences: ['MKFLILLFNILCLFP', 'MAEEEAAKEEE', 'GFLILLFN'],
        stoichiometry: [2, 1, 3],
        job_name: 'complex_prediction',
      };
      expect(config.sequences).toHaveLength(3);
      expect(config.stoichiometry).toEqual([2, 1, 3]);
      expect(config.job_name).toBe('complex_prediction');
    });

    it('supports homodimer configuration', () => {
      const config: AlphaFoldMultimerConfig = {
        sequences: ['MKFLILLFNILCLFP'],
        stoichiometry: [2],
      };
      expect(config.sequences).toHaveLength(1);
      expect(config.stoichiometry![0]).toBe(2);
    });

    it('supports large multimer complexes', () => {
      const chains = Array.from({ length: 12 }, (_, i) => 'M' + 'A'.repeat(i + 5));
      const config: AlphaFoldMultimerConfig = {
        sequences: chains,
        stoichiometry: chains.map(() => 1),
      };
      expect(config.sequences).toHaveLength(12);
      expect(config.stoichiometry).toHaveLength(12);
    });

    it('is assignable to MultimerConfig alias', () => {
      const config: MultimerConfig = {
        sequences: ['MKFL', 'AEEE'],
      };
      expect(config.sequences).toHaveLength(2);
    });
  });

  // --------------------------------------------------------------------------
  // AlphaFoldResult
  // --------------------------------------------------------------------------

  describe('AlphaFoldResult', () => {
    it('accepts success result', () => {
      const result: AlphaFoldResult = {
        status: 'success',
        pdb_data: 'HEADER PREDICTION\nATOM 1 N MET A 1 10.0 12.0 8.0\nEND',
        confidence_scores: [85.2, 92.1, 78.5, 95.0],
        mean_plddt: 87.7,
      };
      expect(result.status).toBe('success');
      expect(result.pdb_data).toContain('HEADER');
      expect(result.confidence_scores).toHaveLength(4);
      expect(result.mean_plddt).toBeCloseTo(87.7);
    });

    it('accepts failed result', () => {
      const result: AlphaFoldResult = {
        status: 'failed',
        error: 'Invalid amino acid sequence',
      };
      expect(result.status).toBe('failed');
      expect(result.error).toBe('Invalid amino acid sequence');
      expect(result.pdb_data).toBeUndefined();
    });

    it('accepts result with PAE matrix', () => {
      const result: AlphaFoldResult = {
        status: 'success',
        pdb_data: 'HEADER\nEND',
        pae_data: [
          [0.5, 3.2, 5.1],
          [3.2, 0.4, 4.8],
          [5.1, 4.8, 0.3],
        ],
        mean_plddt: 90.5,
      };
      expect(result.pae_data).toBeDefined();
      expect(result.pae_data).toHaveLength(3);
      expect(result.pae_data![0]).toHaveLength(3);
      // PAE should be symmetric
      expect(result.pae_data![0][1]).toBe(result.pae_data![1][0]);
    });

    it('accepts result with job_id', () => {
      const result: AlphaFoldResult = {
        status: 'success',
        job_id: 'af-2024-001',
        pdb_data: 'HEADER\nEND',
      };
      expect(result.job_id).toBe('af-2024-001');
    });

    it('validates confidence scores range', () => {
      const result: AlphaFoldResult = {
        status: 'success',
        pdb_data: 'HEADER\nEND',
        confidence_scores: [0, 50, 70, 90, 100],
        mean_plddt: 62,
      };
      result.confidence_scores!.forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });

    it('is assignable to Result alias', () => {
      const result: Result = {
        status: 'success',
        pdb_data: 'HEADER\nEND',
        mean_plddt: 85,
      };
      expect(result.status).toBe('success');
    });

    it('handles all status values', () => {
      const statuses: AlphaFoldResult['status'][] = ['success', 'failed'];
      statuses.forEach((status) => {
        const result: AlphaFoldResult = { status };
        expect(result.status).toBe(status);
      });
    });
  });

  // --------------------------------------------------------------------------
  // Integration / Cross-cutting
  // --------------------------------------------------------------------------

  describe('integration', () => {
    it('prediction config → result flow', () => {
      const config: AlphaFoldPredictionConfig = {
        sequence: 'MKFLILLFNILCLFPVQESQGA',
        mode: 'api',
        num_models: 5,
        use_templates: true,
        job_name: 'integration_test',
      };

      // Simulate a successful prediction result
      const result: AlphaFoldResult = {
        status: 'success',
        job_id: 'af-integration-001',
        pdb_data: `HEADER    PREDICTED PROTEIN
ATOM      1  N   MET A   1      10.000  12.000   8.000  1.00 85.00           N
ATOM      2  CA  MET A   1      11.000  12.500   8.500  1.00 90.00           C
END`,
        confidence_scores: [85.0, 90.0],
        mean_plddt: 87.5,
      };

      expect(config.sequence.length).toBeGreaterThan(0);
      expect(result.status).toBe('success');
      expect(result.pdb_data).toContain('ATOM');
      expect(result.confidence_scores).toHaveLength(2);
    });

    it('multimer config → result flow', () => {
      const config: AlphaFoldMultimerConfig = {
        sequences: ['MKFLILLFNILCLFP', 'MAEEEAAKEEE'],
        stoichiometry: [1, 1],
        job_name: 'dimer_test',
      };

      const result: AlphaFoldResult = {
        status: 'success',
        pdb_data: 'HEADER DIMER\nATOM 1 N MET A 1 10.0 12.0 8.0\nATOM 2 N MET B 1 20.0 22.0 18.0\nEND',
        confidence_scores: Array.from({ length: 26 }, () => Math.random() * 30 + 70),
        mean_plddt: 82.3,
        pae_data: Array.from({ length: 26 }, () =>
          Array.from({ length: 26 }, () => Math.random() * 10)
        ),
      };

      expect(config.sequences).toHaveLength(2);
      expect(result.status).toBe('success');
      expect(result.pae_data).toHaveLength(26);
    });

    it('failed prediction with error details', () => {
      const config: AlphaFoldPredictionConfig = {
        sequence: 'INVALID123',
        mode: 'api',
      };

      const result: AlphaFoldResult = {
        status: 'failed',
        error: `Invalid residues in sequence: ${config.sequence.match(/[^ACDEFGHIKLMNPQRSTVWY]/g)?.join(', ')}`,
      };

      expect(result.status).toBe('failed');
      expect(result.error).toContain('Invalid residues');
      expect(result.pdb_data).toBeUndefined();
      expect(result.confidence_scores).toBeUndefined();
    });
  });
});
