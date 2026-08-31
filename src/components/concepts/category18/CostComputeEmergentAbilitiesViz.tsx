import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeTrainingFlops, computeEmergenceMetric } from './category18Math';
import styles from '../category01/Category01.module.css';

// 213. Cost Per Token History
export const CostPerTokenHistoryViz: React.FC = () => {
  const priceHistory = [
    { year: 2020, model: 'GPT-3 (Davinci)', pricePerM: '$60.00', drop: 'Baseline' },
    { year: 2022, model: 'text-davinci-003', pricePerM: '$20.00', drop: '3x cheaper' },
    { year: 2023, model: 'gpt-3.5-turbo', pricePerM: '$2.00', drop: '30x cheaper' },
    { year: 2024, model: 'GPT-4o-mini / LLaMA-3.3 70B', pricePerM: '$0.15', drop: '400x cheaper ★' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Inference API Pricing Deflation (2020 &ndash; 2024)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              Over 400x Cost Reduction in 4 Years
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            {priceHistory.map((p, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '6px' }}>[{p.year}]</span>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{p.model}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>{p.pricePerM} / 1M Tokens</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{p.drop}</div>
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{Price Deflation: } \\frac{\\$60.00}{\\$0.15} = 400\\times \\text{ Reduction in Inference Cost per Token}`} />
        </div>

        <ControlPanel title="Inference Economics" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            vLLM continuous batching, FP8 quantization, and hardware improvements collapsed inference costs by 400x.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 214. Training Compute Trends
export const TrainingComputeTrendsViz: React.FC = () => {
  const [params, setParams] = useState<number>(70); // 70B
  const [tokens, setTokens] = useState<number>(15); // 15T tokens

  const { flops, log10Flops, gpuHoursH100 } = computeTrainingFlops(params, tokens);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Training Compute FLOPs Estimator (Kaplan & Chinchilla)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              10^{log10Flops.toFixed(2)} Total FLOPs
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Floating Point Operations (FLOPs)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>{flops.toExponential(2)}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>$6 \\times N \\times D$ Total Operations</div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>H100 GPU Cluster Time</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>~{Math.round(gpuHoursH100).toLocaleString()} GPU-Hours</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>~{(gpuHoursH100 / (1000 * 24)).toFixed(1)} days on 1,000 H100s</div>
            </div>
          </div>

          <MathBlock math={`C \\approx 6 N D = 6 \\times (${params} \\times 10^9) \\times (${tokens} \\times 10^{12}) = ${flops.toExponential(2)} \\text{ FLOPs} \\; (10^{${log10Flops.toFixed(1)}})`} />
        </div>

        <ControlPanel title="Training Scaling" onReset={() => { setParams(70); setTokens(15); }}>
          <Slider
            label="Model Parameters"
            value={params}
            min={1}
            max={405}
            step={1}
            onChange={setParams}
            formatValue={(v) => `${v} Billion Parameters`}
          />

          <Slider
            label="Training Dataset Volume"
            value={tokens}
            min={1}
            max={20}
            step={1}
            onChange={setTokens}
            formatValue={(v) => `${v} Trillion Tokens`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 215. Emergent Abilities at Scale
export const EmergentAbilitiesViz: React.FC = () => {
  const [scale, setScale] = useState<number>(24.0); // 10^24 FLOPs
  const [metricMode, setMetricMode] = useState<'nonlinear' | 'linear'>('nonlinear');

  const accuracy = computeEmergenceMetric(scale, 23.5, metricMode === 'nonlinear');

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Emergent Abilities vs Metric Artifacts (Wei et al. vs Schaeffer et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Scale: 10^{scale.toFixed(1)} FLOPs &rarr; {(accuracy * 100).toFixed(0)}% Score
            </span>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '14px 0' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {metricMode === 'nonlinear' ? (
                <div>
                  <strong style={{ color: '#f59e0b' }}>Non-Linear Exact Match Metric (0/1 Step Function):</strong>
                  <p style={{ margin: '4px 0' }}>Displays sharp apparent emergence above 10^23.5 FLOPs because the entire multi-step arithmetic chain must succeed simultaneously (P_all = p^k).</p>
                </div>
              ) : (
                <div>
                  <strong style={{ color: '#10b981' }}>Continuous Linear Metric (Cross-Entropy / Brier Score):</strong>
                  <p style={{ margin: '4px 0' }}>Reveals smooth, continuous per-token probability improvements across all scale orders with zero abrupt discontinuities.</p>
                </div>
              )}
            </div>
          </div>

          <MathBlock math={metricMode === 'nonlinear' ? `\\text{Exact Match Accuracy: } P(\\text{Task}) = \\prod_{i=1}^K p_i \\approx p^K \\quad (\\text{Step Function Sharp Jump})` : `\\text{Token Cross-Entropy: } \\mathcal{L}(C) = \\alpha C^{-\\beta} \\quad (\\text{Smooth Continuous Power Law})`} />
        </div>

        <ControlPanel title="Emergence Explorer" onReset={() => { setScale(24.0); setMetricMode('nonlinear'); }}>
          <button
            type="button"
            onClick={() => setMetricMode((prev) => (prev === 'nonlinear' ? 'linear' : 'nonlinear'))}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: 'var(--accent-muted)',
              border: '1px solid var(--accent-color)',
              color: 'var(--accent-color)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '10px',
            }}
          >
            Switch to {metricMode === 'nonlinear' ? 'Continuous Linear Metric' : 'Non-Linear Exact Match Metric'}
          </button>

          <Slider
            label="Compute Scale (FLOPs)"
            value={scale}
            min={21.0}
            max={26.0}
            step={0.2}
            onChange={setScale}
            formatValue={(v) => `10^${v.toFixed(1)} FLOPs`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
