// Mathematical and algorithmic helpers for Category 4: Sequence Models (Pre-Transformer)

export function simulateRnnStep(
  x: number,
  hPrev: number,
  wX = 0.8,
  wH = 0.5,
  b = 0.0
): number {
  return Math.tanh(wX * x + wH * hPrev + b);
}

export function simulateGradientMagnitude(wH: number, steps = 20): number[] {
  const grads: number[] = [];
  let current = 1.0;
  for (let t = 0; t < steps; t++) {
    grads.push(current);
    current = current * wH;
  }
  return grads;
}

export function simulateLstmCell(
  x: number,
  hPrev: number,
  cPrev: number
): { f: number; i: number; cTilde: number; c: number; o: number; h: number } {
  // Forget gate
  const f = 1 / (1 + Math.exp(-(0.7 * x + 0.5 * hPrev + 0.2)));
  // Input gate
  const i = 1 / (1 + Math.exp(-(0.6 * x + 0.4 * hPrev + 0.1)));
  // Candidate cell state
  const cTilde = Math.tanh(0.8 * x + 0.6 * hPrev);
  // Updated cell state
  const c = f * cPrev + i * cTilde;
  // Output gate
  const o = 1 / (1 + Math.exp(-(0.5 * x + 0.5 * hPrev + 0.1)));
  // Hidden state
  const h = o * Math.tanh(c);

  return { f, i, cTilde, c, o, h };
}

export function computeBahdanauAlignment(
  decoderState: number[],
  encoderStates: number[][]
): number[] {
  // Additive attention: score = tanh(s + h)
  const scores = encoderStates.map((h) => {
    let sum = 0;
    for (let d = 0; d < h.length; d++) {
      sum += (decoderState[d] || 0) + h[d];
    }
    return Math.tanh(sum);
  });

  const maxVal = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxVal));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sumExps);
}

export function computeLuongAlignment(
  decoderState: number[],
  encoderStates: number[][]
): number[] {
  // Multiplicative dot attention: score = s . h
  const scores = encoderStates.map((h) => {
    let dot = 0;
    for (let d = 0; d < h.length; d++) {
      dot += (decoderState[d] || 0) * h[d];
    }
    return dot;
  });

  const maxVal = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxVal));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sumExps);
}
