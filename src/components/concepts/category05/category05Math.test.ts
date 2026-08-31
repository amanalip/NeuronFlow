import { describe, it, expect } from 'vitest';
import {
  computeScaledDotProductAttention,
  computeSinusoidalPE,
  computeRmsNorm,
  computeLayerNorm,
  calculateKvCacheMemoryBytes,
} from './category05Math';

describe('Category 05: Transformer Math & Attention Operations', () => {
  it('computes scaled dot-product attention with causal mask', () => {
    const Q = [
      [1.0, 0.0],
      [0.0, 1.0],
    ];
    const K = [
      [1.0, 0.0],
      [0.0, 1.0],
    ];
    const V = [
      [2.0, 1.0],
      [0.5, 3.0],
    ];

    const { weights } = computeScaledDotProductAttention(Q, K, V, true, true);

    // Row 0 can only attend to position 0 (causal mask)
    expect(weights[0][0]).toBeCloseTo(1.0, 4);
    expect(weights[0][1]).toBe(0.0);

    // Row 1 can attend to positions 0 and 1
    expect(weights[1][0] + weights[1][1]).toBeCloseTo(1.0, 4);
  });

  it('generates sinusoidal positional encodings within [-1, 1]', () => {
    const pe0 = computeSinusoidalPE(0, 0, 64);
    const pe1 = computeSinusoidalPE(0, 1, 64);
    expect(pe0).toBeCloseTo(0.0, 4); // sin(0) = 0
    expect(pe1).toBeCloseTo(1.0, 4); // cos(0) = 1

    const pePos = computeSinusoidalPE(10, 4, 64);
    expect(pePos).toBeGreaterThanOrEqual(-1.0);
    expect(pePos).toBeLessThanOrEqual(1.0);
  });

  it('normalizes vector with RMSNorm and LayerNorm', () => {
    const x = [2.0, -2.0, 2.0, -2.0];
    const rms = computeRmsNorm(x);
    expect(rms[0]).toBeCloseTo(1.0, 3);
    expect(rms[1]).toBeCloseTo(-1.0, 3);

    const ln = computeLayerNorm(x);
    const lnMean = ln.reduce((a, b) => a + b, 0) / ln.length;
    expect(lnMean).toBeCloseTo(0.0, 4);
  });

  it('calculates KV cache memory footprint accurately', () => {
    // 32 layers, 32 heads, 128 dHead, 2048 seqLen, batchSize = 1, FP16 (2 bytes)
    const bytes = calculateKvCacheMemoryBytes(32, 32, 128, 2048, 1, 2);
    // 2 * 2 * 32 * 32 * 128 * 2048 * 1 = 1,073,741,824 bytes = 1 GB = 1024 MB
    expect(bytes).toBe(1073741824);
  });
});
