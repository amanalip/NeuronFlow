import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeBradleyTerryProb } from './category10Math';
import styles from '../category01/Category01.module.css';

// 113. Alignment Intro (The 3 H's)
export const AlignmentIntroViz: React.FC = () => {
  const [activeH, setActiveH] = useState<'helpful' | 'honest' | 'harmless'>('helpful');

  const principles = {
    helpful: { title: 'Helpful', desc: 'Accurately and efficiently fulfills the user request with appropriate detail and clear reasoning.', badge: '#10b981' },
    honest: { title: 'Honest', desc: 'Acknowledges uncertainty, declines hallucination, and truthfully states model capabilities and limits.', badge: '#38bdf8' },
    harmless: { title: 'Harmless', desc: 'Refuses instructions to generate malware, biological weapons, severe abuse, or dangerous acts.', badge: '#ec4899' },
  };

  const current = principles[activeH];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>The 3 H's Alignment Framework (Anthropic / OpenAI)</span>
            <span style={{ fontSize: '0.8rem', color: current.badge, fontWeight: 700 }}>
              {current.title}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {(Object.entries(principles) as [typeof activeH, typeof current][]).map(([key, val]) => (
              <div
                key={key}
                onClick={() => setActiveH(key)}
                style={{
                  padding: '16px 12px',
                  borderRadius: '6px',
                  backgroundColor: activeH === key ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: activeH === key ? `2px solid ${val.badge}` : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: val.badge }}>{val.title}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '6px' }}>{val.desc}</div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{Objective} = \\max_\\theta \\mathbb{E}[R(\\text{Helpful}, \\text{Honest}, \\text{Harmless}) - \\beta D_{\\text{KL}}]`} />
        </div>

        <ControlPanel title="Core Pillar" onReset={() => setActiveH('helpful')}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Alignment constrains pre-trained generative distributions so models prioritize human welfare and factual accuracy.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 114. 3-Stage RLHF Overview
export const RlhfOverviewViz: React.FC = () => {
  const [activeStage, setActiveStage] = useState(1);

  const stages = [
    { num: 1, title: 'Stage 1: Supervised Fine-Tuning (SFT)', desc: 'High-quality human demonstrations convert document completion into instruction following.' },
    { num: 2, title: 'Stage 2: Reward Model (RM) Training', desc: 'Human labelers rank response pairs (y_w ≻ y_l) to train a scalar Bradley-Terry reward scoring model.' },
    { num: 3, title: 'Stage 3: PPO Reinforcement Learning', desc: 'Policy model generates completions scored by the RM while maintaining low KL divergence to SFT base.' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>InstructGPT 3-Stage RLHF Pipeline (Ouyang et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Stage {activeStage} of 3
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stages.map((st) => (
              <div
                key={st.num}
                onClick={() => setActiveStage(st.num)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  backgroundColor: activeStage === st.num ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: activeStage === st.num ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: activeStage === st.num ? 'var(--accent-color)' : 'var(--text-primary)' }}>{st.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{st.desc}</div>
              </div>
            ))}
          </div>

          <MathBlock math={activeStage === 2 ? '\\mathcal{L}_{\\text{RM}} = -\\mathbb{E}_{(x, y_w, y_l)} [\\log \\sigma(r(x, y_w) - r(x, y_l))]' : activeStage === 3 ? 'R(x, y) = r_\\psi(x, y) - \\beta D_{\\text{KL}}(\\pi_\\theta \\parallel \\pi_{\\text{SFT}})' : '\\mathcal{L}_{\\text{SFT}} = -\\sum_t \\log P(y_t \\mid x, y_{<t})'} />
        </div>

        <ControlPanel title="RLHF Stage" onReset={() => setActiveStage(1)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            RLHF iteratively aligns generation with complex, hard-to-specify human preferences.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 115. Reward Modeling (Bradley-Terry) & Reward Hacking
export const RewardModelingViz: React.FC = () => {
  const [rWinner, setRWinner] = useState(2.4);
  const [rLoser, setRLoser] = useState(0.8);

  const probWinner = computeBradleyTerryProb(rWinner, rLoser);
  const loss = -Math.log(Math.max(1e-7, probWinner));

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Bradley-Terry Preference Pair Reward Model</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              P(y_w ≻ y_l) = {(probWinner * 100).toFixed(1)}% (Loss: {loss.toFixed(3)})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--success-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600 }}>Winning Response y_w</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, margin: '4px 0' }}>{rWinner.toFixed(2)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Scalar Reward Score</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--error-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--error-color)', fontWeight: 600 }}>Losing Response y_l</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, margin: '4px 0' }}>{rLoser.toFixed(2)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Scalar Reward Score</div>
            </div>
          </div>

          <MathBlock math={`P(y_w \\succ y_l \\mid x) = \\sigma(r(x, y_w) - r(x, y_l)) = \\frac{1}{1 + e^{-(${rWinner.toFixed(2)} - ${rLoser.toFixed(2)})}} = ${(probWinner * 100).toFixed(1)}\\%`} />
        </div>

        <ControlPanel title="Reward Scores" onReset={() => { setRWinner(2.4); setRLoser(0.8); }}>
          <Slider label="Winner Reward r(x, y_w)" value={rWinner} min={-5} max={5} step={0.1} onChange={setRWinner} formatValue={(v) => v.toFixed(2)} />
          <Slider label="Loser Reward r(x, y_l)" value={rLoser} min={-5} max={5} step={0.1} onChange={setRLoser} formatValue={(v) => v.toFixed(2)} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 116. PPO for LLMs (4-Model System & KL Penalty)
export const PpoForLlmsViz: React.FC = () => {
  const [betaKl, setBetaKl] = useState(0.05);

  const rawReward = 3.5;
  const klDistance = 8.2;
  const netReward = rawReward - betaKl * klDistance;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>PPO 4-Model System & KL Divergence Penalty</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Net Policy Reward: {netReward.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #38bdf8' }}>
              <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>Actor Policy</div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', marginTop: '2px' }}>π_θ (Active)</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Critic Value</div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', marginTop: '2px' }}>V_ϕ (Active)</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--text-muted)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reference</div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', marginTop: '2px' }}>π_ref (Frozen)</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>Reward Model</div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', marginTop: '2px' }}>r_ψ (Frozen)</div>
            </div>
          </div>

          <MathBlock math={`R(x, y) = r_\\psi(x, y) - \\beta D_{\\text{KL}}(\\pi_\\theta(y \\mid x) \\parallel \\pi_{\\text{ref}}(y \\mid x)) = ${rawReward} - ${betaKl.toFixed(2)} \\times ${klDistance} = ${netReward.toFixed(2)}`} />
        </div>

        <ControlPanel title="KL Penalty Coefficient" onReset={() => setBetaKl(0.05)}>
          <Slider label="KL Penalty (β)" value={betaKl} min={0.01} max={0.2} step={0.01} onChange={setBetaKl} formatValue={(v) => `β = ${v.toFixed(2)}`} />
        </ControlPanel>
      </div>
    </div>
  );
};
