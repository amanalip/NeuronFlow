import { describe, it, expect } from 'vitest';
import {
  chunkTextWithOverlap,
  computeCosineSimilarity,
  computeReciprocalRankFusion,
  computeRagasMetrics,
} from './category13Math';

describe('Category 13 Mathematics & RAG Algorithms', () => {
  it('chunks text accurately with sliding overlap window', () => {
    const text = 'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen';
    const chunks = chunkTextWithOverlap(text, 5, 2);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].text.split(' ').length).toBe(5);
    // Overlap should carry 2 words over
    expect(chunks[1].startWord).toBe(3);
  });

  it('calculates cosine similarity between dense vectors', () => {
    const vecA = [1.0, 0.0, 0.0];
    const vecB = [1.0, 0.0, 0.0];
    const vecC = [0.0, 1.0, 0.0];

    expect(computeCosineSimilarity(vecA, vecB)).toBeCloseTo(1.0, 5);
    expect(computeCosineSimilarity(vecA, vecC)).toBeCloseTo(0.0, 5);
  });

  it('computes Reciprocal Rank Fusion (RRF) scores', () => {
    const scoreRank1 = computeReciprocalRankFusion(1, 1, 60);
    const scoreRank5 = computeReciprocalRankFusion(5, 5, 60);

    expect(scoreRank1).toBeGreaterThan(scoreRank5);
    expect(scoreRank1).toBeCloseTo(2 / 61, 5);
  });

  it('computes RAGAS precision, recall, faithfulness, and harmonic mean', () => {
    const { contextPrecision, contextRecall, faithfulness, ragasHarmonicMean } = computeRagasMetrics(
      4,
      5,
      4,
      3,
      4
    );

    expect(contextPrecision).toBe(0.8);
    expect(contextRecall).toBe(1.0);
    expect(faithfulness).toBe(0.75);
    expect(ragasHarmonicMean).toBeGreaterThan(0.7);
    expect(ragasHarmonicMean).toBeLessThan(1.0);
  });
});
