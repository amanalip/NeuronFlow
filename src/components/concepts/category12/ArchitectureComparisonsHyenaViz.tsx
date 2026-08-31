import React from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 148. Encoder-Decoder vs Decoder-Only
export const EncoderDecoderVsDecoderOnlyViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Encoder-Decoder vs Decoder-Only Structural Comparison</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Bidirectional Representation vs Causal Unified Next-Token Prediction
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.84rem' }}>Encoder-Decoder (T5, BART)</div>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Encoder uses full bidirectional attention mask</li>
                <li>Decoder uses causal mask + cross-attention into encoder hidden states</li>
                <li>Excels at translation and conditioned summarization</li>
                <li>Requires managing two distinct model stacks and KV states</li>
              </ul>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-color)', fontSize: '0.84rem' }}>Decoder-Only (LLaMA, GPT-4, Mistral) ★</div>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Unified autoregressive lower-triangular causal attention mask</li>
                <li>No cross-attention layers needed (cleaner architecture)</li>
                <li>Naturally supports few-shot in-context learning and zero-shot reasoning</li>
                <li>Dominates modern foundation model deployments</li>
              </ul>
            </div>
          </div>

          <MathBlock math={`\\text{Causal Mask: } M_{ij} = \\begin{cases} 0 & \\text{if } j \\le i \\\\ -\\infty & \\text{if } j > i \\end{cases}, \\quad \\text{Bidirectional Mask: } M_{ij} = 0 \\; \\forall i, j`} />
        </div>

        <ControlPanel title="Architecture Paradigm" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Decoder-only models unify pre-training and open-ended generation into a single causal autoregressive pipeline.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 149. GPT vs BERT vs T5
export const GptVsBertVsT5Viz: React.FC = () => {
  const models = [
    { name: 'GPT Family (OpenAI)', type: 'Decoder-Only', objective: 'Causal Language Modeling (CLM)', attention: 'Causal (Auto-regressive)', bestFor: 'Text Generation, Chat, Code, Reasoning' },
    { name: 'BERT Family (Google)', type: 'Encoder-Only', objective: 'Masked Language Modeling (MLM) + NSP', attention: 'Bidirectional (Full)', bestFor: 'Classification, Extraction, Embeddings' },
    { name: 'T5 / Flan (Google)', type: 'Encoder-Decoder', objective: 'Span Corruption (Text-to-Text)', attention: 'Bidirectional Enc + Causal Dec', bestFor: 'Translation, Abstractive Summarization' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Foundational Landmark Architectures (GPT vs BERT vs T5)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              The Three Core Branches of Transformer Evolution
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            {models.map((m, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '0.85rem' }}>{m.name}</span>
                  <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{m.type}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <div><strong>Pre-training Objective:</strong> {m.objective}</div>
                  <div><strong>Attention Mask:</strong> {m.attention}</div>
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\mathcal{L}_{\\text{CLM}} = -\\sum_{t} \\log P(x_t \\mid x_{<t}), \\quad \\mathcal{L}_{\\text{MLM}} = -\\sum_{i \\in \\text{masked}} \\log P(x_i \\mid x_{\\backslash i})`} />
        </div>

        <ControlPanel title="Architectural Archetypes" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            These three paradigms formed the foundation for all modern transformer applications.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 150. Retrieval-Augmented Model Architectures (RETRO)
export const RetrievalAugmentedModelsViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>RETRO: In-Architecture Retrieval Cross-Attention (Borgeaud et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Decoupling Knowledge Storage from Model Parameter Scale
            </span>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '14px 0' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              1. <strong>Input Chunking:</strong> Input sequence is split into 64-token chunks $C_u$.<br />
              2. <strong>Dense Vector Retrieval:</strong> Each chunk queries a trillion-token retrieval database for $k$ nearest neighbor passages $N(C_u)$.<br />
              3. <strong>Chunked Cross-Attention (CCA):</strong> Intermediate transformer layers attend across both causal prompt tokens and encoded retrieval representations.
            </div>
          </div>

          <MathBlock math={`\\operatorname{CCA}(H, E) = \\operatorname{Softmax}\\left(\\frac{Q(H) K(E)^T}{\\sqrt{d_k}}\\right) V(E), \\quad E = \\operatorname{Encoder}(\\operatorname{Neighbors}(C_u))`} />
        </div>

        <ControlPanel title="In-Model Retrieval" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Retrieval-augmented architectures achieve accuracy comparable to 10x larger models with lower parameter counts.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 151. Hyena / Convolution-Based Models
export const HyenaViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Hyena Hierarchy: Long Parameterized Convolutions (Poli et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Sub-Quadratic O(N log N) Fast Fourier Transform (FFT) Processing
            </span>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '14px 0' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Hyena replaces attention matrices with long convolutional filters parameterized implicitly via small feed-forward networks (MLPs). The convolution is evaluated in the frequency domain using the Fast Fourier Transform (FFT), reducing sequence complexity from $O(N^2)$ to $O(N \\log N)$.
            </p>
          </div>

          <MathBlock math={`y = u \\circledast h = \\mathcal{F}^{-1}\\left(\\mathcal{F}(u) \\odot \\mathcal{F}(h)\\right), \\quad h(t) = \\operatorname{MLP}(t) \\cdot \\operatorname{Window}(t)`} />
        </div>

        <ControlPanel title="Hyena Convolution" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            FFT-based long convolutions eliminate attention quadratic memory bottlenecks while maintaining global context.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
