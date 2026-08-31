import React from 'react';
import { PerceptronViz, ActivationFunctionsViz } from './PerceptronViz';
import {
  MLPViz,
  ForwardPassViz,
  LossFunctionsViz,
  BackpropagationViz,
  GradientDescentViz,
} from './Concepts03to07Viz';
import {
  LearningRateViz,
  OverfittingViz,
  RegularizationViz,
  BatchNormalizationViz,
  WeightInitializationViz,
  SoftmaxViz,
  CrossEntropyViz,
  ComputationGraphsViz,
} from './Concepts08to15Viz';

interface Category01DispatcherProps {
  slug: string;
}

export const Category01Dispatcher: React.FC<Category01DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'perceptron':
      return <PerceptronViz />;
    case 'activation-functions':
      return <ActivationFunctionsViz />;
    case 'multi-layer-perceptron':
      return <MLPViz />;
    case 'forward-pass':
      return <ForwardPassViz />;
    case 'loss-functions':
      return <LossFunctionsViz />;
    case 'backpropagation':
      return <BackpropagationViz />;
    case 'gradient-descent':
      return <GradientDescentViz />;
    case 'learning-rate':
      return <LearningRateViz />;
    case 'overfitting-underfitting':
      return <OverfittingViz />;
    case 'regularization':
      return <RegularizationViz />;
    case 'batch-normalization':
      return <BatchNormalizationViz />;
    case 'weight-initialization':
      return <WeightInitializationViz />;
    case 'softmax':
      return <SoftmaxViz />;
    case 'cross-entropy-loss':
      return <CrossEntropyViz />;
    case 'computation-graphs':
      return <ComputationGraphsViz />;
    default:
      return <PerceptronViz />;
  }
};
