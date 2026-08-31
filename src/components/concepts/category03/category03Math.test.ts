import { describe, it, expect } from 'vitest';
import { simulateBpeMerges, MULTILINGUAL_BENCHMARK } from './category03Math';

describe('Category 03: Tokenization Math & BPE Simulator', () => {
  it('simulates BPE merge iterations correctly', () => {
    const corpus = {
      low: 5,
      lower: 2,
      newest: 6,
      widest: 3,
    };

    const { merges, vocabulary } = simulateBpeMerges(corpus, 4);

    expect(merges.length).toBe(4);
    expect(vocabulary.length).toBeGreaterThan(6);

    // Initial letters must be in vocabulary
    expect(vocabulary).toContain('l');
    expect(vocabulary).toContain('o');
    expect(vocabulary).toContain('w');
  });

  it('contains valid multilingual benchmark data', () => {
    expect(MULTILINGUAL_BENCHMARK.length).toBe(10);

    const english = MULTILINGUAL_BENCHMARK.find((l) => l.code === 'en');
    expect(english).toBeDefined();
    expect(english?.ratio).toBe(1.0);

    const hindi = MULTILINGUAL_BENCHMARK.find((l) => l.code === 'hi');
    expect(hindi).toBeDefined();
    expect(hindi?.ratio).toBeGreaterThan(2.0);
  });
});
