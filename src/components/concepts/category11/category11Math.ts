// Mathematical and algorithmic helpers for Category 11: Inference & Serving

export function computeSpeculativeSpeedup(gamma: number, alpha: number): number {
  // Expected accepted tokens per target verification step: E[tokens] = (1 - alpha^(gamma + 1)) / (1 - alpha)
  if (alpha >= 1.0) return gamma + 1;
  const numerator = 1 - Math.pow(alpha, gamma + 1);
  const denominator = 1 - alpha;
  return numerator / Math.max(1e-4, denominator);
}

export function computeKvCacheMemoryBytes(
  batchSize: number,
  seqLen: number,
  numLayers = 32,
  numHeads = 32,
  dHead = 128,
  bytesPerElem = 2 // 2 for FP16, 1 for FP8, 0.5 for INT4
): number {
  // 2 tensors (Key, Value) * layers * batch * heads * seq * dHead * bytesPerElem
  return 2 * numLayers * batchSize * numHeads * seqLen * dHead * bytesPerElem;
}

export function computeRooflinePerformance(
  arithmeticIntensity: number,
  peakTflops = 989, // H100 SXM FP16
  peakBandwidthTbS = 3.35 // H100 SXM HBM3
): { achievedTflops: number; boundType: 'memory' | 'compute' } {
  const memoryBoundTflops = arithmeticIntensity * peakBandwidthTbS;
  if (memoryBoundTflops < peakTflops) {
    return { achievedTflops: memoryBoundTflops, boundType: 'memory' };
  }
  return { achievedTflops: peakTflops, boundType: 'compute' };
}

export interface ServingRuntimeInfo {
  name: string;
  backend: string;
  keyFeature: string;
  bestFor: string;
}

export const SERVING_RUNTIMES: ServingRuntimeInfo[] = [
  { name: 'vLLM', backend: 'Python / CUDA / C++', keyFeature: 'PagedAttention & Continuous Batching', bestFor: 'General high-throughput production serving' },
  { name: 'SGLang', backend: 'Python / CUDA (RadixAttention)', keyFeature: 'RadixTree Prefix Caching & Structured JSON', bestFor: 'Complex multi-turn agents & few-shot pipelines' },
  { name: 'TensorRT-LLM', backend: 'NVIDIA C++ / TensorRT', keyFeature: 'Custom kernel fusion & In-Flight Batching', bestFor: 'Maximum bare-metal throughput on NVIDIA GPUs' },
  { name: 'TGI (Text-Gen-Inference)', backend: 'Rust / Python (Hugging Face)', keyFeature: 'FlashAttention & Production telemetry', bestFor: 'Turnkey enterprise container deployments' },
];
