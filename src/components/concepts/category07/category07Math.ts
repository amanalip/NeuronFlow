// Mathematical and algorithmic helpers for Category 7: Pre-training & Scaling Laws

export function computeKaplanLoss(nParamsM: number, dTokensB: number): number {
  // Kaplan et al. (2020) power law approximation: L(N, D) = (Nc/N)^alpha_N + (Dc/D)^alpha_D
  const alphaN = 0.076;
  const alphaD = 0.057;
  const lossN = Math.pow(1000 / (nParamsM + 1), alphaN);
  const lossD = Math.pow(100 / (dTokensB + 1), alphaD);
  return (lossN + lossD) * 1.5;
}

export function computeChinchillaOptimal(computeFlops10e21: number): {
  optimalParamsB: number;
  optimalTokensB: number;
} {
  // Chinchilla rule: C = 6 * N * D, with N proportional to sqrt(C) and D proportional to sqrt(C)
  // Optimal ratio: D ≈ 20 * N
  // 6 * N * 20N = 120 N^2 = C => N = sqrt(C / 120)
  const totalFlops = computeFlops10e21 * 1e21;
  const optimalParams = Math.sqrt(totalFlops / 120);
  const optimalTokens = optimalParams * 20;

  return {
    optimalParamsB: optimalParams / 1e9,
    optimalTokensB: optimalTokens / 1e9,
  };
}

export function computeCosineSchedule(
  step: number,
  warmupSteps: number,
  totalSteps: number,
  peakLr = 1e-4,
  minLr = 1e-5
): number {
  if (step < warmupSteps) {
    return (step / Math.max(1, warmupSteps)) * peakLr;
  }
  const progress = (step - warmupSteps) / Math.max(1, totalSteps - warmupSteps);
  return minLr + 0.5 * (peakLr - minLr) * (1 + Math.cos(Math.PI * progress));
}

export function computeWsdSchedule(
  step: number,
  warmupSteps: number,
  decayStartStep: number,
  totalSteps: number,
  peakLr = 1e-4,
  minLr = 1e-5
): number {
  if (step < warmupSteps) {
    return (step / Math.max(1, warmupSteps)) * peakLr;
  }
  if (step < decayStartStep) {
    return peakLr; // Stable phase
  }
  const decayProgress = (step - decayStartStep) / Math.max(1, totalSteps - decayStartStep);
  return minLr + 0.5 * (peakLr - minLr) * (1 + Math.cos(Math.PI * decayProgress));
}

export interface FloatFormatInfo {
  name: string;
  totalBits: number;
  signBits: number;
  expBits: number;
  mantissaBits: number;
  dynamicRange: string;
  useCase: string;
}

export const PRECISION_FORMATS: FloatFormatInfo[] = [
  { name: 'FP32', totalBits: 32, signBits: 1, expBits: 8, mantissaBits: 23, dynamicRange: '10^-38 to 10^38', useCase: 'Master weights & loss accumulator' },
  { name: 'FP16', totalBits: 16, signBits: 1, expBits: 5, mantissaBits: 10, dynamicRange: '10^-5 to 6.5 x 10^4', useCase: 'Legacy training (requires loss scaling)' },
  { name: 'BF16', totalBits: 16, signBits: 1, expBits: 8, mantissaBits: 7, dynamicRange: '10^-38 to 10^38', useCase: 'Modern standard LLM training (Ampere / Hopper)' },
  { name: 'FP8 (E4M3)', totalBits: 8, signBits: 1, expBits: 4, mantissaBits: 3, dynamicRange: 'Higher precision for forward activations', useCase: 'FP8 forward pass' },
  { name: 'FP8 (E5M2)', totalBits: 8, signBits: 1, expBits: 5, mantissaBits: 2, dynamicRange: 'Higher dynamic range for backward gradients', useCase: 'FP8 backward pass' },
  { name: 'INT8', totalBits: 8, signBits: 1, expBits: 0, mantissaBits: 7, dynamicRange: '-128 to 127 (Linear Quantization)', useCase: 'Inference quantization (bitsandbytes / AWQ)' },
  { name: 'INT4', totalBits: 4, signBits: 1, expBits: 0, mantissaBits: 3, dynamicRange: '-8 to 7 (Weight-Only Quantization)', useCase: 'Edge inference (GPTQ / AWQ / GGUF)' },
];
