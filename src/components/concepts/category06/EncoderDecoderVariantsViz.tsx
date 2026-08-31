import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { MatrixView } from '../../viz/matrix/MatrixView';
import styles from '../category01/Category01.module.css';

// 66. Encoder-Only (BERT / RoBERTa)
export const EncoderOnlyViz: React.FC = () => {
  const tokens = ['[CLS]', 'The', 'movie', 'was', 'great', '[SEP]'];
  const fullAttentionMatrix = Array.from({ length: 6 }, () =>
    Array.from({ length: 6 }, () => 1.0)
  );

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Encoder-Only Bidirectional Attention (BERT)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              All-to-All Full Visibility Matrix
            </span>
          </div>

          <MatrixView
            matrix={fullAttentionMatrix}
            title="Bidirectional Mask (Every token attends to all tokens)"
            cellSize={36}
            minValue={0}
            maxValue={1}
          />

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
            {tokens.map((t, idx) => (
              <span key={idx} style={{ padding: '4px 8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                {t}
              </span>
            ))}
          </div>

          <MathBlock math={`M_{ij} = 0 \\quad \\forall i, j \\in [1, N] \\quad (\\text{Bidirectional Contextual Embeddings})`} />
        </div>

        <ControlPanel title="BERT Properties" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Best for classification, semantic search, sentiment analysis, and named entity recognition where full sequence context is available simultaneously.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 67. Decoder-Only (GPT / LLaMA / Mistral)
export const DecoderOnlyViz: React.FC = () => {
  const tokens = ['The', 'neural', 'network', 'generates', 'text'];
  const causalMatrix = [
    [1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Decoder-Only Causal Autoregression (GPT / LLaMA)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              Lower-Triangular Causal Mask
            </span>
          </div>

          <MatrixView
            matrix={causalMatrix}
            title="Causal Mask (Future tokens blocked from attending)"
            cellSize={38}
            minValue={0}
            maxValue={1}
          />

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
            {tokens.map((t, idx) => (
              <span key={idx} style={{ padding: '4px 8px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                {t}
              </span>
            ))}
          </div>

          <MathBlock math={`P(x_1, \\dots, x_T) = \\prod_{t=1}^T P(x_t \\mid x_1, \\dots, x_{t-1})`} />
        </div>

        <ControlPanel title="Why Decoder-Only Won" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Unified training objective (next-token prediction), zero-shot emergent capabilities, and seamless autoregressive KV caching made decoder-only the universal LLM foundation.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 68. Encoder-Decoder (T5 / BART)
export const EncoderDecoderArchitectureViz: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<'translation' | 'summarization'>('translation');

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Encoder-Decoder Pipeline (T5 / BART)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {selectedTask === 'translation' ? 'Neural Machine Translation' : 'Abstractive Summarization'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '6px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.82rem' }}>Bidirectional Encoder</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Processes entire input prompt bidirectionally without causal masking.</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.82rem' }}>Autoregressive Decoder</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Generates output token-by-token with cross-attention to encoder hidden states.</div>
            </div>
          </div>

          <MathBlock math={`\\text{Output} = \\operatorname{Decoder}(y_{<t}, \\operatorname{Encoder}(x_{1:N}))`} />
        </div>

        <ControlPanel title="Seq2Seq Tasks" onReset={() => setSelectedTask('translation')}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setSelectedTask('translation')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: selectedTask === 'translation' ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                color: selectedTask === 'translation' ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
              }}
            >
              Translation
            </button>
            <button
              type="button"
              onClick={() => setSelectedTask('summarization')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: selectedTask === 'summarization' ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                color: selectedTask === 'summarization' ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
              }}
            >
              Summarization
            </button>
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};
