// Mathematical and algorithmic engines for Category 14: Prompting & Usage

export interface ModelPricingTier {
  modelName: string;
  inputPricePerM: number;
  outputPricePerM: number;
  cachedInputPricePerM: number;
}

export const PRICING_TIERS: Record<string, ModelPricingTier> = {
  gpt4o: {
    modelName: 'GPT-4o',
    inputPricePerM: 2.50,
    outputPricePerM: 10.00,
    cachedInputPricePerM: 1.25,
  },
  claude35Sonnet: {
    modelName: 'Claude 3.5 Sonnet',
    inputPricePerM: 3.00,
    outputPricePerM: 15.00,
    cachedInputPricePerM: 0.30,
  },
  llama370b: {
    modelName: 'LLaMA 3.3 70B',
    inputPricePerM: 0.59,
    outputPricePerM: 0.79,
    cachedInputPricePerM: 0.30,
  },
};

export function computeTokenCost(
  promptTokens: number,
  completionTokens: number,
  cachedTokens = 0,
  tier: ModelPricingTier = PRICING_TIERS.gpt4o
): {
  uncachedInputCost: number;
  cachedInputCost: number;
  outputCost: number;
  totalCost: number;
  totalCostWithoutCaching: number;
  savingsPercentage: number;
} {
  const regularPromptTokens = Math.max(0, promptTokens - cachedTokens);
  const uncachedInputCost = (regularPromptTokens / 1_000_000) * tier.inputPricePerM;
  const cachedInputCost = (cachedTokens / 1_000_000) * tier.cachedInputPricePerM;
  const outputCost = (completionTokens / 1_000_000) * tier.outputPricePerM;
  const totalCost = uncachedInputCost + cachedInputCost + outputCost;

  const totalCostWithoutCaching = (promptTokens / 1_000_000) * tier.inputPricePerM + outputCost;
  const savingsPercentage =
    totalCostWithoutCaching > 0
      ? ((totalCostWithoutCaching - totalCost) / totalCostWithoutCaching) * 100
      : 0;

  return {
    uncachedInputCost,
    cachedInputCost,
    outputCost,
    totalCost,
    totalCostWithoutCaching,
    savingsPercentage,
  };
}

export function computeSelfConsistencyMajority(
  candidateAnswers: string[]
): {
  winner: string;
  voteCount: number;
  confidence: number;
  distribution: Record<string, number>;
} {
  if (candidateAnswers.length === 0) {
    return { winner: '', voteCount: 0, confidence: 0, distribution: {} };
  }

  const distribution: Record<string, number> = {};
  candidateAnswers.forEach((ans) => {
    distribution[ans] = (distribution[ans] || 0) + 1;
  });

  let winner = candidateAnswers[0];
  let maxCount = 0;

  Object.entries(distribution).forEach(([ans, count]) => {
    if (count > maxCount) {
      maxCount = count;
      winner = ans;
    }
  });

  const confidence = maxCount / candidateAnswers.length;
  return { winner, voteCount: maxCount, confidence, distribution };
}

export function computeLostInMiddleRecall(
  depthPercent: number, // 0 (start) to 100 (end)
  contextLengthTokens: number
): number {
  // U-shaped curve modeling Lost-in-the-Middle phenomenon
  // High at 0% (primacy effect) and 100% (recency effect), dips in the middle (40-60%)
  const normalizedDepth = depthPercent / 100;
  const centerDistance = Math.abs(normalizedDepth - 0.5); // 0 at center, 0.5 at edges

  // Base recall drops as context length increases
  const lengthPenalty = Math.min(0.4, (contextLengthTokens / 128_000) * 0.35);
  const uShape = 0.65 + 0.35 * Math.pow(centerDistance * 2, 2);

  const finalRecall = Math.max(0.2, Math.min(1.0, uShape - lengthPenalty));
  return finalRecall;
}
