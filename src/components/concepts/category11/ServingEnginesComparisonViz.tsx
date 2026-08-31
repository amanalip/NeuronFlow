import React from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { ComparisonTable } from '../../viz/charts/ComparisonTable';
import { SERVING_RUNTIMES } from './category11Math';
import styles from '../category01/Category01.module.css';

// 139. vLLM Serving Engine Architecture
export const VllmArchitectureViz: React.FC = () => {
  const components = [
    { name: '1. AsyncLLMEngine', role: 'Receives HTTP/gRPC client requests and pushes them to async background generation queues.' },
    { name: '2. Continuous Scheduler', role: 'Schedules requests dynamically at each token iteration step, eliminating pad tokens.' },
    { name: '3. BlockManager (PagedAttention)', role: 'Maps logical KV cache blocks to non-contiguous physical GPU page tables without memory waste.' },
    { name: '4. Worker / ModelRunner', role: 'Executes forward passes using optimized CUDA kernels, CUDA Graphs, and NCCL tensor parallelism.' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>vLLM Engine Modular Architecture (Kwon et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              End-to-End High-Throughput Serving
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {components.map((c, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--accent-color)' }}>{c.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{c.role}</div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{vLLM Throughput} = \\operatorname{Scheduler}(\\operatorname{BlockManager}(\\operatorname{ModelRunner}(\\text{CUDA Graphs})))`} />
        </div>

        <ControlPanel title="vLLM Subsystems" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            vLLM unifies page-table virtual memory with iteration-level continuous batching to maximize hardware saturation.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 140. TensorRT-LLM, SGLang, vLLM & TGI Comparison
export const ServingEnginesMatrixViz: React.FC = () => {
  const columns = [
    { key: 'name', header: 'Runtime' },
    { key: 'backend', header: 'Core Backend' },
    { key: 'keyFeature', header: 'Key Differentiator' },
    { key: 'bestFor', header: 'Optimal Use Case' },
  ];

  const rows = SERVING_RUNTIMES.map((rt) => ({
    name: <strong style={{ color: 'var(--accent-color)' }}>{rt.name}</strong>,
    backend: <span style={{ fontFamily: 'var(--font-mono)' }}>{rt.backend}</span>,
    keyFeature: rt.keyFeature,
    bestFor: <span style={{ color: '#10b981', fontWeight: 600 }}>{rt.bestFor}</span>,
  }));

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Production LLM Serving Engine Matrix</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Runtime Landscape
            </span>
          </div>

          <ComparisonTable columns={columns} rows={rows} />

          <MathBlock math={`\\text{Production Serving: Choose based on latency requirements, prefix reuse rate, and hardware stack.}`} />
        </div>

        <ControlPanel title="Runtime Selection" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Select SGLang for prefix-heavy multi-turn agent pipelines, TensorRT-LLM for raw throughput on pure NVIDIA stacks, and vLLM for flexible general production serving.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
