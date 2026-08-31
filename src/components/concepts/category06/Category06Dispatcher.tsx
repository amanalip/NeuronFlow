import React from 'react';
import {
  EncoderOnlyViz,
  DecoderOnlyViz,
  EncoderDecoderArchitectureViz,
} from './EncoderDecoderVariantsViz';
import {
  MixtureOfExpertsViz,
  SwitchTransformerViz,
} from './MoESwitchTransformerViz';
import {
  StateSpaceModelsViz,
  MambaViz,
  RwkvViz,
} from './SSMMambaRwkvViz';
import {
  LinearAttentionViz,
  HyenaViz,
  RetNetViz,
} from './LinearAttentionHyenaRetNetViz';
import { VisionTransformerViz } from './VisionTransformerViz';

interface Category06DispatcherProps {
  slug: string;
}

export const Category06Dispatcher: React.FC<Category06DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'encoder-only':
      return <EncoderOnlyViz />;
    case 'decoder-only':
      return <DecoderOnlyViz />;
    case 'encoder-decoder':
      return <EncoderDecoderArchitectureViz />;
    case 'mixture-of-experts':
      return <MixtureOfExpertsViz />;
    case 'switch-transformer':
      return <SwitchTransformerViz />;
    case 'state-space-models':
      return <StateSpaceModelsViz />;
    case 'mamba':
      return <MambaViz />;
    case 'rwkv':
      return <RwkvViz />;
    case 'linear-attention':
      return <LinearAttentionViz />;
    case 'hyena':
      return <HyenaViz />;
    case 'retnet':
      return <RetNetViz />;
    case 'vision-transformer':
      return <VisionTransformerViz />;
    default:
      return <EncoderOnlyViz />;
  }
};
