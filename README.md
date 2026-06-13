# @holoscript/alphafold-plugin

Protein structure prediction for HoloScript — part of the [HoloScript ecosystem](https://holoscript.net).

[![npm version](https://img.shields.io/npm/v/@holoscript/alphafold-plugin.svg)](https://www.npmjs.com/package/@holoscript/alphafold-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Brings protein structure prediction into HoloScript scenes. Supports the AlphaFold API (cloud) and local ColabFold (GPU). The plugin targets the AlphaFold API; ColabFold compatibility covers local runs.

## Features

- Cloud protein structure prediction via the AlphaFold API
- Local prediction via ColabFold on your own GPU
- pLDDT confidence coloring in VR
- Multimer prediction for protein complexes
- PAE (Predicted Aligned Error) heatmap visualization
- Batch prediction for comparing variants

## Installation

```bash
npm install holoscript @holoscript/alphafold-plugin
pip install requests
```

## Usage

```holoscript
object "My Protein" @alphafold_predict @structure_confidence {
  sequence: "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVK",
  mode: "api",
  color_by: "confidence",
}
```

See `examples/protein-prediction.holo` for more.

## Requirements

- Node.js 18+
- Python 3.10+
- AlphaFold API key (for cloud mode) or ColabFold (for local mode)

## Status

Experimental. Core prediction and visualization traits are implemented; expect API and interface changes.

## License

MIT © HoloScript Contributors