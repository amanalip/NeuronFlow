import { describe, it, expect } from 'vitest';
import {
  computeKaplanLoss,
  computeChinchillaOptimal,
  computeCosineSchedule,
  computeWsdSchedule,
  PRECISION_FORMATS,
} from './category07Math';

describe('Category 07: Pre-training & Scaling Laws Math', () => {
  it('computes Kaplan power law loss correctly', () => {
    const lossSmall = computeKaplanLoss(100, 10);
    const lossLarge = computeKaplanLoss(10000, 1000);
    expect(lossSmall).toBeGreaterThan(lossLarge);
  });

  it('computes Chinchilla-optimal parameter and token allocations (D ≈ 20N)', () => {
    const { optimalParamsB, optimalTokensB } = computeChinchillaOptimal(100);
    expect(optimalParamsB).toBeGreaterThan(0);
    expect(optimalTokensB).toBeGreaterThan(0);
    // D should be ~20 * N
    expect(optimalTokensB / optimalParamsB).toBeCloseTo(20.0, 1);
  });

  it('computes Cosine and WSD learning rate schedules', () => {
    const warmupSteps = 100;
    const totalSteps = 1000;
    const decayStart = 800;

    // During warmup
    const cosineWarm = computeCosineSchedule(50, warmupSteps, totalSteps, 1e-4, 1e-5);
    expect(cosineWarm).toBeCloseTo(0.5e-4, 5);

    // During WSD stable phase
    const wsdStable = computeWsdSchedule(500, warmupSteps, decayStart, totalSteps, 1e-4, 1e-5);
    expect(wsdStable).toBeCloseTo(1e-4, 5);
  });

  it('contains valid precision formats', () => {
    expect(PRECISION_FORMATS.length).toBeGreaterThanOrEqual(6);
    const bf16 = PRECISION_FORMATS.find((f) => f.name === 'BF16');
    expect(bf16).toBeDefined();
    expect(bf16?.totalBits).toBe(16);
    expect(bf16?.expBits).toBe(8);
  });
});
