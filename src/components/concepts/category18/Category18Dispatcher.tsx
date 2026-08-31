import React from 'react';
import { Concept } from '../../../model/types';
import { EvolutionTimelineViz, ModelFamilyTreeViz } from './EvolutionTimelineFamilyTreeViz';
import { ParameterCountEvolutionViz, OpenVsClosedModelsViz, BenchmarkProgressViz } from './ParameterScaleOpenClosedBenchmarkViz';
import { CostPerTokenHistoryViz, TrainingComputeTrendsViz, EmergentAbilitiesViz } from './CostComputeEmergentAbilitiesViz';

interface Category18DispatcherProps {
  concept: Concept;
}

export const Category18Dispatcher: React.FC<Category18DispatcherProps> = ({ concept }) => {
  switch (concept.slug) {
    case 'evolution-timeline':
    case '208-evolution-timeline':
      return <EvolutionTimelineViz />;

    case 'model-family-tree':
    case '209-model-family-tree':
      return <ModelFamilyTreeViz />;

    case 'parameter-count-evolution':
    case '210-parameter-count-evolution':
      return <ParameterCountEvolutionViz />;

    case 'open-vs-closed-models':
    case '211-open-vs-closed-models':
      return <OpenVsClosedModelsViz />;

    case 'benchmark-progress':
    case '212-benchmark-progress':
      return <BenchmarkProgressViz />;

    case 'cost-per-token-history':
    case '213-cost-per-token-history':
      return <CostPerTokenHistoryViz />;

    case 'training-compute-trends':
    case '214-training-compute-trends':
      return <TrainingComputeTrendsViz />;

    case 'emergent-abilities':
    case '215-emergent-abilities':
      return <EmergentAbilitiesViz />;

    default:
      return <EvolutionTimelineViz />;
  }
};
