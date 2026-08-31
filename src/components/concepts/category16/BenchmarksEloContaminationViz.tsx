import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeBradleyTerryElo } from './category16Math';
import styles from '../category01/Category01.module.css';

// 192. Benchmark Leaderboards
export const BenchmarkLeaderboardsViz: React.FC = () => {
  const benchmarks = [
    { name: 'MMLU (Academic Knowledge)', gpt4: '88.7%', claude35: '88.3%', llama70b: '82.0%' },
    { name: 'GSM8K (Grade School Math)', gpt4: '95.8%', claude35: '96.4%', llama70b: '93.0%' },
    { name: 'HumanEval (Python Code Pass@1)', gpt4: '90.2%', claude35: '92.0%', llama70b: '80.5%' },
    { name: 'MATH (Hard Competition Math)', gpt4: '76.6%', claude35: '78.3%', llama70b: '68.0%' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Standardized Frontier Benchmark Leaderboards</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              MMLU, GSM8K, HumanEval, & MATH
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            {benchmarks.map((b, idx) => (
              <div key={idx} style={{ padding: '10px 12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '6px' }}>{b.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.75rem' }}>
                  <div style={{ color: '#38bdf8' }}><strong>GPT-4o:</strong> {b.gpt4}</div>
                  <div style={{ color: '#10b981' }}><strong>Claude 3.5:</strong> {b.claude35}</div>
                  <div style={{ color: '#f59e0b' }}><strong>LLaMA 3.3:</strong> {b.llama70b}</div>
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{Pass@}k = 1 - \\frac{\\binom{n - c}{k}}{\\binom{n}{k}} \\quad (\\text{Unbiased Sampling Estimator})`} />
        </div>

        <ControlPanel title="Benchmark Suites" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Standardized academic test suites benchmark knowledge breadth, multi-step math logic, and automated code synthesis.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 193. Evaluation Contamination
export const EvaluationContaminationViz: React.FC = () => {
  const [contaminated, setContaminated] = useState<boolean>(false);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Benchmark Contamination & Test Set Leakage Audit</span>
            <span style={{ fontSize: '0.8rem', color: contaminated ? '#ef4444' : 'var(--success-color)' }}>
              Status: {contaminated ? 'Contaminated (Memorized Test Set)' : 'Clean & Decontaminated (True Generalization)'}
            </span>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '14px 0' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {contaminated ? (
                <div>
                  <strong style={{ color: '#ef4444' }}>Contaminated Test Benchmark:</strong>
                  <p style={{ margin: '4px 0' }}>The model saw GSM8K test questions verbatim during web crawl pre-training. Benchmark score: <strong>98.5%</strong> (Artificially inflated via rote memorization).</p>
                </div>
              ) : (
                <div>
                  <strong style={{ color: 'var(--success-color)' }}>Decontaminated Benchmark Audit:</strong>
                  <p style={{ margin: '4px 0' }}>All 8-gram and 13-gram test matches stripped from pre-training corpus. Benchmark score: <strong>84.2%</strong> (Reflects genuine novel mathematical reasoning).</p>
                </div>
              )}
            </div>
          </div>

          <MathBlock math={`\\text{Leakage Filter: } \\operatorname{Overlap}(D_{\\text{Train}}, \\, D_{\\text{Test}}) = \\{s \\in D_{\\text{Test}} \\mid \\text{13-gram}(s) \\subset D_{\\text{Train}}\\} = \\emptyset`} />
        </div>

        <ControlPanel title="Contamination Audit" onReset={() => setContaminated(false)}>
          <button
            type="button"
            onClick={() => setContaminated((prev) => !prev)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: contaminated ? 'rgba(239, 68, 68, 0.15)' : 'var(--accent-muted)',
              border: contaminated ? '2px solid #ef4444' : '2px solid var(--accent-color)',
              color: contaminated ? '#ef4444' : 'var(--accent-color)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {contaminated ? 'Strip Contaminated Test Sets (Decontaminate)' : 'Inject Leaked Test Set into Pre-training'}
          </button>
        </ControlPanel>
      </div>
    </div>
  );
};

// 194. ELO Ratings (Chatbot Arena)
export const EloRatingsViz: React.FC = () => {
  const [ratingA, setRatingA] = useState<number>(1280);
  const [ratingB, setRatingB] = useState<number>(1250);

  const { expectedA, expectedB, newRatingA, newRatingB, delta } = computeBradleyTerryElo(ratingA, ratingB, 1);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Chatbot Arena ELO Rating Simulator (Bradley-Terry Model)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Battle: Model A Wins (+{delta} ELO)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Model A (Winner)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{ratingA} &rarr; {newRatingA}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Win Probability: {(expectedA * 100).toFixed(1)}%</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #ef4444' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Model B (Loser)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ef4444', margin: '4px 0' }}>{ratingB} &rarr; {newRatingB}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Win Probability: {(expectedB * 100).toFixed(1)}%</div>
            </div>
          </div>

          <MathBlock math={`P(A > B) = \\frac{1}{1 + 10^{(R_B - R_A)/400}} = ${(expectedA * 100).toFixed(1)}\\%, \\quad R_A' = R_A + K(S_A - P(A > B))`} />
        </div>

        <ControlPanel title="Head-to-Head Ratings" onReset={() => { setRatingA(1280); setRatingB(1250); }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Crowdsourced blind head-to-head battles update ELO ratings based on statistical surprise of the outcome.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
