// Mathematical and algorithmic engines for Category 16: Evaluation & Benchmarks

export function computePerplexity(crossEntropyLoss: number): number {
  return Math.exp(crossEntropyLoss);
}

export function computeBleuScore(
  candidateWords: string[],
  referenceWords: string[]
): {
  p1: number;
  p2: number;
  brevityPenalty: number;
  bleuScore: number;
} {
  const c = candidateWords.length;
  const r = referenceWords.length;

  if (c === 0 || r === 0) {
    return { p1: 0, p2: 0, brevityPenalty: 0, bleuScore: 0 };
  }

  // 1-gram precision
  let unigramMatches = 0;
  candidateWords.forEach((w) => {
    if (referenceWords.includes(w)) unigramMatches++;
  });
  const p1 = unigramMatches / c;

  // 2-gram precision
  let bigramMatches = 0;
  const candidateBigrams: string[] = [];
  for (let i = 0; i < c - 1; i++) {
    candidateBigrams.push(`${candidateWords[i]} ${candidateWords[i + 1]}`);
  }

  const referenceBigrams: string[] = [];
  for (let i = 0; i < r - 1; i++) {
    referenceBigrams.push(`${referenceWords[i]} ${referenceWords[i + 1]}`);
  }

  if (candidateBigrams.length > 0) {
    candidateBigrams.forEach((bg) => {
      if (referenceBigrams.includes(bg)) bigramMatches++;
    });
  }
  const p2 = candidateBigrams.length > 0 ? bigramMatches / candidateBigrams.length : p1;

  // Brevity penalty
  const brevityPenalty = c > r ? 1.0 : Math.exp(1 - r / c);

  // Geometric mean
  const bleuScore = brevityPenalty * Math.sqrt(Math.max(1e-4, p1) * Math.max(1e-4, p2));
  return { p1, p2, brevityPenalty, bleuScore };
}

export function computeBradleyTerryElo(
  ratingA: number,
  ratingB: number,
  scoreA: number, // 1 for win A, 0.5 for tie, 0 for loss
  kFactor = 32
): {
  expectedA: number;
  expectedB: number;
  newRatingA: number;
  newRatingB: number;
  delta: number;
} {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;

  const delta = kFactor * (scoreA - expectedA);
  const newRatingA = Math.round(ratingA + delta);
  const newRatingB = Math.round(ratingB - delta);

  return { expectedA, expectedB, newRatingA, newRatingB, delta };
}

export function computeExpectedCalibrationError(
  bins: Array<{ confidence: number; accuracy: number; count: number }>
): number {
  const totalSamples = bins.reduce((sum, b) => sum + b.count, 0);
  if (totalSamples === 0) return 0;

  let weightedErrorSum = 0;
  bins.forEach((b) => {
    const error = Math.abs(b.accuracy - b.confidence);
    weightedErrorSum += (b.count / totalSamples) * error;
  });

  return weightedErrorSum;
}
