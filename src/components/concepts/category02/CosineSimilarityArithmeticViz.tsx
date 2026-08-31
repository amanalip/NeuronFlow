import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { Select } from '../../controls/Select';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeCosineSimilarity, EMBEDDING_VOCAB, findNearestWord } from './category02Math';
import styles from '../category01/Category01.module.css';

// 24. Cosine Similarity
export const CosineSimilarityViz: React.FC = () => {
  const [ax, setAx] = useState(2.0);
  const [ay, setAy] = useState(1.0);
  const [bx, setBx] = useState(1.0);
  const [by, setBy] = useState(2.0);

  const vecA = [ax, ay];
  const vecB = [bx, by];

  const sim = computeCosineSimilarity(vecA, vecB);
  const dot = ax * bx + ay * by;
  const normA = Math.sqrt(ax * ax + ay * ay);
  const normB = Math.sqrt(bx * bx + by * by);
  const angleRad = Math.acos(Math.max(-1, Math.min(1, sim)));
  const angleDeg = (angleRad * 180) / Math.PI;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Geometric Vector Alignment</span>
            <span style={{ fontSize: '0.84rem', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>
              Similarity: {sim.toFixed(4)} (θ = {angleDeg.toFixed(1)}°)
            </span>
          </div>

          <svg viewBox="-4 -4 8 8" style={{ width: '100%', height: '260px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <line x1="-3.8" y1="0" x2="3.8" y2="0" stroke="var(--border-color)" strokeWidth="0.05" />
            <line x1="0" y1="-3.8" x2="0" y2="3.8" stroke="var(--border-color)" strokeWidth="0.05" />

            {/* Vector A */}
            <line x1="0" y1="0" x2={ax} y2={-ay} stroke="#38bdf8" strokeWidth="0.15" markerEnd="url(#arrowA)" />
            <circle cx={ax} cy={-ay} r="0.15" fill="#38bdf8" />
            <text x={ax + 0.2} y={-ay - 0.1} fill="#38bdf8" fontSize="0.4" fontFamily="var(--font-mono)">
              A ({ax.toFixed(1)}, {ay.toFixed(1)})
            </text>

            {/* Vector B */}
            <line x1="0" y1="0" x2={bx} y2={-by} stroke="#f59e0b" strokeWidth="0.15" />
            <circle cx={bx} cy={-by} r="0.15" fill="#f59e0b" />
            <text x={bx + 0.2} y={-by - 0.1} fill="#f59e0b" fontSize="0.4" fontFamily="var(--font-mono)">
              B ({bx.toFixed(1)}, {by.toFixed(1)})
            </text>
          </svg>

          <MathBlock math={`\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|} = \\frac{${dot.toFixed(2)}}{(${normA.toFixed(2)})(${normB.toFixed(2)})} = ${sim.toFixed(4)}`} />
        </div>

        <ControlPanel title="Vector Coordinates" onReset={() => { setAx(2.0); setAy(1.0); setBx(1.0); setBy(2.0); }}>
          <Slider label="Vector A: X" value={ax} min={-3} max={3} step={0.2} onChange={setAx} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Vector A: Y" value={ay} min={-3} max={3} step={0.2} onChange={setAy} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Vector B: X" value={bx} min={-3} max={3} step={0.2} onChange={setBx} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Vector B: Y" value={by} min={-3} max={3} step={0.2} onChange={setBy} formatValue={(v) => v.toFixed(1)} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 25. Embedding Arithmetic
export const EmbeddingArithmeticViz: React.FC = () => {
  const [wordA, setWordA] = useState('king');
  const [wordB, setWordB] = useState('man');
  const [wordC, setWordC] = useState('woman');

  const vA = EMBEDDING_VOCAB.find((v) => v.word === wordA) || EMBEDDING_VOCAB[0];
  const vB = EMBEDDING_VOCAB.find((v) => v.word === wordB) || EMBEDDING_VOCAB[4];
  const vC = EMBEDDING_VOCAB.find((v) => v.word === wordC) || EMBEDDING_VOCAB[5];

  // Target = vA - vB + vC
  const target: [number, number, number] = [
    vA.x - vB.x + vC.x,
    vA.y - vB.y + vC.y,
    vA.z - vB.z + vC.z,
  ];

  const nearest = findNearestWord(target, [wordA, wordB, wordC]);

  const options = EMBEDDING_VOCAB.map((v) => ({
    value: v.word,
    label: v.word,
  }));

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Vector Analogy Solver</span>
            <span style={{ fontSize: '0.84rem', color: 'var(--accent-color)' }}>
              Nearest Match: <strong>"{nearest.word}"</strong> (dist: {nearest.dist.toFixed(3)})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '24px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--accent-color)' }}>"{wordA}"</span>
            <span>-</span>
            <span style={{ color: '#f59e0b' }}>"{wordB}"</span>
            <span>+</span>
            <span style={{ color: '#10b981' }}>"{wordC}"</span>
            <span>=</span>
            <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>"{nearest.word}"</span>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target Vector Coordinates:</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
              [{target[0].toFixed(2)}, {target[1].toFixed(2)}, {target[2].toFixed(2)}]
            </div>
          </div>

          <MathBlock math={`\\vec{v}_{\\text{result}} = \\vec{v}_{\\text{${wordA}}} - \\vec{v}_{\\text{${wordB}}} + \\vec{v}_{\\text{${wordC}}} \\approx \\vec{v}_{\\text{${nearest.word}}}`} />
        </div>

        <ControlPanel title="Analogy Terms" onReset={() => { setWordA('king'); setWordB('man'); setWordC('woman'); }}>
          <Select label="Term A (e.g. king)" value={wordA} options={options} onChange={setWordA} />
          <Select label="Minus Term B (e.g. man)" value={wordB} options={options} onChange={setWordB} />
          <Select label="Plus Term C (e.g. woman)" value={wordC} options={options} onChange={setWordC} />
        </ControlPanel>
      </div>
    </div>
  );
};
