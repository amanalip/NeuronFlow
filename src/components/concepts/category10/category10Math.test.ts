import { describe, it, expect } from 'vitest';
import {
  computeBradleyTerryProb,
  computeDpoRewardDifference,
  computeGrpoAdvantages,
  computeExpectedMaxReward,
} from './category10Math';

describe('Category 10: Alignment & RLHF Math', () => {
  it('computes Bradley-Terry preference probability', () => {
    const probEqual = computeBradleyTerryProb(1.0, 1.0);
    expect(probEqual).toBeCloseTo(0.5, 3);

    const probWin = computeBradleyTerryProb(3.0, 1.0);
    expect(probWin).toBeGreaterThan(0.8);
  });

  it('computes DPO reward difference and loss', () => {
    const { implicitRewardDiff, dpoLoss } = computeDpoRewardDifference(-1.0, -2.5, -3.0, -2.0, 0.1);
    expect(implicitRewardDiff).toBeGreaterThan(0);
    expect(dpoLoss).toBeGreaterThan(0);
  });

  it('computes GRPO relative advantages across group without critic', () => {
    const rewards = [1.0, 2.0, 3.0, 4.0];
    const advantages = computeGrpoAdvantages(rewards);

    expect(advantages.length).toBe(4);
    expect(advantages[0]).toBeLessThan(0);
    expect(advantages[3]).toBeGreaterThan(0);
    // Mean of advantages should be 0
    const meanAdv = advantages.reduce((a, b) => a + b, 0) / 4;
    expect(meanAdv).toBeCloseTo(0, 5);
  });

  it('computes expected maximum reward for Best-of-N', () => {
    const r1 = computeExpectedMaxReward(2.0, 1);
    const r8 = computeExpectedMaxReward(2.0, 8);
    const r64 = computeExpectedMaxReward(2.0, 64);

    expect(r1).toBe(2.0);
    expect(r8).toBeGreaterThan(r1);
    expect(r64).toBeGreaterThan(r8);
  });
});
