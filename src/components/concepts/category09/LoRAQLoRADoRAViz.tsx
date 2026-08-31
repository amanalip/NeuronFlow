import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { calculateLoraParameters } from './category09Math';
import styles from '../category01/Category01.module.css';

// 103. LoRA (Low-Rank Adaptation)
export const LoRAViz: React.FC = () => {
  const [rank, setRank] = useState(8);
  const [alpha, setAlpha] = useState(16);
  const dModel = 4096;

  const { originalParams, loraParams, reductionRatio } = calculateLoraParameters(dModel, dModel, rank);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>LoRA Matrix Factorization (W = W_0 + (α/r)·B·A)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Rank r = {rank} ({reductionRatio.toFixed(2)}% Parameter Reduction)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Frozen Base Matrix W_0</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0' }}>{(originalParams / 1e6).toFixed(1)}M Params</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>4x (4096 x 4096) Frozen</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '2px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>Trainable Adapters (B · A) ★</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>{(loraParams / 1e6).toFixed(3)}M Params</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success-color)' }}>Scale factor: {(alpha / rank).toFixed(2)}x</div>
            </div>
          </div>

          <MathBlock math={`h = W_0 x + \\Delta W x = W_0 x + \\frac{\\alpha}{r} B A x \\quad (A \\in \\mathbb{R}^{r \\times d}, B \\in \\mathbb{R}^{d \\times r})`} />
        </div>

        <ControlPanel title="LoRA Hyperparameters" onReset={() => { setRank(8); setAlpha(16); }}>
          <Slider label="Adapter Rank (r)" value={rank} min={1} max={64} step={1} onChange={setRank} formatValue={(v) => `r = ${v}`} />
          <Slider label="LoRA Alpha (α)" value={alpha} min={1} max={64} step={1} onChange={setAlpha} formatValue={(v) => `α = ${v}`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 104. QLoRA (Quantized LoRA)
export const QLoRAViz: React.FC = () => {
  const innovations = [
    { name: 'NormalFloat4 (NF4)', desc: 'Information-theoretically optimal 4-bit quantile quantization for normally distributed base weights.' },
    { name: 'Double Quantization (DQ)', desc: 'Quantizes the 32-bit quantization constants themselves down to 8-bit, saving 0.37 bits per parameter.' },
    { name: 'Paged Optimizers', desc: 'Uses CUDA Unified Memory to automatically page optimizer states to CPU RAM during memory spikes.' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>QLoRA: 4-bit Quantized Base + 16-bit LoRA Adapters</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              Fine-tune 65B LLMs on a Single 48GB GPU
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {innovations.map((inv, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--accent-color)' }}>{inv.name}</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{inv.desc}</p>
              </div>
            ))}
          </div>

          <MathBlock math={`W^{\\text{Dequantized}} = \\text{dequantize}(c_1, c_2, W^{\\text{NF4}}) + \\frac{\\alpha}{r} B A`} />
        </div>

        <ControlPanel title="QLoRA Summary" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            QLoRA matches 16-bit Full Fine-Tuning benchmark performance while reducing GPU memory requirements by over 65%.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 105. DoRA (Weight-Decomposed LoRA)
export const DoRAViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>DoRA: Magnitude & Direction Decomposition (Liu et al., 2024)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Decomposed Weight Representation
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.84rem' }}>Magnitude Vector (m)</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Learns column-wise norm scaling vector m ∈ ℝ^(1 x d) separately from orientation.
              </p>
            </div>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-color)', fontSize: '0.84rem' }}>Directional Matrix (V + ΔV)</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Updates normalized direction matrix using low-rank BA adapter update.
              </p>
            </div>
          </div>

          <MathBlock math={`W = m \\frac{V + \\Delta V}{\\|V + \\Delta V\\|_c} = m \\frac{W_0 + B A}{\\|W_0 + B A\\|_c}`} />
        </div>

        <ControlPanel title="DoRA Benefits" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            DoRA closely mirrors the learning behavior of Full Fine-Tuning by decoupling weight magnitude changes from directional updates.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
