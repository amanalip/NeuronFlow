import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeMoeRouting, computeMambaDiscretization, computeRwkvDecay } from './category12Math';
import styles from '../category01/Category01.module.css';

// 140. Mixture of Experts (MoE) & 141. Expert Routing
export const MoeRoutingViz: React.FC = () => {
  const [topK, setTopK] = useState<number>(2);
  const [tokenType, setTokenType] = useState<'code' | 'math' | 'dialogue'>('code');

  const logitsMap: Record<'code' | 'math' | 'dialogue', number[]> = {
    code: [3.4, 0.2, 0.1, 2.9, 0.3, 0.4, 0.1, 0.2],
    math: [0.3, 3.8, 0.2, 0.4, 2.7, 0.1, 0.3, 0.1],
    dialogue: [0.2, 0.1, 3.5, 0.3, 0.2, 3.1, 0.4, 0.2],
  };

  const rawLogits = logitsMap[tokenType];
  const { probabilities, topKIndices, topKWeights, auxiliaryLoss } = computeMoeRouting(rawLogits, topK);

  const expertNames = [
    'Expert 0 (Python/Rust)',
    'Expert 1 (Math/Logic)',
    'Expert 2 (Roleplay/Chat)',
    'Expert 3 (Algorithms)',
    'Expert 4 (Calculus)',
    'Expert 5 (Summarization)',
    'Expert 6 (Translation)',
    'Expert 7 (Fact Retrieval)',
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Sparsely-Gated Mixture of Experts (Top-{topK} of 8 Routing)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Auxiliary Load-Balancing Loss: {auxiliaryLoss.toFixed(3)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', margin: '12px 0' }}>
            {expertNames.map((name, idx) => {
              const isSelected = topKIndices.includes(idx);
              const weight = isSelected ? topKWeights[topKIndices.indexOf(idx)] : 0;
              const prob = probabilities[idx];

              return (
                <div
                  key={idx}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'var(--accent-muted)' : 'var(--bg-primary)',
                    border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {name}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0', color: isSelected ? '#10b981' : 'var(--text-muted)' }}>
                    {(prob * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.68rem', color: isSelected ? 'var(--success-color)' : 'var(--text-muted)' }}>
                    {isSelected ? `Active Weight: ${(weight * 100).toFixed(1)}%` : 'Gated Off (0 FLOPs)'}
                  </div>
                </div>
              );
            })}
          </div>

          <MathBlock math={`y = \\sum_{i \\in \\operatorname{TopK}} g_i(x) \\cdot \\operatorname{FFN}_i(x), \\quad g_i(x) = \\frac{\\exp(H(x)_i)}{\\sum_{j \\in \\operatorname{TopK}} \\exp(H(x)_j)}`} />
        </div>

        <ControlPanel title="Router Settings" onReset={() => { setTopK(2); setTokenType('code'); }}>
          <RadioGroup
            label="Token Domain Category"
            value={tokenType}
            options={[
              { value: 'code', label: 'Code Token (def quicksort)' },
              { value: 'math', label: 'Math Token (\\int_0^1 x^2 dx)' },
              { value: 'dialogue', label: 'Chat Token (Hello! How are you?)' },
            ]}
            onChange={(v) => setTokenType(v as 'code' | 'math' | 'dialogue')}
          />

          <RadioGroup
            label="Active Expert Capacity (Top-K)"
            value={topK.toString()}
            options={[
              { value: '1', label: 'Top-1 Expert (Switch Transformer, Maximum Sparsity)' },
              { value: '2', label: 'Top-2 Experts (Mixtral 8x7B, Standard)' },
              { value: '4', label: 'Top-4 Experts (Dense routing blend)' },
            ]}
            onChange={(v) => setTopK(parseInt(v, 10))}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 142. State Space Models (Mamba)
export const MambaViz: React.FC = () => {
  const [delta, setDelta] = useState(0.5);
  const aContinuous = -1.2;
  const bContinuous = 2.0;

  const { aDiscrete, bDiscrete } = computeMambaDiscretization(delta, aContinuous, bContinuous);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Mamba: Selective State Space Discretization (Gu & Dao)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Linear O(n) Sequence Complexity & Constant O(1) Memory
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Input-Dependent Step Size (Δ)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>{delta.toFixed(2)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Selective forgetting speed</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Discrete Transition Matrix (Ā)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{aDiscrete.toFixed(3)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Ā = exp(Δ · A)</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Discrete Input Matrix (B̄)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>{bDiscrete.toFixed(3)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>B̄ = Δ · B</div>
            </div>
          </div>

          <MathBlock math={`h_t = \\bar{A} h_{t-1} + \\bar{B} x_t, \\quad y_t = C h_t \\quad (\\text{Hardware-aware parallel prefix scan})`} />
        </div>

        <ControlPanel title="Mamba Parameters" onReset={() => setDelta(0.5)}>
          <Slider
            label="Selective Step Size (Δ)"
            value={delta}
            min={0.05}
            max={2.0}
            step={0.05}
            onChange={setDelta}
            formatValue={(v) => `Δ = ${v.toFixed(2)}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 143. RWKV
export const RwkvViz: React.FC = () => {
  const [decay, setDecay] = useState(0.4);
  const sampleTokens = [1, 2, 3, 4, 5, 6];
  const attentionWeights = computeRwkvDecay(sampleTokens, decay);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>RWKV: Receptance Weighted Key Value Architecture (Peng et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Exponential Time-Decay Channel Weights
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', margin: '14px 0' }}>
            {attentionWeights.map((w, idx) => (
              <div key={idx} style={{ padding: '8px', background: 'var(--bg-primary)', borderRadius: '4px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Token t-{5 - idx}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>{(w * 100).toFixed(1)}%</div>
                <div style={{ height: '4px', background: 'var(--accent-color)', width: `${w * 100}%`, borderRadius: '2px', margin: 'auto' }} />
              </div>
            ))}
          </div>

          <MathBlock math={`w_k = \\exp(-w \\cdot (t - i)), \\quad \\operatorname{WKV}_t = \\frac{\\sum_{i=1}^{t-1} \\exp(-(t-1-i)w + k_i) v_i + \\exp(u + k_t) v_t}{\\sum_{i=1}^{t-1} \\exp(-(t-1-i)w + k_i) + \\exp(u + k_t)}`} />
        </div>

        <ControlPanel title="RWKV Decay" onReset={() => setDecay(0.4)}>
          <Slider
            label="Time Decay Parameter (w)"
            value={decay}
            min={0.1}
            max={1.5}
            step={0.05}
            onChange={setDecay}
            formatValue={(v) => `w = ${v.toFixed(2)}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
