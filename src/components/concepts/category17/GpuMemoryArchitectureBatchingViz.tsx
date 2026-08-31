import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeGpuVramBreakdown } from './category17Math';
import styles from '../category01/Category01.module.css';

// 198. GPU Architecture & 199. GPU Memory Breakdown
export const GpuMemoryBreakdownViz: React.FC = () => {
  const [paramCount, setParamCount] = useState<number>(8); // 8B model
  const [precision, setPrecision] = useState<'fp16' | 'int8' | 'int4'>('fp16');
  const [contextTokens, setContextTokens] = useState<number>(4096);
  const [batchSize, setBatchSize] = useState<number>(8);

  const precisionBytes = precision === 'fp16' ? 2 : precision === 'int8' ? 1 : 0.5;
  const { modelWeightsGb, kvCacheGb, activationsGb, totalVramGb } = computeGpuVramBreakdown(
    paramCount,
    precisionBytes,
    contextTokens,
    batchSize
  );

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>GPU VRAM Allocation Breakdown ({paramCount}B Model)</span>
            <span style={{ fontSize: '0.8rem', color: totalVramGb <= 80 ? 'var(--success-color)' : '#ef4444' }}>
              Total VRAM: {totalVramGb.toFixed(1)} GB / 80 GB H100 ({((totalVramGb / 80) * 100).toFixed(0)}% Used)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #38bdf8' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Static Model Weights</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>{modelWeightsGb.toFixed(1)} GB</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{precision.toUpperCase()} Precision ({precisionBytes} B/param)</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dynamic KV Cache</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{kvCacheGb.toFixed(1)} GB</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Batch {batchSize} &times; {contextTokens} Tokens</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Activations & Working Buffer</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', margin: '4px 0' }}>{activationsGb.toFixed(1)} GB</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Intermediate Tensor States</div>
            </div>
          </div>

          <MathBlock math={`\\text{Total VRAM} = \\underbrace{\\frac{N \\times P}{1024^3}}_{\\text{Weights: } ${modelWeightsGb.toFixed(1)}\\text{ GB}} + \\underbrace{\\frac{2 \\times L \\times d \\times T \\times B \\times 2}{1024^3}}_{\\text{KV Cache: } ${kvCacheGb.toFixed(1)}\\text{ GB}} + \\text{Act} = ${totalVramGb.toFixed(1)}\\text{ GB}`} />
        </div>

        <ControlPanel title="Memory Sizing" onReset={() => { setParamCount(8); setPrecision('fp16'); setContextTokens(4096); setBatchSize(8); }}>
          <RadioGroup
            label="Weight Precision"
            value={precision}
            options={[
              { value: 'fp16', label: 'FP16 / BF16 (16-bit, 2 Bytes/param)' },
              { value: 'int8', label: 'INT8 Quantized (8-bit, 1 Byte/param)' },
              { value: 'int4', label: 'INT4 Quantized (4-bit, 0.5 Bytes/param)' },
            ]}
            onChange={(v) => setPrecision(v as 'fp16' | 'int8' | 'int4')}
          />

          <Slider
            label="Model Parameters"
            value={paramCount}
            min={1}
            max={70}
            step={1}
            onChange={setParamCount}
            formatValue={(v) => `${v} Billion Parameters`}
          />

          <Slider
            label="Active Context Tokens"
            value={contextTokens}
            min={1024}
            max={32768}
            step={1024}
            onChange={setContextTokens}
            formatValue={(v) => `${v.toLocaleString()} Tokens`}
          />

          <Slider
            label="Concurrent Batch Size"
            value={batchSize}
            min={1}
            max={64}
            step={1}
            onChange={setBatchSize}
            formatValue={(v) => `${v} Concurrent Sequences`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 200. Batch Processing & 201. Continuous Batching
export const ContinuousBatchingViz: React.FC = () => {
  const [isContinuous, setIsContinuous] = useState<boolean>(true);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Static vs Continuous (Iteration-Level) Batching</span>
            <span style={{ fontSize: '0.8rem', color: isContinuous ? 'var(--success-color)' : '#ef4444' }}>
              Mode: {isContinuous ? 'Continuous Batching (vLLM / Orca) ★' : 'Static Batching (Padding Bubble Waste)'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                <span>Req 1 (Short query: 4 tokens)</span>
                <span style={{ color: '#10b981' }}>Finished at step 4</span>
              </div>
              <div style={{ height: '14px', background: '#38bdf8', borderRadius: '3px', width: '40%' }} />
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                <span>Req 2 (Medium query: 7 tokens)</span>
                <span style={{ color: '#10b981' }}>Finished at step 7</span>
              </div>
              <div style={{ height: '14px', background: '#38bdf8', borderRadius: '3px', width: '70%' }} />
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                <span>Req 3 (Long query: 10 tokens)</span>
                <span style={{ color: '#f59e0b' }}>Finished at step 10</span>
              </div>
              <div style={{ height: '14px', background: '#38bdf8', borderRadius: '3px', width: '100%' }} />
            </div>

            {isContinuous && (
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '6px', fontSize: '0.76rem', color: '#10b981' }}>
                ✓ <strong>Dynamic Slot Insertion:</strong> When Req 1 finished at step 4, pending Req 4 immediately took its batch slot without waiting for Req 3!
              </div>
            )}
          </div>

          <MathBlock math={isContinuous ? `\\text{GPU Utilization} \\approx 95\\% \\quad (\\text{Zero Padding Waste})` : `\\text{Padding Waste} = \\sum_{i=1}^B (T_{\\max} - T_i) \\approx 45\\% \\text{ Idle GPU Compute}`} />
        </div>

        <ControlPanel title="Scheduling Architecture" onReset={() => setIsContinuous(true)}>
          <button
            type="button"
            onClick={() => setIsContinuous((prev) => !prev)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: isContinuous ? 'var(--accent-muted)' : 'rgba(239, 68, 68, 0.15)',
              border: isContinuous ? '2px solid var(--accent-color)' : '2px solid #ef4444',
              color: isContinuous ? 'var(--accent-color)' : '#ef4444',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {isContinuous ? 'Switch to Naive Static Batching' : 'Enable Continuous Iteration-Level Batching'}
          </button>
        </ControlPanel>
      </div>
    </div>
  );
};
