import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeSinusoidalPE } from './category05Math';
import { MatrixView } from '../../viz/matrix/MatrixView';
import styles from '../category01/Category01.module.css';

// 55. Sinusoidal Positional Encoding
export const SinusoidalPEViz: React.FC = () => {
  const numPositions = 12;
  const numDims = 12;

  const peMatrix: number[][] = [];
  for (let p = 0; p < numPositions; p++) {
    const row: number[] = [];
    for (let d = 0; d < numDims; d++) {
      row.push(computeSinusoidalPE(p, d, numDims));
    }
    peMatrix.push(row);
  }

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Sinusoidal Positional Heatmap (Vaswani et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              12 Positions x 12 Dimensions
            </span>
          </div>

          <MatrixView
            matrix={peMatrix}
            title="PE(pos, 2i) = sin(...) / PE(pos, 2i+1) = cos(...)"
            cellSize={28}
            minValue={-1}
            maxValue={1}
          />

          <MathBlock math={`PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right), \\quad PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right)`} />
        </div>

        <ControlPanel title="Positional Theory" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Each dimension corresponds to a sinusoidal wave of different frequency, from 2π to 10000 · 2π, enabling the model to attend by relative positions via trigonometric addition formulas.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 56. Rotary Position Embedding (RoPE)
export const RoPEViz: React.FC = () => {
  const [posM, setPosM] = useState(2);
  const [posN, setPosN] = useState(5);
  const theta = 0.4; // Base frequency

  // RoPE rotates vector in 2D by m * theta
  const angleM = posM * theta;
  const angleN = posN * theta;
  const relDist = Math.abs(posM - posN);

  const xM = Math.cos(angleM) * 2;
  const yM = Math.sin(angleM) * 2;
  const xN = Math.cos(angleN) * 2;
  const yN = Math.sin(angleN) * 2;

  const dot = Math.cos((posM - posN) * theta);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>RoPE 2D Complex Plane Rotation (Su et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Relative Offset: Δpos = {relDist} (Dot Product = {dot.toFixed(3)})
            </span>
          </div>

          <svg viewBox="-3 -3 6 6" style={{ width: '100%', height: '240px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <line x1="-2.8" y1="0" x2="2.8" y2="0" stroke="var(--border-color)" strokeWidth="0.04" />
            <line x1="0" y1="-2.8" x2="0" y2="2.8" stroke="var(--border-color)" strokeWidth="0.04" />
            <circle cx="0" cy="0" r="2" fill="none" stroke="var(--border-color)" strokeDasharray="0.1 0.1" strokeWidth="0.03" />

            {/* Position M vector */}
            <line x1="0" y1="0" x2={xM} y2={-yM} stroke="#38bdf8" strokeWidth="0.1" />
            <circle cx={xM} cy={-yM} r="0.15" fill="#38bdf8" />
            <text x={xM + 0.2} y={-yM} fill="#38bdf8" fontSize="0.35" fontFamily="var(--font-mono)">pos {posM}</text>

            {/* Position N vector */}
            <line x1="0" y1="0" x2={xN} y2={-yN} stroke="#f59e0b" strokeWidth="0.1" />
            <circle cx={xN} cy={-yN} r="0.15" fill="#f59e0b" />
            <text x={xN + 0.2} y={-yN} fill="#f59e0b" fontSize="0.35" fontFamily="var(--font-mono)">pos {posN}</text>
          </svg>

          <MathBlock math={`\\langle R_{\\Theta, m}^d \\mathbf{q}, R_{\\Theta, n}^d \\mathbf{k} \\rangle = g(\\mathbf{q}, \\mathbf{k}, m - n) \\quad (\\text{Depends Only on Relative Distance})`} />
        </div>

        <ControlPanel title="Token Positions" onReset={() => { setPosM(2); setPosN(5); }}>
          <Slider label="Query Token Position (m)" value={posM} min={0} max={10} step={1} onChange={setPosM} />
          <Slider label="Key Token Position (n)" value={posN} min={0} max={10} step={1} onChange={setPosN} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 57. ALiBi (Attention with Linear Biases)
export const ALiBiViz: React.FC = () => {
  const [slope, setSlope] = useState(0.5);

  const seqLen = 6;
  const biasMatrix: number[][] = [];
  for (let i = 0; i < seqLen; i++) {
    const row: number[] = [];
    for (let j = 0; j < seqLen; j++) {
      row.push(-slope * Math.abs(i - j));
    }
    biasMatrix.push(row);
  }

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>ALiBi Linear Distance Penalty Matrix (Press et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Head Slope m = {slope.toFixed(2)}
            </span>
          </div>

          <MatrixView
            matrix={biasMatrix}
            title="Bias Matrix added to QK^T before Softmax"
            cellSize={40}
            minValue={-3}
            maxValue={0}
          />

          <MathBlock math={`\\operatorname{softmax}\\left(q_i k_j^T - m \\cdot |i - j|\\right) \\quad (\\text{Enables Zero-Shot Context Extrapolation})`} />
        </div>

        <ControlPanel title="ALiBi Slope Parameter" onReset={() => setSlope(0.5)}>
          <Slider
            label="Head Slope (m = 2^(-8/h))"
            value={slope}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={setSlope}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
