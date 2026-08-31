// Mathematical and algorithmic helpers for Category 5: The Transformer

export function computeScaledDotProductAttention(
  Q: number[][],
  K: number[][],
  V: number[][],
  scale = true,
  causalMask = false
): { scores: number[][]; weights: number[][]; output: number[][] } {
  const seqLen = Q.length;
  const dK = Q[0]?.length || 1;
  const factor = scale ? Math.sqrt(dK) : 1;

  // Q * K^T
  const scores: number[][] = [];
  for (let i = 0; i < seqLen; i++) {
    const row: number[] = [];
    for (let j = 0; j < seqLen; j++) {
      let dot = 0;
      for (let d = 0; d < dK; d++) {
        dot += Q[i][d] * K[j][d];
      }
      let scaled = dot / factor;
      if (causalMask && j > i) {
        scaled = -1e9;
      }
      row.push(scaled);
    }
    scores.push(row);
  }

  // Softmax per row
  const weights: number[][] = scores.map((row) => {
    const maxVal = Math.max(...row);
    const exps = row.map((v) => (v === -1e9 ? 0 : Math.exp(v - maxVal)));
    const sumExps = exps.reduce((a, b) => a + b, 0) || 1;
    return exps.map((e) => e / sumExps);
  });

  // Weights * V
  const dV = V[0]?.length || 1;
  const output: number[][] = [];
  for (let i = 0; i < seqLen; i++) {
    const outRow: number[] = [];
    for (let d = 0; d < dV; d++) {
      let sum = 0;
      for (let j = 0; j < seqLen; j++) {
        sum += weights[i][j] * V[j][d];
      }
      outRow.push(sum);
    }
    output.push(outRow);
  }

  return { scores, weights, output };
}

export function computeSinusoidalPE(pos: number, dim: number, dModel = 64): number {
  const i = Math.floor(dim / 2);
  const freq = 1 / Math.pow(10000, (2 * i) / dModel);
  return dim % 2 === 0 ? Math.sin(pos * freq) : Math.cos(pos * freq);
}

export function computeRmsNorm(x: number[], eps = 1e-5): number[] {
  const d = x.length;
  const sumSq = x.reduce((acc, v) => acc + v * v, 0);
  const rms = Math.sqrt(sumSq / d + eps);
  return x.map((v) => v / rms);
}

export function computeLayerNorm(x: number[], eps = 1e-5): number[] {
  const d = x.length;
  const mean = x.reduce((acc, v) => acc + v, 0) / d;
  const variance = x.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / d;
  const std = Math.sqrt(variance + eps);
  return x.map((v) => (v - mean) / std);
}

export function calculateKvCacheMemoryBytes(
  nLayers: number,
  nHeads: number,
  dHead: number,
  seqLen: number,
  batchSize: number,
  bytesPerElem = 2 // FP16/BF16
): number {
  // 2 matrices (K and V) * nLayers * nHeads * dHead * seqLen * batchSize * precision
  return 2 * bytesPerElem * nLayers * nHeads * dHead * seqLen * batchSize;
}
