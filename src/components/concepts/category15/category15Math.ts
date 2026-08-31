// Mathematical and algorithmic engines for Category 15: Agents & Multi-Step Reasoning

export interface AgentTaskNode {
  id: string;
  name: string;
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export function computeTopologicalSort(tasks: AgentTaskNode[]): string[] {
  const inDegree: Record<string, number> = {};
  const adjList: Record<string, string[]> = {};

  tasks.forEach((t) => {
    inDegree[t.id] = 0;
    adjList[t.id] = [];
  });

  tasks.forEach((t) => {
    t.dependencies.forEach((dep) => {
      if (adjList[dep]) {
        adjList[dep].push(t.id);
        inDegree[t.id] = (inDegree[t.id] || 0) + 1;
      }
    });
  });

  const queue: string[] = [];
  Object.keys(inDegree).forEach((id) => {
    if (inDegree[id] === 0) queue.push(id);
  });

  const sortedOrder: string[] = [];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    sortedOrder.push(curr);

    adjList[curr]?.forEach((neighbor) => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }

  return sortedOrder;
}

export function computeReflexionRevision(
  draftScore: number,
  critiqueSeverity: number
): { revisedScore: number; improvement: number } {
  // Verbal reinforcement learning revision boost
  const gain = (1.0 - draftScore) * (critiqueSeverity * 0.75 + 0.15);
  const revisedScore = Math.min(1.0, draftScore + gain);
  const improvement = revisedScore - draftScore;

  return { revisedScore, improvement };
}
