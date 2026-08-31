import { describe, it, expect } from 'vitest';
import {
  computeTopologicalSort,
  computeReflexionRevision,
  AgentTaskNode,
} from './category15Math';

describe('Category 15 Mathematics & Agent Reasoning Algorithms', () => {
  it('computes topological sort for DAG task decomposition', () => {
    const tasks: AgentTaskNode[] = [
      { id: 'a', name: 'Task A', dependencies: [], status: 'completed' },
      { id: 'b', name: 'Task B', dependencies: ['a'], status: 'pending' },
      { id: 'c', name: 'Task C', dependencies: ['b'], status: 'pending' },
    ];

    const order = computeTopologicalSort(tasks);
    expect(order).toEqual(['a', 'b', 'c']);
  });

  it('calculates Reflexion self-correction score boost', () => {
    const initialScore = 0.6;
    const critiqueSeverity = 0.8;
    const { revisedScore, improvement } = computeReflexionRevision(initialScore, critiqueSeverity);

    expect(revisedScore).toBeGreaterThan(initialScore);
    expect(improvement).toBeGreaterThan(0);
    expect(revisedScore).toBeLessThanOrEqual(1.0);
  });
});
