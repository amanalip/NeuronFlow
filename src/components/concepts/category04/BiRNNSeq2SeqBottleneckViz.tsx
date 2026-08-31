import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { LossCurve, LossDataPoint } from '../../viz/charts/LossCurve';
import styles from '../category01/Category01.module.css';

// 42. Bidirectional RNNs
export const BidirectionalRnnViz: React.FC = () => {
  const [selectedWordIdx, setSelectedWordIdx] = useState(2);
  const words = ['the', 'bank', 'of', 'the', 'river'];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Bidirectional Context Concatenation</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Word: "{words[selectedWordIdx]}"
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {words.map((w, idx) => {
              const isSelected = idx === selectedWordIdx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedWordIdx(idx)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'var(--accent-muted)' : 'var(--bg-secondary)',
                    border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>→ h_{idx + 1}^f</span>
                  <span style={{ fontWeight: 600, fontSize: '0.86rem', color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)' }}>{w}</span>
                  <span style={{ fontSize: '0.72rem', color: '#f59e0b' }}>← h_{idx + 1}^b</span>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Representation of "<strong>{words[selectedWordIdx]}</strong>" combines left context (up to token {selectedWordIdx + 1}) and right context (from token {selectedWordIdx + 1} to end). Resolves lexical ambiguity like financial vs river "bank".
            </p>
          </div>

          <MathBlock math={`h_t = \\begin{bmatrix} \\vec{h}_t^{\\to} \\\\ \\vec{h}_t^{\\leftarrow} \\end{bmatrix} \\quad (\\text{Dimension: } 2 \\times d)`} />
        </div>

        <ControlPanel title="Word Selection" onReset={() => setSelectedWordIdx(2)}>
          <Slider label="Target Token Position" value={selectedWordIdx} min={0} max={words.length - 1} step={1} onChange={setSelectedWordIdx} formatValue={(v) => `Token #${v + 1} ("${words[v]}")`} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 43. Seq2Seq Architecture
export const Seq2SeqArchitectureViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Encoder-Decoder Translation Pipeline</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Fixed Context Bottleneck: c
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px', background: 'var(--bg-primary)', borderRadius: '6px', gap: '8px', flexWrap: 'wrap' }}>
            {/* Encoder */}
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center', flex: 1, minWidth: '120px' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.85rem' }}>Encoder RNN</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>"le chat dort"</div>
            </div>

            {/* Bottleneck context vector */}
            <div style={{ padding: '10px 14px', background: 'var(--accent-muted)', border: '2px solid var(--accent-color)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '0.82rem' }}>Context Vector (c)</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>h_T compressed</div>
            </div>

            {/* Decoder */}
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', textAlign: 'center', flex: 1, minWidth: '120px' }}>
              <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.85rem' }}>Decoder RNN</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>"the cat sleeps"</div>
            </div>
          </div>

          <MathBlock math={`c = q(h_1, \\dots, h_{T_x}) = h_{T_x}, \\quad P(y_t \\mid y_{<t}, c) = g(y_{t-1}, s_t, c)`} />
        </div>

        <ControlPanel title="Architecture Summary" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            The standard Seq2Seq architecture forces all semantic meaning of an arbitrary-length source sentence through a single fixed-size vector c.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 44. Information Bottleneck
export const InformationBottleneckViz: React.FC = () => {
  const curveData: LossDataPoint[] = [
    { step: 5, trainLoss: 38, valLoss: 38 },
    { step: 10, trainLoss: 36, valLoss: 37 },
    { step: 15, trainLoss: 34, valLoss: 36 },
    { step: 20, trainLoss: 28, valLoss: 35 },
    { step: 30, trainLoss: 18, valLoss: 34 },
    { step: 40, trainLoss: 12, valLoss: 33 },
    { step: 50, trainLoss: 7, valLoss: 32 },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Sentence Length vs BLEU Translation Quality</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--error-color)' }}>
              Steep Drop Beyond 15-20 Words
            </span>
          </div>

          <LossCurve
            data={curveData}
            title="Translation BLEU Score vs Sentence Length"
            xLabel="Sentence Length (Words)"
            yLabel="BLEU Score"
          />

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Blue curve (Without Attention): BLEU crashes past 20 words due to the context compression bottleneck.<br />
              Orange dashed curve (With Attention): Retains high BLEU score irrespective of sentence length.
            </p>
          </div>

          <MathBlock math={`\\lim_{T \\to \\infty} I(X; c) \\ll H(X) \\quad (\\text{Capacity Collapse})`} />
        </div>

        <ControlPanel title="Bottleneck Theory" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            The information bottleneck was the primary catalyst for inventing the Attention Mechanism (Bahdanau et al., 2014).
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
