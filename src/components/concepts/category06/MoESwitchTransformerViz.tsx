import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeTopKGating } from './category06Math';
import styles from '../category01/Category01.module.css';

// 69. Mixture of Experts (MoE)
export const MixtureOfExpertsViz: React.FC = () => {
  const [topK, setTopK] = useState(2);
  const [tokenType, setTokenType] = useState<'code' | 'math' | 'prose'>('code');

  const tokenVectors = {
    code: [1.2, 0.2, 0.8, -0.4],
    math: [0.1, 1.5, -0.2, 0.9],
    prose: [-0.5, 0.1, 1.4, 0.6],
  };

  const expertWeights = [
    [0.9, 0.1, 0.2, 0.0], // Expert 1 (Python / Coding)
    [0.8, 0.2, 0.1, 0.1], // Expert 2 (Algorithms)
    [0.1, 0.9, 0.1, 0.8], // Expert 3 (Calculus / Logic)
    [0.0, 0.8, 0.2, 0.7], // Expert 4 (Linear Algebra)
    [0.2, 0.1, 0.9, 0.3], // Expert 5 (Creative Writing)
    [0.1, 0.0, 0.8, 0.5], // Expert 6 (Translation)
    [0.4, 0.4, 0.4, 0.4], // Expert 7 (General Knowledge)
    [0.3, 0.3, 0.3, 0.3], // Expert 8 (System Routing)
  ];

  const { expertIndices, expertWeights: weights } = computeTopKGating(
    tokenVectors[tokenType],
    expertWeights,
    topK
  );

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Sparse Mixture of Experts Routing (Mixtral 8x7B)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Top-{topK} Active (12.9B active of 46.7B total parameters)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {expertWeights.map((_, idx) => {
              const activeIdx = expertIndices.indexOf(idx);
              const isActive = activeIdx !== -1;
              const weightVal = isActive ? weights[activeIdx] : 0;

              return (
                <div
                  key={idx}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'var(--accent-muted)' : 'var(--bg-primary)',
                    border: isActive ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isActive ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                    Expert #{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: isActive ? '#10b981' : 'var(--text-muted)' }}>
                    {isActive ? `Weight: ${weightVal.toFixed(2)}` : 'Inactive'}
                  </span>
                </div>
              );
            })}
          </div>

          <MathBlock math={`y = \\sum_{i=1}^E G(x)_i E_i(x), \\quad G(x) = \\operatorname{Softmax}(\\operatorname{TopK}(H(x), k))`} />
        </div>

        <ControlPanel title="Token Type & Top-K" onReset={() => { setTopK(2); setTokenType('code'); }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            {(['code', 'math', 'prose'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTokenType(t)}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: '4px',
                  backgroundColor: tokenType === t ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                  color: tokenType === t ? '#ffffff' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                  textTransform: 'capitalize',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <Slider label="Top-K Selected Experts" value={topK} min={1} max={4} step={1} onChange={setTopK} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 70. Switch Transformer (Top-1 Routing & Capacity Factor)
export const SwitchTransformerViz: React.FC = () => {
  const [capacityFactor, setCapacityFactor] = useState(1.0);

  // Tokens arriving at an expert (capacity = numTokens / numExperts * capacityFactor)
  const numTokens = 12;
  const numExperts = 4;
  const expertCapacity = Math.floor((numTokens / numExperts) * capacityFactor);
  const arrivingTokens = 5; // Suppose 5 tokens routed to Expert 1
  const droppedTokens = Math.max(0, arrivingTokens - expertCapacity);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Switch Transformer Top-1 Expert Capacity (Fedus et al.)</span>
            <span style={{ fontSize: '0.8rem', color: droppedTokens > 0 ? 'var(--error-color)' : 'var(--success-color)' }}>
              {droppedTokens > 0 ? `${droppedTokens} Dropped Tokens (Bypassed via Residual)` : 'Zero Dropped Tokens ✓'}
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem' }}>Expert Buffer Capacity:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-color)' }}>{expertCapacity} slots</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem' }}>Tokens Routed to Expert:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>{arrivingTokens} tokens</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem' }}>Dropped / Skipped Tokens:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: droppedTokens > 0 ? 'var(--error-color)' : 'var(--success-color)' }}>
                {droppedTokens} tokens
              </strong>
            </div>
          </div>

          <MathBlock math={`\\text{Expert Capacity} = \\left\\lfloor \\frac{\\text{Tokens}}{\\text{Experts}} \\times \\text{Capacity Factor} \\right\\rfloor`} />
        </div>

        <ControlPanel title="Capacity Parameter" onReset={() => setCapacityFactor(1.0)}>
          <Slider
            label="Capacity Factor"
            value={capacityFactor}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={setCapacityFactor}
            formatValue={(v) => `${v.toFixed(1)}x`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
