import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeCosineSchedule, computeWsdSchedule } from './category07Math';
import { LossCurve, LossDataPoint } from '../../viz/charts/LossCurve';
import { ComparisonTable } from '../../viz/charts/ComparisonTable';
import styles from '../category01/Category01.module.css';

// 84. Learning Rate Schedules (Cosine vs WSD)
export const LearningRateSchedulesViz: React.FC = () => {
  const [scheduleType, setScheduleType] = useState<'cosine' | 'wsd'>('wsd');
  const [warmupRatio, setWarmupRatio] = useState(0.05);

  const totalSteps = 1000;
  const warmupSteps = Math.floor(totalSteps * warmupRatio);
  const decayStart = 800;

  const points: LossDataPoint[] = [];
  for (let s = 0; s <= totalSteps; s += 25) {
    const lrVal =
      scheduleType === 'cosine'
        ? computeCosineSchedule(s, warmupSteps, totalSteps, 1e-4, 1e-5)
        : computeWsdSchedule(s, warmupSteps, decayStart, totalSteps, 1e-4, 1e-5);

    points.push({
      step: s,
      trainLoss: lrVal * 1e4, // Scale for plotting
    });
  }

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{scheduleType === 'cosine' ? 'Cosine Decay Schedule' : 'Warmup-Stable-Decay (WSD Schedule)'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Peak LR: 1e-4, Warmup: {warmupSteps} steps
            </span>
          </div>

          <LossCurve
            data={points}
            title="Learning Rate Trajectory over 1,000 Training Steps"
            xLabel="Step"
            yLabel="LR (x 10^-4)"
          />

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {scheduleType === 'wsd' ? (
                <span>
                  <strong>WSD Capability:</strong> The stable phase allows continuous training without committing to a total step count. Checkpoints can be branched anytime and rapidly annealed with custom datasets.
                </span>
              ) : (
                <span>
                  <strong>Cosine Limitation:</strong> Total training steps must be fixed in advance; interrupting early yields sub-optimal learning rate decay.
                </span>
              )}
            </p>
          </div>

          <MathBlock math={scheduleType === 'cosine' ? '\\eta_t = \\eta_{\\min} + \\frac{1}{2}(\\eta_{\\max} - \\eta_{\\min})\\left(1 + \\cos\\left(\\frac{t - T_{\\text{warm}}}{T_{\\text{total}} - T_{\\text{warm}}} \\pi\\right)\\right)' : '\\eta_t = \\begin{cases} t / T_{\\text{warm}} \\cdot \\eta_{\\max} & t < T_{\\text{warm}} \\\\ \\eta_{\\max} & T_{\\text{warm}} \\le t < T_{\\text{decay}} \\\\ \\text{CosineDecay}(t) & t \\ge T_{\\text{decay}} \\end{cases}'} />
        </div>

        <ControlPanel title="Schedule Settings" onReset={() => { setScheduleType('wsd'); setWarmupRatio(0.05); }}>
          <RadioGroup
            label="Schedule Architecture"
            value={scheduleType}
            options={[
              { value: 'wsd', label: 'WSD (Warmup-Stable-Decay)' },
              { value: 'cosine', label: 'Cosine Decay (Standard)' },
            ]}
            onChange={(v) => setScheduleType(v as 'cosine' | 'wsd')}
          />
          <Slider
            label="Warmup Ratio"
            value={warmupRatio}
            min={0.01}
            max={0.2}
            step={0.01}
            onChange={setWarmupRatio}
            formatValue={(v) => `${(v * 100).toFixed(0)}% of steps`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 85. Adam vs AdamW (Decoupled Weight Decay)
export const AdamWViz: React.FC = () => {
  const [lambdaWd, setLambdaWd] = useState(0.01);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>AdamW Decoupled Weight Decay (Loshchilov & Hutter)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Weight Decay λ = {lambdaWd}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--error-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--error-color)', fontSize: '0.82rem' }}>Flawed L2 Penalty (Standard Adam)</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Weights with large historical gradients receive LESS weight decay because gradient is divided by √v_t.
              </p>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--success-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--success-color)', fontSize: '0.82rem' }}>Decoupled Decay (AdamW) ★ Standard</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Decays weights directly in the update step independently of gradient second-moment variance.
              </p>
            </div>
          </div>

          <MathBlock math={`\\text{AdamW Update: } \\theta_{t+1} = \\theta_t - \\eta_t \\lambda \\theta_t - \\frac{\\eta_t}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t`} />
        </div>

        <ControlPanel title="Weight Decay" onReset={() => setLambdaWd(0.01)}>
          <Slider
            label="Weight Decay Coefficient (λ)"
            value={lambdaWd}
            min={0.001}
            max={0.1}
            step={0.005}
            onChange={setLambdaWd}
            formatValue={(v) => v.toFixed(3)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 86. Modern Optimizers (Lion, Sophia, Muon)
export const ModernOptimizersViz: React.FC = () => {
  const columns = [
    { key: 'name', header: 'Optimizer' },
    { key: 'memory', header: 'State Memory' },
    { key: 'method', header: 'Core Innovation' },
    { key: 'benefit', header: 'Primary Benefit' },
  ];

  const rows = [
    {
      name: <strong style={{ color: 'var(--accent-color)' }}>AdamW</strong>,
      memory: <span style={{ fontFamily: 'var(--font-mono)' }}>2x model size (m, v)</span>,
      method: '1st & 2nd moment scaling',
      benefit: 'Universal stability standard',
    },
    {
      name: <strong style={{ color: '#10b981' }}>Lion</strong>,
      memory: <span style={{ fontFamily: 'var(--font-mono)', color: '#10b981' }}>1x model size (50% savings)</span>,
      method: 'Sign momentum update',
      benefit: 'Lower VRAM overhead and faster step time',
    },
    {
      name: <strong style={{ color: '#f59e0b' }}>Sophia</strong>,
      memory: <span style={{ fontFamily: 'var(--font-mono)' }}>2x model size</span>,
      method: 'Stochastic diagonal Hessian curvature',
      benefit: '2x faster convergence on LLMs',
    },
    {
      name: <strong style={{ color: '#ec4899' }}>Muon</strong>,
      memory: <span style={{ fontFamily: 'var(--font-mono)' }}>1x model size</span>,
      method: 'Newton-Schulz matrix orthogonalization',
      benefit: 'Exceptional sample efficiency in hidden layers',
    },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Modern LLM Optimizer Landscape</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Beyond Standard AdamW
            </span>
          </div>

          <ComparisonTable columns={columns} rows={rows} />

          <MathBlock math={`\\text{Lion: } \\theta_{t+1} = \\theta_t - \\eta_t \\left( \\operatorname{sign}(\\beta_1 m_{t-1} + (1 - \\beta_1) g_t) + \\lambda \\theta_t \\right)`} />
        </div>

        <ControlPanel title="Optimizer Comparison" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Modern optimizers minimize GPU memory footprint for optimizer states and incorporate second-order curvature for faster convergence.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
