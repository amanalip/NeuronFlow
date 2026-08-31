import React from 'react';
import { TransformerArchitectureViz } from './TransformerArchitectureViz';
import {
  SelfAttentionViz,
  QkvIntuitionViz,
  ScaledDotProductAttentionViz,
} from './SelfAttentionQkvScaledViz';
import {
  MultiHeadAttentionViz,
  CrossAttentionViz,
  CausalMaskingViz,
} from './MultiHeadCrossCausalViz';
import {
  SinusoidalPEViz,
  RoPEViz,
  ALiBiViz,
} from './PositionalEncodingsViz';
import {
  FeedForwardNetworksViz,
  ResidualConnectionsViz,
  LayerNormalizationViz,
  RmsNormViz,
  PreLnVsPostLnViz,
} from './FFNResidualNormsViz';
import {
  KVCacheViz,
  MqaGqaViz,
  SlidingWindowAttentionViz,
} from './KVCacheMqaGqaWindowViz';

interface Category05DispatcherProps {
  slug: string;
}

export const Category05Dispatcher: React.FC<Category05DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'transformer-architecture':
      return <TransformerArchitectureViz />;
    case 'self-attention':
      return <SelfAttentionViz />;
    case 'qkv':
      return <QkvIntuitionViz />;
    case 'scaled-dot-product-attention':
      return <ScaledDotProductAttentionViz />;
    case 'multi-head-attention':
      return <MultiHeadAttentionViz />;
    case 'cross-attention':
      return <CrossAttentionViz />;
    case 'causal-masking':
      return <CausalMaskingViz />;
    case 'positional-encoding-sinusoidal':
      return <SinusoidalPEViz />;
    case 'rope':
      return <RoPEViz />;
    case 'alibi':
      return <ALiBiViz />;
    case 'feed-forward-networks':
      return <FeedForwardNetworksViz />;
    case 'residual-connections':
      return <ResidualConnectionsViz />;
    case 'layer-normalization':
      return <LayerNormalizationViz />;
    case 'rmsnorm':
      return <RmsNormViz />;
    case 'pre-ln-vs-post-ln':
      return <PreLnVsPostLnViz />;
    case 'kv-cache':
      return <KVCacheViz />;
    case 'mqa-gqa':
      return <MqaGqaViz />;
    case 'sliding-window-attention':
      return <SlidingWindowAttentionViz />;
    default:
      return <TransformerArchitectureViz />;
  }
};
