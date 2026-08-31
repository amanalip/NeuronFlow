import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeDpoRewardDifference } from './category10Math';
import styles from '../category01/Category01.module.css';

// 117. DPO (Direct Preference Optimization)
export const DpoViz: React.FC = () => {
  const [beta, setBeta] = useState(0.1);

  const { implicitRewardDiff, dpoLoss } = computeDpoRewardDifference(
    -1.2, // logpWinner
    -2.8, // logpWinnerRef
    -3.4, // logpLoser
    -2.5, // logpLoserRef
    beta
  );

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Direct Preference Optimization (Rafailov et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Temperature β = {beta.toFixed(2)} (DPO Loss: {dpoLoss.toFixed(3)})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Implicit Margin Δr(x, y_w, y_l)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>
                {implicitRewardDiff.toFixed(3)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success-color)' }}>Winner Preferred ✓</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DPO Advantage</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>
                No Reward Model / No RL Loop
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Closed-form exact SFT-like loss</div>
            </div>
          </div>

          <MathBlock math={`\\mathcal{L}_{\\text{DPO}} = -\\mathbb{E}\\left[\\log \\sigma\\left( \\beta \\log \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)} \\right)\\right]`} />
        </div>

        <ControlPanel title="DPO Hyperparameters" onReset={() => setBeta(0.1)}>
          <Slider label="Temperature (β)" value={beta} min={0.01} max={0.5} step={0.01} onChange={setBeta} formatValue={(v) => `β = ${v.toFixed(2)}`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 118. KTO (Kahneman-Tversky Optimization)
export const KtoViz: React.FC = () => {
  const [lossAversionRatio, setLossAversionRatio] = useState(2.0); // Losses hurt ~2x more than gains help

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Kahneman-Tversky Optimization (Ethayarajh et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Loss Aversion λ_D / λ_U = {lossAversionRatio.toFixed(1)}x
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--success-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--success-color)', fontSize: '0.82rem' }}>Binary Positive Feedback (y = +1)</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Utility value function scales with standard gain curve relative to reference point.
              </p>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--error-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--error-color)', fontSize: '0.82rem' }}>Binary Negative Feedback (y = -1)</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Penalized {lossAversionRatio.toFixed(1)}x more steeply, matching human psychological aversion.
              </p>
            </div>
          </div>

          <MathBlock math={`v(z) = \\begin{cases} 1 - \\sigma(z - z_0) & y = +1 \\\\ \\lambda_D \\sigma(z - z_0) & y = -1 \\end{cases} \\quad (\\text{Binary feedback without pairs})`} />
        </div>

        <ControlPanel title="Prospect Theory" onReset={() => setLossAversionRatio(2.0)}>
          <Slider label="Loss Aversion Weight (λ_D)" value={lossAversionRatio} min={1.0} max={4.0} step={0.1} onChange={setLossAversionRatio} formatValue={(v) => `${v.toFixed(1)}x penalty`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 119. ORPO (Odds Ratio Preference Optimization)
export const OrpoViz: React.FC = () => {
  const [lambdaOr, setLambdaOr] = useState(0.1);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>ORPO: Monolithic Alignment without SFT Stage (Hong et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Odds Ratio Weight λ = {lambdaOr.toFixed(2)}
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              ORPO unifies cross-entropy instruction fine-tuning with odds ratio preference penalties into a <strong>single training phase</strong>, bypassing the separate SFT and reference model steps.
            </p>
          </div>

          <MathBlock math={`\\mathcal{L}_{\\text{ORPO}} = \\mathcal{L}_{\\text{SFT}} + \\lambda \\mathcal{L}_{\\text{OR}} = -\\log P(y_w \\mid x) - \\lambda \\log \\sigma\\left(\\log \\frac{\\text{odds}_\\theta(y_w \\mid x)}{\\text{odds}_\\theta(y_l \\mid x)}\\right)`} />
        </div>

        <ControlPanel title="ORPO Hyperparameters" onReset={() => setLambdaOr(0.1)}>
          <Slider label="Odds Ratio Multiplier (λ)" value={lambdaOr} min={0.01} max={0.5} step={0.01} onChange={setLambdaOr} formatValue={(v) => `λ = ${v.toFixed(2)}`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 120. SimPO (Simple Preference Optimization)
export const SimPoViz: React.FC = () => {
  const [gammaMargin, setGammaMargin] = useState(0.5);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>SimPO: Reference-Free Alignment with Length Normalization</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Target Reward Margin γ = {gammaMargin.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #38bdf8' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.82rem' }}>Length Normalization (1/|y|)</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Prevents reward hacking where models generate overly verbose text to inflate log-probs.
              </div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #10b981' }}>
              <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.82rem' }}>Target Margin (γ)</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Enforces explicit separation boundary between winning and losing generations.
              </div>
            </div>
          </div>

          <MathBlock math={`\\mathcal{L}_{\\text{SimPO}} = -\\log \\sigma \\left( \\frac{\\beta}{|y_w|} \\log \\pi_\\theta(y_w \\mid x) - \\frac{\\beta}{|y_l|} \\log \\pi_\\theta(y_l \\mid x) - \\gamma \\right)`} />
        </div>

        <ControlPanel title="SimPO Parameters" onReset={() => setGammaMargin(0.5)}>
          <Slider label="Reward Margin (γ)" value={gammaMargin} min={0.1} max={1.5} step={0.05} onChange={setGammaMargin} formatValue={(v) => `γ = ${v.toFixed(2)}`} />
        </ControlPanel>
      </div>
    </div>
  );
};
