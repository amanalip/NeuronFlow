import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeRooflinePerformance } from './category11Math';
import styles from '../category01/Category01.module.css';

// 135. GPU Memory Hierarchy
export const GpuMemoryHierarchyViz: React.FC = () => {
  const levels = [
    { name: 'SRAM / Register File', capacity: '24 MB (per GPU)', bandwidth: '19.0 TB/s', latency: '~1 ns' },
    { name: 'L2 Cache', capacity: '50 MB', bandwidth: '5.2 TB/s', latency: '~5 ns' },
    { name: 'HBM3 (Main VRAM)', capacity: '80 GB', bandwidth: '3.35 TB/s', latency: '~100 ns' },
    { name: 'PCIe Gen5 / NVLink', capacity: 'N/A', bandwidth: '64 - 900 GB/s', latency: '~1,000 ns' },
    { name: 'Host System RAM', capacity: '512 GB - 2 TB', bandwidth: '50 - 200 GB/s', latency: '~5,000 ns' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>NVIDIA H100 GPU Memory Hierarchy</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Bandwidth & Latency Spectrum
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {levels.map((lvl, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--accent-color)' }}>{lvl.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Cap: {lvl.capacity}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>{lvl.bandwidth}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lat: {lvl.latency}</div>
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{Operational Rule: Keep data in SRAM as long as possible (Kernel Fusion & FlashAttention)}`} />
        </div>

        <ControlPanel title="Memory Hierarchy" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            High-performance LLM kernels are designed to minimize round-trips to high-bandwidth HBM memory.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 136. Roofline Model
export const RooflineModelViz: React.FC = () => {
  const [arithmeticIntensity, setArithmeticIntensity] = useState(150); // FLOPs per byte

  const { achievedTflops, boundType } = computeRooflinePerformance(arithmeticIntensity, 989, 3.35);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Roofline Performance Model (H100 SXM FP16)</span>
            <span style={{ fontSize: '0.8rem', color: boundType === 'compute' ? 'var(--success-color)' : '#f59e0b' }}>
              {boundType === 'compute' ? 'Compute-Bound (Peak Plateau)' : 'Memory-Bandwidth-Bound (Slope)'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arithmetic Intensity (I)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, margin: '4px 0' }}>{arithmeticIntensity} FLOPs/Byte</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Ridge Point: 295 FLOPs/Byte</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: `1px solid ${boundType === 'compute' ? 'var(--success-color)' : '#f59e0b'}` }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Achieved Throughput</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: boundType === 'compute' ? 'var(--success-color)' : '#f59e0b', margin: '4px 0' }}>
                {achievedTflops.toFixed(1)} TFLOPs
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Max Ceiling: 989 TFLOPs</div>
            </div>
          </div>

          <MathBlock math={`P = \\min(P_{\\text{peak}}, I \\times \\text{BW}) = \\min(989, ${arithmeticIntensity} \\times 3.35) = ${achievedTflops.toFixed(1)} \\text{ TFLOPs}`} />
        </div>

        <ControlPanel title="Arithmetic Intensity" onReset={() => setArithmeticIntensity(150)}>
          <Slider
            label="Intensity (FLOPs / Byte)"
            value={arithmeticIntensity}
            min={10}
            max={600}
            step={10}
            onChange={setArithmeticIntensity}
            formatValue={(v) => `${v} FLOPs/B`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 137. Decoding Strategies (Top-K, Top-P, Temperature)
export const DecodingStrategiesViz: React.FC = () => {
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [topK, setTopK] = useState(40);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Autoregressive Sampling Strategies</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              T: {temperature.toFixed(2)}, Top-P: {topP.toFixed(2)}, Top-K: {topK}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Temperature</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent-color)' }}>{temperature.toFixed(2)}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Logit scaling (z / T)</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Top-P (Nucleus)</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#10b981' }}>{topP.toFixed(2)}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Cumulative mass cutoff</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Top-K</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#38bdf8' }}>{topK}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Fixed rank cutoff</div>
            </div>
          </div>

          <MathBlock math={`P(t_i) = \\frac{\\exp(z_i / T)}{\\sum_{j \\in V_{\\text{filtered}}} \\exp(z_j / T)} \\quad \\text{where } \\sum_{j \\in V_p} P(t_j) \\le p`} />
        </div>

        <ControlPanel title="Sampling Controls" onReset={() => { setTemperature(0.7); setTopP(0.9); setTopK(40); }}>
          <Slider label="Temperature (T)" value={temperature} min={0.1} max={2.0} step={0.05} onChange={setTemperature} formatValue={(v) => `T = ${v.toFixed(2)}`} />
          <Slider label="Top-P (Nucleus)" value={topP} min={0.1} max={1.0} step={0.05} onChange={setTopP} formatValue={(v) => `p = ${v.toFixed(2)}`} />
          <Slider label="Top-K" value={topK} min={1} max={100} step={5} onChange={setTopK} formatValue={(v) => `K = ${v}`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 138. Structured Outputs (Grammar / Regex Masking)
export const StructuredOutputsViz: React.FC = () => {
  const [schemaMode, setSchemaMode] = useState<'json' | 'sql'>('json');

  const schemas = {
    json: {
      regex: '^{"name":\\s*"[a-zA-Z]+",\\s*"age":\\s*\\d+}$',
      sample: '{"name": "Alice", "age": 28}',
      allowedNext: ['"name"', '{', '"age"', ':', ',', '}'],
      blockedNext: ['SELECT', '<script>', 'def ', 'NaN'],
    },
    sql: {
      regex: '^SELECT\\s+[a-zA-Z_]+\\s+FROM\\s+[a-zA-Z_]+;$',
      sample: 'SELECT name FROM users;',
      allowedNext: ['SELECT', 'FROM', 'WHERE', 'id', 'users', ';'],
      blockedNext: ['{', '}', 'import', 'console.log'],
    },
  };

  const current = schemas[schemaMode];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Constrained Decoding & Logit Masking (Outlines / SGLang)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Deterministic Schema Compliance (Zero Syntax Errors)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '10px 12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Target Grammar DFA / Regex:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-color)', marginTop: '2px' }}>{current.regex}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--success-color)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--success-color)', fontWeight: 600 }}>Valid Next Tokens (Logit Kept):</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px' }}>
                  {current.allowedNext.join(', ')}
                </div>
              </div>
              <div style={{ padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--error-color)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--error-color)', fontWeight: 600 }}>Invalid Tokens (Logit = -∞):</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px' }}>
                  {current.blockedNext.join(', ')}
                </div>
              </div>
            </div>
          </div>

          <MathBlock math={`z_i = \\begin{cases} z_i & t_i \\in \\operatorname{DFAState}(s) \\\\ -\\infty & t_i \\notin \\operatorname{DFAState}(s) \\end{cases} \\quad (100\\% \\text{ Guaranteed Validity})`} />
        </div>

        <ControlPanel title="Grammar Schema" onReset={() => setSchemaMode('json')}>
          <RadioGroup
            label="Schema Mode"
            value={schemaMode}
            options={[
              { value: 'json', label: 'Strict JSON Schema' },
              { value: 'sql', label: 'Valid SQL Query' },
            ]}
            onChange={(v) => setSchemaMode(v as 'json' | 'sql')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
