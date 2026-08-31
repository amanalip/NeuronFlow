import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeDiffusionForwardStep } from './category12Math';
import styles from '../category01/Category01.module.css';

// 144. Vision Transformer (ViT)
export const VitViz: React.FC = () => {
  const [patchSize, setPatchSize] = useState<16 | 32>(16);
  const imageDim = 224;
  const numPatches = (imageDim / patchSize) ** 2;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Vision Transformer Patch Projection (ViT)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {imageDim}x{imageDim} Input Image: {numPatches} Visual Tokens
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Patch Dimension (PxP)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-color)', margin: '4px 0' }}>{patchSize}x{patchSize} px</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Flattened dim: {patchSize * patchSize * 3}</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Token Sequence Length (N)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{numPatches} + 1 [CLS]</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>N = (H * W) / P^2</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Embedding Dimension</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>d_model = 768</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Standard Transformer Encoder</div>
            </div>
          </div>

          <MathBlock math={`\\mathbf{z}_0 = [\\mathbf{x}_{\\text{class}}; \\, \\mathbf{x}_p^1 \\mathbf{E}; \\, \\mathbf{x}_p^2 \\mathbf{E}; \\, \\dots; \\, \\mathbf{x}_p^N \\mathbf{E}] + \\mathbf{E}_{\\text{pos}}, \\quad \\mathbf{E} \\in \\mathbb{R}^{(P^2 \\cdot C) \\times D}`} />
        </div>

        <ControlPanel title="ViT Configuration" onReset={() => setPatchSize(16)}>
          <RadioGroup
            label="Patch Size (P)"
            value={patchSize.toString()}
            options={[
              { value: '16', label: '16x16 Patches (196 Tokens, Higher Resolution)' },
              { value: '32', label: '32x32 Patches (49 Tokens, Fast Compute)' },
            ]}
            onChange={(v) => setPatchSize(parseInt(v, 10) as 16 | 32)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 145. Multimodal (Text + Image)
export const MultimodalTextImageViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Vision-Language Architecture (LLaVA / CLIP Cross-Modality Projection)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Projecting Visual Embeddings into Text Vocabulary Space
            </span>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '10px 0' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              1. <strong>Vision Encoder (CLIP ViT-L/14):</strong> Image is transformed into a grid of visual tokens (e.g. 576 tokens of dim 1024).<br />
              2. <strong>Modality Projection (2-Layer MLP):</strong> Maps visual tokens matching language model hidden dimension (e.g. 4096).<br />
              3. <strong>Autoregressive LLM:</strong> Visual tokens and prompt text tokens are concatenated into a single unified sequence.
            </div>
          </div>

          <MathBlock math={`\\mathbf{H}_{\\text{input}} = [\\operatorname{MLP}_{\\text{proj}}(\\operatorname{ViT}(\\text{Image})); \\; \\operatorname{Embed}(\\text{Prompt Tokens})]`} />
        </div>

        <ControlPanel title="Multimodal Pipeline" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            The cross-modality projection MLP aligns continuous image embeddings with discrete textual token spaces.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 146. Multimodal (Text + Audio)
export const MultimodalTextAudioViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Audio Feature Extraction & Transcription (Whisper Architecture)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Log-Mel Spectrogram to 1D Convolutional Stem to Seq2Seq
            </span>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '10px 0' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              1. <strong>Acoustic Front-End:</strong> Converts 16 kHz audio into an 80-channel log-magnitude Mel spectrogram with 25ms windows and 10ms hop size.<br />
              2. <strong>Convolutional Subsampling:</strong> 2 convolutional layers with filter width 3 and stride 2 reduce time resolution by 2x.<br />
              3. <strong>Encoder-Decoder Transformer:</strong> Bidirectional encoder processes acoustic features; autoregressive decoder emits transcript tokens.
            </div>
          </div>

          <MathBlock math={`X_{\\text{mel}} \\in \\mathbb{R}^{80 \\times T} \\xrightarrow{\\operatorname{Conv1D}(\\text{stride}=2)} Z_{\\text{audio}} \\in \\mathbb{R}^{d_{\\text{model}} \\times \\frac{T}{2}} \\xrightarrow{\\text{Encoder}} H_{\\text{audio}} \\xrightarrow{\\text{Decoder}} \\text{Text Tokens}`} />
        </div>

        <ControlPanel title="Audio Front-End" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Spectrogram convolution stems reduce sequence length before feeding audio features into attention layers.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 147. Diffusion Models (Conceptual)
export const DiffusionModelsViz: React.FC = () => {
  const [stepT, setStepT] = useState<number>(300);
  const totalSteps = 1000;
  const x0 = 2.0;

  const { alphaBar, mean, variance, noisyValue } = computeDiffusionForwardStep(x0, stepT, totalSteps);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Diffusion Forward Noise Schedule (DDPM)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Step t = {stepT} / {totalSteps}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Signal Retention</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>{(alphaBar * 100).toFixed(1)}%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Mean: {mean.toFixed(2)}</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Noise Variance</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ef4444', margin: '4px 0' }}>{(variance * 100).toFixed(1)}%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Added Gaussian noise</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Noisy Sample (xt)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{noisyValue.toFixed(2)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Target x0 = 2.00</div>
            </div>
          </div>

          <MathBlock math={`q(x_t \\mid x_0) = \\mathcal{N}\\left(x_t; \\, \\sqrt{\\bar{\\alpha}_t} x_0, \\, (1 - \\bar{\\alpha}_t) \\mathbf{I}\\right), \\quad x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\, \\epsilon`} />
        </div>

        <ControlPanel title="Diffusion Timestep" onReset={() => setStepT(300)}>
          <Slider
            label="Forward Step (t)"
            value={stepT}
            min={0}
            max={totalSteps}
            step={25}
            onChange={setStepT}
            formatValue={(v) => `t = ${v} / ${totalSteps}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
