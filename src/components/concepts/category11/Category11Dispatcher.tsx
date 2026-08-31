import React from 'react';
import {
  InferencePipelineViz,
  PagedAttentionViz,
  SpeculativeDecodingViz,
  MedusaViz,
} from './InferencePipelinePagedSpeculativeViz';
import {
  ContinuousBatchingViz,
  ChunkedPrefillViz,
  KvCacheQuantizationViz,
  KvCacheEvictionViz,
  PrefixCachingViz,
} from './BatchingChunkedKvOptimizationViz';
import {
  GpuMemoryHierarchyViz,
  RooflineModelViz,
  DecodingStrategiesViz,
  StructuredOutputsViz,
} from './RooflineMemoryDecodingStructuredViz';
import {
  VllmArchitectureViz,
  ServingEnginesMatrixViz,
} from './ServingEnginesComparisonViz';

interface Category11DispatcherProps {
  slug: string;
}

export const Category11Dispatcher: React.FC<Category11DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'inference-pipeline':
      return <InferencePipelineViz />;
    case 'paged-attention':
      return <PagedAttentionViz />;
    case 'speculative-decoding':
      return <SpeculativeDecodingViz />;
    case 'medusa':
      return <MedusaViz />;
    case 'continuous-batching':
      return <ContinuousBatchingViz />;
    case 'chunked-prefill':
      return <ChunkedPrefillViz />;
    case 'kv-cache-quantization':
      return <KvCacheQuantizationViz />;
    case 'kv-cache-eviction':
      return <KvCacheEvictionViz />;
    case 'prefix-caching':
      return <PrefixCachingViz />;
    case 'gpu-memory-hierarchy':
      return <GpuMemoryHierarchyViz />;
    case 'roofline-model':
      return <RooflineModelViz />;
    case 'decoding-strategies':
      return <DecodingStrategiesViz />;
    case 'structured-outputs':
      return <StructuredOutputsViz />;
    case 'vllm-architecture':
      return <VllmArchitectureViz />;
    case 'tensorrt-llm-sglang':
      return <ServingEnginesMatrixViz />;
    default:
      return <InferencePipelineViz />;
  }
};
