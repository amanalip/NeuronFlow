import React, { useState } from 'react';
import { Toggle } from '../../controls/Toggle';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { MatrixView } from '../../viz/matrix/MatrixView';
import styles from '../category01/Category01.module.css';

// 52. Multi-Head Attention Subspaces
export const MultiHeadAttentionViz: React.FC = () => {
  const [activeHead, setActiveHead] = useState<0 | 1 | 2>(0);

  const headNames = [
    'Head 1: Syntactic Dependencies (Verb -> Object)',
    'Head 2: Coreference Resolution (Pronoun -> Noun)',
    'Head 3: Positional Proximity (Local Neighbor Focus)',
  ];

  const headMatrices = [
    // Head 1
    [
      [0.6, 0.1, 0.3],
      [0.1, 0.7, 0.2],
      [0.2, 0.1, 0.7],
    ],
    // Head 2
    [
      [0.2, 0.7, 0.1],
      [0.1, 0.8, 0.1],
      [0.5, 0.1, 0.4],
    ],
    // Head 3
    [
      [0.8, 0.2, 0.0],
      [0.3, 0.5, 0.2],
      [0.0, 0.2, 0.8],
    ],
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{headNames[activeHead]}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Head #{activeHead + 1} of 3
            </span>
          </div>

          <MatrixView
            matrix={headMatrices[activeHead]}
            title="Head Attention Weights (3x3 Subspace)"
            cellSize={48}
            minValue={0}
            maxValue={1}
          />

          <MathBlock math={`\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O`} />
        </div>

        <ControlPanel title="Subspace Heads" onReset={() => setActiveHead(0)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {headNames.map((name, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveHead(idx as 0 | 1 | 2)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: activeHead === idx ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: activeHead === idx ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: activeHead === idx ? 'var(--accent-color)' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  textAlign: 'left',
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

// 53. Cross-Attention
export const CrossAttentionViz: React.FC = () => {
  const [isCross, setIsCross] = useState(true);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{isCross ? 'Cross-Attention (Decoder ← Encoder)' : 'Self-Attention (Internal)'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {isCross ? 'Q from Decoder, K/V from Encoder' : 'Q, K, V from Same Sequence'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', gap: '10px' }}>
            <div style={{ padding: '12px', background: isCross ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#38bdf8' }}>Queries (Q)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {isCross ? 'Target Decoder Tokens' : 'Source / Target Tokens'}
              </div>
            </div>
            <div style={{ padding: '12px', background: isCross ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#10b981' }}>Keys (K) & Values (V)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {isCross ? 'Source Encoder Stack' : 'Source / Target Tokens'}
              </div>
            </div>
          </div>

          {isCross ? (
            <MathBlock math={`\\text{CrossAttn}(Q_{\\text{dec}}, K_{\\text{enc}}, V_{\\text{enc}}) = \\operatorname{softmax}\\left(\\frac{Q_{\\text{dec}} K_{\\text{enc}}^T}{\\sqrt{d_k}}\\right) V_{\\text{enc}}`} />
          ) : (
            <MathBlock math={`\\text{SelfAttn}(X) = \\operatorname{softmax}\\left(\\frac{(XW_Q)(XW_K)^T}{\\sqrt{d_k}}\\right) (XW_V)`} />
          )}
        </div>

        <ControlPanel title="Attention Mode" onReset={() => setIsCross(true)}>
          <Toggle label="Enable Cross-Attention Mode" checked={isCross} onChange={setIsCross} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 54. Causal Masking
export const CausalMaskingViz: React.FC = () => {
  const [maskEnabled, setMaskEnabled] = useState(true);

  const rawMatrix = [
    [0.7, 0.4, 0.2, 0.1],
    [0.3, 0.8, 0.5, 0.2],
    [0.1, 0.4, 0.9, 0.6],
    [0.2, 0.1, 0.3, 0.8],
  ];

  const maskedMatrix = rawMatrix.map((row, rIdx) =>
    row.map((val, cIdx) => (maskEnabled && cIdx > rIdx ? 0.0 : val))
  );

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Autoregressive Causal Lower-Triangular Mask</span>
            <span style={{ fontSize: '0.8rem', color: maskEnabled ? 'var(--success-color)' : 'var(--error-color)' }}>
              {maskEnabled ? 'Causal Mask Enforced (No Future Leakage)' : 'Bidirectional (Future Tokens Leaking)'}
            </span>
          </div>

          <MatrixView
            matrix={maskedMatrix}
            title="Attention Matrix (4 Tokens)"
            cellSize={44}
            minValue={0}
            maxValue={1}
          />

          <MathBlock math={`M_{ij} = \\begin{cases} 0 & \\text{if } j \\le i \\\\ -\\infty & \\text{if } j > i \\end{cases} \\quad \\implies \\quad \\operatorname{softmax}(S + M)_{ij} = 0 \\text{ for } j > i`} />
        </div>

        <ControlPanel title="Causal Masking" onReset={() => setMaskEnabled(true)}>
          <Toggle
            label="Apply Lower-Triangular Mask"
            checked={maskEnabled}
            onChange={setMaskEnabled}
            description="Prevents autoregressive decoder positions from attending to subsequent future tokens."
          />
        </ControlPanel>
      </div>
    </div>
  );
};
