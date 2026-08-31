import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computePipelineBubbleFraction } from './category08Math';
import styles from '../category01/Category01.module.css';

// 91. Tensor Parallelism (Megatron-LM)
export const TensorParallelismViz: React.FC = () => {
  const [tpSize, setTpSize] = useState<2 | 4 | 8>(4);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Megatron-LM MLP Tensor Parallelism (TP = {tpSize})</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              1 AllReduce per Transformer Sublayer
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.82rem' }}>1. Column Parallel Linear (W_1 / W_QKV):</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Weights sliced column-wise: W = [W_1, ..., W_{tpSize}]. Each GPU computes Y_i = X · W_i without communication.
              </div>
            </div>

            <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.82rem' }}>2. Row Parallel Linear (W_2 / W_O):</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Weights sliced row-wise: W = [W_1; ...; W_{tpSize}]. Each GPU computes partial sums Y_i · W_i.
              </div>
            </div>

            <div style={{ padding: '10px', background: 'var(--accent-muted)', border: '2px solid var(--accent-color)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '0.82rem' }}>3. Single AllReduce Synchronization:</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                Y = AllReduce(∑ Y_i · W_i): Restores exact full output on all {tpSize} GPUs.
              </div>
            </div>
          </div>

          <MathBlock math={`\\text{MLP}(X) = \\operatorname{AllReduce}\\left( \\sum_{i=1}^{\\text{TP}} \\operatorname{GELU}(X W_1^{(i)}) W_2^{(i)} \\right)`} />
        </div>

        <ControlPanel title="Tensor Parallel Dimension" onReset={() => setTpSize(4)}>
          <RadioGroup
            label="TP Shard Count"
            value={tpSize.toString()}
            options={[
              { value: '2', label: 'TP = 2' },
              { value: '4', label: 'TP = 4' },
              { value: '8', label: 'TP = 8 (Full 8-GPU Node)' },
            ]}
            onChange={(v) => setTpSize(parseInt(v, 10) as 2 | 4 | 8)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 92. Pipeline Parallelism (GPipe vs 1F1B)
export const PipelineParallelismViz: React.FC = () => {
  const [pipelineStages, setPipelineStages] = useState(4);
  const [microBatches, setMicroBatches] = useState(8);

  const bubbleFraction = computePipelineBubbleFraction(pipelineStages, microBatches);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Pipeline Parallelism & Bubble Overhead (1F1B Schedule)</span>
            <span style={{ fontSize: '0.8rem', color: bubbleFraction > 0.3 ? 'var(--warning-color)' : 'var(--success-color)' }}>
              Bubble Fraction: {(bubbleFraction * 100).toFixed(1)}% Idle Time
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pipeline Stages (p)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-color)' }}>{pipelineStages} Stages</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Micro-batches (m)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#10b981' }}>{microBatches} Chunks</div>
            </div>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>1F1B (One Forward, One Backward):</strong> After warmup, each GPU alternates 1 forward step with 1 backward step, reducing peak activation memory from O(m) to O(p).
          </div>

          <MathBlock math={`F_{\\text{bubble}} = \\frac{p - 1}{p - 1 + m} = \\frac{${pipelineStages} - 1}{${pipelineStages} - 1 + ${microBatches}} = ${(bubbleFraction * 100).toFixed(1)}\\%`} />
        </div>

        <ControlPanel title="Pipeline Parameters" onReset={() => { setPipelineStages(4); setMicroBatches(8); }}>
          <Slider label="Pipeline Stages (p GPUs)" value={pipelineStages} min={2} max={16} step={1} onChange={setPipelineStages} />
          <Slider label="Micro-batches per Step (m)" value={microBatches} min={4} max={32} step={2} onChange={setMicroBatches} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 93. 3D Parallelism (TP x PP x DP Grid)
export const ThreeDParallelismViz: React.FC = () => {
  const [tp, setTp] = useState(8);
  const [pp, setPp] = useState(4);
  const [dp, setDp] = useState(16);

  const totalGpus = tp * pp * dp;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>3D Cluster Parallelism Grid (Megatron-DeepSpeed)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Total GPUs: {totalGpus} (TP: {tp} × PP: {pp} × DP: {dp})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #38bdf8' }}>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>Tensor Parallel (TP)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0' }}>{tp}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Intra-Node NVLink (900 GB/s)</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>Pipeline Parallel (PP)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0' }}>{pp}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Inter-Node InfiniBand</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Data Parallel (DP)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0' }}>{dp}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ZeRO / FSDP Sharding</div>
            </div>
          </div>

          <MathBlock math={`N_{\\text{GPUs}} = \\text{TP} \\times \\text{PP} \\times \\text{DP} = ${tp} \\times ${pp} \\times ${dp} = ${totalGpus} \\text{ H100 SXM5 GPUs}`} />
        </div>

        <ControlPanel title="3D Grid Dimensions" onReset={() => { setTp(8); setPp(4); setDp(16); }}>
          <Slider label="Tensor Parallel (TP)" value={tp} min={1} max={8} step={1} onChange={setTp} />
          <Slider label="Pipeline Parallel (PP)" value={pp} min={1} max={8} step={1} onChange={setPp} />
          <Slider label="Data Parallel (DP)" value={dp} min={1} max={64} step={1} onChange={setDp} />
        </ControlPanel>
      </div>
    </div>
  );
};
