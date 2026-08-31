import React from 'react';
import { Concept } from '../../../model/types';
import { GpuMemoryBreakdownViz, ContinuousBatchingViz } from './GpuMemoryArchitectureBatchingViz';
import { ModelServingArchitectureViz, LatencyBreakdownViz, ThroughputVsLatencyViz } from './LatencyParetoServingArchitectureViz';
import { MultiGpuInferenceViz, EdgeDeploymentViz, PrefillVsDecodeViz } from './MultiGpuEdgePrefillDecodeViz';

interface Category17DispatcherProps {
  concept: Concept;
}

export const Category17Dispatcher: React.FC<Category17DispatcherProps> = ({ concept }) => {
  switch (concept.slug) {
    case 'gpu-architecture':
    case '198-gpu-architecture':
    case 'gpu-memory-breakdown':
    case '199-gpu-memory-breakdown':
      return <GpuMemoryBreakdownViz />;

    case 'batch-processing-throughput':
    case '200-batch-processing-throughput':
    case 'continuous-batching':
    case '201-continuous-batching':
      return <ContinuousBatchingViz />;

    case 'model-serving-architecture':
    case '202-model-serving-architecture':
      return <ModelServingArchitectureViz />;

    case 'latency-breakdown':
    case '203-latency-breakdown':
      return <LatencyBreakdownViz />;

    case 'throughput-vs-latency':
    case '204-throughput-vs-latency':
      return <ThroughputVsLatencyViz />;

    case 'multi-gpu-inference':
    case '205-multi-gpu-inference':
      return <MultiGpuInferenceViz />;

    case 'edge-deployment':
    case '206-edge-deployment':
      return <EdgeDeploymentViz />;

    case 'prefill-vs-decode':
    case '207-prefill-vs-decode':
      return <PrefillVsDecodeViz />;

    default:
      return <GpuMemoryBreakdownViz />;
  }
};
