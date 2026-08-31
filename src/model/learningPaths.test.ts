import { describe, it, expect } from 'vitest';
import { PREREQUISITES_MAP, GUIDED_LEARNING_TRACKS, getEstimatedReadMinutes } from './learningPaths';
import { CONCEPTS } from './concept-registry';

describe('Milestone 37: Learning Paths & Prerequisites Graph', () => {
  it('ensures all prerequisite targets are valid concept numbers (1-215)', () => {
    const validNumbers = new Set(CONCEPTS.map((c) => c.number));

    Object.entries(PREREQUISITES_MAP).forEach(([conceptNumStr, prereqs]) => {
      const conceptNum = Number(conceptNumStr);
      expect(validNumbers.has(conceptNum)).toBe(true);

      prereqs.forEach((p) => {
        expect(validNumbers.has(p)).toBe(true);
        expect(p).not.toBe(conceptNum); // Cannot be prerequisite to self
      });
    });
  });

  it('verifies that the prerequisite graph is a Directed Acyclic Graph (DAG) with no cycles', () => {
    const visited = new Set<number>();
    const recursionStack = new Set<number>();

    function hasCycle(node: number): boolean {
      visited.add(node);
      recursionStack.add(node);

      const neighbors = PREREQUISITES_MAP[node] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }

      recursionStack.delete(node);
      return false;
    }

    Object.keys(PREREQUISITES_MAP).forEach((k) => {
      const node = Number(k);
      if (!visited.has(node)) {
        expect(hasCycle(node)).toBe(false);
      }
    });
  });

  it('validates guided learning tracks', () => {
    expect(GUIDED_LEARNING_TRACKS.length).toBe(4);
    const validNumbers = new Set(CONCEPTS.map((c) => c.number));

    GUIDED_LEARNING_TRACKS.forEach((track) => {
      expect(track.conceptNumbers.length).toBeGreaterThan(5);
      track.conceptNumbers.forEach((n) => {
        expect(validNumbers.has(n)).toBe(true);
      });
    });
  });

  it('computes realistic estimated read minutes', () => {
    expect(getEstimatedReadMinutes('Beginner')).toBe(3);
    expect(getEstimatedReadMinutes('Intermediate')).toBe(6);
    expect(getEstimatedReadMinutes('Advanced')).toBe(10);
  });
});
