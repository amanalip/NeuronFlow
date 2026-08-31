// Mathematical and algorithmic engines for Category 17: Infrastructure & Serving

export function computeGpuVramBreakdown(
  paramCountBillion: number,
  precisionBytes: number, // 2 for FP16/BF16, 1 for INT8, 0.5 for INT4
  contextTokens: number,
  batchSize: number,
  numLayers = 32,
  hiddenDim = 4096
): {
  modelWeightsGb: number;
  kvCacheGb: number;
  activationsGb: number;
  totalVramGb: number;
} {
  // Model weights = params * bytesPerParam
  const modelWeightsGb = (paramCountBillion * 1e9 * precisionBytes) / (1024 ** 3);

  // KV Cache = 2 (K and V) * numLayers * hiddenDim * contextTokens * batchSize * precisionBytes
  const kvBytes = 2 * numLayers * hiddenDim * contextTokens * batchSize * 2; // KV typically kept in FP16
  const kvCacheGb = kvBytes / (1024 ** 3);

  // Activation buffer baseline
  const activationsGb = Math.min(8.0, 0.5 + 0.1 * batchSize);
  const totalVramGb = modelWeightsGb + kvCacheGb + activationsGb;

  return { modelWeightsGb, kvCacheGb, activationsGb, totalVramGb };
}

export function computeServingLatency(
  promptTokens: number,
  outputTokens: number,
  prefillThroughputTokPerSec = 4000,
  decodeThroughputTokPerSec = 85
): {
  ttftMs: number;
  tpotMs: number;
  totalLatencySec: number;
  effectiveTokensPerSec: number;
} {
  const ttftMs = (promptTokens / prefillThroughputTokPerSec) * 1000 + 15; // +15ms queue/network baseline
  const tpotMs = (1 / decodeThroughputTokPerSec) * 1000;
  const totalLatencySec = ttftMs / 1000 + (outputTokens * tpotMs) / 1000;
  const effectiveTokensPerSec = outputTokens / totalLatencySec;

  return { ttftMs, tpotMs, totalLatencySec, effectiveTokensPerSec };
}

export function computePrefillVsDecodeIntensity(
  hiddenDim: number,
  seqLen: number,
  precisionBytes = 2
): {
  prefillIntensityFlopsPerByte: number; // Compute bound
  decodeIntensityFlopsPerByte: number;  // Memory bound
} {
  // Prefill: GEMM matrix multiplication (O(N^2) math over O(N) memory load)
  const prefillIntensityFlopsPerByte = (2 * seqLen * hiddenDim) / (precisionBytes * hiddenDim);

  // Decode: GEMV matrix-vector multiplication (O(1) math per weight element loaded from HBM)
  const decodeIntensityFlopsPerByte = 2 / precisionBytes; // ~1 FLOP / byte

  return { prefillIntensityFlopsPerByte, decodeIntensityFlopsPerByte };
}
