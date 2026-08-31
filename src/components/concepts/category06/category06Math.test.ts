import { describe, it, expect } from 'vitest';
import {
  computeTopKGating,
  simulateLinearAttentionComplexity,
  simulateSelectiveSsmStep,
} from './category06Math';

describe('Category 06: Transformer Variants & Modern Architectures Math', () => {
  it('computes Top-K MoE expert gating correctly', () => {
    const token = [1.0, 0.0];
    const experts = [
      [0.9, 0.1], // Expert 0
      [0.2, 0.8], // Expert 1
      [0.8, 0.1], // Expert 2
      [0.1, 0.1], // Expert 3
    ];

    const { expertIndices, expertWeights } = computeTopKGating(token, experts, 2);

    expect(expertIndices.length).toBe(2);
    // Expert 0 has highest dot product (0.9), Expert 2 has second highest (0.8)
    expect(expertIndices[0]).toBe(0);
    expect(expertIndices[1]).toBe(2);

    const sumWeights = expertWeights.reduce((a, b) => a + b, 0);
    expect(sumWeights).toBeCloseTo(1.0, 4);
  });

  it('demonstrates crossover in linear vs quadratic attention FLOPs', () => {
    const shortSeq = simulateLinearAttentionComplexity(32, 64);
    // When N is small (32 < 64), quadratic (2 * 32^2 * 64 = 131072) < linear (2 * 32 * 64^2 = 262144)
    expect(shortSeq.quadraticFlops).toBeLessThan(shortSeq.linearFlops);

    const longSeq = simulateLinearAttentionComplexity(4096, 64);
    // When N is large (4096 >> 64), linear << quadratic
    expect(longSeq.linearFlops).toBeLessThan(longSeq.quadraticFlops);
  });

  it('computes selective SSM step discretization', () => {
    const { h, y } = simulateSelectiveSsmStep(1.0, 0.0, 0.5, -1.0, 1.0);
    expect(h).toBeCloseTo(0.5, 4);
    expect(y).toBeDefined();
  });
});
