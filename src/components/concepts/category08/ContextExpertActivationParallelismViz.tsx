import React, { useState } from 'react';
import { Toggle } from '../../controls/Toggle';
import { ControlPanel } from '../../controls/ControlPanel';
import { ButtonGroup } from '../../controls/ButtonGroup';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 94. Context Parallelism & Ring Attention
export const ContextParallelismViz: React.FC = () => {
  const [shiftStep, setShiftStep] = useState(0);
  const numGpus = 4;
  const totalSeqK = 512; // 512k context
  const localSeqK = totalSeqK / numGpus;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Ring Attention Context Parallelism ({totalSeqK}k Tokens)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Shift Step {shiftStep + 1} of {numGpus}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {Array.from({ length: numGpus }).map((_, gpuId) => {
              const currentKvBlock = (gpuId + shiftStep) % numGpus;
              return (
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
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '4px' }}>Query Block: Q_{gpuId}</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>Current KV: KV_{currentKvBlock}</div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Each GPU holds fixed Query chunk Q_i ({localSeqK}k tokens) while Key and Value blocks circulate asynchronously in a ring, overlapping communication with local attention computation.
          </div>

          <ButtonGroup
            actions={[
              { label: 'Rotate Ring KV', onClick: () => setShiftStep((s) => (s + 1) % numGpus) },
              { label: 'Reset Ring', onClick: () => setShiftStep(0) },
            ]}
          />

          <MathBlock math={`\\text{Memory per GPU} = \\mathcal{O}\\left(\\frac{N}{P}\\right) \\quad (\\text{Enables Million-Token Context Scaling})`} />
        </div>

        <ControlPanel title="Ring Attention" onReset={() => setShiftStep(0)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Ring Attention eliminates the quadratic memory wall for long contexts by partitioning sequences across P devices.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 95. Expert Parallelism (MoE All-to-All)
export const ExpertParallelismViz: React.FC = () => {
  const [phase, setPhase] = useState<'dispatch' | 'compute' | 'combine'>('dispatch');

  const phaseData = {
    dispatch: '1. All-to-All Dispatch: Tokens sent across GPUs to the device hosting their top-k selected expert.',
    compute: '2. Local Expert Execution: Each GPU runs forward pass through its locally resident expert FFNs.',
    combine: '3. All-to-All Combine: Expert outputs routed back to original token source GPU and weighted by gating coefficients.',
  };

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>MoE Expert Parallelism All-to-All Shuffling</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Phase: {phase.toUpperCase()}
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{phaseData[phase]}</p>
          </div>

          <MathBlock math={`\\text{Comm Volume} = 2 \\times \\text{Tokens} \\times \\text{TopK} \\times d_{\\text{model}} \\quad (\\text{All-to-All Dispatch + Combine})`} />
        </div>

        <ControlPanel title="Routing Step" onReset={() => setPhase('dispatch')}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['dispatch', 'compute', 'combine'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPhase(p)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: phase === p ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                  color: phase === p ? '#ffffff' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                  textTransform: 'capitalize',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

// 96. Activation Checkpointing
export const ActivationCheckpointingViz: React.FC = () => {
  const [checkpointingOn, setCheckpointingOn] = useState(true);

  const rawActivationGb = 64;
  const checkpointActivationGb = 12;
  const activeGb = checkpointingOn ? checkpointActivationGb : rawActivationGb;
  const flopOverhead = checkpointingOn ? '+33% FLOPs (Recomputed on Backward)' : '0% Extra FLOPs';

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Gradient Activation Checkpointing (Chen et al.)</span>
            <span style={{ fontSize: '0.8rem', color: checkpointingOn ? 'var(--success-color)' : 'var(--warning-color)' }}>
              {checkpointingOn ? 'Checkpointing Active (5.3x Memory Savings)' : 'Full Stored Activations'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Activation Memory</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: checkpointingOn ? 'var(--success-color)' : '#f59e0b', margin: '4px 0' }}>
                {activeGb} GB
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{checkpointingOn ? 'Stores boundary tensors only' : 'Stores all intermediate layers'}</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Compute Overhead</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>
                {flopOverhead}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Trade compute for VRAM capacity</div>
            </div>
          </div>

          <MathBlock math={`\\text{Memory: } \\mathcal{O}(L) \\longrightarrow \\mathcal{O}(\\sqrt{L}) \\quad \\text{or} \\quad \\mathcal{O}(1) \\text{ per layer}`} />
        </div>

        <ControlPanel title="Checkpointing Setting" onReset={() => setCheckpointingOn(true)}>
          <Toggle label="Enable Activation Checkpointing" checked={checkpointingOn} onChange={setCheckpointingOn} />
        </ControlPanel>
      </div>
    </div>
  );
};
