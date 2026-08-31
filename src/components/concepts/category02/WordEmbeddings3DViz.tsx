import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { Toggle } from '../../controls/Toggle';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { EMBEDDING_VOCAB } from './category02Math';
import styles from '../category01/Category01.module.css';

export const WordEmbeddings3DViz: React.FC = () => {
  const [rotX, setRotX] = useState(25);
  const [rotY, setRotY] = useState(45);
  const [showAnalogy, setShowAnalogy] = useState(true);

  // 3D to 2D projection math
  const radX = (rotX * Math.PI) / 180;
  const radY = (rotY * Math.PI) / 180;

  const project3D = (x: number, y: number, z: number): [number, number] => {
    // Rotate around Y
    const x1 = x * Math.cos(radY) + z * Math.sin(radY);
    const z1 = -x * Math.sin(radY) + z * Math.cos(radY);
    // Rotate around X
    const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);

    // Scale to SVG canvas
    const scale = 50;
    const px = 200 + x1 * scale;
    const py = 150 - y2 * scale;
    return [px, py];
  };

  const categoryColors: Record<string, string> = {
    royalty: '#818cf8',
    gender: '#38bdf8',
    animals: '#10b981',
    cities: '#f59e0b',
    actions: '#ec4899',
  };

  // Find key analogy points
  const king = EMBEDDING_VOCAB.find((v) => v.word === 'king');
  const man = EMBEDDING_VOCAB.find((v) => v.word === 'man');
  const woman = EMBEDDING_VOCAB.find((v) => v.word === 'woman');
  const queen = EMBEDDING_VOCAB.find((v) => v.word === 'queen');

  const pKing = king ? project3D(king.x, king.y, king.z) : [0, 0];
  const pMan = man ? project3D(man.x, man.y, man.z) : [0, 0];
  const pWoman = woman ? project3D(woman.x, woman.y, woman.z) : [0, 0];
  const pQueen = queen ? project3D(queen.x, queen.y, queen.z) : [0, 0];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>3D Semantic Vector Space</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              15 Word Embeddings
            </span>
          </div>

          <svg viewBox="0 0 400 300" style={{ width: '100%', height: '300px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {/* 3D Coordinate Axes */}
            {(() => {
              const origin = project3D(0, 0, 0);
              const axisX = project3D(3, 0, 0);
              const axisY = project3D(0, 3, 0);
              const axisZ = project3D(0, 0, 3);
              return (
                <g stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3">
                  <line x1={origin[0]} y1={origin[1]} x2={axisX[0]} y2={axisX[1]} />
                  <line x1={origin[0]} y1={origin[1]} x2={axisY[0]} y2={axisY[1]} />
                  <line x1={origin[0]} y1={origin[1]} x2={axisZ[0]} y2={axisZ[1]} />
                </g>
              );
            })()}

            {/* Analogy Vector Trajectory: King - Man + Woman = Queen */}
            {showAnalogy && (
              <g stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3">
                <line x1={pKing[0]} y1={pKing[1]} x2={pMan[0]} y2={pMan[1]} />
                <line x1={pWoman[0]} y1={pWoman[1]} x2={pQueen[0]} y2={pQueen[1]} />
              </g>
            )}

            {/* Projected Word Nodes */}
            {EMBEDDING_VOCAB.map((item) => {
              const [px, py] = project3D(item.x, item.y, item.z);
              const col = categoryColors[item.category] || 'var(--accent-color)';

              return (
                <g key={item.word} transform={`translate(${px}, ${py})`}>
                  <circle r="6" fill={col} stroke="#ffffff" strokeWidth="1.5" />
                  <text
                    x="9"
                    y="4"
                    fill="var(--text-primary)"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                    fontWeight="600"
                  >
                    {item.word}
                  </text>
                </g>
              );
            })}
          </svg>

          <MathBlock math={`\\vec{v}_{\\text{king}} - \\vec{v}_{\\text{man}} + \\vec{v}_{\\text{woman}} \\approx \\vec{v}_{\\text{queen}}`} />
        </div>

        <ControlPanel title="3D Viewport Controls" onReset={() => { setRotX(25); setRotY(45); setShowAnalogy(true); }}>
          <Slider label="Rotate Elevation (X)" value={rotX} min={-90} max={90} step={5} onChange={setRotX} formatValue={(v) => `${v}°`} />
          <Slider label="Rotate Azimuth (Y)" value={rotY} min={-180} max={180} step={5} onChange={setRotY} formatValue={(v) => `${v}°`} />
          <Toggle label="Show Analogy Path (King - Man + Woman = Queen)" checked={showAnalogy} onChange={setShowAnalogy} />
        </ControlPanel>
      </div>
    </div>
  );
};
