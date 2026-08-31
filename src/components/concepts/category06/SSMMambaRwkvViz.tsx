import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { simulateSelectiveSsmStep } from './category06Math';
import styles from '../category01/Category01.module.css';

// 71. State Space Models (SSM)
export const StateSpaceModelsViz: React.FC = () => {
  const [mode, setMode] = useState<'recurrent' | 'convolutional'>('recurrent');

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>State Space Model (SSM) Duality</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {mode === 'recurrent' ? 'Recurrent View (Fast O(1) Inference)' : 'Convolutional View (Parallel O(T log T) Training)'}
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {mode === 'recurrent' ? (
              <div>
                <strong>Linear Recurrence Form:</strong>
                <div style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', margin: '8px 0' }}>
                  h_t = Ā h_(t-1) + B̄ x_t <br />
                  y_t = C h_t
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Maintains a fixed-size memory state h_t across unlimited sequence lengths with O(1) memory and time per generated token.
                </p>
              </div>
            ) : (
              <div>
                <strong>Global Convolution Form:</strong>
                <div style={{ fontFamily: 'var(--font-mono)', color: '#10b981', margin: '8px 0' }}>
                  y = x * K̄, \\quad K̄ = (CB̄, CĀB̄, CĀ²B̄, ...)
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Computes all sequence outputs simultaneously via Fast Fourier Transform (FFT) during pre-training.
                </p>
              </div>
            )}
          </div>

          <MathBlock math={mode === 'recurrent' ? 'h_t = \\bar{A} h_{t-1} + \\bar{B} x_t, \\quad y_t = C h_t' : 'y = x * \\bar{K} = \\operatorname{IFFT}(\\operatorname{FFT}(x) \\cdot \\operatorname{FFT}(\\bar{K}))'} />
        </div>

        <ControlPanel title="SSM Representation" onReset={() => setMode('recurrent')}>
          <RadioGroup
            label="Computation Mode"
            value={mode}
            options={[
              { value: 'recurrent', label: 'Recurrent (Inference)' },
              { value: 'convolutional', label: 'Convolutional (Training)' },
            ]}
            onChange={(v) => setMode(v as 'recurrent' | 'convolutional')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 72. Mamba (Selective State Space Model)
export const MambaViz: React.FC = () => {
  const [deltaVal, setDeltaVal] = useState(0.8);
  const inputX = 1.0;
  const hPrev = 0.5;

  const { h, y } = simulateSelectiveSsmStep(inputX, hPrev, deltaVal, -1.0, 1.0);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Mamba Selective Scan Mechanism (Gu & Dao)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Input-Dependent Discretization Δ(x)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated State (h_t)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)' }}>{h.toFixed(3)}</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Output (y_t)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>{y.toFixed(3)}</div>
            </div>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Hardware-Aware Scan:</strong> Fuses state expansion into ultra-fast on-chip GPU SRAM memory, avoiding high-bandwidth memory (HBM) memory bottlenecks.
          </div>

          <MathBlock math={`\\bar{A} = \\exp(\\Delta_t A), \\quad \\bar{B} = \\Delta_t B_t, \\quad \\Delta_t = \\operatorname{softplus}(\\text{Linear}(x_t))`} />
        </div>

        <ControlPanel title="Selective Gate Parameter" onReset={() => setDeltaVal(0.8)}>
          <Slider
            label="Selective Step Size (Δ_t)"
            value={deltaVal}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={setDeltaVal}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 73. RWKV (Receptance Weighted Key Value)
export const RwkvViz: React.FC = () => {
  const [decayW, setDecayW] = useState(0.85);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>RWKV Time-Mixing Exponential Decay</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Decay w = {decayW.toFixed(2)}
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--accent-color)' }}>Time-Mixing Formulation:</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              RWKV replaces quadratic attention with an exponential decay channel that runs sequentially in O(1) memory during generation while training like a transformer in parallel.
            </p>
          </div>

          <MathBlock math={`wkv_t = \\frac{\\sum_{i=1}^{t-1} e^{-(t-1-i)w + k_i} v_i + e^{u + k_t} v_t}{\\sum_{i=1}^{t-1} e^{-(t-1-i)w + k_i} + e^{u + k_t}}`} />
        </div>

        <ControlPanel title="RWKV Decay" onReset={() => setDecayW(0.85)}>
          <Slider
            label="Time Decay Parameter (w)"
            value={decayW}
            min={0.1}
            max={1.5}
            step={0.05}
            onChange={setDecayW}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
