import { describe, it, expect } from 'vitest';
import {
  computeSpeculativeSpeedup,
  computeKvCacheMemoryBytes,
  computeRooflinePerformance,
  SERVING_RUNTIMES,
} from './category11Math';

describe('Category 11: Inference & Serving Math', () => {
  it('computes speculative decoding speedup factor accurately', () => {
    const s1 = computeSpeculativeSpeedup(4, 0.8);
    expect(s1).toBeGreaterThan(1.0);
    expect(s1).toBeLessThanOrEqual(5.0);

    const sHighAlpha = computeSpeculativeSpeedup(4, 0.95);
    expect(sHighAlpha).toBeGreaterThan(s1);
  });

  it('computes KV cache memory scaling across precision formats', () => {
    const fp16 = computeKvCacheMemoryBytes(4, 8192, 32, 32, 128, 2);
    const fp8 = computeKvCacheMemoryBytes(4, 8192, 32, 32, 128, 1);
    const int4 = computeKvCacheMemoryBytes(4, 8192, 32, 32, 128, 0.5);

    expect(fp8).toBe(fp16 / 2);
    expect(int4).toBe(fp16 / 4);
    expect(fp16).toBeGreaterThan(1e9); // >1 GB
  });

  it('computes Roofline performance bounds', () => {
    const lowIntensity = computeRooflinePerformance(50, 989, 3.35);
    expect(lowIntensity.boundType).toBe('memory');
    expect(lowIntensity.achievedTflops).toBeCloseTo(50 * 3.35, 1);

    const highIntensity = computeRooflinePerformance(500, 989, 3.35);
    expect(highIntensity.boundType).toBe('compute');
    expect(highIntensity.achievedTflops).toBe(989);
  });

  it('contains valid serving runtimes', () => {
    expect(SERVING_RUNTIMES.length).toBe(4);
    const vllm = SERVING_RUNTIMES.find((r) => r.name === 'vLLM');
    expect(vllm).toBeDefined();
    expect(vllm?.keyFeature).toContain('PagedAttention');
  });
});
