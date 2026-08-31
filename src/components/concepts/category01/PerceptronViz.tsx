import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { Toggle } from '../../controls/Toggle';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { perceptronPredict } from './category01Math';
import styles from './Category01.module.css';

interface DataPoint {
  x1: number;
  x2: number;
  label: number;
}

const LOGIC_GATES: Record<string, { name: string; points: DataPoint[]; defaultW: [number, number, number] }> = {
  AND: {
    name: 'AND Gate (Linearly Separable)',
    points: [
      { x1: 0, x2: 0, label: 0 },
      { x1: 1, x2: 0, label: 0 },
      { x1: 0, x2: 1, label: 0 },
      { x1: 1, x2: 1, label: 1 },
    ],
    defaultW: [1.5, 1.5, -2.0],
  },
  OR: {
    name: 'OR Gate (Linearly Separable)',
    points: [
      { x1: 0, x2: 0, label: 0 },
      { x1: 1, x2: 0, label: 1 },
      { x1: 0, x2: 1, label: 1 },
      { x1: 1, x2: 1, label: 1 },
    ],
    defaultW: [2.0, 2.0, -1.0],
  },
  XOR: {
    name: 'XOR Gate (Non-Linearly Separable)',
    points: [
      { x1: 0, x2: 0, label: 0 },
      { x1: 1, x2: 0, label: 1 },
      { x1: 0, x2: 1, label: 1 },
      { x1: 1, x2: 1, label: 0 },
    ],
    defaultW: [1.0, 1.0, -1.0],
  },
};

