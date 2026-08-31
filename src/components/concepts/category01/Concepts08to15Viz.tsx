import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { softmax } from './category01Math';
import { ProbabilityBar, ProbabilityItem } from '../../viz/charts/ProbabilityBar';
import styles from './Category01.module.css';

// 08. Learning Rate
export const LearningRateViz: React.FC = () => {
  const [lr, setLr] = useState(0.2);

  // Simulate 15 steps of f(w) = w^2
  let w = 2.5;
  const trajectory: number[] = [w];
  for (let i = 0; i < 15; i++) {
    const grad = 2 * w;
    w = w - lr * grad;
    trajectory.push(w);
  }

  const status =
    lr < 0.05
      ? 'Too Slow (Stagnant)'
      : lr <= 0.8
      ? 'Optimal Convergence'
      : lr < 1.0
      ? 'Oscillating'
      : 'Diverging (Exploding)';

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Optimization Trajectory</span>
            <span style={{ fontSize: '0.82rem', color: lr > 0.8 ? 'var(--error-color)' : 'var(--success-color)' }}>
              {status}
            </span>
          </div>

          <svg viewBox="0 0 400 200" style={{ width: '100%', height: '220px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <line x1="20" y1="180" x2="380" y2="180" stroke="var(--border-color)" strokeWidth="1" />
            <line x1="20" y1="20" x2="20" y2="180" stroke="var(--border-color)" strokeWidth="1" />

            {/* Trajectory line */}
            <path
              d={trajectory
                .map((val, idx) => {
                  const px = 20 + (idx / 15) * 360;
                  const clampedLoss = Math.min(val * val, 10);
                  const py = 180 - (clampedLoss / 10) * 150;
                  return `${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
                })
                .join(' ')}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="2"
            />

            {trajectory.map((val, idx) => {
              const px = 20 + (idx / 15) * 360;
              const clampedLoss = Math.min(val * val, 10);
              const py = 180 - (clampedLoss / 10) * 150;
              return <circle key={idx} cx={px} cy={py} r="3.5" fill="#f59e0b" />;
            })}
          </svg>

          <MathBlock math={`w_{t+1} = w_t - \\eta \\nabla L(w_t) = w_t - (${lr.toFixed(2)}) \\cdot (2 w_t)`} />
        </div>

        <ControlPanel title="Learning Rate Controls" onReset={() => setLr(0.2)}>
          <Slider
            label="Learning Rate (η)"
            value={lr}
            min={0.01}
            max={1.15}
            step={0.01}
            onChange={setLr}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 09. Overfitting vs Underfitting
export const OverfittingViz: React.FC = () => {
  const [degree, setDegree] = useState(3);

  // Synthetic dataset: y = sin(x) + noise
  const points = [
    { x: -2.0, y: -0.9 },
    { x: -1.4, y: -0.95 },
    { x: -0.8, y: -0.7 },
    { x: 0.0, y: 0.05 },
    { x: 0.7, y: 0.65 },
    { x: 1.3, y: 0.95 },
    { x: 2.0, y: 0.88 },
  ];

  const regime =
    degree === 1
      ? 'Underfitting (High Bias)'
      : degree <= 4
      ? 'Good Generalization'
      : 'Overfitting (High Variance)';

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Polynomial Fit: Degree {degree}</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-color)' }}>
              {regime}
            </span>
          </div>

          <svg viewBox="-2.5 -1.5 5 3" style={{ width: '100%', height: '240px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <line x1="-2.4" y1="0" x2="2.4" y2="0" stroke="var(--border-color)" strokeWidth="0.02" />
            <line x1="0" y1="-1.4" x2="0" y2="1.4" stroke="var(--border-color)" strokeWidth="0.02" />

            {/* Data Points */}
            {points.map((pt, idx) => (
              <circle key={idx} cx={pt.x} cy={-pt.y} r="0.08" fill="#38bdf8" />
            ))}

            {/* Polynomial curve mockup */}
            <path
              d={Array.from({ length: 80 }).map((_, i) => {
                const x = -2.2 + (i / 80) * 4.4;
                let y = 0;
                if (degree === 1) y = 0.5 * x;
                else if (degree <= 4) y = Math.sin(x * 0.9);
                else y = Math.sin(x * 0.9) + 0.3 * Math.sin(x * degree);
                return `${i === 0 ? 'M' : 'L'} ${x} ${-y}`;
              }).join(' ')}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="0.05"
            />
          </svg>

          <MathBlock math={`y(x) = \\sum_{j=0}^{${degree}} w_j x^j`} />
        </div>

        <ControlPanel title="Model Complexity" onReset={() => setDegree(3)}>
          <Slider
            label="Polynomial Degree"
            value={degree}
            min={1}
            max={8}
            step={1}
            onChange={setDegree}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 10. Regularization L1 vs L2
export const RegularizationViz: React.FC = () => {
  const [regType, setRegType] = useState<'l1' | 'l2'>('l1');
  const [lambda, setLambda] = useState(0.5);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{regType === 'l1' ? 'L1 Regularization (Lasso Diamond)' : 'L2 Regularization (Ridge Circle)'}</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-color)' }}>
              λ = {lambda.toFixed(2)}
            </span>
          </div>

          <svg viewBox="-3 -3 6 6" style={{ width: '100%', height: '240px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <line x1="-2.8" y1="0" x2="2.8" y2="0" stroke="var(--border-color)" strokeWidth="0.05" />
            <line x1="0" y1="-2.8" x2="0" y2="2.8" stroke="var(--border-color)" strokeWidth="0.05" />

            {/* Constraint Boundary */}
            {regType === 'l1' ? (
              <polygon
                points={`0,${-1.8 * (1 - lambda * 0.4)} ${1.8 * (1 - lambda * 0.4)},0 0,${1.8 * (1 - lambda * 0.4)} ${-1.8 * (1 - lambda * 0.4)},0`}
                fill="rgba(56, 189, 248, 0.15)"
                stroke="var(--accent-color)"
                strokeWidth="0.08"
              />
            ) : (
              <circle
                cx="0"
                cy="0"
                r={1.8 * (1 - lambda * 0.4)}
                fill="rgba(56, 189, 248, 0.15)"
                stroke="var(--accent-color)"
                strokeWidth="0.08"
              />
            )}

            {/* Loss Contours */}
            <ellipse cx="1.2" cy="1.2" rx="0.9" ry="0.6" fill="none" stroke="var(--text-muted)" strokeWidth="0.04" />
            <ellipse cx="1.2" cy="1.2" rx="1.5" ry="1.0" fill="none" stroke="var(--text-muted)" strokeWidth="0.04" />
          </svg>

          {regType === 'l1' ? (
            <MathBlock math={`L_{\\text{total}} = L_0 + \\lambda \\sum |w_i| \\quad \\text{(Induces Exact Sparsity)}`} />
          ) : (
            <MathBlock math={`L_{\\text{total}} = L_0 + \\lambda \\sum w_i^2 \\quad \\text{(Weight Decay / Shrinkage)}`} />
          )}
        </div>

        <ControlPanel title="Penalty Parameters" onReset={() => { setRegType('l1'); setLambda(0.5); }}>
          <RadioGroup
            label="Regularization Type"
            value={regType}
            options={[
              { value: 'l1', label: 'L1 (Lasso)' },
              { value: 'l2', label: 'L2 (Ridge)' },
            ]}
            onChange={(v) => setRegType(v as 'l1' | 'l2')}
          />
          <Slider
            label="Penalty Strength (λ)"
            value={lambda}
            min={0.0}
            max={1.0}
            step={0.05}
            onChange={setLambda}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 11. Batch Normalization
export const BatchNormalizationViz: React.FC = () => {
  const [gamma, setGamma] = useState(1.0);
  const [beta, setBeta] = useState(0.0);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Activation Distribution Shift</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              γ = {gamma.toFixed(2)}, β = {beta.toFixed(2)}
            </span>
          </div>

          <svg viewBox="-4 -1 8 4" style={{ width: '100%', height: '220px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <line x1="-3.8" y1="0" x2="3.8" y2="0" stroke="var(--border-color)" strokeWidth="0.04" />
            <line x1="0" y1="-0.8" x2="0" y2="2.5" stroke="var(--border-color)" strokeWidth="0.04" />

            {/* Normalized Gaussian */}
            <path
              d={Array.from({ length: 60 }).map((_, i) => {
                const x = -3.5 + (i / 60) * 7.0;
                const std = Math.max(0.1, gamma);
                const mean = beta;
                const y = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="rgba(56, 189, 248, 0.2)"
              stroke="var(--accent-color)"
              strokeWidth="0.08"
            />
          </svg>

          <MathBlock math={`y_i = \\gamma \\cdot \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}} + \\beta`} />
        </div>

        <ControlPanel title="Affine Parameters" onReset={() => { setGamma(1.0); setBeta(0.0); }}>
          <Slider label="Scale Factor (γ)" value={gamma} min={0.2} max={2.5} step={0.1} onChange={setGamma} formatValue={(v) => v.toFixed(2)} />
          <Slider label="Shift Offset (β)" value={beta} min={-2.0} max={2.0} step={0.1} onChange={setBeta} formatValue={(v) => v.toFixed(2)} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 12. Weight Initialization
export const WeightInitializationViz: React.FC = () => {
  const [initScheme, setInitScheme] = useState<'xavier' | 'he' | 'zeros' | 'random_large'>('xavier');

  const descriptions: Record<string, string> = {
    xavier: 'Xavier/Glorot: Var(W) = 2 / (n_in + n_out). Preserves variance for Tanh/Sigmoid.',
    he: 'He/Kaiming: Var(W) = 2 / n_in. Preserves activation variance for ReLU.',
    zeros: 'All Zeros: Breaks symmetry failure; all neurons compute identical features.',
    random_large: 'Random Large (Std = 1.0): Activations saturate or explode in deep layers.',
  };

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Layer 10 Activation Distribution</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {initScheme.toUpperCase()}
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', minHeight: '140px' }}>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {descriptions[initScheme]}
            </p>
          </div>

          <MathBlock
            math={
              initScheme === 'xavier'
                ? `W \\sim \\mathcal{N}\\left(0, \\frac{2}{n_{\\text{in}} + n_{\\text{out}}}\\right)`
                : initScheme === 'he'
                ? `W \\sim \\mathcal{N}\\left(0, \\frac{2}{n_{\\text{in}}}\\right)`
                : initScheme === 'zeros'
                ? `W = \\mathbf{0}`
                : `W \\sim \\mathcal{N}(0, 1.0)`
            }
          />
        </div>

        <ControlPanel title="Initialization Scheme" onReset={() => setInitScheme('xavier')}>
          <RadioGroup
            label="Method"
            value={initScheme}
            options={[
              { value: 'xavier', label: 'Xavier' },
              { value: 'he', label: 'He / Kaiming' },
              { value: 'zeros', label: 'All Zeros' },
              { value: 'random_large', label: 'Random Large' },
            ]}
            onChange={(v) => setInitScheme(v as 'xavier' | 'he' | 'zeros' | 'random_large')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 13. Softmax & Temperature
export const SoftmaxViz: React.FC = () => {
  const [z1, setZ1] = useState(2.0);
  const [z2, setZ2] = useState(1.0);
  const [z3, setZ3] = useState(0.1);
  const [temp, setTemp] = useState(1.0);

  const probs = softmax([z1, z2, z3], temp);

  const probData: ProbabilityItem[] = [
    { token: 'Class A', probability: probs[0], logit: z1 },
    { token: 'Class B', probability: probs[1], logit: z2 },
    { token: 'Class C', probability: probs[2], logit: z3 },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Softmax Probability Distribution</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              T = {temp.toFixed(2)}
            </span>
          </div>

          <ProbabilityBar data={probData} showLogits title="Normalized Probabilities" />

          <MathBlock math={`P(y = i) = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}`} />
        </div>

        <ControlPanel title="Logits & Temperature" onReset={() => { setZ1(2.0); setZ2(1.0); setZ3(0.1); setTemp(1.0); }}>
          <Slider label="Logit z1 (Class A)" value={z1} min={-3} max={5} step={0.1} onChange={setZ1} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Logit z2 (Class B)" value={z2} min={-3} max={5} step={0.1} onChange={setZ2} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Logit z3 (Class C)" value={z3} min={-3} max={5} step={0.1} onChange={setZ3} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Temperature (T)" value={temp} min={0.1} max={3.0} step={0.05} onChange={setTemp} formatValue={(v) => v.toFixed(2)} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 14. Cross-Entropy Loss
export const CrossEntropyViz: React.FC = () => {
  const [pTarget, setPTarget] = useState(0.85);
  const loss = -Math.log(Math.max(pTarget, 0.0001));

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Cross-Entropy & Surprisal</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--accent-color)' }}>
              Loss = {loss.toFixed(4)}
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span>Target Class: True Label (y = 1)</span>
              <span>Assigned Prob: {(pTarget * 100).toFixed(1)}%</span>
            </div>
            <div style={{ height: '24px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${pTarget * 100}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.15s ease' }} />
            </div>
          </div>

          <MathBlock math={`H(p, q) = -\\sum_{x} p(x) \\log q(x) = -\\log(${pTarget.toFixed(2)}) = ${loss.toFixed(4)}`} />
        </div>

        <ControlPanel title="Target Assignment" onReset={() => setPTarget(0.85)}>
          <Slider
            label="Predicted Probability on True Class"
            value={pTarget}
            min={0.01}
            max={0.99}
            step={0.01}
            onChange={setPTarget}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 15. Computation Graphs
export const ComputationGraphsViz: React.FC = () => {
  const [a, setA] = useState(2.0);
  const [b, setB] = useState(3.0);

  // Graph: c = a * b, d = a + c, L = d^2
  const c = a * b;
  const d = a + c;
  const L = d * d;

  // Gradients
  const dL_dd = 2 * d;
  const dL_dc = dL_dd * 1.0;
  const dL_db = dL_dc * a;
  const dL_da = dL_dd * 1.0 + dL_dc * b;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Autograd Directed Acyclic Graph (DAG)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--accent-color)' }}>
              Loss = {L.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Inputs</div>
              <div style={{ fontWeight: 600 }}>a={a.toFixed(1)}, b={b.toFixed(1)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-color)' }}>dL/da = {dL_da.toFixed(1)}</div>
              <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>dL/db = {dL_db.toFixed(1)}</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>c = a * b</div>
              <div style={{ fontWeight: 600 }}>c = {c.toFixed(1)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-color)' }}>dL/dc = {dL_dc.toFixed(1)}</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>d = a + c</div>
              <div style={{ fontWeight: 600 }}>d = {d.toFixed(1)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-color)' }}>dL/dd = {dL_dd.toFixed(1)}</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>L = d²</div>
              <div style={{ fontWeight: 600 }}>L = {L.toFixed(1)}</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981' }}>dL/dL = 1.0</div>
            </div>
          </div>

          <MathBlock math={`L = (a + ab)^2, \\quad \\frac{\\partial L}{\\partial a} = 2(a + ab)(1 + b) = ${dL_da.toFixed(2)}`} />
        </div>

        <ControlPanel title="Input Leaf Nodes" onReset={() => { setA(2.0); setB(3.0); }}>
          <Slider label="Leaf a" value={a} min={-4} max={4} step={0.5} onChange={setA} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Leaf b" value={b} min={-4} max={4} step={0.5} onChange={setB} formatValue={(v) => v.toFixed(1)} />
        </ControlPanel>
      </div>
    </div>
  );
};
