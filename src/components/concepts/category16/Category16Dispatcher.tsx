import React from 'react';
import { Concept } from '../../../model/types';
import { PerplexityViz, BleuRougeViz, HumanEvaluationViz } from './PerplexityBleuRougeHumanEvalViz';
import { BenchmarkLeaderboardsViz, EvaluationContaminationViz, EloRatingsViz } from './BenchmarksEloContaminationViz';
import { CalibrationUncertaintyViz, NeedleInAHaystackTestViz, MultiTurnEvaluationViz } from './CalibrationNeedleMultiTurnViz';

interface Category16DispatcherProps {
  concept: Concept;
}

export const Category16Dispatcher: React.FC<Category16DispatcherProps> = ({ concept }) => {
  switch (concept.slug) {
    case 'perplexity':
    case '188-perplexity':
      return <PerplexityViz />;

    case 'bleu-score':
    case '189-bleu-score':
    case 'rouge-score':
    case '190-rouge-score':
      return <BleuRougeViz />;

    case 'human-evaluation':
    case '191-human-evaluation':
      return <HumanEvaluationViz />;

    case 'benchmark-leaderboards':
    case '192-benchmark-leaderboards':
      return <BenchmarkLeaderboardsViz />;

    case 'evaluation-contamination':
    case '193-evaluation-contamination':
      return <EvaluationContaminationViz />;

    case 'elo-ratings':
    case '194-elo-ratings':
      return <EloRatingsViz />;

    case 'calibration-uncertainty':
    case '195-calibration-uncertainty':
      return <CalibrationUncertaintyViz />;

    case 'needle-in-a-haystack':
    case '196-needle-in-a-haystack':
      return <NeedleInAHaystackTestViz />;

    case 'multi-turn-evaluation':
    case '197-multi-turn-evaluation':
      return <MultiTurnEvaluationViz />;

    default:
      return <PerplexityViz />;
  }
};
