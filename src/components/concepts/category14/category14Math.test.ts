import { describe, it, expect } from 'vitest';
import {
  computeTokenCost,
  computeSelfConsistencyMajority,
  computeLostInMiddleRecall,
  PRICING_TIERS,
} from './category14Math';

describe('Category 14 Mathematics & Prompting Algorithms', () => {
  it('calculates token billing costs and prompt caching discount', () => {
    const promptTokens = 100_000;
    const completionTokens = 1_000;
    const cachedTokens = 80_000;

    const result = computeTokenCost(
      promptTokens,
      completionTokens,
      cachedTokens,
      PRICING_TIERS.gpt4o
    );

    expect(result.totalCost).toBeLessThan(result.totalCostWithoutCaching);
    expect(result.savingsPercentage).toBeGreaterThan(0);
  });

  it('determines consensus winner in self-consistency voting', () => {
    const candidateAnswers = ['11', '11', '21', '11', '11', '5'];
    const { winner, voteCount, confidence } = computeSelfConsistencyMajority(candidateAnswers);

    expect(winner).toBe('11');
    expect(voteCount).toBe(4);
    expect(confidence).toBeCloseTo(4 / 6, 5);
  });

  it('evaluates Lost-in-the-Middle U-shaped recall degradation', () => {
    const startRecall = computeLostInMiddleRecall(0, 64_000);
    const middleRecall = computeLostInMiddleRecall(50, 64_000);
    const endRecall = computeLostInMiddleRecall(100, 64_000);

    expect(startRecall).toBeGreaterThan(middleRecall);
    expect(endRecall).toBeGreaterThan(middleRecall);
  });
});
