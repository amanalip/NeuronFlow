import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeKvCacheMemoryBytes } from './category11Math';
import styles from '../category01/Category01.module.css';

// 130. Continuous Batching (Iteration-Level Scheduling)
export const ContinuousBatchingViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Continuous Iteration-Level Batching (Orca / vLLM)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              Zero Padding Waste (2-4x Higher Serving Throughput)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--error-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--error-color)', fontSize: '0.82rem' }}>Static Batching (Legacy)</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                All requests in a batch wait until the longest request completes, wasting GPU cycles on pad tokens.
              </p>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--success-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--success-color)', fontSize: '0.82rem' }}>Continuous Batching ★</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                At each token generation step, completed requests exit immediately and incoming requests join without delay.
              </p>
            </div>
          </div>

          <MathBlock math={`\\text{Throughput Gain} = \\frac{\\text{Total Useful Generated Tokens}}{\\text{Total Iteration FLOPs}} \\quad (\\approx 2\\text{x}-4\\text{x vs Static Batching})`} />
        </div>

        <ControlPanel title="Scheduling Architecture" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Continuous batching executes at the token iteration boundary rather than the sequence boundary.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 131. Chunked Prefill (Sarathi-Serve)
export const ChunkedPrefillViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Chunked Prefill & Co-Scheduling (Sarathi-Serve)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Eliminating Inter-Token Latency (ITL) Spikes
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Large prompt prefills (e.g. 8,192 tokens) monopolize the GPU for hundreds of milliseconds, stalling ongoing decode requests. Chunked prefill partitions the prefill into 512-token chunks and bundles each chunk with decode tokens in a balanced forward step.
            </p>
          </div>

          <MathBlock math={`\\text{Batch}_t = \\{ \\text{PrefillChunk}_{512}, \\text{DecodeToken}_1, \\dots, \\text{DecodeToken}_{16} \\}`} />
        </div>

        <ControlPanel title="Chunking Benefits" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Chunked prefill stabilizes tail latency (P99 ITL) and maximizes compute utilization simultaneously.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 132. KV Cache Quantization
export const KvCacheQuantizationViz: React.FC = () => {
  const [seqLen, setSeqLen] = useState(8192);
  const [batchSize, setBatchSize] = useState(4);
  const [precision, setPrecision] = useState<'fp16' | 'fp8' | 'int4'>('fp8');

  const bytesPerElem = precision === 'fp16' ? 2 : precision === 'fp8' ? 1 : 0.5;
  const memoryBytes = computeKvCacheMemoryBytes(batchSize, seqLen, 32, 32, 128, bytesPerElem);
  const memoryGb = memoryBytes / (1024 * 1024 * 1024);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>KV Cache Quantization ({precision.toUpperCase()})</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              VRAM Footprint: {memoryGb.toFixed(2)} GB (Batch {batchSize}, {seqLen} Tokens)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FP16 Baseline</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0' }}>
                {(computeKvCacheMemoryBytes(batchSize, seqLen, 32, 32, 128, 2) / 1e9).toFixed(2)} GB
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>2 bytes / element</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-color)', fontWeight: 600 }}>FP8 Cache ★</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>
                {(computeKvCacheMemoryBytes(batchSize, seqLen, 32, 32, 128, 1) / 1e9).toFixed(2)} GB
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--success-color)' }}>50% Memory Savings</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>INT4 Cache</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>
                {(computeKvCacheMemoryBytes(batchSize, seqLen, 32, 32, 128, 0.5) / 1e9).toFixed(2)} GB
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--success-color)' }}>75% Memory Savings</div>
            </div>
          </div>

          <MathBlock math={`\\text{KV Memory} = 2 \\times 2 \\times N_{\\text{layers}} \\times B \\times H \\times L \\times d_h \\times \\text{Bytes} = ${memoryGb.toFixed(2)} \\text{ GB}`} />
        </div>

        <ControlPanel title="KV Cache Settings" onReset={() => { setSeqLen(8192); setBatchSize(4); setPrecision('fp8'); }}>
          <RadioGroup
            label="KV Precision"
            value={precision}
            options={[
              { value: 'fp16', label: 'FP16 (2 Bytes)' },
              { value: 'fp8', label: 'FP8 (1 Byte - Standard)' },
              { value: 'int4', label: 'INT4 (0.5 Bytes)' },
            ]}
            onChange={(v) => setPrecision(v as 'fp16' | 'fp8' | 'int4')}
          />
          <Slider label="Sequence Length" value={seqLen} min={2048} max={32768} step={2048} onChange={setSeqLen} formatValue={(v) => `${v} tokens`} />
          <Slider label="Concurrent Batch Size" value={batchSize} min={1} max={16} step={1} onChange={setBatchSize} formatValue={(v) => `${v} streams`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 133. KV Cache Eviction (StreamingLLM / H2O)
export const KvCacheEvictionViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>KV Cache Eviction: StreamingLLM (Xiao et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              Infinite Context Streaming with Fixed O(1) Memory
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <div style={{ padding: '8px 12px', background: 'var(--accent-muted)', border: '1px solid var(--accent-color)', borderRadius: '4px', textAlign: 'center', flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--accent-color)' }}>Attention Sinks (First 4 Tokens)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Retains huge initial attention bias</div>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', textAlign: 'center', flex: 2 }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Rolling Local Window (Last W Tokens)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Most recent conversational context</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Middle tokens are continuously evicted without model perplexity exploding because the attention sinks absorb excess softmax mass.
            </p>
          </div>

          <MathBlock math={`\\text{Retained Tokens} = \\{ t_1, t_2, t_3, t_4 \\} \\cup \\{ t_{N-W+1}, \\dots, t_N \\}`} />
        </div>

        <ControlPanel title="Eviction Strategies" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            StreamingLLM prevents catastrophic performance degradation without fine-tuning by anchoring the initial attention sink tokens.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 134. Prefix Caching (RadixAttention - SGLang)
export const PrefixCachingViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>RadixAttention: Radix Tree KV Cache Sharing (SGLang)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Zero TTFT for Shared System Prompts & Few-Shot Prefixes
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-color)' }}>
              [Root: System Prompt (512 tokens)]
              <br />
              ├── [Branch A: User Turn 1] → [Assistant Turn 1]
              <br />
              └── [Branch B: User Turn 2 (Reuses Cached Root KV)]
            </div>
          </div>

          <MathBlock math={`\\text{Time to First Token (TTFT)} = 0\\text{ ms for cached prefix tokens}`} />
        </div>

        <ControlPanel title="Radix Tree Benefits" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            RadixAttention maintains an LRU-evicted tree of token sequences, enabling automatic KV cache reuse across multi-turn chat sessions and agent chains.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
