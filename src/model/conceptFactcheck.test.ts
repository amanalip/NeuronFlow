import { describe, it, expect } from 'vitest';
import { CONCEPTS } from './concept-registry';
import { CATEGORIES } from './categories';

describe('Milestone 39: Full Content Polish, Integrity & Factcheck Suite', () => {
  it('validates that all 215 concepts have complete and thorough structured content', () => {
    expect(CONCEPTS.length).toBe(215);

    CONCEPTS.forEach((c) => {
      expect(c.title.trim().length).toBeGreaterThan(2);
      expect(c.summary.trim().length).toBeGreaterThan(10);
      expect(c.category.trim().length).toBeGreaterThan(2);
      expect(c.categoryNumber).toBeGreaterThanOrEqual(1);
      expect(c.categoryNumber).toBeLessThanOrEqual(18);

      // Verify explanation sections
      expect(c.explanation.what.trim().length).toBeGreaterThan(15);
      expect(c.explanation.why.trim().length).toBeGreaterThan(15);
      expect(c.explanation.how.length).toBeGreaterThanOrEqual(2);
      expect(c.explanation.keyTakeaway.trim().length).toBeGreaterThan(15);

      // Verify verified sources
      expect(c.explanation.sources.length).toBeGreaterThan(0);
      c.explanation.sources.forEach((s) => {
        expect(s.title.trim().length).toBeGreaterThan(2);
        expect(s.url.startsWith('http://') || s.url.startsWith('https://')).toBe(true);
      });
    });
  });

  it('validates that all 18 categories have exact concept counts and valid sequential ranges', () => {
    expect(CATEGORIES.length).toBe(18);

    let expectedStart = 1;
    CATEGORIES.forEach((cat) => {
      expect(cat.range[0]).toBe(expectedStart);
      expect(cat.range[1]).toBe(expectedStart + cat.conceptCount - 1);
      expectedStart = cat.range[1] + 1;
    });

    expect(expectedStart).toBe(216); // All 215 covered sequentially
  });

  it('ensures zero em dashes in any concept explanation string', () => {
    CONCEPTS.forEach((c) => {
      expect(c.title).not.toContain('—');
      expect(c.summary).not.toContain('—');
      expect(c.explanation.what).not.toContain('—');
      expect(c.explanation.why).not.toContain('—');
      c.explanation.how.forEach((step) => {
        expect(step).not.toContain('—');
      });
      expect(c.explanation.keyTakeaway).not.toContain('—');
    });
  });

  it('ensures zero AI buzzwords in concept explanations', () => {
    const buzzwords = [
      'delve',
      'utilize',
      'leverage',
      'streamline',
      'harness',
      'revolutionize',
      'cutting-edge',
      'game-changer',
      'elevate',
      'empower',
      'unlock',
      'supercharge',
      'deep dive',
      'at the end of the day',
      'it\'s worth noting',
      'in terms of',
      'it should be noted',
      'in today\'s world',
      'a myriad of',
    ];

    CONCEPTS.forEach((c) => {
      const fullText = [
        c.title,
        c.summary,
        c.explanation.what,
        c.explanation.why,
        ...c.explanation.how,
        c.explanation.keyTakeaway,
      ].join(' ').toLowerCase();

      buzzwords.forEach((bw) => {
        const found = fullText.includes(bw);
        if (found) {
          throw new Error(`Concept #${c.number} (${c.title}) contains forbidden buzzword: "${bw}"`);
        }
        expect(found).toBe(false);
      });
    });
  });
});
