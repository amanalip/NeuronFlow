// Mathematical and algorithmic functions for Category 12: Architecture Variants

export function computeMoeRouting(
  routerLogits: number[],
  topK = 2
): {
  probabilities: number[];
  topKIndices: number[];
  topKWeights: number[];
  auxiliaryLoss: number;
} {
  // Softmax over router logits
  const maxLogit = Math.max(...routerLogits);
  const exps = routerLogits.map((l) => Math.exp(l - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  const probabilities = exps.map((e) => e / sumExps);

  // Top-K selection
  const indexed = probabilities.map((p, idx) => ({ p, idx }));
  indexed.sort((a, b) => b.p - a.p);
  const selected = indexed.slice(0, topK);

  // Normalize top-k weights
  const sumTop = selected.reduce((acc, curr) => acc + curr.p, 0);
  const topKIndices = selected.map((s) => s.idx);
  const topKWeights = selected.map((s) => s.p / sumTop);

  // Auxiliary load-balancing loss: L_aux = alpha * N * sum(f_i * P_i)
  const numExperts = routerLogits.length;
  const uniform = 1 / numExperts;
  const auxiliaryLoss = numExperts * probabilities.reduce((acc, p) => acc + p * uniform, 0);

  return { probabilities, topKIndices, topKWeights, auxiliaryLoss };
}

export function computeMambaDiscretization(
  delta: number,
  aContinuous: number,
  bContinuous: number
): { aDiscrete: number; bDiscrete: number } {
  // Discretization: A_bar = exp(Delta * A), B_bar = Delta * B (first-order Euler / ZOH)
  const aDiscrete = Math.exp(delta * aContinuous);
  const bDiscrete = delta * bContinuous;
  return { aDiscrete, bDiscrete };
}

export function computeRwkvDecay(
  tokens: number[],
  decayRate = 0.5
): number[] {
  // Receptance Weighted Key Value decay: w_t = exp(-decayRate * (t - i))
  const attentionWeights: number[] = [];
  const seqLen = tokens.length;
  for (let i = 0; i < seqLen; i++) {
    const weight = Math.exp(-decayRate * (seqLen - 1 - i));
    attentionWeights.push(weight);
  }
  const sum = attentionWeights.reduce((a, b) => a + b, 0);
  return attentionWeights.map((w) => w / sum);
}

export function computeDiffusionForwardStep(
  x0: number,
  stepT: number,
  totalSteps = 1000
): { alphaBar: number; mean: number; variance: number; noisyValue: number } {
  // Linear beta schedule from 0.0001 to 0.02
  const progress = Math.min(1, Math.max(0, stepT / totalSteps));
  const alphaBar = Math.cos(((progress + 0.008) / 1.008) * (Math.PI / 2)) ** 2;
  const mean = Math.sqrt(alphaBar) * x0;
  const variance = 1 - alphaBar;
  // Deterministic sample for visualization
  const noisyValue = mean + Math.sqrt(variance) * 0.75;
  return { alphaBar, mean, variance, noisyValue };
}
