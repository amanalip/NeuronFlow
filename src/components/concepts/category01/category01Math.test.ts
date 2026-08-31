import { describe, it, expect } from 'vitest';
import {
  sigmoid,
  sigmoidDeriv,
  tanh,
  tanhDeriv,
  relu,
  reluDeriv,
  leakyRelu,
  gelu,
  swish,
  softmax,
  crossEntropyLoss,
  mseLoss,
  perceptronPredict,
  evaluatePolynomial,
} from './category01Math';

describe('Category 01: Neural Network Foundations Math', () => {
  it('computes sigmoid and its derivative correctly', () => {
    expect(sigmoid(0)).toBe(0.5);
    expect(sigmoidDeriv(0)).toBe(0.25);
    expect(sigmoid(10)).toBeCloseTo(1.0, 3);
    expect(sigmoid(-10)).toBeCloseTo(0.0, 3);
  });

  it('computes tanh and its derivative correctly', () => {
    expect(tanh(0)).toBe(0);
    expect(tanhDeriv(0)).toBe(1);
    expect(tanh(5)).toBeCloseTo(1.0, 2);
  });

  it('computes ReLU and LeakyReLU correctly', () => {
    expect(relu(5)).toBe(5);
    expect(relu(-5)).toBe(0);
    expect(reluDeriv(5)).toBe(1);
    expect(reluDeriv(-5)).toBe(0);

    expect(leakyRelu(-5, 0.1)).toBeCloseTo(-0.5);
    expect(leakyRelu(5, 0.1)).toBe(5);
  });

  it('computes GELU and Swish correctly', () => {
    expect(gelu(0)).toBeCloseTo(0, 4);
    expect(swish(0)).toBe(0);
    expect(swish(2)).toBeGreaterThan(1.5);
  });

  it('computes softmax probability distributions summing to 1', () => {
    const logits = [2.0, 1.0, 0.1];
    const probs = softmax(logits, 1.0);
    expect(probs.length).toBe(3);
    const sum = probs.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 5);
    expect(probs[0]).toBeGreaterThan(probs[1]);
    expect(probs[1]).toBeGreaterThan(probs[2]);
  });

  it('computes Cross-Entropy and MSE loss accurately', () => {
    const probs = [0.7, 0.2, 0.1];
    const ce = crossEntropyLoss(0, probs);
    expect(ce).toBeCloseTo(-Math.log(0.7), 4);

    const mse = mseLoss([0.8, 0.2], [1.0, 0.0]);
    expect(mse).toBeCloseTo((0.04 + 0.04) / 2, 4);
  });

  it('predicts 2D perceptron logic operations', () => {
    // AND gate weights: w1=1.5, w2=1.5, b=-2.0
    expect(perceptronPredict(0, 0, 1.5, 1.5, -2.0)).toBe(0);
    expect(perceptronPredict(1, 0, 1.5, 1.5, -2.0)).toBe(0);
    expect(perceptronPredict(0, 1, 1.5, 1.5, -2.0)).toBe(0);
    expect(perceptronPredict(1, 1, 1.5, 1.5, -2.0)).toBe(1);
  });

  it('evaluates polynomial curves', () => {
    // 2 + 3x + 4x^2 at x = 2 -> 2 + 6 + 16 = 24
    expect(evaluatePolynomial(2, [2, 3, 4])).toBe(24);
  });
});
