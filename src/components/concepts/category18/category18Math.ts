// Mathematical and algorithmic engines for Category 18: Model Family Tree & History

export function computeTrainingFlops(
  paramCountBillion: number,
  trainingTokensTrillion: number
): {
  flops: number;
  log10Flops: number;
  gpuHoursH100: number; // H100 ~ 1e15 FP16 FLOPs/sec effective
} {
  const n = paramCountBillion * 1e9;
  const d = trainingTokensTrillion * 1e12;
  const flops = 6 * n * d;
  const log10Flops = Math.log10(flops);

  // H100 GPU throughput ~ 500 TFLOPs FP16/BF16 sustained with MFU ~ 45% = ~2.25e14 FLOP/s
  const h100FlopsPerSec = 2.25e14;
  const gpuHoursH100 = flops / (h100FlopsPerSec * 3600);

  return { flops, log10Flops, gpuHoursH100 };
}

export function computeEmergenceMetric(
  scaleFlopsLog10: number,
  thresholdLog10 = 23.5,
  isNonLinearAccuracy = true
): number {
  if (isNonLinearAccuracy) {
    // Non-linear 0/1 exact match accuracy step function
    if (scaleFlopsLog10 < thresholdLog10) {
      return 0.05 * Math.random();
    }
    const delta = scaleFlopsLog10 - thresholdLog10;
    return Math.min(0.95, 0.1 + 0.85 * (1 - Math.exp(-1.5 * delta)));
  }

  // Continuous cross-entropy or Brier score shows smooth linear improvement
  const normalized = (scaleFlopsLog10 - 20) / 6; // range 20 to 26
  return Math.max(0.1, Math.min(0.95, normalized));
}
