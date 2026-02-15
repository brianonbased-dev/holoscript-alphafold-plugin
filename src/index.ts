/**
 * @holoscript/alphafold-plugin v1.0.0
 * AlphaFold protein structure prediction for HoloScript
 *
 * @packageDocumentation
 */

export interface AlphaFoldPredictionConfig {
  sequence: string;           // Amino acid sequence
  job_name?: string;           // Job name
  mode?: 'api' | 'local';     // Prediction mode
  num_models?: number;         // Number of models (default: 5)
  use_templates?: boolean;     // Use template structures
}

export interface AlphaFoldMultimerConfig {
  sequences: string[];         // Multiple protein sequences
  stoichiometry?: number[];    // Copy numbers per chain
  job_name?: string;
}

export interface AlphaFoldResult {
  status: 'success' | 'failed';
  pdb_data?: string;                    // PDB file contents
  confidence_scores?: number[];          // pLDDT per residue
  mean_plddt?: number;                   // Mean confidence
  pae_data?: number[][];                 // Predicted Aligned Error matrix
  job_id?: string;                       // Job ID (API mode)
  error?: string;                        // Error message (if failed)
}

// Version
export const VERSION = '1.0.0';

// Re-export types
export type {
  AlphaFoldPredictionConfig as PredictionConfig,
  AlphaFoldMultimerConfig as MultimerConfig,
  AlphaFoldResult as Result,
};

// Default export
export default {
  VERSION,
};
