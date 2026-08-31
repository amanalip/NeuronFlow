import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeGrpoAdvantages, computeExpectedMaxReward } from './category10Math';
import styles from '../category01/Category01.module.css';

// 121. RLAIF & Constitutional AI (Anthropic)
export const RlaifViz: React.FC = () => {
  const [ruleIndex, setRuleIndex] = useState(0);

  const rules = [
    { title: 'Harm Minimization', critique: 'The response mentions hazardous chemical formulas.', revision: 'Replace specific formulas with general historical safety guidelines.' },
    { title: 'De-escalation & Civility', critique: 'The tone is defensive and confrontational.', revision: 'Adopt a neutral, professional, and empathetic tone.' },
    { title: 'Truthfulness & Factuality', critique: 'The answer states speculative claims as definitive facts.', revision: 'Add calibrated epistemic hedges and cite verified sources.' },
  ];

  const current = rules[ruleIndex];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Constitutional AI: Self-Critique & Revision Flywheel</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Principle: {current.title}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--error-color)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--error-color)', fontWeight: 600 }}>1. AI Critique (Based on Constitution):</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '4px' }}>"{current.critique}"</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--success-color)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--success-color)', fontWeight: 600 }}>2. AI Revised Output (Aligned SFT Data):</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '4px' }}>"{current.revision}"</div>
            </div>
          </div>

          <MathBlock math={`\\text{Model}_{t+1} = \\operatorname{Train}\\left( \\operatorname{Revise}_{\\text{Constitution}}(\\text{Model}_t(\\text{Prompt})) \\right)`} />
        </div>

        <ControlPanel title="Constitutional Principles" onReset={() => setRuleIndex(0)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {rules.map((r, idx) => (
              <button
                key={r.title}
                type="button"
                onClick={() => setRuleIndex(idx)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '4px',
                  backgroundColor: ruleIndex === idx ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
                  border: ruleIndex === idx ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: ruleIndex === idx ? 'var(--accent-color)' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                {r.title}
              </button>
            ))}
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

// 122. GRPO (Group Relative Policy Optimization - DeepSeek-R1)
export const GrpoViz: React.FC = () => {
  const [groupSize, setGroupSize] = useState(4);

  const rawRewards = [1.0, 0.2, 0.8, -0.4, 1.2, 0.0, -0.6, 0.9].slice(0, groupSize);
  const advantages = computeGrpoAdvantages(rawRewards);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>DeepSeek GRPO (No Critic Model / Group Advantage)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Group Size G = {groupSize} Candidates
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(4, groupSize)}, 1fr)`, gap: '8px' }}>
            {rawRewards.map((r, idx) => {
              const adv = advantages[idx];
              const isPositive = adv >= 0;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '10px 8px',
                    background: 'var(--bg-primary)',
                    border: `1px solid ${isPositive ? 'var(--success-color)' : 'var(--error-color)'}`,
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Output y_{idx + 1}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '2px' }}>r = {r.toFixed(1)}</div>
                  <div style={{ fontSize: '0.78rem', color: isPositive ? 'var(--success-color)' : 'var(--error-color)', fontWeight: 700, marginTop: '4px' }}>
                    Adv: {adv > 0 ? `+${adv.toFixed(2)}` : adv.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Memory Savings:</strong> By scoring advantage relative to the mean and standard deviation of candidate group outputs, GRPO eliminates the large Critic/Value model entirely.
          </div>

          <MathBlock math={`A_i = \\frac{r_i - \\operatorname{mean}(\\{r_1, \\dots, r_G\\})}{\\operatorname{std}(\\{r_1, \\dots, r_G\\})} \\quad (\\text{Saves 25-50\\% GPU Memory vs PPO})`} />
        </div>

        <ControlPanel title="Group Sampling" onReset={() => setGroupSize(4)}>
          <Slider label="Group Size (G)" value={groupSize} min={2} max={8} step={2} onChange={setGroupSize} formatValue={(v) => `G = ${v}`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 123. Rejection Sampling & Best-of-N (RAFT)
export const RejectionSamplingViz: React.FC = () => {
  const [numCandidates, setNumCandidates] = useState(8);

  const baseReward = 2.0;
  const expectedMax = computeExpectedMaxReward(baseReward, numCandidates);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Best-of-N Rejection Sampling (RAFT)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              N = {numCandidates} Samples
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Expected Max Reward</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>
                {expectedMax.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success-color)' }}>+{(expectedMax - baseReward).toFixed(2)} boost over mean</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Inference Cost Multiplier</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f59e0b', margin: '4px 0' }}>
                {numCandidates}x FLOPs
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Logarithmic return on compute</div>
            </div>
          </div>

          <MathBlock math={`\\mathbb{E}\\left[ \\max_{i=1}^N r_i \\right] \\approx \\mu + \\sigma \\sqrt{2 \\ln N} \\quad (N = ${numCandidates} \\implies ${(expectedMax).toFixed(2)})`} />
        </div>

        <ControlPanel title="Candidate Count (N)" onReset={() => setNumCandidates(8)}>
          <Slider label="Samples (N)" value={numCandidates} min={1} max={64} step={1} onChange={setNumCandidates} formatValue={(v) => `N = ${v}`} />
        </ControlPanel>
      </div>
    </div>
  );
};
