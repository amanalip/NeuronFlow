import React from 'react';
import {
  AlignmentIntroViz,
  RlhfOverviewViz,
  RewardModelingViz,
  PpoForLlmsViz,
} from './RlhfRewardPpoViz';
import {
  DpoViz,
  KtoViz,
  OrpoViz,
  SimPoViz,
} from './DpoKtoOrpoSimPoViz';
import {
  RlaifViz,
  GrpoViz,
  RejectionSamplingViz,
} from './RlaifGrpoRejectionSamplingViz';
import {
  SafetyGuardrailsViz,
  OverRefusalViz,
} from './SafetyGuardrailsOverRefusalViz';

interface Category10DispatcherProps {
  slug: string;
}

export const Category10Dispatcher: React.FC<Category10DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'alignment-intro':
      return <AlignmentIntroViz />;
    case 'rlhf-overview':
      return <RlhfOverviewViz />;
    case 'reward-modeling':
      return <RewardModelingViz />;
    case 'ppo-for-llms':
      return <PpoForLlmsViz />;
    case 'dpo':
      return <DpoViz />;
    case 'kto':
      return <KtoViz />;
    case 'orpo':
      return <OrpoViz />;
    case 'simpo':
      return <SimPoViz />;
    case 'rlahf-rlaif':
      return <RlaifViz />;
    case 'grpo':
      return <GrpoViz />;
    case 'rejection-sampling':
      return <RejectionSamplingViz />;
    case 'safety-guardrails':
      return <SafetyGuardrailsViz />;
    case 'over-refusal':
      return <OverRefusalViz />;
    default:
      return <AlignmentIntroViz />;
  }
};
