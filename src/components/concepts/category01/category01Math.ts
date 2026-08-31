// Mathematical helpers for Category 1: Neural Network Foundations

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function sigmoidDeriv(x: number): number {
  const s = sigmoid(x);
  return s * (1 - s);
}

export function tanh(x: number): number {
  return Math.tanh(x);
}

export function tanhDeriv(x: number): number {
  const t = Math.tanh(x);
  return 1 - t * t;
}

export function relu(x: number): number {
  return Math.max(0, x);
}

export function reluDeriv(x: number): number {
  return x > 0 ? 1 : 0;
}

export function leakyRelu(x: number, alpha = 0.1): number {
  return x > 0 ? x : alpha * x;
}

export function leakyReluDeriv(x: number, alpha = 0.1): number {
  return x > 0 ? 1 : alpha;
}

export function gelu(x: number): number {
  return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3))));
}

export function swish(x: number, beta = 1): number {
  return x * sigmoid(beta * x);
}

export function softmax(logits: number[], temperature = 1): number[] {
  const t = Math.max(temperature, 0.0001);
  const scaled = logits.map((z) => z / t);
  const maxVal = Math.max(...scaled);
  const exps = scaled.map((z) => Math.exp(z - maxVal));
  const sumExps = exps.reduce((acc, v) => acc + v, 0);
  return exps.map((v) => v / sumExps);
}

export function crossEntropyLoss(targetIdx: number, probabilities: number[]): number {
  const prob = Math.max(probabilities[targetIdx] || 0.00001, 0.00001);
  return -Math.log(prob);
}

export function mseLoss(predictions: number[], targets: number[]): number {
  if (predictions.length === 0) return 0;
  const sum = predictions.reduce((acc, pred, i) => acc + Math.pow(pred - (targets[i] || 0), 2), 0);
  return sum / predictions.length;
}

// 2D Perceptron forward calculation
export function perceptronPredict(x1: number, x2: number, w1: number, w2: number, b: number, activation: 'step' | 'sigmoid' = 'step'): number {
  const z = w1 * x1 + w2 * x2 + b;
  if (activation === 'step') {
    return z >= 0 ? 1 : 0;
  }
  return sigmoid(z);
}

// Polynomial curve fitting evaluation
export function evaluatePolynomial(x: number, coefficients: number[]): number {
  return coefficients.reduce((acc, coef, power) => acc + coef * Math.pow(x, power), 0);
}
