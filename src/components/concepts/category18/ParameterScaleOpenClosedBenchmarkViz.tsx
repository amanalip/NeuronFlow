import React from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 210. Parameter Count Evolution
export const ParameterCountEvolutionViz: React.FC = () => {
  const models = [
    { year: 2018, name: 'BERT-Base', params: '110 Million', logScale: 8.04, color: '#38bdf8' },
    { year: 2019, name: 'GPT-2 Extra Large', params: '1.5 Billion', logScale: 9.18, color: '#38bdf8' },
    { year: 2020, name: 'GPT-3', params: '175 Billion', logScale: 11.24, color: '#38bdf8' },
    { year: 2023, name: 'LLaMA-1 65B', params: '65 Billion', logScale: 10.81, color: '#10b981' },
    { year: 2023, name: 'GPT-4 (MoE)', params: '~1.8 Trillion (16x110B)', logScale: 12.25, color: '#f59e0b' },
    { year: 2024, name: 'LLaMA-3 405B', params: '405 Billion Dense', logScale: 11.61, color: '#10b981' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Parameter Count Growth (Log Scale 110M &rarr; 1.8T)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Over 4 Orders of Magnitude Growth in 5 Years
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '14px 0' }}>
            {models.map((m, idx) => (
              <div
                key={idx}
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
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '8px' }}>[{m.year}]</span>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{m.name}</strong>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: m.color }}>
                  {m.params}
                </span>
              </div>
            ))}
          </div>

          <MathBlock math={`\\Delta N = \\frac{1.8 \\times 10^{12}}{1.1 \\times 10^8} \\approx 16,360\\times \\text{ Parameter Scale Expansion}`} />
        </div>

        <ControlPanel title="Scale Trajectory" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Parameter scale expanded by 16,000x between 2018 and 2023 before transitioning toward compute-optimal data scaling.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 211. Open vs Closed Models
export const OpenVsClosedModelsViz: React.FC = () => {
  const dimensions = [
    { name: 'Model Weight Access', open: 'Full access (run on private clusters)', closed: 'Zero access (black-box hosted API)' },
    { name: 'Data Privacy & Sovereignty', open: 'Air-gapped on-premises compliance', closed: 'Data sent to third-party cloud' },
    { name: 'Custom Fine-Tuning', open: 'Full parameter LoRA / full weight updates', closed: 'Restricted fine-tuning APIs' },
    { name: 'Frontier Reasoning', open: 'Matches previous generation frontier', closed: 'Bleeding-edge frontier capabilities' },
    { name: 'Operational Overhead', open: 'Requires GPU cluster management', closed: 'Fully managed infrastructure' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Open Weights vs Proprietary Closed APIs</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Strategic Ecosystem Tradeoffs
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0' }}>
            {dimensions.map((d, idx) => (
              <div key={idx} style={{ padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.76rem', color: 'var(--text-primary)', marginBottom: '3px' }}>{d.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.72rem' }}>
                  <div style={{ color: '#10b981' }}><strong>Open Weights:</strong> {d.open}</div>
                  <div style={{ color: '#38bdf8' }}><strong>Closed API:</strong> {d.closed}</div>
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{TCO Decision: } \\operatorname{Cost}_{\\text{API}}(V_{\\text{tokens}}) \\lessgtr \\operatorname{Cost}_{\\text{Self-Hosted}}(\\text{GPU Hardware}, \\, \\text{DevOps})`} />
        </div>

        <ControlPanel title="Ecosystem Dynamics" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Enterprises deploy hybrid architectures: open weights for privacy-critical internal pipelines and closed APIs for frontier reasoning.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 212. Benchmark Progress Over Time
export const BenchmarkProgressViz: React.FC = () => {
  const history = [
    { release: 'GPT-3 (2020)', mmlu: '43.9%', gsm8k: '35.0%', humaneval: '28.1%' },
    { release: 'InstructGPT (2022)', mmlu: '65.2%', gsm8k: '60.0%', humaneval: '42.0%' },
    { release: 'GPT-4 (2023)', mmlu: '86.4%', gsm8k: '92.0%', humaneval: '67.0%' },
    { release: 'Claude 3.5 / GPT-4o (2024)', mmlu: '88.7%', gsm8k: '96.4%', humaneval: '92.0%' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Benchmark Saturation Trajectory (2020 &ndash; 2024)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              From 40% to 90%+ Across Academic Suites
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            {history.map((h, idx) => (
              <div key={idx} style={{ padding: '10px 12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{h.release}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.74rem' }}>
                  <div style={{ color: '#38bdf8' }}><strong>MMLU:</strong> {h.mmlu}</div>
                  <div style={{ color: '#10b981' }}><strong>GSM8K:</strong> {h.gsm8k}</div>
                  <div style={{ color: '#f59e0b' }}><strong>HumanEval:</strong> {h.humaneval}</div>
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{Rapid Saturation: } \\text{HumanEval (Code)}: 28.1\\% \\longrightarrow 92.0\\% \\quad (\\text{Harder benchmarks required: SWE-bench, GPQA})`} />
        </div>

        <ControlPanel title="Benchmark Pace" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Standard undergraduate benchmarks saturated rapidly, pushing researchers to develop agentic coding and PhD-level science evaluations.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
