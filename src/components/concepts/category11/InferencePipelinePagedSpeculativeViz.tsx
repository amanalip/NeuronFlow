import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeSpeculativeSpeedup } from './category11Math';
import styles from '../category01/Category01.module.css';

// 126. Inference Pipeline (Prefill vs Decode)
export const InferencePipelineViz: React.FC = () => {
  const [phase, setPhase] = useState<'prefill' | 'decode'>('decode');

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>LLM Inference: Prefill vs Decode Phase</span>
            <span style={{ fontSize: '0.8rem', color: phase === 'prefill' ? '#38bdf8' : '#10b981' }}>
              Current: {phase.toUpperCase()} PHASE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              onClick={() => setPhase('prefill')}
              style={{
                padding: '14px',
                background: 'var(--bg-primary)',
                border: phase === 'prefill' ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.84rem' }}>1. Prefill (Time to First Token)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Processes entire prompt in parallel. Highly <strong>compute-bound</strong> (large GEMM matrix multiplication).
              </div>
            </div>

            <div
              onClick={() => setPhase('decode')}
              style={{
                padding: '14px',
                background: 'var(--bg-primary)',
                border: phase === 'decode' ? '2px solid #10b981' : '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.84rem' }}>2. Decode (Inter-Token Latency) ★</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Generates 1 token per step sequentially. Highly <strong>memory-bandwidth-bound</strong> (GEMV vector-matrix operations).
              </div>
            </div>
          </div>

          <MathBlock math={phase === 'prefill' ? '\\text{Prefill: } \\text{FLOPs} = 2 N s_{\\text{prompt}} \\quad (\\text{High Arithmetic Intensity})' : '\\text{Decode: } \\text{Memory Read} = 2 N \\text{ Bytes/token} \\quad (\\text{Low Arithmetic Intensity})'} />
        </div>

        <ControlPanel title="Inference Mode" onReset={() => setPhase('decode')}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Decode throughput is capped by GPU VRAM bandwidth because weights must be loaded from HBM to SRAM for every single generated token.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 127. PagedAttention (vLLM)
export const PagedAttentionViz: React.FC = () => {
  const blocks = [
    { logical: 'Block 0 (Tokens 0-15)', physical: 'GPU Frame #4', status: 'Allocated' },
    { logical: 'Block 1 (Tokens 16-31)', physical: 'GPU Frame #12', status: 'Allocated' },
    { logical: 'Block 2 (Tokens 32-47)', physical: 'GPU Frame #7', status: 'Allocated' },
    { logical: 'Block 3 (Tokens 48-63)', physical: 'Unallocated', status: 'Dynamic On-Demand' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>vLLM PagedAttention Page Table (Kwon et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              &lt; 4% Memory Fragmentation (vs 60-80% in PyTorch)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {blocks.map((b, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{b.logical}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-color)' }}>
                  → {b.physical}
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{KV Cache Virtual Page Table: } \\operatorname{LogicalBlock}(i) \\longrightarrow \\operatorname{PhysicalFrame}(j)`} />
        </div>

        <ControlPanel title="Paged Memory" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            PagedAttention breaks continuous KV cache reservations into fixed-size physical pages, allowing non-contiguous allocation and zero memory waste.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 128. Speculative Decoding (Leviathan et al.)
export const SpeculativeDecodingViz: React.FC = () => {
  const [gamma, setGamma] = useState(4); // 4 draft tokens
  const [alpha, setAlpha] = useState(0.8); // 80% acceptance rate

  const speedup = computeSpeculativeSpeedup(gamma, alpha);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Speculative Decoding: Draft & Parallel Verification</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Expected Yield: {speedup.toFixed(2)} Tokens / Target Step
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Small Draft Model (e.g. 1B)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>{gamma} Tokens</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Speculative fast forward pass</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Large Target Model (e.g. 70B)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>1 Single Forward Pass</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--success-color)' }}>Verifies all {gamma} tokens in parallel</div>
            </div>
          </div>

          <MathBlock math={`\\mathbb{E}[\\text{Accepted Tokens}] = \\frac{1 - \\alpha^{\\gamma + 1}}{1 - \\alpha} = \\frac{1 - ${alpha.toFixed(2)}^{${gamma + 1}}}{1 - ${alpha.toFixed(2)}} = ${speedup.toFixed(2)} \\text{ Tokens/Step}`} />
        </div>

        <ControlPanel title="Speculative Parameters" onReset={() => { setGamma(4); setAlpha(0.8); }}>
          <Slider label="Draft Length (γ tokens)" value={gamma} min={1} max={8} step={1} onChange={setGamma} formatValue={(v) => `γ = ${v}`} />
          <Slider label="Draft Acceptance Rate (α)" value={alpha} min={0.2} max={0.95} step={0.05} onChange={setAlpha} formatValue={(v) => `${(v * 100).toFixed(0)}%`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 129. Medusa Multi-Head Speculative Decoding
export const MedusaViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Medusa: Multi-Head Speculative Decoding (Cai et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              Draft Model-Free Speculation
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Medusa adds multiple lightweight prediction heads on top of the target model's final hidden states:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <div style={{ padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', textAlign: 'center', fontSize: '0.78rem' }}>
                <strong>Head 1:</strong> Token t+1
              </div>
              <div style={{ padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', textAlign: 'center', fontSize: '0.78rem' }}>
                <strong>Head 2:</strong> Token t+2
              </div>
              <div style={{ padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', textAlign: 'center', fontSize: '0.78rem' }}>
                <strong>Head 3:</strong> Token t+3
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              A tree-attention mask verifies multiple candidate top-k token paths in a single target model forward pass.
            </div>
          </div>

          <MathBlock math={`y_{t+k} = \\operatorname{Softmax}\\left( h_t W_{\\text{Medusa}}^{(k)} \\right) \\quad (k = 1, 2, \\dots, K)`} />
        </div>

        <ControlPanel title="Medusa Advantage" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Medusa eliminates the overhead of managing and hosting a separate draft model by reusing the base model's internal representations.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
