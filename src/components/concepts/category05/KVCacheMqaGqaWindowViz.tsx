import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { Toggle } from '../../controls/Toggle';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { calculateKvCacheMemoryBytes } from './category05Math';
import { MatrixView } from '../../viz/matrix/MatrixView';
import styles from '../category01/Category01.module.css';

// 63. KV Cache & Memory Calculator
export const KVCacheViz: React.FC = () => {
  const [seqLen, setSeqLen] = useState(2048);
  const [batchSize, setBatchSize] = useState(1);
  const [useCache, setUseCache] = useState(true);

  const nLayers = 32;
  const nHeads = 32;
  const dHead = 128;

  const totalBytes = calculateKvCacheMemoryBytes(nLayers, nHeads, dHead, seqLen, batchSize);
  const memMb = (totalBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Autoregressive KV Cache Memory & Complexity</span>
            <span style={{ fontSize: '0.8rem', color: useCache ? 'var(--success-color)' : 'var(--warning-color)' }}>
              {useCache ? 'O(T) per Step with Cache' : 'O(T²) Redundant Computation'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>KV Cache RAM Required</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>{memMb} MB</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>FP16 (2 bytes / weight)</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Step Flop Cost</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: useCache ? '#10b981' : '#f59e0b', margin: '4px 0' }}>
                {useCache ? '1 × T' : `${seqLen} × T`}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{useCache ? 'Compute new token Q only' : 'Recomputes all past keys'}</div>
            </div>
          </div>

          <MathBlock math={`\\text{RAM} = 2 \\times 2_{\\text{bytes}} \\times n_{\\text{layers}} \\times n_{\\text{heads}} \\times d_{\\text{head}} \\times T \\times B = ${memMb} \\text{ MB}`} />
        </div>

        <ControlPanel title="KV Cache Settings" onReset={() => { setSeqLen(2048); setBatchSize(1); setUseCache(true); }}>
          <Slider label="Sequence Length (Tokens)" value={seqLen} min={512} max={8192} step={512} onChange={setSeqLen} />
          <Slider label="Batch Size" value={batchSize} min={1} max={16} step={1} onChange={setBatchSize} />
          <Toggle label="Enable KV Cache" checked={useCache} onChange={setUseCache} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 64. Multi-Query (MQA) & Grouped-Query Attention (GQA)
export const MqaGqaViz: React.FC = () => {
  const [arch, setArch] = useState<'mha' | 'gqa' | 'mqa'>('gqa');

  const configs = {
    mha: { title: 'Multi-Head Attention (MHA)', qHeads: 8, kvHeads: 8, reduction: '1x (Baseline RAM)', desc: '1 Key/Value head per Query head' },
    gqa: { title: 'Grouped-Query Attention (GQA)', qHeads: 8, kvHeads: 2, reduction: '4x Memory Reduction', desc: '1 Key/Value head per 4 Query heads (LLaMA-3 / Mistral standard)' },
    mqa: { title: 'Multi-Query Attention (MQA)', qHeads: 8, kvHeads: 1, reduction: '8x Memory Reduction', desc: '1 Key/Value head shared across all Query heads' },
  };

  const current = configs[arch];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{current.title}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {current.reduction}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Query Heads: {current.qHeads}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-color)' }}>KV Heads: {current.kvHeads}</span>
            </div>

            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {Array.from({ length: current.qHeads }).map((_, idx) => {
                const groupIdx = Math.floor(idx / (current.qHeads / current.kvHeads));
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 10px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      textAlign: 'center',
                      flex: 1,
                    }}
                  >
                    Q_{idx + 1} → <strong>KV_{groupIdx + 1}</strong>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>{current.desc}</div>
          </div>

          <MathBlock math={`\\text{KV Footprint Ratio} = \\frac{n_{\\text{kv\\_heads}}}{n_{\\text{q\\_heads}}} = \\frac{${current.kvHeads}}{${current.qHeads}} = ${(current.kvHeads / current.qHeads).toFixed(3)}`} />
        </div>

        <ControlPanel title="KV Head Sharing" onReset={() => setArch('gqa')}>
          <RadioGroup
            label="Attention Pattern"
            value={arch}
            options={[
              { value: 'mha', label: 'MHA (8 Q, 8 KV)' },
              { value: 'gqa', label: 'GQA (8 Q, 2 KV)' },
              { value: 'mqa', label: 'MQA (8 Q, 1 KV)' },
            ]}
            onChange={(v) => setArch(v as 'mha' | 'gqa' | 'mqa')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 65. Sliding Window Attention
export const SlidingWindowAttentionViz: React.FC = () => {
  const [windowSize, setWindowSize] = useState(2);

  const seqLen = 8;
  const matrix: number[][] = [];
  for (let i = 0; i < seqLen; i++) {
    const row: number[] = [];
    for (let j = 0; j < seqLen; j++) {
      // Causal and within sliding window
      const inWindow = j <= i && i - j <= windowSize;
      row.push(inWindow ? 1.0 : 0.0);
    }
    matrix.push(row);
  }

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Sliding Window Attention Matrix (Mistral / Longformer)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Window W = {windowSize} tokens (O(N · W) Complexity)
            </span>
          </div>

          <MatrixView
            matrix={matrix}
            title="Sparsity Matrix (8 Tokens)"
            cellSize={34}
            minValue={0}
            maxValue={1}
          />

          <MathBlock math={`\\text{Attention}(i, j) \\neq 0 \\iff i - W \\le j \\le i \\quad (\\text{Linear Complexity } \\mathcal{O}(N \\times W))`} />
        </div>

        <ControlPanel title="Window Width" onReset={() => setWindowSize(2)}>
          <Slider
            label="Sliding Window Size (W)"
            value={windowSize}
            min={1}
            max={6}
            step={1}
            onChange={setWindowSize}
            formatValue={(v) => `W = ${v}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
