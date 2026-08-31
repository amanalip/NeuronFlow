import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computePrefillVsDecodeIntensity } from './category17Math';
import styles from '../category01/Category01.module.css';

// 205. Multi-GPU Inference (Tensor Parallelism)
export const MultiGpuInferenceViz: React.FC = () => {
  const [numGpus, setNumGpus] = useState<number>(4);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Multi-GPU Tensor Parallelism (Megatron-LM / vLLM)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Sharded Across {numGpus} &times; H100 GPUs (NVLink 900 GB/s Interconnect)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numGpus}, 1fr)`, gap: '8px', margin: '14px 0' }}>
            {Array.from({ length: numGpus }).map((_, idx) => (
              <div key={idx} style={{ padding: '12px 6px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #38bdf8', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#38bdf8' }}>GPU #{idx}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Weight Shard {idx + 1}/{numGpus}<br />
                  (1/{numGpus} Heads)
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            <strong>Megatron Split:</strong> Attention Q, K, V projections are sharded by columns; Output projection $W_O$ is sharded by rows followed by an <code>All-Reduce</code> across NVLink.
          </div>

          <MathBlock math={`Y = \\operatorname{AllReduce}\\left([X W_1, \\, X W_2, \\, \\dots, \\, X W_N]\\right) \\quad (\\text{Tensor Parallel Synchrony})`} />
        </div>

        <ControlPanel title="Cluster Scale" onReset={() => setNumGpus(4)}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 4, 8].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setNumGpus(g)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '4px',
                  backgroundColor: numGpus === g ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
                  border: numGpus === g ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: numGpus === g ? 'var(--accent-color)' : 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                {g} GPU{g > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

// 206. Edge & On-Device Deployment
export const EdgeDeploymentViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Edge & On-Device Deployment (Llama.cpp / CoreML / GGUF)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              100% Private, Zero Cloud Cost
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #10b981' }}>
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.8rem' }}>Apple Silicon (Metal / Unified Memory)</div>
              <ul style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '6px', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <li>Shared CPU + GPU memory pool (up to 128GB unified RAM)</li>
                <li>Zero PCIe transfer bottleneck</li>
                <li>Runs 70B INT4 models locally @ 25 Tok/s</li>
              </ul>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #38bdf8' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.8rem' }}>Mobile NPU (Snapdragon / iPhone Neural Engine)</div>
              <ul style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '6px', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <li>Dedicated ultra-low-power INT4 matrix accelerators</li>
                <li>Executes 3B parameter SLMs locally in &lt;1.5W power</li>
                <li>Instant local transcription and autocomplete</li>
              </ul>
            </div>
          </div>

          <MathBlock math={`\\text{On-Device INT4 RAM: } \\text{VRAM} = \\frac{7.0 \\times 10^9 \\times 0.5 \\text{ Bytes}}{1024^3} + 0.8\\text{ GB KV} \\approx 4.1\\text{ GB}`} />
        </div>

        <ControlPanel title="Edge Architecture" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            INT4 quantization and unified memory architectures allow laptops and phones to run language models with zero network roundtrips.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 207. Prefill vs Decode Phases
export const PrefillVsDecodeViz: React.FC = () => {
  const hiddenDim = 4096;
  const seqLen = 2048;
  const { prefillIntensityFlopsPerByte, decodeIntensityFlopsPerByte } = computePrefillVsDecodeIntensity(hiddenDim, seqLen);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Prefill vs Decode Phases (Arithmetic Intensity Dynamics)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Compute-Bound vs Memory-Bandwidth-Bound
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #38bdf8' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.82rem' }}>1. Prefill Phase (Prompt Ingestion)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>{prefillIntensityFlopsPerByte.toFixed(0)} FLOPs/Byte</div>
              <ul style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <li>Processes all $N$ prompt tokens simultaneously (GEMM)</li>
                <li><strong>Compute-Bound:</strong> Fully saturates Tensor Cores</li>
                <li>Determines Time to First Token (TTFT)</li>
              </ul>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #10b981' }}>
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.82rem' }}>2. Decode Phase (Token Generation)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{decodeIntensityFlopsPerByte.toFixed(1)} FLOPs/Byte</div>
              <ul style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <li>Generates 1 token per forward step (GEMV)</li>
                <li><strong>Memory-Bound:</strong> Must load entire model from HBM per token</li>
                <li>Determines Time Per Output Token (TPOT)</li>
              </ul>
            </div>
          </div>

          <MathBlock math={`\\text{Disaggregated Serving: } \\operatorname{Cluster}_{\\text{Prefill}} (\\text{High FLOPs}) \\; \\& \\; \\operatorname{Cluster}_{\\text{Decode}} (\\text{High Memory Bandwidth})`} />
        </div>

        <ControlPanel title="Operational Insights" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Disaggregated serving separates prefill and decode across dedicated hardware pools, eliminating interference and maximizing hardware utilization.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
