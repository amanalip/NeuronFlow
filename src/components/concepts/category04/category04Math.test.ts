import { describe, it, expect } from 'vitest';
import {
  simulateRnnStep,
  simulateGradientMagnitude,
  simulateLstmCell,
  computeBahdanauAlignment,
  computeLuongAlignment,
} from './category04Math';

describe('Category 04: Sequence Models Math', () => {
  it('simulates basic RNN time step update', () => {
    const h1 = simulateRnnStep(0.5, 0.0, 1.0, 0.5, 0.0);
    expect(h1).toBeCloseTo(Math.tanh(0.5), 4);

    const h2 = simulateRnnStep(0.5, h1, 1.0, 0.5, 0.0);
    expect(h2).toBeCloseTo(Math.tanh(0.5 + 0.5 * h1), 4);
  });

  it('simulates vanishing and exploding gradient growth', () => {
    const vanishing = simulateGradientMagnitude(0.5, 5);
    expect(vanishing[0]).toBe(1.0);
    expect(vanishing[4]).toBeCloseTo(Math.pow(0.5, 4), 4);

    const exploding = simulateGradientMagnitude(2.0, 4);
    expect(exploding[3]).toBe(8.0);
  });

  it('computes LSTM 4-gate forward pass', () => {
    const { f, i, cTilde, c, o, h } = simulateLstmCell(1.0, 0.5, 0.8);
    expect(f).toBeGreaterThan(0);
    expect(f).toBeLessThan(1);
    expect(i).toBeGreaterThan(0);
    expect(i).toBeLessThan(1);
    expect(cTilde).toBeGreaterThan(-1);
    expect(cTilde).toBeLessThan(1);
    expect(c).toBeDefined();
    expect(o).toBeGreaterThan(0);
    expect(h).toBeDefined();
  });

  it('computes Bahdanau and Luong attention distributions', () => {
    const decState = [1.0, 0.5];
    const encStates = [
      [0.2, 0.1],
      [1.5, 1.2],
      [0.3, 0.4],
    ];

    const bahdanau = computeBahdanauAlignment(decState, encStates);
    expect(bahdanau.length).toBe(3);
    const sumBahdanau = bahdanau.reduce((a, b) => a + b, 0);
    expect(sumBahdanau).toBeCloseTo(1.0, 4);

    const luong = computeLuongAlignment(decState, encStates);
    expect(luong.length).toBe(3);
    const sumLuong = luong.reduce((a, b) => a + b, 0);
    expect(sumLuong).toBeCloseTo(1.0, 4);
  });
});
