import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { NCCL_PRIMITIVES, NcclPrimitiveInfo } from './category08Math';
import styles from '../category01/Category01.module.css';

// 97. FlashAttention (IO-Aware Tiling & Online Softmax)
export const FlashAttentionViz: React.FC = () => {
  const [method, setMethod] = useState<'standard' | 'flash'>('flash');

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{method === 'flash' ? 'FlashAttention IO-Aware Tiling (Dao et al.)' : 'Standard Attention (HBM Memory Bottleneck)'}</span>
            <span style={{ fontSize: '0.8rem', color: method === 'flash' ? 'var(--success-color)' : 'var(--warning-color)' }}>
              {method === 'flash' ? 'O(N) HBM Memory Reads / Online Softmax' : 'O(N²) Materialized HBM Attention Matrix'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #38bdf8' }}>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>Fast On-Chip GPU SRAM</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0' }}>19 TB/s (H100)</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>24 MB ultra-fast cache</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>High-Bandwidth Memory (HBM3)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0' }}>3.35 TB/s (H100)</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>80 GB main VRAM</div>
            </div>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {method === 'flash' ? (
              <p>
                <strong>Online Softmax:</strong> Computes running maximum m_i and normalization sum l_i directly within SRAM tiles. It never writes the massive N x N attention matrix to slow HBM.
              </p>
            ) : (
              <p>
                <strong>HBM Overhead:</strong> Writes full intermediate QK^T matrix (N x N) and Softmax weights to HBM, bottlenecking compute cores on memory bandwidth.
              </p>
            )}
          </div>

          <MathBlock math={method === 'flash' ? 'm_{\\text{new}} = \\max(m_{\\text{old}}, \\tilde{m}), \\quad l_{\\text{new}} = e^{m_{\\text{old}} - m_{\\text{new}}} l_{\\text{old}} + e^{\\tilde{m} - m_{\\text{new}}} \\tilde{l}' : '\\text{HBM Accesses} = \\mathcal{O}(N^2) \\quad (\\text{Memory Bandwidth Bound})'} />
        </div>

        <ControlPanel title="Attention Algorithm" onReset={() => setMethod('flash')}>
          <RadioGroup
            label="Implementation"
            value={method}
            options={[
              { value: 'flash', label: 'FlashAttention (Tiled Online Softmax)' },
              { value: 'standard', label: 'Standard Attention (Full HBM Writes)' },
            ]}
            onChange={(v) => setMethod(v as 'standard' | 'flash')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 98. Mixed Precision Training & Dynamic Loss Scaling
export const MixedPrecisionTrainingViz: React.FC = () => {
  const [lossScalePower, setLossScalePower] = useState(15); // Scale S = 2^15 = 32768

  const scaleFactor = Math.pow(2, lossScalePower);
  const rawGrad = 1.2e-6; // Very small gradient
  const scaledGrad = rawGrad * scaleFactor;
  const underflow = rawGrad < 5.96e-8 && lossScalePower === 0;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Automatic Mixed Precision (AMP) & Loss Scaling</span>
            <span style={{ fontSize: '0.8rem', color: underflow ? 'var(--error-color)' : 'var(--success-color)' }}>
              {underflow ? 'Underflow Detected! Gradients Flush to 0.0' : `Loss Scale S = 2^${lossScalePower} (${scaleFactor.toLocaleString()})`}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Raw FP16 Gradient Value</div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: '#f59e0b', margin: '4px 0' }}>
                {rawGrad.toExponential(2)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Minimum FP16 subnormal: 5.96e-8</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scaled Gradient (g_scaled = S · g)</div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-color)', margin: '4px 0' }}>
                {scaledGrad.toExponential(2)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--success-color)' }}>Safely within FP16 dynamic range ✓</div>
            </div>
          </div>

          <MathBlock math={`g_{\\text{FP16}} = \\frac{\\nabla (S \\cdot \\mathcal{L})}{S} \\quad (\\text{Dynamic Loss Scaling Prevents Underflow})`} />
        </div>

        <ControlPanel title="Loss Scale Exponent" onReset={() => setLossScalePower(15)}>
          <Slider
            label="Loss Scale Factor (S = 2^k)"
            value={lossScalePower}
            min={0}
            max={20}
            step={1}
            onChange={setLossScalePower}
            formatValue={(v) => `2^${v} = ${Math.pow(2, v).toLocaleString()}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 99. Collective Communication Primitives (NCCL)
export const CommunicationPrimitivesViz: React.FC = () => {
  const [selectedPrim, setSelectedPrim] = useState<string>('AllReduce');

  const active: NcclPrimitiveInfo =
    NCCL_PRIMITIVES.find((p) => p.name === selectedPrim) || NCCL_PRIMITIVES[0];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>NCCL Collective Primitive: {active.name}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Pattern: {active.pattern}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {[0, 1, 2, 3].map((id) => (
              <div
                key={id}
                style={{
                  padding: '12px 8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-color)' }}>Rank #{id}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>GPU {id}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ color: 'var(--accent-color)' }}>{active.name}</strong>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#38bdf8' }}>Volume: {active.commVolume}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{active.description}</p>
          </div>

          <MathBlock math={`\\text{NCCL}(${active.name}): \\quad \\text{Communication Volume} = ${active.commVolume}`} />
        </div>

        <ControlPanel title="NCCL Primitive" onReset={() => setSelectedPrim('AllReduce')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NCCL_PRIMITIVES.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setSelectedPrim(p.name)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  backgroundColor: selectedPrim === p.name ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
                  border: selectedPrim === p.name ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: selectedPrim === p.name ? 'var(--accent-color)' : 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{p.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.pattern}</span>
              </button>
            ))}
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};
