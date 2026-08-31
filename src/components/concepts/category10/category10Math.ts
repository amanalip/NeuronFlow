// Mathematical and algorithmic helpers for Category 10: Alignment & RLHF

export function computeBradleyTerryProb(rWinner: number, rLoser: number): number {
  const diff = rWinner - rLoser;
  return 1 / (1 + Math.exp(-diff));
}

export function computeDpoRewardDifference(
  logpWinner: number,
  logpWinnerRef: number,
  logpLoser: number,
  logpLoserRef: number,
  beta = 0.1
): { implicitRewardDiff: number; dpoLoss: number } {
  const logRatioWinner = logpWinner - logpWinnerRef;
  const logRatioLoser = logpLoser - logpLoserRef;
  const implicitRewardDiff = beta * (logRatioWinner - logRatioLoser);
  const prob = 1 / (1 + Math.exp(-implicitRewardDiff));
  const dpoLoss = -Math.log(Math.max(1e-7, prob));

  return { implicitRewardDiff, dpoLoss };
}

export function computeGrpoAdvantages(rewards: number[]): number[] {
  if (rewards.length === 0) return [];
  const mean = rewards.reduce((a, b) => a + b, 0) / rewards.length;
  const variance =
    rewards.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(1, rewards.length);
  const std = Math.sqrt(variance) || 1e-4;

  return rewards.map((r) => (r - mean) / std);
}

export function computeExpectedMaxReward(baseReward: number, n: number, sigma = 1.0): number {
  // Analytical approximation for expected maximum of N standard normal samples
  if (n <= 1) return baseReward;
  const alpha = Math.sqrt(2 * Math.log(n)) - (Math.log(Math.log(n)) + Math.log(4 * Math.PI)) / (2 * Math.sqrt(2 * Math.log(n)));
  return baseReward + sigma * alpha;
}
