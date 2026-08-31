import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeExpectedCalibrationError } from './category16Math';
import styles from '../category01/Category01.module.css';

// 195. Calibration & Uncertainty
export const CalibrationUncertaintyViz: React.FC = () => {
  const sampleBins = [
    { confidence: 0.1, accuracy: 0.12, count: 120 },
    { confidence: 0.3, accuracy: 0.28, count: 250 },
    { confidence: 0.5, accuracy: 0.48, count: 400 },
    { confidence: 0.7, accuracy: 0.69, count: 580 },
    { confidence: 0.9, accuracy: 0.88, count: 850 },
  ];

  const ece = computeExpectedCalibrationError(sampleBins);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Model Calibration & Expected Calibration Error (ECE)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              ECE: {(ece * 100).toFixed(2)}% (Well-Calibrated)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', margin: '14px 0' }}>
            {sampleBins.map((b, idx) => (
              <div key={idx} style={{ padding: '8px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Conf: {(b.confidence * 100).toFixed(0)}%</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', margin: '2px 0' }}>{(b.accuracy * 100).toFixed(0)}%</div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-secondary)' }}>Accuracy</div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{ECE} = \\sum_{m=1}^M \\frac{|B_m|}{N} \\left|\\operatorname{acc}(B_m) - \\operatorname{conf}(B_m)\\right| = ${(ece * 100).toFixed(2)}\\%`} />
        </div>

        <ControlPanel title="Calibration Insight" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            A well-calibrated model outputs confidence probabilities that match true empirical accuracy, essential for clinical and legal safety.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 196. Needle in a Haystack Test (2D Grid)
export const NeedleInAHaystackTestViz: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<{ len: string; depth: string; score: number } | null>(null);

  const lengths = ['8k', '16k', '32k', '64k', '128k'];
  const depths = ['0%', '25%', '50%', '75%', '100%'];

  const gridData: Record<string, Record<string, number>> = {
    '8k': { '0%': 1.0, '25%': 1.0, '50%': 1.0, '75%': 1.0, '100%': 1.0 },
    '16k': { '0%': 1.0, '25%': 0.98, '50%': 0.96, '75%': 0.99, '100%': 1.0 },
    '32k': { '0%': 1.0, '25%': 0.95, '50%': 0.90, '75%': 0.96, '100%': 1.0 },
    '64k': { '0%': 0.98, '25%': 0.88, '50%': 0.76, '75%': 0.89, '100%': 0.99 },
    '128k': { '0%': 0.95, '25%': 0.78, '50%': 0.62, '75%': 0.80, '100%': 0.96 },
  };

  const getColor = (score: number) => {
    if (score >= 0.95) return '#10b981';
    if (score >= 0.85) return '#38bdf8';
    if (score >= 0.75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Needle In A Haystack 2D Context Recall Matrix</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {selectedCell ? `${selectedCell.len} Context @ ${selectedCell.depth} Depth: ${(selectedCell.score * 100).toFixed(0)}% Recall` : 'Click a matrix cell'}
            </span>
          </div>

          <div style={{ margin: '14px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(5, 1fr)', gap: '4px', fontSize: '0.72rem', textAlign: 'center' }}>
              <span />
              {lengths.map((l) => (
                <span key={l} style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{l}</span>
              ))}

              {depths.map((d) => (
                <React.Fragment key={d}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)', lineHeight: '28px' }}>{d}</span>
                  {lengths.map((l) => {
                    const score = gridData[l][d];
                    return (
                      <div
                        key={`${l}-${d}`}
                        onClick={() => setSelectedCell({ len: l, depth: d, score })}
                        style={{
                          height: '28px',
                          borderRadius: '4px',
                          backgroundColor: getColor(score),
                          color: '#000',
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          opacity: 0.9,
                        }}
                      >
                        {(score * 100).toFixed(0)}%
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <MathBlock math={`\\text{Recall Matrix: } R(L, \\, D) = \\mathbb{I}\\left(\\operatorname{LLM}(L, D) = \\text{"Target Fact"}\\right)`} />
        </div>

        <ControlPanel title="Recall Map" onReset={() => setSelectedCell(null)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Green squares represent 100% accurate recall. Long context windows exhibit noticeable dips in the middle (50% depth at 128k).
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 197. Multi-Turn Evaluation (MT-Bench)
export const MultiTurnEvaluationViz: React.FC = () => {
  const turns = [
    { turn: 1, topic: 'Initial Question', score: 9.4, desc: 'Clear instruction following on prompt setup.' },
    { turn: 2, topic: 'Follow-Up Clarification', score: 9.1, desc: 'Resolves coreferences and retains persona.' },
    { turn: 3, topic: 'Negative Constraint Added', score: 8.8, desc: 'Maintains formatting rules accurately.' },
    { turn: 4, topic: 'Contradiction Resolution', score: 8.2, desc: 'Minor degradation in original system context.' },
    { turn: 5, topic: 'Multi-Step Math Follow-Up', score: 7.9, desc: 'Accumulated context noise begins impacting precision.' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Multi-Turn Dialogue Degradation Curve (MT-Bench)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Overall Score: 8.68 / 10
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '14px 0' }}>
            {turns.map((t) => (
              <div
                key={t.turn}
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
                    Turn #{t.turn}: {t.topic}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.desc}</div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: t.score > 8.5 ? '#10b981' : '#f59e0b' }}>
                  {t.score.toFixed(1)} / 10
                </span>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{MT-Bench Score} = \\frac{1}{T} \\sum_{t=1}^T \\operatorname{Judge}(\\operatorname{Response}_t, \\, \\operatorname{Context}_{<t}) = 8.68 / 10`} />
        </div>

        <ControlPanel title="Multi-Turn Benchmarking" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Single-turn tests miss conversational drift, coreference errors, and context degradation over extended interactions.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
