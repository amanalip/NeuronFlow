import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

export const TeacherForcingViz: React.FC = () => {
  const [mode, setMode] = useState<'teacher_forcing' | 'free_running' | 'scheduled_sampling'>('teacher_forcing');
  const [samplingRatio, setSamplingRatio] = useState(0.5);

  const targetSequence = ['The', 'quick', 'brown', 'fox'];
  const modelMistakeSequence = ['The', 'slow', 'white', 'rabbit'];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Autoregressive Decoder Input Strategy</span>
            <span style={{ fontSize: '0.8rem', color: mode === 'teacher_forcing' ? 'var(--accent-color)' : 'var(--warning-color)' }}>
              {mode === 'teacher_forcing'
                ? 'Teacher Forcing (Ground Truth Fed)'
                : mode === 'free_running'
                ? 'Free Running (Model Predictions Fed)'
                : `Scheduled Sampling (p = ${samplingRatio.toFixed(2)})`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Target Ground Truth Sequence (y*):</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {targetSequence.map((tok, idx) => (
                  <span key={idx} style={{ padding: '4px 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                    "{tok}"
                  </span>
                ))}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Tokens Fed as Decoder Inputs (y_(t-1)):</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {targetSequence.map((_, idx) => {
                  const isGroundTruth =
                    mode === 'teacher_forcing' ||
                    (mode === 'scheduled_sampling' && idx % 2 === 0);
                  const fedWord = isGroundTruth ? targetSequence[idx] : modelMistakeSequence[idx];

                  return (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 8px',
                        background: isGroundTruth ? 'var(--accent-muted)' : 'rgba(239, 68, 68, 0.15)',
                        border: isGroundTruth ? '1px solid var(--accent-color)' : '1px solid var(--error-color)',
                        color: isGroundTruth ? 'var(--accent-color)' : 'var(--error-color)',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                      }}
                    >
                      "{fedWord}" {isGroundTruth ? '✓ (GT)' : '✗ (Pred)'}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Exposure Bias:</strong> Standard Teacher Forcing trains models strictly on ground-truth prefixes. At test time, the model sees its own errors for the first time, leading to compounding generation divergence.
          </p>

          <MathBlock math={`y_t \\sim P(y_t \\mid s_t, y_{t-1}^{\\text{input}}), \\quad y_{t-1}^{\\text{input}} = \\begin{cases} y_{t-1}^* & \\text{with prob } \\epsilon \\\\ \\hat{y}_{t-1} & \\text{with prob } 1 - \\epsilon \\end{cases}`} />
        </div>

        <ControlPanel title="Feeding Strategy" onReset={() => { setMode('teacher_forcing'); setSamplingRatio(0.5); }}>
          <RadioGroup
            label="Training Paradigm"
            value={mode}
            options={[
              { value: 'teacher_forcing', label: 'Teacher Forcing' },
              { value: 'free_running', label: 'Free Running (Inference)' },
              { value: 'scheduled_sampling', label: 'Scheduled Sampling' },
            ]}
            onChange={(v) => setMode(v as 'teacher_forcing' | 'free_running' | 'scheduled_sampling')}
          />
          {mode === 'scheduled_sampling' && (
            <Slider
              label="Teacher Forcing Probability (ε)"
              value={samplingRatio}
              min={0.0}
              max={1.0}
              step={0.05}
              onChange={setSamplingRatio}
              formatValue={(v) => v.toFixed(2)}
            />
          )}
        </ControlPanel>
      </div>
    </div>
  );
};
