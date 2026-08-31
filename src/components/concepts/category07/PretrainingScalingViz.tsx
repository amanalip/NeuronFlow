import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeKaplanLoss, computeChinchillaOptimal } from './category07Math';
import { LossCurve, LossDataPoint } from '../../viz/charts/LossCurve';
import styles from '../category01/Category01.module.css';

// 78. Pre-training Objectives
export const PretrainingObjectivesViz: React.FC = () => {
  const [objective, setObjective] = useState<'clm' | 'mlm' | 'span'>('clm');

  const sentence = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];

  const getMaskedView = () => {
    switch (objective) {
      case 'clm':
        return sentence.map((w, idx) => (
          <span key={idx} style={{ padding: '4px 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
            {w}
          </span>
        ));
      case 'mlm':
        return sentence.map((w, idx) => {
          const isMasked = idx === 3 || idx === 7;
          return (
            <span
              key={idx}
              style={{
                padding: '4px 8px',
                background: isMasked ? 'var(--accent-muted)' : 'var(--bg-secondary)',
                border: isMasked ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                color: isMasked ? 'var(--accent-color)' : 'var(--text-primary)',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: isMasked ? 700 : 400,
              }}
            >
              {isMasked ? '[MASK]' : w}
            </span>
          );
        });
      case 'span':
        return (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>The</span>
            <span style={{ padding: '4px 8px', background: 'var(--accent-muted)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>&lt;extra_id_0&gt;</span>
            <span style={{ padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>jumps over the</span>
            <span style={{ padding: '4px 8px', background: 'var(--accent-muted)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>&lt;extra_id_1&gt;</span>
          </div>
        );
    }
  };

  const descriptions = {
    clm: 'Causal Language Modeling (GPT): Predicts token x_t conditioned on all preceding tokens x_<t. Universal foundation for generative reasoning.',
    mlm: 'Masked Language Modeling (BERT): Randomly masks 15% of tokens (80% [MASK], 10% random, 10% unchanged) and reconstructs them bidirectionally.',
    span: 'Span Corruption (T5): Replaces contiguous spans of tokens with unique sentinel tokens (<extra_id_k>) and trains decoder to generate the missing spans.',
  };

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Self-Supervised Pre-training Objective</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {objective.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {getMaskedView()}
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {descriptions[objective]}
          </div>

          <MathBlock math={objective === 'clm' ? '\\mathcal{L}_{\\text{CLM}} = -\\sum_{t=1}^T \\log P(x_t \\mid x_{<t}; \\theta)' : objective === 'mlm' ? '\\mathcal{L}_{\\text{MLM}} = -\\sum_{i \\in M} \\log P(x_i \\mid \\tilde{X}; \\theta)' : '\\mathcal{L}_{\\text{Span}} = -\\sum_{k} \\log P(\\text{Span}_k \\mid X_{\\text{masked}}; \\theta)'} />
        </div>

        <ControlPanel title="Objective Strategy" onReset={() => setObjective('clm')}>
          <RadioGroup
            label="Training Task"
            value={objective}
            options={[
              { value: 'clm', label: 'Causal LM (GPT)' },
              { value: 'mlm', label: 'Masked LM (BERT)' },
              { value: 'span', label: 'Span Corruption (T5)' },
            ]}
            onChange={(v) => setObjective(v as 'clm' | 'mlm' | 'span')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 79. Scaling Laws (Kaplan et al., 2020)
export const KaplanScalingLawsViz: React.FC = () => {
  const [paramsM, setParamsM] = useState(1000);
  const [tokensB, setTokensB] = useState(100);

  const predictedLoss = computeKaplanLoss(paramsM, tokensB);

  const paramPoints = [100, 300, 1000, 3000, 10000, 30000];
  const curveData: LossDataPoint[] = paramPoints.map((p) => ({
    step: p,
    trainLoss: computeKaplanLoss(p, tokensB),
  }));

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Kaplan Power Law Scaling Frontier</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Cross-Entropy Loss: {predictedLoss.toFixed(3)} nats
            </span>
          </div>

          <LossCurve
            data={curveData}
            title="Predicted Loss vs Parameters N (at Fixed Dataset D)"
            xLabel="Parameters N (Millions)"
            yLabel="Loss L(N)"
          />

          <MathBlock math={`L(N, D) = \\left(\\frac{N_c}{N}\\right)^{\\alpha_N} + \\left(\\frac{D_c}{D}\\right)^{\\alpha_D} \\quad (\\alpha_N \\approx 0.076, \\alpha_D \\approx 0.057)`} />
        </div>

        <ControlPanel title="Kaplan Budget" onReset={() => { setParamsM(1000); setTokensB(100); }}>
          <Slider label="Model Parameters (Millions)" value={paramsM} min={100} max={10000} step={100} onChange={setParamsM} formatValue={(v) => `${v}M`} />
          <Slider label="Training Tokens (Billions)" value={tokensB} min={10} max={1000} step={10} onChange={setTokensB} formatValue={(v) => `${v}B`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 80. Chinchilla Optimal Scaling (Hoffmann et al., 2022)
export const ChinchillaOptimalViz: React.FC = () => {
  const [computeBudget, setComputeBudget] = useState(100); // 10^21 FLOPs

  const { optimalParamsB, optimalTokensB } = computeChinchillaOptimal(computeBudget);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Chinchilla Compute-Optimal Allocation (D ≈ 20N)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              FLOPs = 6 · N · D
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Optimal Parameters (N*)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>
                {optimalParamsB.toFixed(1)}B
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Model Weights</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Optimal Tokens (D*)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>
                {optimalTokensB.toFixed(1)}B
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Training Tokens (20x N)</div>
            </div>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Historical Correction:</strong> Hoffmann et al. proved that Kaplan significantly underestimated the value of data scaling. Models should scale model size and dataset size in equal proportion.
          </div>

          <MathBlock math={`N^* \\propto C^{a}, \\quad D^* \\propto C^{b} \\quad (a \\approx 0.5, b \\approx 0.5 \\implies D \\approx 20N)`} />
        </div>

        <ControlPanel title="FLOP Budget" onReset={() => setComputeBudget(100)}>
          <Slider
            label="Compute Budget (x 10^21 FLOPs)"
            value={computeBudget}
            min={10}
            max={1000}
            step={10}
            onChange={setComputeBudget}
            formatValue={(v) => `${v} x 10^21`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
