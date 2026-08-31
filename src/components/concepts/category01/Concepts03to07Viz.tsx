import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { ButtonGroup } from '../../controls/ButtonGroup';
import { MathBlock } from '../../math/MathBlock';
import { sigmoid, relu } from './category01Math';
import styles from './Category01.module.css';

// 03. Multi-Layer Perceptron
export const MLPViz: React.FC = () => {
  const [hiddenLayers, setHiddenLayers] = useState(2);
  const [neuronsPerLayer, setNeuronsPerLayer] = useState(4);
  const [inputVal1, setInputVal1] = useState(0.8);
  const [inputVal2, setInputVal2] = useState(-0.5);

  const layerStructure = [2, ...Array(hiddenLayers).fill(neuronsPerLayer), 1];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Feedforward Network Architecture</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {layerStructure.join(' → ')}
            </span>
          </div>

          <svg viewBox="0 0 500 280" style={{ width: '100%', height: '280px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {/* Draw layer connections */}
            {layerStructure.map((numNodes, lIdx) => {
              if (lIdx === layerStructure.length - 1) return null;
              const nextNumNodes = layerStructure[lIdx + 1];
              const x1 = 50 + (lIdx / (layerStructure.length - 1)) * 400;
              const x2 = 50 + ((lIdx + 1) / (layerStructure.length - 1)) * 400;

              return Array.from({ length: numNodes }).map((_, i) => {
                const y1 = 140 + (i - (numNodes - 1) / 2) * 40;
                return Array.from({ length: nextNumNodes }).map((_, j) => {
                  const y2 = 140 + (j - (nextNumNodes - 1) / 2) * 40;
                  return (
                    <line
                      key={`${lIdx}-${i}-${j}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--accent-muted)"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  );
                });
              });
            })}

            {/* Draw neuron circles */}
            {layerStructure.map((numNodes, lIdx) => {
              const x = 50 + (lIdx / (layerStructure.length - 1)) * 400;
              return Array.from({ length: numNodes }).map((_, i) => {
                const y = 140 + (i - (numNodes - 1) / 2) * 40;
                const isInput = lIdx === 0;
                const isOutput = lIdx === layerStructure.length - 1;
                const fillColor = isInput ? '#38bdf8' : isOutput ? '#10b981' : '#818cf8';

                return (
                  <g key={`${lIdx}-${i}`}>
                    <circle cx={x} cy={y} r="14" fill="var(--bg-secondary)" stroke={fillColor} strokeWidth="2.5" />
                    <text
                      x={x}
                      y={y + 4}
                      fill="var(--text-primary)"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                    >
                      {isInput ? (i === 0 ? inputVal1.toFixed(1) : inputVal2.toFixed(1)) : 'a'}
                    </text>
                  </g>
                );
              });
            })}
          </svg>

          <MathBlock math={`a^{[l]} = \\sigma(W^{[l]} a^{[l-1]} + b^{[l]})`} />
        </div>

        <ControlPanel title="Network Hyperparameters" onReset={() => { setHiddenLayers(2); setNeuronsPerLayer(4); }}>
          <Slider
            label="Hidden Layers"
            value={hiddenLayers}
            min={1}
            max={3}
            step={1}
            onChange={setHiddenLayers}
          />
          <Slider
            label="Neurons per Layer"
            value={neuronsPerLayer}
            min={2}
            max={6}
            step={1}
            onChange={setNeuronsPerLayer}
          />
          <Slider
            label="Input x1"
            value={inputVal1}
            min={-2}
            max={2}
            step={0.1}
            onChange={setInputVal1}
            formatValue={(v) => v.toFixed(1)}
          />
          <Slider
            label="Input x2"
            value={inputVal2}
            min={-2}
            max={2}
            step={0.1}
            onChange={setInputVal2}
            formatValue={(v) => v.toFixed(1)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 04. Forward Pass Step-by-Step
export const ForwardPassViz: React.FC = () => {
  const [step, setStep] = useState(0);
  const [x1, setX1] = useState(1.5);
  const [x2, setX2] = useState(-0.8);
  const [w11, setW11] = useState(0.6);
  const [w12, setW12] = useState(-0.4);
  const [b1, setB1] = useState(0.2);

  // Math steps
  const z1 = w11 * x1 + w12 * x2 + b1;
  const a1 = relu(z1);

  const stepsDescriptions = [
    'Step 1: Input features x1 and x2 are loaded.',
    `Step 2: Linear combination z = (${w11.toFixed(2)} * ${x1.toFixed(2)}) + (${w12.toFixed(2)} * ${x2.toFixed(2)}) + ${b1.toFixed(2)} = ${z1.toFixed(3)}.`,
    `Step 3: Non-linear activation applied: a = ReLU(${z1.toFixed(3)}) = ${a1.toFixed(3)}.`,
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Forward Computation Flow</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Step {step + 1} of 3
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {stepsDescriptions[step]}
            </p>
            {step === 0 && <MathBlock math={`x = \\begin{bmatrix} ${x1.toFixed(2)} \\\\ ${x2.toFixed(2)} \\end{bmatrix}`} />}
            {step === 1 && <MathBlock math={`z = W x + b = \\begin{bmatrix} ${w11.toFixed(2)} & ${w12.toFixed(2)} \\end{bmatrix} \\begin{bmatrix} ${x1.toFixed(2)} \\\\ ${x2.toFixed(2)} \\end{bmatrix} + (${b1.toFixed(2)}) = ${z1.toFixed(3)}`} />}
            {step === 2 && <MathBlock math={`a = \\text{ReLU}(${z1.toFixed(3)}) = \\max(0, ${z1.toFixed(3)}) = ${a1.toFixed(3)}`} />}
          </div>

          <ButtonGroup
            actions={[
              { label: 'Step Back', onClick: () => setStep((s) => Math.max(0, s - 1)), disabled: step === 0 },
              { label: 'Next Step', onClick: () => setStep((s) => Math.min(2, s + 1)), disabled: step === 2 },
              { label: 'Reset', onClick: () => setStep(0) },
            ]}
          />
        </div>

        <ControlPanel title="Linear Layer Parameters" onReset={() => { setX1(1.5); setX2(-0.8); setW11(0.6); setW12(-0.4); setB1(0.2); }}>
          <Slider label="Input x1" value={x1} min={-2} max={2} step={0.1} onChange={setX1} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Input x2" value={x2} min={-2} max={2} step={0.1} onChange={setX2} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Weight w1" value={w11} min={-2} max={2} step={0.1} onChange={setW11} formatValue={(v) => v.toFixed(2)} />
          <Slider label="Weight w2" value={w12} min={-2} max={2} step={0.1} onChange={setW12} formatValue={(v) => v.toFixed(2)} />
          <Slider label="Bias b" value={b1} min={-2} max={2} step={0.1} onChange={setB1} formatValue={(v) => v.toFixed(2)} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 05. Loss Functions MSE vs Cross-Entropy
export const LossFunctionsViz: React.FC = () => {
  const [lossType, setLossType] = useState<'mse' | 'ce'>('ce');
  const [predProb, setPredProb] = useState(0.7);
  const target = 1.0;

  const mseVal = Math.pow(predProb - target, 2);
  const ceVal = -Math.log(Math.max(predProb, 0.001));

  const points: { p: number; mse: number; ce: number }[] = [];
  for (let i = 1; i <= 99; i++) {
    const p = i / 100;
    points.push({
      p,
      mse: Math.pow(p - target, 2),
      ce: -Math.log(p),
    });
  }

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{lossType === 'ce' ? 'Cross-Entropy Loss Curve' : 'Mean Squared Error Curve'}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--accent-color)' }}>
              Loss = {lossType === 'ce' ? ceVal.toFixed(4) : mseVal.toFixed(4)}
            </span>
          </div>

          <svg viewBox="0 0 350 200" style={{ width: '100%', height: '220px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <line x1="30" y1="170" x2="330" y2="170" stroke="var(--border-color)" strokeWidth="1" />
            <line x1="30" y1="20" x2="30" y2="170" stroke="var(--border-color)" strokeWidth="1" />

            {/* Path */}
            <path
              d={points
                .map((pt, idx) => {
                  const x = 30 + pt.p * 300;
                  const yVal = lossType === 'ce' ? pt.ce : pt.mse;
                  const y = 170 - Math.min(yVal, 3.5) * 40;
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke={lossType === 'ce' ? 'var(--accent-color)' : 'var(--warning-color)'}
              strokeWidth="2.5"
            />

            {/* Current point */}
            <circle
              cx={30 + predProb * 300}
              cy={170 - Math.min(lossType === 'ce' ? ceVal : mseVal, 3.5) * 40}
              r="5"
              fill="#ffffff"
              stroke="var(--accent-color)"
              strokeWidth="2"
            />
          </svg>

          {lossType === 'ce' ? (
            <MathBlock math={`L_{\\text{CE}} = -\\log(\\hat{y}) = -\\log(${predProb.toFixed(2)}) = ${ceVal.toFixed(3)}`} />
          ) : (
            <MathBlock math={`L_{\\text{MSE}} = (\\hat{y} - y)^2 = (${predProb.toFixed(2)} - 1.0)^2 = ${mseVal.toFixed(3)}`} />
          )}
        </div>

        <ControlPanel title="Loss Parameters" onReset={() => setPredProb(0.7)}>
          <RadioGroup
            label="Loss Function"
            value={lossType}
            options={[
              { value: 'ce', label: 'Cross-Entropy' },
              { value: 'mse', label: 'Mean Squared Error' },
            ]}
            onChange={(v) => setLossType(v as 'mse' | 'ce')}
          />
          <Slider
            label="Predicted Probability (ŷ)"
            value={predProb}
            min={0.01}
            max={0.99}
            step={0.01}
            onChange={setPredProb}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 06. Backpropagation & Chain Rule
export const BackpropagationViz: React.FC = () => {
  const [outputGrad, setOutputGrad] = useState(1.0);
  const [w, setW] = useState(2.0);
  const [x, setX] = useState(1.5);

  const z = w * x;
  const a = sigmoid(z);
  const da_dz = a * (1 - a);
  const dz_dw = x;
  const dL_dw = outputGrad * da_dz * dz_dw;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Computational Chain Rule Flow</span>
            <span style={{ color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>
              dL/dw = {dL_dw.toFixed(4)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '20px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-color)' }}>Forward</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>z = {z.toFixed(2)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>a = {a.toFixed(3)}</div>
            </div>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>⇄</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: '#f59e0b' }}>Backward</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>da/dz = {da_dz.toFixed(3)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>dz/dw = {dz_dw.toFixed(2)}</div>
            </div>
          </div>

          <MathBlock math={`\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial a} \\cdot \\frac{\\partial a}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w} = (${outputGrad.toFixed(2)}) (${da_dz.toFixed(3)}) (${dz_dw.toFixed(2)}) = ${dL_dw.toFixed(4)}`} />
        </div>

        <ControlPanel title="Backprop Controls" onReset={() => { setOutputGrad(1.0); setW(2.0); setX(1.5); }}>
          <Slider label="Upstream Error (dL/da)" value={outputGrad} min={0.1} max={3.0} step={0.1} onChange={setOutputGrad} formatValue={(v) => v.toFixed(2)} />
          <Slider label="Weight w" value={w} min={-3.0} max={3.0} step={0.1} onChange={setW} formatValue={(v) => v.toFixed(2)} />
          <Slider label="Input x" value={x} min={-3.0} max={3.0} step={0.1} onChange={setX} formatValue={(v) => v.toFixed(2)} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 07. Gradient Descent Surface
export const GradientDescentViz: React.FC = () => {
  const [learningRate, setLearningRate] = useState(0.1);
  const [currentX, setCurrentX] = useState(2.5);
  const [history, setHistory] = useState<number[]>([2.5]);

  // Quadratic loss function: f(x) = x^2, f'(x) = 2x
  const handleStep = () => {
    const grad = 2 * currentX;
    const nextX = currentX - learningRate * grad;
    setCurrentX(nextX);
    setHistory((prev) => [...prev, nextX]);
  };

  const handleReset = () => {
    setCurrentX(2.5);
    setHistory([2.5]);
  };

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>1D Convex Optimization: f(w) = w²</span>
            <span style={{ color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>
              w = {currentX.toFixed(3)}, Loss = {(currentX * currentX).toFixed(3)}
            </span>
          </div>

          <svg viewBox="-3.5 -0.5 7 10" style={{ width: '100%', height: '240px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {/* Parabola */}
            <path
              d={Array.from({ length: 60 }).map((_, i) => {
                const wx = -3.0 + (i / 60) * 6.0;
                const wy = 9 - wx * wx;
                return `${i === 0 ? 'M' : 'L'} ${wx} ${wy}`;
              }).join(' ')}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="0.1"
            />

            {/* Optimization trajectory */}
            {history.map((hx, idx) => (
              <circle
                key={idx}
                cx={hx}
                cy={9 - hx * hx}
                r={idx === history.length - 1 ? 0.2 : 0.1}
                fill={idx === history.length - 1 ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)'}
              />
            ))}
          </svg>

          <ButtonGroup
            actions={[
              { label: 'Step Optimizer', onClick: handleStep },
              { label: 'Reset Position', onClick: handleReset },
            ]}
          />
        </div>

        <ControlPanel title="Optimizer Settings" onReset={() => setLearningRate(0.1)}>
          <Slider
            label="Learning Rate (η)"
            value={learningRate}
            min={0.01}
            max={1.1}
            step={0.01}
            onChange={setLearningRate}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
