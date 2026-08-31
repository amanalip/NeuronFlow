import React, { useState } from 'react';
import { TextInput } from '../../controls/TextInput';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 29. Unigram Tokenizer (SentencePiece)
export const UnigramTokenizerViz: React.FC = () => {
  const [text, setText] = useState('unhappiness');

  // Candidate segmentations with log probabilities
  const candidates = [
    { seg: ['un', 'happiness'], score: -2.1, best: true },
    { seg: ['un', 'happi', 'ness'], score: -2.8, best: false },
    { seg: ['u', 'n', 'happiness'], score: -4.5, best: false },
    { seg: ['unhappy', 'ness'], score: -3.2, best: false },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Viterbi Lattice Segmentation</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Input: "{text}"
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {candidates.map((cand, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'var(--bg-primary)',
                  border: cand.best ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', gap: '6px' }}>
                  {cand.seg.map((piece, pIdx) => (
                    <span key={pIdx} style={{ padding: '2px 8px', background: 'var(--bg-secondary)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      "{piece}"
                    </span>
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: cand.best ? 'var(--accent-color)' : 'var(--text-muted)' }}>
                  log P = {cand.score.toFixed(1)} {cand.best ? '★ Best' : ''}
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\mathbf{x}^* = \\operatorname{argmax}_{\\mathbf{x} \\in S(X)} \\sum_{i=1}^{|\\mathbf{x}|} \\log P(x_i)`} />
        </div>

        <ControlPanel title="Unigram Inputs" onReset={() => setText('unhappiness')}>
          <TextInput label="Input String" value={text} onChange={setText} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 30. Byte-Level BPE
export const ByteLevelBpeViz: React.FC = () => {
  const [text, setText] = useState('AI 🚀');

  const encoder = new TextEncoder();
  const bytes = Array.from(encoder.encode(text));

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>UTF-8 Byte Sequence Breakdown</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {bytes.length} Raw Bytes (256 Base Alphabet)
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {bytes.map((b, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>0x{b.toString(16).toUpperCase()}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-color)' }}>{b}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Byte-level BPE (GPT-2/GPT-4) tokenizes raw UTF-8 bytes instead of Unicode characters. Every character, script, and emoji is deterministically tokenizable with zero out-of-vocabulary fallback tokens.
          </p>

          <MathBlock math={`\\text{Base Vocab} = \\{0, 1, 2, \\dots, 255\\} \\quad \\implies \\quad |V_{\\text{base}}| = 256`} />
        </div>

        <ControlPanel title="Byte Encoder" onReset={() => setText('AI 🚀')}>
          <TextInput label="Input String (Try Emojis & Symbols)" value={text} onChange={setText} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 31. SentencePiece
export const SentencePieceViz: React.FC = () => {
  const [text, setText] = useState('New York City');

  // Replace whitespace with SentencePiece meta-symbol U+2581 (_)
  const normalized = ` ${text.replace(/\s+/g, ' ')}`;
  const pieces = [' New', ' York', ' City'];
  const detokenized = pieces.join('').replace(/ /g, ' ').trim();

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>SentencePiece Reversible Tokenization</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              Lossless Round-Trip
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Whitespace Meta-Symbol Replacement:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent-color)', marginTop: '4px' }}>
                "{normalized}"
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tokenized Pieces:</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                {pieces.map((p, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                    "{p}"
                  </span>
                ))}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Reconstructed Output:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: '#10b981', marginTop: '4px' }}>
                "{detokenized}" {detokenized === text ? '(Exact Match ✓)' : ''}
              </div>
            </div>
          </div>

          <MathBlock math={`\\text{Detokenize}(\\text{Tokenize}(\\text{Text})) \\equiv \\text{Text}`} />
        </div>

        <ControlPanel title="SentencePiece Inputs" onReset={() => setText('New York City')}>
          <TextInput label="Input String" value={text} onChange={setText} />
        </ControlPanel>
      </div>
    </div>
  );
};
