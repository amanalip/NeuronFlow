// Mathematical and algorithmic helpers for Category 8: Distributed Training & Parallelism

export function computeTrainingMemoryBreakdown(
  paramsB: number,
  batchSize: number,
  seqLen: number,
  numLayers = 32,
  dModel = 4096
): {
  weightsGb: number;
  gradsGb: number;
  optimizerGb: number;
  activationsGb: number;
  totalGb: number;
} {
  // Model weights (FP16/BF16: 2 bytes per param)
  const weightsGb = (paramsB * 1e9 * 2) / (1024 * 1024 * 1024);
  // Gradients (FP16/BF16: 2 bytes per param)
  const gradsGb = (paramsB * 1e9 * 2) / (1024 * 1024 * 1024);
  // Adam optimizer states: FP32 master weights (4 bytes) + momentum (4 bytes) + variance (4 bytes) = 12-16 bytes/param
  const optimizerGb = (paramsB * 1e9 * 16) / (1024 * 1024 * 1024);
  // Activations per layer: ~34 * b * s * d bytes per layer in standard transformer
  const activationsGb = (numLayers * 34 * batchSize * seqLen * dModel) / (1024 * 1024 * 1024);

  const totalGb = weightsGb + gradsGb + optimizerGb + activationsGb;

  return { weightsGb, gradsGb, optimizerGb, activationsGb, totalGb };
}

export function computeZeroShardedMemory(
  paramsB: number,
  numGpus: number,
  stage: 0 | 1 | 2 | 3
): { perGpuGb: number; reductionFactor: number } {
  const base = computeTrainingMemoryBreakdown(paramsB, 1, 2048);
  const w = base.weightsGb;
  const g = base.gradsGb;
  const opt = base.optimizerGb;

  let totalPerGpu = 0;

  switch (stage) {
    case 0: // No sharding (DDP)
      totalPerGpu = w + g + opt;
      break;
    case 1: // Shard optimizer
      totalPerGpu = w + g + opt / numGpus;
      break;
    case 2: // Shard optimizer + gradients
      totalPerGpu = w + (g + opt) / numGpus;
      break;
    case 3: // Shard optimizer + gradients + parameters (FSDP)
      totalPerGpu = (w + g + opt) / numGpus;
      break;
  }

  const baseTotal = w + g + opt;
  const reductionFactor = baseTotal / Math.max(0.1, totalPerGpu);

  return { perGpuGb: totalPerGpu, reductionFactor };
}

export function computePipelineBubbleFraction(
  pipelineStages: number,
  microBatches: number
): number {
  // GPipe bubble fraction: (p - 1) / (p - 1 + m)
  return (pipelineStages - 1) / Math.max(1, pipelineStages - 1 + microBatches);
}

export interface NcclPrimitiveInfo {
  name: string;
  pattern: string;
  commVolume: string;
  description: string;
}

export const NCCL_PRIMITIVES: NcclPrimitiveInfo[] = [
  { name: 'AllReduce', pattern: 'All -> All (Sum)', commVolume: '2 * (N-1)/N * M', description: 'Combines tensors across all ranks and returns the sum to every rank.' },
  { name: 'AllGather', pattern: 'All -> All (Concat)', commVolume: '(N-1)/N * M', description: 'Gathers tensor shards from all ranks and concatenates them on every rank.' },
  { name: 'ReduceScatter', pattern: 'All -> All (Reduce + Shard)', commVolume: '(N-1)/N * M', description: 'Reduces tensors across ranks and scatters equal disjoint parts to each rank.' },
  { name: 'Broadcast', pattern: 'One -> All', commVolume: 'M', description: 'Copies a tensor from a single root rank to all other ranks.' },
  { name: 'Scatter', pattern: 'One -> All (Split)', commVolume: '(N-1)/N * M', description: 'Splits a tensor on root rank into equal chunks and sends one chunk to each rank.' },
  { name: 'Gather', pattern: 'All -> One (Concat)', commVolume: '(N-1)/N * M', description: 'Gathers tensor chunks from all ranks and concatenates them on root rank.' },
  { name: 'Reduce', pattern: 'All -> One (Sum)', commVolume: '(N-1)/N * M', description: 'Reduces tensors from all ranks to a single destination root rank.' },
  { name: 'All-to-All', pattern: 'All -> All (Matrix Transpose)', commVolume: '(N-1)/N * M', description: 'Each rank sends a distinct chunk of data to every other rank.' },
];
