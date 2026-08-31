// Mathematical and algorithmic helpers for Category 6: Transformer Variants & Modern Architectures

export function computeTopKGating(
  tokenVector: number[],
  expertWeights: number[][],
  topK = 2
): { expertIndices: number[]; expertWeights: number[] } {
  // Compute raw router logits: x . W_g
  const numExperts = expertWeights.length;
  const logits: { index: number; score: number }[] = [];

  for (let e = 0; e < numExperts; e++) {
    let dot = 0;
    for (let d = 0; d < tokenVector.length; d++) {
      dot += tokenVector[d] * (expertWeights[e][d] || 0.1);
    }
    logits.push({ index: e, score: dot });
  }

  // Sort descending
  logits.sort((a, b) => b.score - a.score);

  // Take topK
  const selected = logits.slice(0, topK);
  const maxScore = selected[0]?.score || 0;
  const exps = selected.map((s) => Math.exp(s.score - maxScore));
  const sumExps = exps.reduce((a, b) => a + b, 0) || 1;
  const normalized = exps.map((e) => e / sumExps);

  return {
    expertIndices: selected.map((s) => s.index),
    expertWeights: normalized,
  };
}

export function simulateLinearAttentionComplexity(
  seqLen: number,
  dModel = 64
): { quadraticFlops: number; linearFlops: number } {
  // Standard Attention: 2 * N^2 * d
  const quadraticFlops = 2 * seqLen * seqLen * dModel;
  // Linear Attention: 2 * N * d^2
  const linearFlops = 2 * seqLen * dModel * dModel;

  return { quadraticFlops, linearFlops };
}

export function simulateSelectiveSsmStep(
  x: number,
  hPrev: number,
  delta: number,
  aBar: number,
  bBar: number
): { h: number; y: number } {
  // Input-dependent discretization
  const aDisc = Math.exp(delta * aBar);
  const bDisc = delta * bBar;
  const h = aDisc * hPrev + bDisc * x;
  const y = 0.8 * h + 0.1 * x;
  return { h, y };
}
