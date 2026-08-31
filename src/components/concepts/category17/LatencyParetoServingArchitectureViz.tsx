import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeServingLatency } from './category17Math';
import styles from '../category01/Category01.module.css';

// 202. Model Serving Architecture
export const ModelServingArchitectureViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Production LLM Serving Infrastructure (vLLM / TensorRT-LLM)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              High-Availability Topology
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            <div style={{ padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: '6px', borderLeft: '4px solid #38bdf8' }}>
              <strong style={{ fontSize: '0.8rem', color: '#38bdf8' }}>1. API Gateway & Auth:</strong>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Rate limiting, token usage metering, routing, and SSE connection management.</div>
            </div>

            <div style={{ padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
              <strong style={{ fontSize: '0.8rem', color: '#f59e0b' }}>2. Load Balancer & Queue Router:</strong>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Tracks active KV cache occupancy and dispatches requests to worker with lowest queue latency.</div>
            </div>

            <div style={{ padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
              <strong style={{ fontSize: '0.8rem', color: '#10b981' }}>3. GPU Inference Worker Replicas:</strong>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Executes continuous batching, PagedAttention memory paging, and FP8 tensor operations.</div>
            </div>
          </div>

          <MathBlock math={`\\text{Client Latency: } T_{\\text{total}} = T_{\\text{Gateway}} + T_{\\text{Queue}} + \\text{TTFT} + (N_{\\text{out}} \\times \\text{TPOT})`} />
        </div>

        <ControlPanel title="Serving Topology" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Serving architecture decouples load balancing from continuous batching engines for horizontal elasticity.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 203. Latency Breakdown (TTFT vs TPOT)
export const LatencyBreakdownViz: React.FC = () => {
  const [promptTokens, setPromptTokens] = useState<number>(1500);
  const [outputTokens, setOutputTokens] = useState<number>(400);

  const { ttftMs, tpotMs, totalLatencySec, effectiveTokensPerSec } = computeServingLatency(promptTokens, outputTokens);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Latency Breakdown: TTFT (Prefill) vs TPOT (Decode)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Total Stream Duration: {totalLatencySec.toFixed(2)}s ({effectiveTokensPerSec.toFixed(1)} Tok/s)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Time to First Token (TTFT)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>{ttftMs.toFixed(0)} ms</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Prompt Prefill Phase (Compute-Bound)</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Time Per Output Token (TPOT)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{tpotMs.toFixed(1)} ms</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Single-Token Decode (Memory-Bound)</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Generation Stream Speed</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', margin: '4px 0' }}>{(1000 / tpotMs).toFixed(0)} Tok/s</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>User Reading Velocity</div>
            </div>
          </div>

          <MathBlock math={`\\text{Total Latency} = \\underbrace{\\text{TTFT}}_{${ttftMs.toFixed(0)}\\text{ ms}} + \\underbrace{(${outputTokens} \\times \\text{TPOT})}_{${((outputTokens * tpotMs) / 1000).toFixed(2)}\\text{ s}} = ${totalLatencySec.toFixed(2)}\\text{ seconds}`} />
        </div>

        <ControlPanel title="Sequence Parameters" onReset={() => { setPromptTokens(1500); setOutputTokens(400); }}>
          <Slider
            label="Prompt Tokens"
            value={promptTokens}
            min={100}
            max={8000}
            step={100}
            onChange={setPromptTokens}
            formatValue={(v) => `${v.toLocaleString()} Tokens`}
          />

          <Slider
            label="Output Tokens"
            value={outputTokens}
            min={50}
            max={1500}
            step={50}
            onChange={setOutputTokens}
            formatValue={(v) => `${v.toLocaleString()} Tokens`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 204. Throughput vs Latency Tradeoff
export const ThroughputVsLatencyViz: React.FC = () => {
  const points = [
    { concurrency: 1, throughput: 85, tpot: 11.8, note: 'Ultra-low latency' },
    { concurrency: 8, throughput: 580, tpot: 13.8, note: 'Optimal interactive balance' },
    { concurrency: 32, throughput: 1850, tpot: 17.3, note: 'High throughput zone' },
    { concurrency: 64, throughput: 2800, tpot: 22.9, note: 'Batch serving sweet spot' },
    { concurrency: 128, throughput: 3400, tpot: 37.6, note: 'Memory bus saturation' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Serving Concurrency Pareto Frontier (Throughput vs Latency)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              GPU Saturation Dynamics
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '14px 0' }}>
            {points.map((p) => (
              <div
                key={p.concurrency}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                    Concurrency: {p.concurrency} Users ({p.note})
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Per-User TPOT: {p.tpot} ms
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                  {p.throughput.toLocaleString()} Tok/s
                </span>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{System Throughput (Tok/s)} = \\frac{B}{\\operatorname{TPOT}(B)} \\quad (\\text{Concave Pareto Frontier})`} />
        </div>

        <ControlPanel title="Pareto Optimization" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Batching amortizes weight loading across users, achieving 40x higher total throughput at the expense of a mild 3x TPOT increase.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