export const PerceptronViz: React.FC = () => {
  const [gate, setGate] = useState<'AND' | 'OR' | 'XOR'>('AND');
  const [w1, setW1] = useState(1.5);
  const [w2, setW2] = useState(1.5);
  const [bias, setBias] = useState(-2.0);

  const activeGate = LOGIC_GATES[gate];

  const handleSelectGate = (val: string) => {
    const nextGate = val as 'AND' | 'OR' | 'XOR';
    setGate(nextGate);
    const defaults = LOGIC_GATES[nextGate].defaultW;
    setW1(defaults[0]);
    setW2(defaults[1]);
    setBias(defaults[2]);
  };

  const handleReset = () => {
    const defaults = activeGate.defaultW;
    setW1(defaults[0]);
    setW2(defaults[1]);
    setBias(defaults[2]);
  };

  // Evaluate accuracy
  const results = activeGate.points.map((pt) => {
    const pred = perceptronPredict(pt.x1, pt.x2, w1, w2, bias, 'step');
    return { ...pt, pred, correct: pred === pt.label };
  });

  const allCorrect = results.every((r) => r.correct);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Decision Boundary & Classification</span>
            <span className={allCorrect ? styles.correctBadge : styles.incorrectBadge}>
              {allCorrect ? '100% Solved' : 'Misclassified'}
            </span>
          </div>

          <svg viewBox="-0.5 -0.5 2.0 2.0" style={{ width: '100%', height: '280px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {/* Grid Axes */}
            <line x1="0" y1="1.3" x2="1.3" y2="1.3" stroke="var(--border-color)" strokeWidth="0.02" />
            <line x1="0" y1="0" x2="0" y2="1.3" stroke="var(--border-color)" strokeWidth="0.02" />

            {/* Decision boundary line: w1*x1 + w2*x2 + b = 0 => x2 = (-w1*x1 - b)/w2 */}
            {Math.abs(w2) > 0.001 && (
              <line
                x1="-0.2"
                y1={(-w1 * -0.2 - bias) / w2}
                x2="1.4"
                y2={(-w1 * 1.4 - bias) / w2}
                stroke="var(--accent-color)"
                strokeWidth="0.04"
                strokeDasharray="0.05 0.03"
              />
            )}

            {/* Data points */}
            {results.map((pt, idx) => (
              <g key={idx} transform={`translate(${pt.x1}, ${pt.x2})`}>
                <circle
                  r="0.1"
                  fill={pt.label === 1 ? 'var(--success-color)' : 'var(--error-color)'}
                  stroke={pt.correct ? '#ffffff' : 'var(--warning-color)'}
                  strokeWidth="0.02"
                />
                <text
                  x="0.14"
                  y="0.05"
                  fill="var(--text-primary)"
                  fontSize="0.11"
                  fontFamily="var(--font-mono)"
                >
                  ({pt.x1},{pt.x2})
                </text>
              </g>
            ))}
          </svg>

          <MathBlock math={`z = (${w1.toFixed(2)}) \\cdot x_1 + (${w2.toFixed(2)}) \\cdot x_2 + (${bias.toFixed(2)})`} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {results.map((r, i) => (
              <div key={i} className={styles.pointRow}>
                <span>({r.x1}, {r.x2}) Target: {r.label}</span>
                <span className={r.correct ? styles.correctBadge : styles.incorrectBadge}>
                  Pred: {r.pred} {r.correct ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ControlPanel title="Perceptron Parameters" onReset={handleReset}>
          <RadioGroup
            label="Target Task"
            value={gate}
            options={[
              { value: 'AND', label: 'AND' },
              { value: 'OR', label: 'OR' },
              { value: 'XOR', label: 'XOR' },
            ]}
            onChange={handleSelectGate}
          />
          <Slider
            label="Weight w1"
            value={w1}
            min={-4}
            max={4}
            step={0.1}
            onChange={setW1}
            formatValue={(v) => v.toFixed(2)}
          />
          <Slider
            label="Weight w2"
            value={w2}
            min={-4}
            max={4}
            step={0.1}
            onChange={setW2}
            formatValue={(v) => v.toFixed(2)}
          />
          <Slider
            label="Bias b"
            value={bias}
            min={-5}
            max={5}
            step={0.1}
            onChange={setBias}
            formatValue={(v) => v.toFixed(2)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

export const ActivationFunctionsViz: React.FC = () => {
  const [selectedFunc, setSelectedFunc] = useState<'relu' | 'sigmoid' | 'tanh' | 'gelu' | 'swish'>('relu');
  const [inputX, setInputX] = useState(1.2);
  const [showDerivative, setShowDerivative] = useState(false);

  // Generate curve coordinates
  const steps = 100;
  const xMin = -4;
  const xMax = 4;
  const points: { x: number; y: number; dy: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin);
    let y = 0;
    let dy = 0;

    if (selectedFunc === 'relu') {
      y = Math.max(0, x);
      dy = x > 0 ? 1 : 0;
    } else if (selectedFunc === 'sigmoid') {
      const s = 1 / (1 + Math.exp(-x));
      y = s;
      dy = s * (1 - s);
    } else if (selectedFunc === 'tanh') {
      y = Math.tanh(x);
      dy = 1 - y * y;
    } else if (selectedFunc === 'gelu') {
      y = 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3))));
      dy = 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * Math.pow(x, 3))));
    } else if (selectedFunc === 'swish') {
      const s = 1 / (1 + Math.exp(-x));
      y = x * s;
      dy = s + y * (1 - s);
    }

    points.push({ x, y, dy });
  }

  // Active value calculation
  let activeY = 0;
  if (selectedFunc === 'relu') activeY = Math.max(0, inputX);
  else if (selectedFunc === 'sigmoid') activeY = 1 / (1 + Math.exp(-inputX));
  else if (selectedFunc === 'tanh') activeY = Math.tanh(inputX);
  else if (selectedFunc === 'gelu') activeY = 0.5 * inputX * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (inputX + 0.044715 * Math.pow(inputX, 3))));
  else if (selectedFunc === 'swish') activeY = inputX * (1 / (1 + Math.exp(-inputX)));

  const formulaMap: Record<string, string> = {
    relu: 'f(x) = \\max(0, x)',
    sigmoid: 'f(x) = \\frac{1}{1 + e^{-x}}',
    tanh: 'f(x) = \\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}',
    gelu: 'f(x) = x \\cdot \\Phi(x) \\approx 0.5x(1 + \\tanh(\\sqrt{2/\\pi}(x + 0.044715x^3)))',
    swish: 'f(x) = x \\cdot \\sigma(\\beta x)',
  };

  const pathD = points
    .map((p, i) => {
      const px = ((p.x - xMin) / (xMax - xMin)) * 400;
      const py = 150 - (showDerivative ? p.dy : p.y) * 40;
      return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
    })
    .join(' ');

  const currentPx = ((inputX - xMin) / (xMax - xMin)) * 400;
  const currentPy = 150 - activeY * 40;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{selectedFunc.toUpperCase()} {showDerivative ? 'Derivative' : 'Function Curve'}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              f({inputX.toFixed(2)}) = {activeY.toFixed(3)}
            </span>
          </div>

          <svg viewBox="0 0 400 240" style={{ width: '100%', height: '260px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {/* Zero Axis lines */}
            <line x1="0" y1="150" x2="400" y2="150" stroke="var(--border-color)" strokeWidth="1.5" />
            <line x1="200" y1="0" x2="200" y2="240" stroke="var(--border-color)" strokeWidth="1.5" />

            {/* Function Curve */}
            <path d={pathD} fill="none" stroke="var(--accent-color)" strokeWidth="3" />

            {/* Active Point */}
            {!showDerivative && (
              <circle cx={currentPx} cy={currentPy} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            )}
          </svg>

          <MathBlock math={formulaMap[selectedFunc]} />
        </div>

        <ControlPanel title="Activation Controls" onReset={() => { setInputX(0); setShowDerivative(false); }}>
          <RadioGroup
            label="Activation Type"
            value={selectedFunc}
            options={[
              { value: 'relu', label: 'ReLU' },
              { value: 'sigmoid', label: 'Sigmoid' },
              { value: 'tanh', label: 'Tanh' },
              { value: 'gelu', label: 'GELU' },
              { value: 'swish', label: 'Swish' },
            ]}
            onChange={(v) => setSelectedFunc(v as 'relu' | 'sigmoid' | 'tanh' | 'gelu' | 'swish')}
          />
          <Slider
            label="Input Value (x)"
            value={inputX}
            min={-4}
            max={4}
            step={0.1}
            onChange={setInputX}
            formatValue={(v) => v.toFixed(2)}
          />
          <Toggle
            label="Show Derivative Curve"
            checked={showDerivative}
            onChange={setShowDerivative}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
