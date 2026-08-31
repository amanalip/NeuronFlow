import { describe, it, expect } from 'vitest';
import { CONCEPTS, getConceptById, getConceptBySlug } from './concept-registry';
import { CATEGORIES } from './categories';

describe('Concept Registry', () => {
  it('contains exactly 215 concepts', () => {
    expect(CONCEPTS.length).toBe(215);
  });

  it('contains exactly 18 categories matching total count', () => {
    expect(CATEGORIES.length).toBe(18);
    const totalInCategories = CATEGORIES.reduce((acc, cat) => acc + cat.conceptCount, 0);
    expect(totalInCategories).toBe(215);
  });

  it('has strictly sequential numbering from 1 to 215', () => {
    CONCEPTS.forEach((concept, idx) => {
      expect(concept.number).toBe(idx + 1);
    });
  });

  it('has unique IDs and slugs across all concepts', () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    CONCEPTS.forEach((concept) => {
      expect(ids.has(concept.id)).toBe(false);
      expect(slugs.has(concept.slug)).toBe(false);
      ids.add(concept.id);
      slugs.add(concept.slug);
    });

    expect(ids.size).toBe(215);
    expect(slugs.size).toBe(215);
  });

  it('has valid categories, difficulties, and non-empty explanations', () => {
    const validDifficulties = new Set(['Beginner', 'Intermediate', 'Advanced']);

    CONCEPTS.forEach((concept) => {
      expect(concept.categoryNumber).toBeGreaterThanOrEqual(1);
      expect(concept.categoryNumber).toBeLessThanOrEqual(18);
      expect(validDifficulties.has(concept.difficulty)).toBe(true);
      expect(concept.title.length).toBeGreaterThan(0);
      expect(concept.summary.length).toBeGreaterThan(0);

      // Structured explanation
      expect(concept.explanation.what.length).toBeGreaterThan(10);
      expect(concept.explanation.why.length).toBeGreaterThan(10);
      expect(concept.explanation.how.length).toBeGreaterThan(0);
      expect(concept.explanation.keyTakeaway.length).toBeGreaterThan(5);
      expect(concept.explanation.sources.length).toBeGreaterThan(0);
      expect(concept.explanation.sources[0].url).toMatch(/^https?:\/\//);
    });
  });

  it('looks up concepts by ID and slug accurately', () => {
    const perceptron = getConceptById('01-perceptron');
    expect(perceptron).toBeDefined();
    expect(perceptron?.number).toBe(1);
    expect(perceptron?.title).toBe('Perceptron');

    const transformer = getConceptBySlug('transformer', 'transformer-architecture');
    expect(transformer).toBeDefined();
    expect(transformer?.number).toBe(48);

    const emergent = getConceptById('215-emergent-abilities');
    expect(emergent).toBeDefined();
    expect(emergent?.number).toBe(215);
  });
});
