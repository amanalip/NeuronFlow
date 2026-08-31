import { describe, it, expect } from 'vitest';
import { GLOSSARY_TERMS, getRelatedConceptNumbers } from './glossary';
import { CONCEPTS } from './concept-registry';

describe('Milestone 38: Glossary & Cross-Reference Linking', () => {
  it('verifies glossary terms list and concept linkages', () => {
    expect(GLOSSARY_TERMS.length).toBeGreaterThan(40);
    const validNumbers = new Set(CONCEPTS.map((c) => c.number));

    GLOSSARY_TERMS.forEach((term) => {
      expect(term.term.length).toBeGreaterThan(0);
      expect(term.definition.length).toBeGreaterThan(10);
      expect(validNumbers.has(term.conceptNumber)).toBe(true);
      expect(term.categoryNumber).toBeGreaterThanOrEqual(1);
      expect(term.categoryNumber).toBeLessThanOrEqual(18);
    });
  });

  it('verifies related concept cross-references', () => {
    const relatedForSelfAttention = getRelatedConceptNumbers(48);
    expect(relatedForSelfAttention.length).toBeGreaterThan(0);
    expect(relatedForSelfAttention).not.toContain(48);

    const relatedForRAG = getRelatedConceptNumbers(152);
    expect(relatedForRAG.length).toBeGreaterThan(0);
    expect(relatedForRAG).not.toContain(152);
  });
});
