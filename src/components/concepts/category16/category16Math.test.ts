import { describe, it, expect } from 'vitest';
import {
  computePerplexity,
  computeBleuScore,
  computeBradleyTerryElo,
  computeExpectedCalibrationError,
} from './category16Math';

describe('Category 16 Mathematics & Evaluation Algorithms', () => {
  it('computes perplexity from cross-entropy loss', () => {
    const loss = 2.0;
    const ppl = computePerplexity(loss);
    expect(ppl).toBeCloseTo(Math.exp(2.0), 5);
  });

  it('calculates BLEU score with n-gram precision and brevity penalty', () => {
    const candidate = ['the', 'quick', 'brown', 'fox'];
    const reference = ['the', 'fast', 'brown', 'fox'];

    const { p1, brevityPenalty, bleuScore } = computeBleuScore(candidate, reference);
    expect(p1).toBe(0.75); // 3 out of 4 words match
    expect(brevityPenalty).toBe(1.0);
    expect(bleuScore).toBeGreaterThan(0);
  });

  it('computes Bradley-Terry ELO rating updates', () => {
    const { newRatingA, newRatingB, delta } = computeBradleyTerryElo(1200, 1200, 1, 32);
    expect(delta).toBe(16);
    expect(newRatingA).toBe(1216);
    expect(newRatingB).toBe(1184);
  });

  it('computes Expected Calibration Error (ECE)', () => {
    const bins = [
      { confidence: 0.2, accuracy: 0.2, count: 100 },
      { confidence: 0.8, accuracy: 0.7, count: 100 },
    ];
    const ece = computeExpectedCalibrationError(bins);
    expect(ece).toBeCloseTo(0.05, 4);
  });
});
