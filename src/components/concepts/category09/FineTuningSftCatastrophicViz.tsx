import React, { useState } from 'react';
import { Toggle } from '../../controls/Toggle';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { ComparisonTable } from '../../viz/charts/ComparisonTable';
import styles from '../category01/Category01.module.css';

// 100. Fine-Tuning Intro (Full FT vs PEFT)
export const FineTuningIntroViz: React.FC = () => {
  const columns = [
    { key: 'method', header: 'Method' },
    { key: 'trainable', header: 'Trainable Params' },
    { key: 'storage', header: 'Storage per Task' },
    { key: 'risk', header: 'Forgetting Risk' },
  ];

  const rows = [
    {
      method: <strong style={{ color: '#f59e0b' }}>Full Fine-Tuning</strong>,
      trainable: <span style={{ fontFamily: 'var(--font-mono)' }}>100% (All Weights)</span>,
      storage: <span style={{ fontFamily: 'var(--font-mono)' }}>Full Checkpoint (140 GB for 70B)</span>,
      risk: <span style={{ color: 'var(--error-color)', fontWeight: 600 }}>High (Overwrites base knowledge)</span>,
    },
    {
      method: <strong style={{ color: 'var(--accent-color)' }}>PEFT (LoRA / QLoRA) ★</strong>,
      trainable: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-color)' }}>&lt; 0.5% (Low-rank adapters)</span>,
      storage: <span style={{ fontFamily: 'var(--font-mono)', color: '#10b981' }}>Small Adapter (~50 MB)</span>,
      risk: <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>Zero (Base model frozen)</span>,
    },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Full Fine-Tuning vs Parameter-Efficient Adaptation</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Trade-off Matrix
            </span>
          </div>

          <ComparisonTable columns={columns} rows={rows} />

          <MathBlock math={`\\text{Full FT: } W_{\\text{task}} = W_0 + \\Delta W \\quad \\longleftrightarrow \\quad \\text{PEFT: } W_{\\text{task}} = W_0 + B A`} />
        </div>

        <ControlPanel title="Fine-Tuning Strategy" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            PEFT keeps the original pre-trained base model completely frozen, training only a lightweight set of adapter parameters per downstream application.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 101. Supervised Fine-Tuning (SFT & Loss Masking)
export const SftLossMaskingViz: React.FC = () => {
  const [maskPromptLoss, setMaskPromptLoss] = useState(true);

  const turns = [
    { role: 'system', text: 'You are an expert Python assistant.', isTarget: false },
    { role: 'user', text: 'How do I reverse a string in Python?', isTarget: false },
    { role: 'assistant', text: 'Use slice notation: s[::-1]', isTarget: true },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>SFT Target Loss Masking (Label = -100)</span>
            <span style={{ fontSize: '0.8rem', color: maskPromptLoss ? 'var(--success-color)' : 'var(--warning-color)' }}>
              {maskPromptLoss ? 'Loss Mask Active (Assistant Tokens Only)' : 'Unmasked (Penalizes User Prompt Tokens)'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {turns.map((t, idx) => {
              const computesLoss = !maskPromptLoss || t.isTarget;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: computesLoss ? 'var(--accent-muted)' : 'var(--bg-secondary)',
                    border: computesLoss ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t.role}</strong>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: computesLoss ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                      {computesLoss ? 'Loss Computed ✓' : 'Masked: label = -100 (Zero Grad)'}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>{t.text}</div>
                </div>
              );
            })}
          </div>

          <MathBlock math={`\\mathcal{L}_{\\text{SFT}} = -\\sum_{t \\in \\text{Assistant}} \\log P(x_t \\mid x_{<t}) \\quad (\\text{User tokens ignored in backprop})`} />
        </div>

        <ControlPanel title="Loss Masking" onReset={() => setMaskPromptLoss(true)}>
          <Toggle
            label="Enable Prompt Loss Masking"
            checked={maskPromptLoss}
            onChange={setMaskPromptLoss}
            description="Prevents wasting gradient updates on predicting the user prompt tokens."
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 102. Catastrophic Forgetting
export const CatastrophicForgettingViz: React.FC = () => {
  const [replayBufferOn, setReplayBufferOn] = useState(true);

  const domainScore = 92; // High coding score
  const generalKnowledgeScore = replayBufferOn ? 86 : 38; // Preserved with replay buffer vs dropped without

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Catastrophic Forgetting & General Knowledge Retention</span>
            <span style={{ fontSize: '0.8rem', color: replayBufferOn ? 'var(--success-color)' : 'var(--error-color)' }}>
              {replayBufferOn ? 'Mitigated with Replay Buffer (86% General Benchmark)' : 'Severe Knowledge Collapse (38% General Benchmark)'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target Domain (Python Coding)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>{domainScore}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Specialized task performance</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: `1px solid ${replayBufferOn ? 'var(--success-color)' : 'var(--error-color)'}` }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>General Knowledge (MMLU / Reasoning)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: replayBufferOn ? 'var(--success-color)' : 'var(--error-color)', margin: '4px 0' }}>
                {generalKnowledgeScore}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{replayBufferOn ? 'Preserved via 10% general replay' : 'Overwritten during narrow tuning'}</div>
            </div>
          </div>

          <MathBlock math={`\\mathcal{L} = \\alpha \\mathcal{L}_{\\text{Domain}} + (1 - \\alpha) \\mathcal{L}_{\\text{Replay}}`} />
        </div>

        <ControlPanel title="Forgetting Defense" onReset={() => setReplayBufferOn(true)}>
          <Toggle
            label="Enable General Replay Mix"
            checked={replayBufferOn}
            onChange={setReplayBufferOn}
            description="Blends 10-15% of general pre-training data during fine-tuning to anchor core knowledge."
          />
        </ControlPanel>
      </div>
    </div>
  );
};
