import React, { useState } from 'react';
import { Toggle } from '../../controls/Toggle';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeLayerNorm, computeRmsNorm } from './category05Math';
import styles from '../category01/Category01.module.css';

// 58. Feed-Forward Networks & SwiGLU
export const FeedForwardNetworksViz: React.FC = () => {
  const [ffnType, setFfnType] = useState<'standard' | 'swiglu'>('swiglu');
  const dModel = 4096;
  const dFfn = ffnType === 'standard' ? 4 * dModel : Math.round((8 / 3) * dModel);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{ffnType === 'standard' ? 'Standard Two-Layer MLP (ReLU/GELU)' : 'SwiGLU Gated Feed-Forward (LLaMA)'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Hidden Dimension: {dFfn} (d_model = {dModel})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Input Vector</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.86rem' }}>d_model = {dModel}</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--accent-muted)', border: '2px solid var(--accent-color)', borderRadius: '6px', textAlign: 'center', flex: 1.5 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Expansion Subspace</div>
              <div style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '0.88rem' }}>d_ffn = {dFfn}</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Projection Back</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.86rem' }}>d_model = {dModel}</div>
            </div>
          </div>

          {ffnType === 'standard' ? (
            <MathBlock math={`\\text{FFN}(x) = \\operatorname{GELU}(xW_1 + b_1)W_2 + b_2 \\quad (\\text{Expansion factor: } 4\\times)`} />
          ) : (
            <MathBlock math={`\\text{SwiGLU}(x) = \\left(\\operatorname{Swish}(xW) \\otimes xV\\right) W_2 \\quad (\\text{Element-wise Gating})`} />
          )}
        </div>

        <ControlPanel title="FFN Architecture" onReset={() => setFfnType('swiglu')}>
          <RadioGroup
            label="Variant"
            value={ffnType}
            options={[
              { value: 'swiglu', label: 'SwiGLU (LLaMA / Mistral)' },
              { value: 'standard', label: 'Standard GELU MLP' },
            ]}
            onChange={(v) => setFfnType(v as 'standard' | 'swiglu')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 59. Residual Connections
export const ResidualConnectionsViz: React.FC = () => {
  const [residualOn, setResidualOn] = useState(true);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Residual Highway Gradient Propagation</span>
            <span style={{ fontSize: '0.8rem', color: residualOn ? 'var(--success-color)' : 'var(--error-color)' }}>
              {residualOn ? 'Skip Highway Active (Clean Gradient Flow)' : 'Disconnected (Vanishing Gradients in Deep Stack)'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {[6, 5, 4, 3, 2, 1].map((layer) => {
              const gradMag = residualOn ? 1.0 : Math.pow(0.35, 6 - layer);
              return (
                <div
                  key={layer}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Layer #{layer}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: residualOn ? 'var(--success-color)' : 'var(--error-color)' }}>
                    Gradient Reach: {gradMag.toFixed(3)}
                  </span>
                </div>
              );
            })}
          </div>

          <MathBlock math={`\\frac{\\partial \\mathcal{L}}{\\partial x_l} = \\frac{\\partial \\mathcal{L}}{\\partial x_L} \\left( I + \\frac{\\partial}{\\partial x_l} \\sum_{i=l}^{L-1} \\mathcal{F}(x_i) \\right) \\quad (\\text{Identity Gradient Shield})`} />
        </div>

        <ControlPanel title="Skip Connection" onReset={() => setResidualOn(true)}>
          <Toggle label="Enable Residual Highway (x + Sublayer(x))" checked={residualOn} onChange={setResidualOn} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 60. Layer Normalization vs Batch Normalization
export const LayerNormalizationViz: React.FC = () => {
  const [normType, setNormType] = useState<'layer' | 'batch'>('layer');

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{normType === 'layer' ? 'Layer Normalization (Across Channels)' : 'Batch Normalization (Across Batch Elements)'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Sequence-independent Statistics
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            {normType === 'layer' ? (
              <p>
                <strong>LayerNorm</strong> computes mean and variance independently for each sample across the hidden feature dimension (d_model). Perfect for autoregressive sequence models where batch sizes and sentence lengths vary dynamically.
              </p>
            ) : (
              <p>
                <strong>BatchNorm</strong> computes statistics across the batch dimension. It breaks down in sequence modeling because token lengths differ and autoregressive generation processes batch size = 1 at inference time.
              </p>
            )}
          </div>

          <MathBlock math={`\\text{LN}(x) = \\frac{x - \\mu_L}{\\sqrt{\\sigma_L^2 + \\epsilon}} \\odot \\gamma + \\beta, \\quad \\mu_L = \\frac{1}{d} \\sum_{i=1}^d x_i`} />
        </div>

        <ControlPanel title="Normalization Method" onReset={() => setNormType('layer')}>
          <RadioGroup
            label="Method"
            value={normType}
            options={[
              { value: 'layer', label: 'LayerNorm (Standard)' },
              { value: 'batch', label: 'BatchNorm (Vision/CNNs)' },
            ]}
            onChange={(v) => setNormType(v as 'layer' | 'batch')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 61. RMSNorm (Root Mean Square Normalization)
export const RmsNormViz: React.FC = () => {
  const sample = [1.2, -0.8, 2.1, -1.5, 0.4];
  const lnOutput = computeLayerNorm(sample);
  const rmsOutput = computeRmsNorm(sample);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>RMSNorm vs Standard LayerNorm</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              10-15% Faster Computation (No Mean Centering)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#38bdf8' }}>Standard LayerNorm</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                [{lnOutput.map((v) => v.toFixed(2)).join(', ')}]
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-color)' }}>RMSNorm (LLaMA / Gemma)</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                [{rmsOutput.map((v) => v.toFixed(2)).join(', ')}]
              </div>
            </div>
          </div>

          <MathBlock math={`\\text{RMSNorm}(x) = \\frac{x}{\\text{RMS}(x)} \\odot \\gamma, \\quad \\text{RMS}(x) = \\sqrt{\\frac{1}{d} \\sum_{i=1}^d x_i^2 + \\epsilon}`} />
        </div>

        <ControlPanel title="RMSNorm Properties" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            RMSNorm hypothesizes that the scaling invariance property of LayerNorm is what drives training stability, making mean-centering unnecessary.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 62. Pre-LN vs Post-LN
export const PreLnVsPostLnViz: React.FC = () => {
  const [arch, setArch] = useState<'pre' | 'post'>('pre');

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{arch === 'pre' ? 'Pre-LN (Modern Standard: GPT-3, LLaMA)' : 'Post-LN (Original Transformer)'}</span>
            <span style={{ fontSize: '0.8rem', color: arch === 'pre' ? 'var(--success-color)' : 'var(--warning-color)' }}>
              {arch === 'pre' ? 'Stable Training without Warm-Up' : 'Requires Warm-Up / Fragile to Explode'}
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {arch === 'pre' ? (
              <div>
                <strong>Pre-LN Flow:</strong> <br />
                <code style={{ color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>
                  x = x + Sublayer(LayerNorm(x))
                </code>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  The residual stream stays clean and normalized at every addition, enabling 100+ layer architectures to train smoothly from step 1.
                </p>
              </div>
            ) : (
              <div>
                <strong>Post-LN Flow:</strong> <br />
                <code style={{ color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                  x = LayerNorm(x + Sublayer(x))
                </code>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Gradients near the output layer have very large expected norms while vanishing exponentially in early layers without a careful warm-up schedule.
                </p>
              </div>
            )}
          </div>

          <MathBlock math={arch === 'pre' ? 'x_{l+1} = x_l + \\mathcal{F}(\\text{LN}(x_l))' : 'x_{l+1} = \\text{LN}(x_l + \\mathcal{F}(x_l))'} />
        </div>

        <ControlPanel title="Architecture Selection" onReset={() => setArch('pre')}>
          <RadioGroup
            label="LayerNorm Placement"
            value={arch}
            options={[
              { value: 'pre', label: 'Pre-LN (Modern Standard)' },
              { value: 'post', label: 'Post-LN (Vaswani 2017)' },
            ]}
            onChange={(v) => setArch(v as 'pre' | 'post')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
