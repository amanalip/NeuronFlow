import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { MatrixView } from '../../viz/matrix/MatrixView';
import styles from '../category01/Category01.module.css';

export const VisionTransformerViz: React.FC = () => {
  const [selectedPatch, setSelectedPatch] = useState(4); // 0 to 15 (4x4 grid of 16x16 patches)

  // 4x4 patch grid attention rollout for selected patch
  const patchAttention: number[][] = [];
  for (let r = 0; r < 4; r++) {
    const row: number[] = [];
    for (let c = 0; c < 4; c++) {
      const dist = Math.abs(Math.floor(selectedPatch / 4) - r) + Math.abs((selectedPatch % 4) - c);
      const attn = Math.exp(-dist * 0.7);
      row.push(attn);
    }
    patchAttention.push(row);
  }

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Vision Transformer (ViT) Patch Attention (Dosovitskiy et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              16 Patches (16x16 pixels) + [CLS] Token
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>4x4 Patch Grid:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', width: '160px', height: '160px', background: 'var(--bg-primary)', padding: '6px', borderRadius: '6px' }}>
                {Array.from({ length: 16 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPatch(idx)}
                    style={{
                      border: selectedPatch === idx ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                      backgroundColor: selectedPatch === idx ? 'var(--accent-color)' : 'var(--bg-secondary)',
                      color: selectedPatch === idx ? '#ffffff' : 'var(--text-muted)',
                      borderRadius: '3px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    P{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Attention Rollout Heatmap:</div>
              <MatrixView matrix={patchAttention} cellSize={36} minValue={0} maxValue={1} />
            </div>
          </div>

          <MathBlock math={`\\mathbf{z}_0 = [\\mathbf{x}_{\\text{class}}; \\mathbf{x}_p^1 \\mathbf{E}; \\dots; \\mathbf{x}_p^N \\mathbf{E}] + \\mathbf{E}_{\\text{pos}} \\quad (\\mathbf{E} \\in \\mathbb{R}^{(P^2 \\cdot C) \\times D})`} />
        </div>

        <ControlPanel title="ViT Patch Selection" onReset={() => setSelectedPatch(4)}>
          <Slider
            label="Selected Query Patch"
            value={selectedPatch}
            min={0}
            max={15}
            step={1}
            onChange={setSelectedPatch}
            formatValue={(v) => `Patch #${v + 1}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
