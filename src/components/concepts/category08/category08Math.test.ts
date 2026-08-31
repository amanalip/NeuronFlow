import { describe, it, expect } from 'vitest';
import {
  computeTrainingMemoryBreakdown,
  computeZeroShardedMemory,
  computePipelineBubbleFraction,
  NCCL_PRIMITIVES,
} from './category08Math';

describe('Category 08: Distributed Training & Parallelism Math', () => {
  it('computes 70B training memory breakdown', () => {
    const { weightsGb, gradsGb, optimizerGb, totalGb } = computeTrainingMemoryBreakdown(70, 2, 2048);
    expect(weightsGb).toBeGreaterThan(100);
    expect(gradsGb).toBeGreaterThan(100);
    expect(optimizerGb).toBeGreaterThan(900); // 16 bytes/param
    expect(totalGb).toBeGreaterThan(1000); // ~1.4 TB
  });

  it('computes ZeRO sharding reduction stages', () => {
    const ddp = computeZeroShardedMemory(70, 8, 0);
    const zero1 = computeZeroShardedMemory(70, 8, 1);
    const zero2 = computeZeroShardedMemory(70, 8, 2);
    const zero3 = computeZeroShardedMemory(70, 8, 3);

    expect(zero1.perGpuGb).toBeLessThan(ddp.perGpuGb);
    expect(zero2.perGpuGb).toBeLessThan(zero1.perGpuGb);
    expect(zero3.perGpuGb).toBeLessThan(zero2.perGpuGb);
    expect(zero3.reductionFactor).toBeCloseTo(8.0, 1);
  });

  it('computes pipeline parallelism bubble fraction', () => {
    const bubble = computePipelineBubbleFraction(4, 8);
    // (4 - 1) / (4 - 1 + 8) = 3 / 11 ≈ 0.2727
    expect(bubble).toBeCloseTo(3 / 11, 4);
  });

  it('contains valid NCCL communication primitives', () => {
    expect(NCCL_PRIMITIVES.length).toBe(8);
    const allreduce = NCCL_PRIMITIVES.find((p) => p.name === 'AllReduce');
    expect(allreduce).toBeDefined();
    expect(allreduce?.commVolume).toContain('2 * (N-1)/N * M');
  });
});
