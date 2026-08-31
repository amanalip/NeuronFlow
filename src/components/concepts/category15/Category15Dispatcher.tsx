import React from 'react';
import { Concept } from '../../../model/types';
import { AgentLoopViz, PlanningTaskDecompositionViz, AgentMemoryViz } from './AgentLoopPlanningMemoryViz';
import { MultiAgentSystemsViz, CodeExecutionAgentsViz, ReflectionSelfCorrectionViz } from './MultiAgentCodeExecutionReflexionViz';
import { AutonomousOrchestrationPatternsViz } from './AutonomousOrchestrationPatternsViz';

interface Category15DispatcherProps {
  concept: Concept;
}

export const Category15Dispatcher: React.FC<Category15DispatcherProps> = ({ concept }) => {
  switch (concept.slug) {
    case 'agent-loop':
    case '178-agent-loop':
    case 'tool-use-pipeline':
    case '179-tool-use-pipeline':
      return <AgentLoopViz />;

    case 'planning-task-decomposition':
    case '180-planning-task-decomposition':
      return <PlanningTaskDecompositionViz />;

    case 'memory-short-term':
    case '181-memory-short-term':
    case 'memory-long-term':
    case '182-memory-long-term':
      return <AgentMemoryViz />;

    case 'multi-agent-systems':
    case '183-multi-agent-systems':
      return <MultiAgentSystemsViz />;

    case 'code-execution-agents':
    case '184-code-execution-agents':
      return <CodeExecutionAgentsViz />;

    case 'reflection-self-correction':
    case '185-reflection-self-correction':
      return <ReflectionSelfCorrectionViz />;

    case 'autonomous-agents':
    case '186-autonomous-agents':
    case 'orchestration-patterns':
    case '187-orchestration-patterns':
      return <AutonomousOrchestrationPatternsViz />;

    default:
      return <AgentLoopViz />;
  }
};
