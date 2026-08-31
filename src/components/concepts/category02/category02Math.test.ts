import { describe, it, expect } from 'vitest';
import {
  computeCosineSimilarity,
  computeTf,
  computeIdf,
  computeTfIdf,
  extractNgrams,
  extractSubwords,
  findNearestWord,
  EMBEDDING_VOCAB,
} from './category02Math';

describe('Category 02: Text Representation Math', () => {
  it('computes cosine similarity accurately', () => {
    // Parallel vectors -> 1.0
    expect(computeCosineSimilarity([1, 2, 3], [2, 4, 6])).toBeCloseTo(1.0, 5);
    // Orthogonal vectors -> 0.0
    expect(computeCosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0.0, 5);
    // Opposite vectors -> -1.0
    expect(computeCosineSimilarity([1, 1], [-1, -1])).toBeCloseTo(-1.0, 5);
  });

  it('computes TF, IDF, and TF-IDF scores', () => {
    const doc1 = ['the', 'cat', 'sat'];
    const doc2 = ['the', 'dog', 'barked'];
    const allDocs = [doc1, doc2];

    const tfCat = computeTf('cat', doc1);
    expect(tfCat).toBeCloseTo(1 / 3, 4);

    const idfCat = computeIdf('cat', allDocs);
    const idfThe = computeIdf('the', allDocs);
    // 'cat' is more specific than 'the' (which appears in all documents), so idfCat > idfThe
    expect(idfCat).toBeGreaterThan(idfThe);

    const tfIdfCat = computeTfIdf('cat', doc1, allDocs);
    expect(tfIdfCat).toBeGreaterThan(0);
  });

  it('extracts N-grams correctly from text', () => {
    const text = 'the neural network predicts tokens';
    const bigrams = extractNgrams(text, 2);
    expect(bigrams).toEqual([
      'the neural',
      'neural network',
      'network predicts',
      'predicts tokens',
    ]);

    const trigrams = extractNgrams(text, 3);
    expect(trigrams.length).toBe(3);
    expect(trigrams[0]).toBe('the neural network');
  });

  it('extracts character subwords for FastText', () => {
    const subwords = extractSubwords('where', 3, 3);
    expect(subwords).toContain('<wh');
    expect(subwords).toContain('whe');
    expect(subwords).toContain('her');
    expect(subwords).toContain('ere');
    expect(subwords).toContain('re>');
  });

  it('performs vector analogy search (King - Man + Woman ~ Queen)', () => {
    const king = EMBEDDING_VOCAB.find((v) => v.word === 'king')!;
    const man = EMBEDDING_VOCAB.find((v) => v.word === 'man')!;
    const woman = EMBEDDING_VOCAB.find((v) => v.word === 'woman')!;

    const target: [number, number, number] = [
      king.x - man.x + woman.x,
      king.y - man.y + woman.y,
      king.z - man.z + woman.z,
    ];

    const nearest = findNearestWord(target, ['king', 'man', 'woman']);
    expect(nearest.word).toBe('queen');
  });
});
