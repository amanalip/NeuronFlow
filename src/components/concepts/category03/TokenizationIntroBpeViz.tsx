import React, { useState } from 'react';
import { TextInput } from '../../controls/TextInput';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { ButtonGroup } from '../../controls/ButtonGroup';
import { MathBlock } from '../../math/MathBlock';
import { simulateBpeMerges } from './category03Math';
import styles from '../category01/Category01.module.css';

// 26. Tokenization Intro: Character vs Word vs Subword
export const TokenizationIntroViz: React.FC = () => {
  const [text, setText] = useState('unhappiness and transformers');

  // Character tokens
  const charTokens = text.split('');

  // Word tokens
  const wordTokens = text.trim().split(/\s+/).filter(Boolean);

  // Subword tokens (heuristic mockup)
  const subwordTokens = ['un', 'happi', 'ness', ' ', 'and', ' ', 'transform', 'ers'];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Tokenization Paradigms Comparison</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Input: "{text}"
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Word-level */}
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong>Word-Level ({wordTokens.length} tokens)</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Vocab: &gt;100k words (High OOV risk)</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {wordTokens.map((t, idx) => (
                  <span key={idx} style={{ padding: '4px 8px', background: '#38bdf8', color: '#0f172a', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                    "{t}"
                  </span>
                ))}
              </div>
            </div>

            {/* Subword-level */}
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--accent-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ color: 'var(--accent-color)' }}>Subword-Level ({subwordTokens.length} tokens) ★ Standard</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Vocab: ~32k-100k (Zero OOV)</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {subwordTokens.map((t, idx) => (
                  <span key={idx} style={{ padding: '4px 8px', background: 'var(--accent-muted)', color: 'var(--accent-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                    "{t}"
                  </span>
                ))}
              </div>
            </div>

            {/* Character-level */}
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong>Character-Level ({charTokens.length} tokens)</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Vocab: ~256 chars (Long sequences)</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {charTokens.map((t, idx) => (
                  <span key={idx} style={{ padding: '2px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    {t === ' ' ? '␣' : t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <MathBlock math={`\\text{Length: } L_{\\text{char}} > L_{\\text{subword}} > L_{\\text{word}} \\quad \\Longleftrightarrow \\quad \\text{Vocab: } |V_{\\text{char}}| < |V_{\\text{subword}}| < |V_{\\text{word}}|`} />
        </div>

        <ControlPanel title="Text Input" onReset={() => setText('unhappiness and transformers')}>
          <TextInput label="Input String" value={text} onChange={setText} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 27. Byte-Pair Encoding (BPE)
export const BpeViz: React.FC = () => {
  const [numMerges, setNumMerges] = useState(4);

  const initialCorpus = {
    low: 5,
    lower: 2,
    newest: 6,
    widest: 3,
  };

  const { merges, vocabulary } = simulateBpeMerges(initialCorpus, numMerges);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>BPE Merge Training Steps</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Vocab Size: {vocabulary.length} tokens
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Learned Merge Rules:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {merges.map((m, idx) => (
                <div key={idx} style={{ padding: '6px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  #{idx + 1}: ('{m.pair[0]}', '{m.pair[1]}') → <strong>'{m.merged}'</strong> (freq: {m.count})
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current Vocabulary Tokens:</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              {vocabulary.map((v) => `'${v}'`).join(', ')}
            </div>
          </div>

          <ButtonGroup
            actions={[
              { label: 'Step Merge', onClick: () => setNumMerges((m) => Math.min(8, m + 1)), disabled: numMerges >= 8 },
              { label: 'Reset Rules', onClick: () => setNumMerges(1) },
            ]}
          />

          <MathBlock math={`\\text{Merge Criterion: } \\operatorname{argmax}_{(u, v)} \\text{Count}(u, v)`} />
        </div>

        <ControlPanel title="Merge Steps" onReset={() => setNumMerges(4)}>
          <Slider label="Number of Merges" value={numMerges} min={1} max={8} step={1} onChange={setNumMerges} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 28. WordPiece
export const WordPieceViz: React.FC = () => {
  const [word, setWord] = useState('unbreakable');

  // WordPiece splits with ## prefix
  const pieces = ['un', '##break', '##able'];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>WordPiece Subword Prefixing (BERT)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Continuation Prefix: ##
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {pieces.map((p, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  background: idx === 0 ? '#38bdf8' : 'var(--accent-muted)',
                  color: idx === 0 ? '#0f172a' : 'var(--accent-color)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.86rem',
                }}
              >
                {p}
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            WordPiece maximizes language model likelihood rather than pure pair frequency. Subtokens continuing a previous root receive the <code style={{ color: 'var(--accent-color)' }}>##</code> prefix.
          </p>

          <MathBlock math={`\\text{Score}(u, v) = \\frac{\\text{Count}(uv)}{\\text{Count}(u) \\times \\text{Count}(v)}`} />
        </div>

        <ControlPanel title="WordPiece Input" onReset={() => setWord('unbreakable')}>
          <TextInput label="Target Word" value={word} onChange={setWord} />
        </ControlPanel>
      </div>
    </div>
  );
};
