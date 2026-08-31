import React from 'react';
import {
  PretrainingObjectivesViz,
  KaplanScalingLawsViz,
  ChinchillaOptimalViz,
} from './PretrainingScalingViz';
import {
  DataCurationPipelineViz,
  SyntheticDataGenerationViz,
  CurriculumLearningViz,
} from './DataCurationSyntheticCurriculumViz';
import {
  LearningRateSchedulesViz,
  AdamWViz,
  ModernOptimizersViz,
} from './OptimizersSchedulesViz';
import { NumericalPrecisionViz } from './NumericalPrecisionViz';

interface Category07DispatcherProps {
  slug: string;
}

export const Category07Dispatcher: React.FC<Category07DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'pretraining-objectives':
      return <PretrainingObjectivesViz />;
    case 'scaling-laws-kaplan':
      return <KaplanScalingLawsViz />;
    case 'chinchilla-optimal':
      return <ChinchillaOptimalViz />;
    case 'data-curation-pipeline':
      return <DataCurationPipelineViz />;
    case 'synthetic-data-generation':
      return <SyntheticDataGenerationViz />;
    case 'curriculum-learning':
      return <CurriculumLearningViz />;
    case 'learning-rate-schedules':
      return <LearningRateSchedulesViz />;
    case 'optimizer-adamw':
      return <AdamWViz />;
    case 'optimizer-modern':
      return <ModernOptimizersViz />;
    case 'numerical-precision':
      return <NumericalPrecisionViz />;
    default:
      return <PretrainingObjectivesViz />;
  }
};
