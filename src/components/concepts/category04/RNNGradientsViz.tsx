import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { ButtonGroup } from '../../controls/ButtonGroup';
import { MathBlock } from '../../math/MathBlock';
import { simulateRnnStep, simulateGradientMagnitude } from './category04Math';
import { LossCurve, LossDataPoint } from '../../viz/charts/LossCurve';
import styles from '../category01/Category01.module.css';

// 38. Recurrent Neural Networks (Unrolled over time)
export const RecurrentNeuralNetworksViz: React.FC = () => {
  const [currentT, setCurrentT] = useState(0);
  const inputs = [0.8, -0.4, 0.6, 0.9, -0.2];

  // Compute unrolled hidden states
  const hiddenStates: number[] = [];
  let h = 0;
  for (let i = 0; i < inputs.length; i++) {
    h = simulateRnnStep(inputs[i], h, 0.8, 0.6, 0.0);
    hiddenStates.push(h);
  }

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Unrolled Recurrent Network (T = 5)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Active Step: t = {currentT + 1}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', overflowX: 'auto', gap: '8px' }}>
            {inputs.map((xVal, idx) => {
              const isActive = idx === currentT;
              const hVal = hiddenStates[idx];

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    background: isActive ? 'var(--accent-muted)' : 'var(--bg-secondary)',
                    border: isActive ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    borderRadius: '6px',
                    minWidth: '60px',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>t = {idx + 1}</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>x = {xVal}</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isActive ? 'var(--accent-color)' : 'var(--bg-tertiary)', color: isActive ? '#ffffff' : 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                    h_{idx + 1}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-color)' }}>{hVal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <ButtonGroup
            actions={[
              { label: 'Step Back', onClick: () => setCurrentT((t) => Math.max(0, t - 1)), disabled: currentT <= 0 },
              { label: 'Step Forward', onClick: () => setCurrentT((t) => Math.min(inputs.length - 1, t + 1)), disabled: currentT >= inputs.length - 1 },
              { label: 'Reset', onClick: () => setCurrentT(0) },
            ]}
          />

          <MathBlock math={`h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)`} />
        </div>

        <ControlPanel title="Sequence Controls" onReset={() => setCurrentT(0)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Each time step updates hidden state h_t based on the current input token x_t and the previous memory vector h_(t-1).
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 39. Vanishing & Exploding Gradients
export const VanishingGradientsViz: React.FC = () => {
  const [wH, setWh] = useState(0.85);

  const grads = simulateGradientMagnitude(wH, 15);

  const chartData: LossDataPoint[] = grads.map((val, idx) => ({
    step: idx + 1,
    trainLoss: Math.min(val, 10),
  }));

  const status =
    wH < 0.7
      ? 'Severe Vanishing (Gradients Collapse to 0)'
      : wH <= 1.0
      ? 'Stable Gradient Flow'
      : 'Exploding (Exponential Growth)';

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Backpropagation Through Time (BPTT) Gradient Magnitude</span>
            <span style={{ fontSize: '0.8rem', color: wH > 1.05 ? 'var(--error-color)' : wH < 0.7 ? 'var(--warning-color)' : 'var(--success-color)' }}>
              {status}
            </span>
          </div>

          <LossCurve
            data={chartData}
            title="Gradient Magnitude over 15 Time Steps"
            xLabel="Time Step t (Backwards)"
            yLabel="Norm ||dL/dh_t||"
          />

          <MathBlock math={`\\frac{\\partial L}{\\partial h_0} = \\frac{\\partial L}{\\partial h_T} \\prod_{t=1}^T \\frac{\\partial h_t}{\\partial h_{t-1}} \\approx \\frac{\\partial L}{\\partial h_T} (W_{hh}^T)^T`} />
        </div>

        <ControlPanel title="Recurrent Weight" onReset={() => setWh(0.85)}>
          <Slider
            label="Weight Magnitude (||W_hh||)"
            value={wH}
            min={0.3}
            max={1.3}
            step={0.05}
            onChange={setWh}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
