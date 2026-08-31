import { describe, it, expect } from 'vitest';
import {
  computeMoeRouting,
  computeMambaDiscretization,
  computeRwkvDecay,
  computeDiffusionForwardStep,
} from './category12Math';

describe('Category 12 Mathematics & Architecture Variants', () => {
  it('computes top-K MoE expert routing and auxiliary loss correctly', () => {
    const logits = [3.0, 1.0, 0.5, 2.5];
    const { topKIndices, topKWeights, auxiliaryLoss } = computeMoeRouting(logits, 2);

    expect(topKIndices.length).toBe(2);
    expect(topKIndices[0]).toBe(0); // Highest logit is at index 0
    expect(topKIndices[1]).toBe(3); // Second highest is at index 3
    expect(topKWeights[0] + topKWeights[1]).toBeCloseTo(1.0, 5);
    expect(auxiliaryLoss).toBeGreaterThan(0);
  });

  it('calculates Mamba continuous-to-discrete state space parameters', () => {
    const delta = 0.5;
    const aCont = -1.0;
    const bCont = 2.0;
    const { aDiscrete, bDiscrete } = computeMambaDiscretization(delta, aCont, bCont);

    expect(aDiscrete).toBeCloseTo(Math.exp(-0.5), 5);
    expect(bDiscrete).toBeCloseTo(1.0, 5);
  });

  it('computes RWKV exponential time-decay attention weights', () => {
    const tokens = [1, 2, 3, 4];
    const weights = computeRwkvDecay(tokens, 0.5);

    expect(weights.length).toBe(4);
    // Most recent token should have highest attention weight
    expect(weights[3]).toBeGreaterThan(weights[0]);
    const sum = weights.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 5);
  });

  it('calculates Diffusion forward Markov noise schedule properties', () => {
    const { alphaBar, mean, variance } = computeDiffusionForwardStep(2.0, 500, 1000);

    expect(alphaBar).toBeGreaterThan(0);
    expect(alphaBar).toBeLessThan(1);
    expect(alphaBar + variance).toBeCloseTo(1.0, 5);
    expect(mean).toBeGreaterThan(0);
  });
});
