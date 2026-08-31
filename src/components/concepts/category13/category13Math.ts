// Mathematical and algorithmic engines for Category 13: RAG (Retrieval-Augmented Generation)

export function chunkTextWithOverlap(
  text: string,
  chunkSizeWords = 20,
  overlapWords = 5
): Array<{ chunkIndex: number; text: string; startWord: number; endWord: number }> {
  const words = text.trim().split(/\s+/);
  if (words.length === 0 || words[0] === '') return [];

  const step = Math.max(1, chunkSizeWords - overlapWords);
  const chunks: Array<{ chunkIndex: number; text: string; startWord: number; endWord: number }> = [];

  let start = 0;
  let index = 0;
  while (start < words.length) {
    const end = Math.min(words.length, start + chunkSizeWords);
    const chunkWords = words.slice(start, end);
    chunks.push({
      chunkIndex: index,
      text: chunkWords.join(' '),
      startWord: start,
      endWord: end,
    });
    index++;
    if (end >= words.length) break;
    start += step;
  }

  return chunks;
}

export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

export function computeReciprocalRankFusion(
  bm25Rank: number,
  vectorRank: number,
  kConstant = 60
): number {
  // RRF(d) = 1 / (k + rank_bm25) + 1 / (k + rank_vector)
  const score = 1 / (kConstant + bm25Rank) + 1 / (kConstant + vectorRank);
  return score;
}

export function computeRagasMetrics(
  retrievedRelevantCount: number,
  totalRetrieved: number,
  groundTruthRelevantCount: number,
  supportedClaimsCount: number,
  totalClaimsCount: number
): {
  contextPrecision: number;
  contextRecall: number;
  faithfulness: number;
  ragasHarmonicMean: number;
} {
  const contextPrecision = totalRetrieved > 0 ? retrievedRelevantCount / totalRetrieved : 0;
  const contextRecall = groundTruthRelevantCount > 0 ? retrievedRelevantCount / groundTruthRelevantCount : 0;
  const faithfulness = totalClaimsCount > 0 ? supportedClaimsCount / totalClaimsCount : 0;

  const validScores = [contextPrecision, contextRecall, faithfulness].filter((s) => s > 0);
  const ragasHarmonicMean =
    validScores.length > 0
      ? validScores.length / validScores.reduce((acc, val) => acc + 1 / val, 0)
      : 0;

  return { contextPrecision, contextRecall, faithfulness, ragasHarmonicMean };
}
