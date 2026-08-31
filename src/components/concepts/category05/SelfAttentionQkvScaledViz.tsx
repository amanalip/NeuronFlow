import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeScaledDotProductAttention } from './category05Math';
import { MatrixView } from '../../viz/matrix/MatrixView';
import styles from '../category01/Category01.module.css';

// 49. Self-Attention Step-by-Step
export const SelfAttentionViz: React.FC = () => {
  const [scaleFactor, setScaleFactor] = useState(true);

  // 3 tokens with 2-dim embeddings
  const Q = [
    [1.0, 0.5],
    [0.2, 1.2],
    [0.9, 0.1],
  ];
  const K = [
    [1.0, 0.4],
    [0.1, 1.1],
    [0.8, 0.2],
  ];
  const V = [
    [2.0, 0.0],
    [0.0, 2.0],
    [1.0, 1.0],
  ];

  const { scores, weights } = computeScaledDotProductAttention(Q, K, V, scaleFactor, false);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Self-Attention Softmax Weights (A = softmax(QK^T / √d_k))</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Seq Length: 3 tokens, d_k: 2
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Raw Scaled Scores (QK^T / √d_k):</div>
              <MatrixView matrix={scores} cellSize={44} minValue={0} maxValue={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Softmax Attention Matrix (A):</div>
              <MatrixView matrix={weights} cellSize={44} minValue={0} maxValue={1.0} />
            </div>
          </div>

          <MathBlock math={`\\text{Attention}(Q, K, V) = \\operatorname{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V`} />
        </div>

        <ControlPanel title="Attention Options" onReset={() => setScaleFactor(true)}>
          <button
            type="button"
            onClick={() => setScaleFactor(!scaleFactor)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: scaleFactor ? 'var(--accent-color)' : 'var(--bg-tertiary)',
              color: scaleFactor ? '#ffffff' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}
          >
            {scaleFactor ? 'Scaling (√d_k) Enabled ✓' : 'Scaling Disabled (Raw Dot Product)'}
          </button>
        </ControlPanel>
      </div>
    </div>
  );
};

// 50. Query, Key, Value (QKV) Intuition
export const QkvIntuitionViz: React.FC = () => {
  const [queryTerm, setQueryTerm] = useState<'author' | 'topic' | 'date'>('author');

  const database = [
    { key: 'author', val: 'Vaswani et al.', desc: 'Lead researchers behind Attention Is All You Need' },
    { key: 'topic', val: 'Transformer & Self-Attention', desc: 'Parallel sequence modeling architecture' },
    { key: 'date', val: 'June 2017', desc: 'NeurIPS paper publication date' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Search & Retrieval Analogy for Attention</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Query (Q) → Match Keys (K) → Retrieve Values (V)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {database.map((entry) => {
              const isMatch = entry.key === queryTerm;
              return (
                <div
                  key={entry.key}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '6px',
                    backgroundColor: isMatch ? 'var(--accent-muted)' : 'var(--bg-primary)',
                    border: isMatch ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Key: </span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: isMatch ? 'var(--accent-color)' : 'var(--text-primary)' }}>"{entry.key}"</strong>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{entry.desc}</div>
                  </div>
                  <div style={{ padding: '4px 10px', background: isMatch ? 'var(--accent-color)' : 'var(--bg-secondary)', color: isMatch ? '#ffffff' : 'var(--text-primary)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                    Value: {entry.val}
                  </div>
                </div>
              );
            })}
          </div>

          <MathBlock math={`\\text{Output} = \\sum_{j} \\operatorname{sim}(Q, K_j) \\cdot V_j`} />
        </div>

        <ControlPanel title="Query Selector" onReset={() => setQueryTerm('author')}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['author', 'topic', 'date'] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQueryTerm(q)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: queryTerm === q ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                  color: queryTerm === q ? '#ffffff' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

// 51. Scaled Dot-Product Attention (Why Scale by √d_k?)
export const ScaledDotProductAttentionViz: React.FC = () => {
  const [dK, setDk] = useState(64);

  // Variance of dot product: Var(q . k) = d_k
  const rawStd = Math.sqrt(dK);
  const saturationRisk = dK >= 128 ? 'Severe Softmax Saturation (Vanishing Gradients)' : dK >= 64 ? 'Moderate Saturation' : 'Stable';

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Dot Product Variance & Gradient Saturation</span>
            <span style={{ fontSize: '0.8rem', color: dK >= 128 ? 'var(--error-color)' : 'var(--success-color)' }}>
              {saturationRisk}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Unscaled Dot Product Variance</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', margin: '4px 0' }}>Var(Q · K) = {dK}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Std Dev σ = {rawStd.toFixed(2)} (Pushes softmax to extremes)</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Scaled by 1/√{dK} ({Math.sqrt(dK).toFixed(1)})</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>Var(Q · K / √d_k) = 1.0</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Preserves unit variance (Healthy gradients)</div>
            </div>
          </div>

          <MathBlock math={`\\operatorname{Var}\\left(\\sum_{i=1}^{d_k} q_i k_i\\right) = d_k \\quad \\implies \\quad \\operatorname{Var}\\left(\\frac{q \\cdot k}{\\sqrt{d_k}}\\right) = \\frac{d_k}{(\\sqrt{d_k})^2} = 1`} />
        </div>

        <ControlPanel title="Dimension Settings" onReset={() => setDk(64)}>
          <Slider
            label="Head Dimension (d_k)"
            value={dK}
            min={4}
            max={512}
            step={4}
            onChange={setDk}
            formatValue={(v) => `d_k = ${v}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
