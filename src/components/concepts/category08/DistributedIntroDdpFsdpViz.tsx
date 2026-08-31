import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { ButtonGroup } from '../../controls/ButtonGroup';
import { MathBlock } from '../../math/MathBlock';
import { computeTrainingMemoryBreakdown, computeZeroShardedMemory } from './category08Math';
import styles from '../category01/Category01.module.css';

// 88. Distributed Training Intro & Memory Breakdown
export const DistributedTrainingIntroViz: React.FC = () => {
  const [paramsB, setParamsB] = useState(70); // 70B model

  const { weightsGb, gradsGb, optimizerGb, activationsGb, totalGb } =
    computeTrainingMemoryBreakdown(paramsB, 2, 2048);

  const numGpusRequired = Math.ceil(totalGb / 80); // 80GB A100/H100

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>LLM Training Memory Breakdown ({paramsB}B Parameters)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Total RAM: {totalGb.toFixed(0)} GB ({numGpusRequired}x 80GB GPUs Required)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Weights (FP16)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{weightsGb.toFixed(0)} GB</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>2 bytes / param</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gradients</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{gradsGb.toFixed(0)} GB</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>2 bytes / param</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>Adam States ★</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{optimizerGb.toFixed(0)} GB</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>16 bytes / param</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Activations</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ec4899' }}>{activationsGb.toFixed(0)} GB</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Batch 2, Len 2048</div>
            </div>
          </div>

          <MathBlock math={`\\text{Total RAM} = 2N + 2N + 16N + \\text{Activations} \\approx 20N \\quad (\\text{70B Model} \\implies \\approx 1.4 \\text{ TB Memory})`} />
        </div>

        <ControlPanel title="Model Capacity" onReset={() => setParamsB(70)}>
          <Slider
            label="Model Parameters (Billions)"
            value={paramsB}
            min={7}
            max={140}
            step={7}
            onChange={setParamsB}
            formatValue={(v) => `${v}B Params`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 89. Distributed Data Parallelism (DDP & Ring-AllReduce)
export const DdpRingAllReduceViz: React.FC = () => {
  const [step, setStep] = useState(0);

  const ringSteps = [
    { title: 'Step 0: Independent Local Gradients', desc: 'Each GPU computes local mini-batch gradients g_i on its private model replica.' },
    { title: 'Step 1: Ring Scatter-Reduce (Transfer 1)', desc: 'GPU i sends chunk k to GPU (i+1)%4 and accumulates incoming chunk from GPU (i-1)%4.' },
    { title: 'Step 2: Ring Scatter-Reduce (Transfer 2)', desc: 'Second scatter-reduce shift completes full reduction for all 4 tensor chunks.' },
    { title: 'Step 3: Ring AllGather (Broadcast 1)', desc: 'Each GPU shares its fully reduced chunk around the ring to all peers.' },
    { title: 'Step 4: Synchronization Complete', desc: 'Every GPU holds identical synchronized average gradients ḡ with optimal 2*(N-1)/N communication.' },
  ];

  const current = ringSteps[step];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Ring-AllReduce Gradient Synchronization (4 GPUs)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {current.title}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {[0, 1, 2, 3].map((gpuId) => (
              <div
                key={gpuId}
                style={{
                  padding: '12px 8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-color)' }}>GPU #{gpuId}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {step === 0
                    ? `Local g_${gpuId}`
                    : step < 3
                    ? `Reducing chunk ${(gpuId + step) % 4}`
                    : 'Synchronized ḡ'}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {current.desc}
          </div>

          <ButtonGroup
            actions={[
              { label: 'Previous', onClick: () => setStep((s) => Math.max(0, s - 1)), disabled: step <= 0 },
              { label: 'Next Step', onClick: () => setStep((s) => Math.min(ringSteps.length - 1, s + 1)), disabled: step >= ringSteps.length - 1 },
              { label: 'Reset', onClick: () => setStep(0) },
            ]}
          />

          <MathBlock math={`\\text{Total Communication Volume} = 2 \\times \\left(\\frac{W - 1}{W}\\right) \\times M \\quad (\\text{Independent of GPU count } W)`} />
        </div>

        <ControlPanel title="Ring AllReduce Step" onReset={() => setStep(0)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Ring-AllReduce splits tensors into W chunks and sends them in a logical ring, achieving bandwidth-optimal communication.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 90. ZeRO Stages & FSDP
export const ZeRoFsdpViz: React.FC = () => {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(3);
  const [numGpus, setNumGpus] = useState(8);
  const paramsB = 70;

  const { perGpuGb, reductionFactor } = computeZeroShardedMemory(paramsB, numGpus, stage);

  const stageTitles = {
    0: 'DDP Baseline (No Sharding)',
    1: 'ZeRO-1 (Optimizer State Sharding)',
    2: 'ZeRO-2 (Optimizer + Gradient Sharding)',
    3: 'ZeRO-3 / FSDP (Full Parameter + Gradient + Optimizer Sharding)',
  };

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{stageTitles[stage]}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {reductionFactor.toFixed(1)}x Memory Reduction on {numGpus} GPUs
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Memory per GPU</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: perGpuGb <= 80 ? 'var(--success-color)' : 'var(--error-color)', margin: '4px 0' }}>
                {perGpuGb.toFixed(1)} GB
              </div>
              <div style={{ fontSize: '0.75rem', color: perGpuGb <= 80 ? 'var(--success-color)' : 'var(--error-color)' }}>
                {perGpuGb <= 80 ? 'Fits on 80GB GPU ✓' : 'Out of Memory on 80GB GPU ✗'}
              </div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Communication Overhead</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: stage === 3 ? '#f59e0b' : 'var(--accent-color)', margin: '4px 0' }}>
                {stage === 3 ? '1.5x DDP' : '1.0x DDP'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {stage === 3 ? 'AllGather weights per layer' : 'Standard AllReduce'}
              </div>
            </div>
          </div>

          <MathBlock math={stage === 3 ? '\\text{Memory}_{\\text{ZeRO-3}} = \\frac{2N + 2N + 16N}{W} = \\frac{20N}{W} = \\frac{1400\\text{ GB}}{8} \\approx 175\\text{ GB}' : '\\text{Memory}_{\\text{ZeRO-1}} = 2N + 2N + \\frac{16N}{W}'} />
        </div>

        <ControlPanel title="ZeRO Configuration" onReset={() => { setStage(3); setNumGpus(8); }}>
          <RadioGroup
            label="ZeRO Stage"
            value={stage.toString()}
            options={[
              { value: '0', label: 'DDP (0x Sharding)' },
              { value: '1', label: 'ZeRO-1 (Optimizer)' },
              { value: '2', label: 'ZeRO-2 (Opt + Grads)' },
              { value: '3', label: 'ZeRO-3 / FSDP (Full)' },
            ]}
            onChange={(v) => setStage(parseInt(v, 10) as 0 | 1 | 2 | 3)}
          />
          <Slider
            label="Cluster GPU Count (W)"
            value={numGpus}
            min={2}
            max={64}
            step={2}
            onChange={setNumGpus}
            formatValue={(v) => `${v} GPUs`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
