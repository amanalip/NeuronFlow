import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

export const TransformerArchitectureViz: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'mha' | 'ffn' | 'norm' | 'pe' | 'cross'>('mha');

  const moduleData = {
    mha: {
      title: 'Multi-Head Self-Attention',
      desc: 'Projects input into h subspaces, computes parallel scaled dot-product attention, and concatenates results.',
      formula: '\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O',
    },
    ffn: {
      title: 'Position-wise Feed-Forward Network',
      desc: 'Applies two linear transformations with a non-linear activation (ReLU / GELU / SwiGLU) separately to each position.',
      formula: '\\text{FFN}(x) = \\max(0, xW_1 + b_1)W_2 + b_2',
    },
    norm: {
      title: 'Add & Norm (Residual + LayerNorm)',
      desc: 'Adds skip connection to preserve gradient flow and normalizes across feature dimensions.',
      formula: '\\text{Output} = \\text{LayerNorm}(x + \\text{Sublayer}(x))',
    },
    pe: {
      title: 'Positional Encoding',
      desc: 'Injects sequence order into permutation-invariant self-attention via sinusoidal or learned vectors.',
      formula: 'PE_{(pos, 2i)} = \\sin(pos / 10000^{2i/d}), \\quad PE_{(pos, 2i+1)} = \\cos(pos / 10000^{2i/d})',
    },
    cross: {
      title: 'Cross-Attention (Decoder)',
      desc: 'Queries come from the decoder; Keys and Values come from the top of the encoder stack.',
      formula: '\\text{CrossAttn}(Q_{\\text{dec}}, K_{\\text{enc}}, V_{\\text{enc}}) = \\operatorname{softmax}\\left(\\frac{Q_{\\text{dec}} K_{\\text{enc}}^T}{\\sqrt{d_k}}\\right) V_{\\text{enc}}',
    },
  };

  const current = moduleData[activeModule];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Transformer Encoder-Decoder Architecture (Vaswani et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {current.title}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '6px' }}>
            {/* Encoder Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#38bdf8', textAlign: 'center' }}>ENCODER (x N)</div>
              <button
                type="button"
                onClick={() => setActiveModule('ffn')}
                style={{ padding: '6px', background: activeModule === 'ffn' ? 'var(--accent-muted)' : 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
              >
                Feed Forward
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('norm')}
                style={{ padding: '6px', background: activeModule === 'norm' ? 'var(--accent-muted)' : 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
              >
                Add & Norm
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('mha')}
                style={{ padding: '6px', background: activeModule === 'mha' ? 'var(--accent-muted)' : 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
              >
                Multi-Head Self-Attn
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('pe')}
                style={{ padding: '6px', background: activeModule === 'pe' ? 'var(--accent-muted)' : 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
              >
                Positional Encoding
              </button>
            </div>

            {/* Decoder Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#10b981', textAlign: 'center' }}>DECODER (x N)</div>
              <button
                type="button"
                onClick={() => setActiveModule('ffn')}
                style={{ padding: '6px', background: activeModule === 'ffn' ? 'var(--accent-muted)' : 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
              >
                Feed Forward
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('cross')}
                style={{ padding: '6px', background: activeModule === 'cross' ? 'var(--accent-muted)' : 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
              >
                Cross-Attention
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('mha')}
                style={{ padding: '6px', background: activeModule === 'mha' ? 'var(--accent-muted)' : 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
              >
                Masked Self-Attn
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('pe')}
                style={{ padding: '6px', background: activeModule === 'pe' ? 'var(--accent-muted)' : 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--text-primary)' }}
              >
                Positional Encoding
              </button>
            </div>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-color)', marginBottom: '4px' }}>{current.title}</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{current.desc}</p>
            <MathBlock math={current.formula} />
          </div>
        </div>

        <ControlPanel title="Interactive Sub-Blocks" onReset={() => setActiveModule('mha')}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Click any block in the Encoder or Decoder stack to inspect its mathematical formulation, tensor shapes, and architectural function.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
