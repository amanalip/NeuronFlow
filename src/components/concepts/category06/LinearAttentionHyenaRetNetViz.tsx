import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { simulateLinearAttentionComplexity } from './category06Math';
import { LossCurve, LossDataPoint } from '../../viz/charts/LossCurve';
import styles from '../category01/Category01.module.css';

// 74. Linear Attention & Matrix Associativity
export const LinearAttentionViz: React.FC = () => {
  const [dModel, setDModel] = useState(64);

  const seqLens = [128, 256, 512, 1024, 2048, 4096];
  const curveData: LossDataPoint[] = seqLens.map((n) => {
    const { quadraticFlops, linearFlops } = simulateLinearAttentionComplexity(n, dModel);
    return {
      step: n,
      trainLoss: quadraticFlops / 1000000,
      valLoss: linearFlops / 1000000,
    };
  });

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Quadratic vs Linear Attention Complexity</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              d_model = {dModel}
            </span>
          </div>

          <LossCurve
            data={curveData}
            title="Computational FLOPs (Millions) vs Sequence Length N"
            xLabel="Sequence Length (N)"
            yLabel="MFLOPs"
          />

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Blue curve (Quadratic Attention O(N² · d)): Escalates rapidly with long prompts.<br />
              Orange dashed curve (Linear Attention O(N · d²)): Scales strictly linearly with sequence length N via kernel feature maps.
            </p>
          </div>

          <MathBlock math={`(QK^T)V \\in \\mathbb{R}^{N \\times N} \\times \\mathbb{R}^{N \\times d} \\quad \\longrightarrow \\quad Q(K^T V) \\in \\mathbb{R}^{N \\times d} \\times \\mathbb{R}^{d \\times d}`} />
        </div>

        <ControlPanel title="Dimension Settings" onReset={() => setDModel(64)}>
          <Slider
            label="Head Dimension (d)"
            value={dModel}
            min={32}
            max={256}
            step={32}
            onChange={setDModel}
            formatValue={(v) => `d = ${v}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 75. Hyena Hierarchy
export const HyenaViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Hyena Long Implicit Convolutions (Poli et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              O(N log N) via Fast Fourier Transforms
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--accent-color)' }}>Implicit Filter Parameterization:</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Hyena completely eliminates attention dot products by parameterizing sub-quadratic long convolution filters with small feed-forward MLPs modulated by gating projections.
            </p>
          </div>

          <MathBlock math={`y = h_N \\star (v_N \\odot (h_{N-1} \\star (v_{N-1} \\odot \\dots (h_1 \\star v_1))))`} />
        </div>

        <ControlPanel title="Hyena Architecture" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Enables context scaling to millions of tokens by executing entire sequence convolutions in frequency domain via FFT.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 76. RetNet (Retentive Network)
export const RetNetViz: React.FC = () => {
  const [paradigm, setParadigm] = useState<'parallel' | 'recurrent' | 'chunkwise'>('parallel');

  const descriptions = {
    parallel: 'Parallel Mode (Training): Computes full sequence retaining attention-like training throughput using decay mask matrix.',
    recurrent: 'Recurrent Mode (Inference): Runs O(1) state recurrence for zero-overhead token generation with constant memory.',
    chunkwise: 'Chunkwise Mode (Long Context): Splits long sequences into local chunks with cross-chunk recurrence.',
  };

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Retentive Network: Three Computation Paradigms</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Mode: {paradigm.toUpperCase()}
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{descriptions[paradigm]}</p>
          </div>

          <MathBlock math={`\\text{Retention}(X) = \\left( Q K^T \\odot D \\right) V, \\quad D_{ij} = \\begin{cases} \\gamma^{i-j} & \\text{if } i \\ge j \\\\ 0 & \\text{if } i < j \\end{cases}`} />
        </div>

        <ControlPanel title="Retention Modes" onReset={() => setParadigm('parallel')}>
          <RadioGroup
            label="Execution Paradigm"
            value={paradigm}
            options={[
              { value: 'parallel', label: 'Parallel (Training)' },
              { value: 'recurrent', label: 'Recurrent (Inference)' },
              { value: 'chunkwise', label: 'Chunkwise (Long Context)' },
            ]}
            onChange={(v) => setParadigm(v as 'parallel' | 'recurrent' | 'chunkwise')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
