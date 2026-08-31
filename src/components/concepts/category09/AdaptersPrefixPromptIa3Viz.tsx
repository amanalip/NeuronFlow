import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 106. Bottleneck Adapters (Houlsby / Pfeiffer)
export const AdaptersViz: React.FC = () => {
  const [bottleneckDim, setBottleneckDim] = useState(64);
  const dModel = 4096;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Bottleneck Adapter Sublayer (Houlsby / Pfeiffer)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Bottleneck: {bottleneckDim} (d_model = {dModel})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Input (d_model)</div>
              <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{dModel}</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--accent-muted)', border: '2px solid var(--accent-color)', borderRadius: '6px', textAlign: 'center', flex: 1.2 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-color)' }}>Down-Project + Non-Linearity + Up-Project</div>
              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--accent-color)' }}>{bottleneckDim} Bottleneck</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Output + Residual</div>
              <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{dModel}</div>
            </div>
          </div>

          <MathBlock math={`\\text{Adapter}(h) = \\sigma(h W_{\\text{down}}) W_{\\text{up}} + h \\quad (W_{\\text{down}} \\in \\mathbb{R}^{d \\times m}, W_{\\text{up}} \\in \\mathbb{R}^{m \\times d})`} />
        </div>

        <ControlPanel title="Adapter Dimension" onReset={() => setBottleneckDim(64)}>
          <Slider
            label="Bottleneck Dimension (m)"
            value={bottleneckDim}
            min={16}
            max={256}
            step={16}
            onChange={setBottleneckDim}
            formatValue={(v) => `m = ${v}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 107. Prefix Tuning (Li & Liang)
export const PrefixTuningViz: React.FC = () => {
  const [prefixLen, setPrefixLen] = useState(20);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Prefix Tuning: Virtual Key/Value Prefixes across Layers</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Prefix Length: {prefixLen} Virtual Tokens
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ padding: '8px 12px', background: 'var(--accent-muted)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem' }}>
                [P_K ; P_V] ({prefixLen} Virtual Tokens)
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem' }}>
                [K ; V] (Real Sequence Tokens)
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Prepends learnable continuous vectors P_K and P_V to the Keys and Values at every multi-head attention layer.
            </p>
          </div>

          <MathBlock math={`K_{\\text{new}} = [P_K; K], \\quad V_{\\text{new}} = [P_V; V] \\quad (\\text{Prepended to every transformer layer})`} />
        </div>

        <ControlPanel title="Prefix Hyperparameters" onReset={() => setPrefixLen(20)}>
          <Slider label="Virtual Prefix Length" value={prefixLen} min={5} max={50} step={5} onChange={setPrefixLen} formatValue={(v) => `${v} tokens`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 108. Prompt Tuning (Lester et al.)
export const PromptTuningViz: React.FC = () => {
  const [softPromptLen, setSoftPromptLen] = useState(16);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Prompt Tuning: Input Layer Soft Prompts</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {softPromptLen} Soft Tokens (Input Layer Only)
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ padding: '8px 12px', background: 'var(--accent-muted)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem' }}>
                Soft Prompt P ({softPromptLen} tokens)
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem' }}>
                Input Text Embeddings E
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Unlike Prefix Tuning which alters all layers, Prompt Tuning only prepends learnable embedding vectors P at the input vocabulary layer.
            </p>
          </div>

          <MathBlock math={`X_{\\text{embedded}} = [P; \\operatorname{Embed}(x_1, \\dots, x_N)] \\quad (P \\in \\mathbb{R}^{l \\times d_{\\text{model}}})`} />
        </div>

        <ControlPanel title="Soft Prompt Length" onReset={() => setSoftPromptLen(16)}>
          <Slider label="Virtual Prompt Length" value={softPromptLen} min={5} max={50} step={5} onChange={setSoftPromptLen} formatValue={(v) => `${v} tokens`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 109. (IA)^3 (Infused Adapter by Inhibiting and Amplifying Inner Activations)
export const Ia3Viz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>(IA)³ Element-wise Scaling Vectors (Liu et al., 2022)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              &lt; 0.01% Trainable Parameters (Extreme Efficiency)
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Instead of learning low-rank matrix multiplications, (IA)³ learns simple learned scaling vectors <strong>l_k, l_v, l_ff</strong> that element-wise scale activations.
            </p>
          </div>

          <MathBlock math={`K = l_k \\odot (X W_K), \\quad V = l_v \\odot (X W_V), \\quad \\text{FFN}(x) = l_{ff} \\odot \\gamma(x W_1) W_2`} />
        </div>

        <ControlPanel title="(IA)³ Properties" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            (IA)³ introduces zero extra matrix operations at inference time because scaling vectors can be permanently folded into existing weights.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
