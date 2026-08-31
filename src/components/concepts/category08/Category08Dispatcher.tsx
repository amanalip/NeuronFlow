import React from 'react';
import {
  DistributedTrainingIntroViz,
  DdpRingAllReduceViz,
  ZeRoFsdpViz,
} from './DistributedIntroDdpFsdpViz';
import {
  TensorParallelismViz,
  PipelineParallelismViz,
  ThreeDParallelismViz,
} from './TensorPipeline3DParallelismViz';
import {
  ContextParallelismViz,
  ExpertParallelismViz,
  ActivationCheckpointingViz,
} from './ContextExpertActivationParallelismViz';
import {
  FlashAttentionViz,
  MixedPrecisionTrainingViz,
  CommunicationPrimitivesViz,
} from './FlashAttentionMixedPrecisionPrimitivesViz';

interface Category08DispatcherProps {
  slug: string;
}

export const Category08Dispatcher: React.FC<Category08DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'distributed-training-intro':
      return <DistributedTrainingIntroViz />;
    case 'data-parallelism-ddp':
      return <DdpRingAllReduceViz />;
    case 'fsdp-zero':
      return <ZeRoFsdpViz />;
    case 'tensor-parallelism':
      return <TensorParallelismViz />;
    case 'pipeline-parallelism':
      return <PipelineParallelismViz />;
    case '3d-parallelism':
      return <ThreeDParallelismViz />;
    case 'context-parallelism':
      return <ContextParallelismViz />;
    case 'expert-parallelism':
      return <ExpertParallelismViz />;
    case 'activation-checkpointing':
      return <ActivationCheckpointingViz />;
    case 'flash-attention':
      return <FlashAttentionViz />;
    case 'mixed-precision-training':
      return <MixedPrecisionTrainingViz />;
    case 'communication-primitives':
      return <CommunicationPrimitivesViz />;
    default:
      return <DistributedTrainingIntroViz />;
  }
};
