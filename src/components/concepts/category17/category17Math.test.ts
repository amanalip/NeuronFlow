import { describe, it, expect } from 'vitest';
import {
  computeGpuVramBreakdown,
  computeServingLatency,
  computePrefillVsDecodeIntensity,
} from './category17Math';

describe('Category 17 Mathematics & Serving Infrastructure Algorithms', () => {
  it('calculates GPU VRAM memory breakdown accurately', () => {
    const { modelWeightsGb, kvCacheGb, totalVramGb } = computeGpuVramBreakdown(
      8,
      2, // FP16
      4096,
      8
    );

    expect(modelWeightsGb).toBeGreaterThan(14); // ~14.9 GB for 8B params in FP16
    expect(kvCacheGb).toBeGreaterThan(0);
    expect(totalVramGb).toBeLessThan(80); // Fits within 80GB H100
  });

  it('calculates serving latency (TTFT and TPOT)', () => {
    const { ttftMs, tpotMs, totalLatencySec, effectiveTokensPerSec } = computeServingLatency(
      2000,
      500
    );

    expect(ttftMs).toBeGreaterThan(0);
    expect(tpotMs).toBeGreaterThan(0);
    expect(totalLatencySec).toBeGreaterThan(0);
    expect(effectiveTokensPerSec).toBeGreaterThan(0);
  });

  it('contrasts prefill compute intensity with decode memory bandwidth intensity', () => {
    const { prefillIntensityFlopsPerByte, decodeIntensityFlopsPerByte } = computePrefillVsDecodeIntensity(
      4096,
      2048
    );

    expect(prefillIntensityFlopsPerByte).toBeGreaterThan(decodeIntensityFlopsPerByte * 100);
    expect(decodeIntensityFlopsPerByte).toBeCloseTo(1.0, 1);
  });
});
