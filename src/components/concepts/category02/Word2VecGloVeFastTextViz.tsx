import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { TextInput } from '../../controls/TextInput';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { extractSubwords } from './category02Math';
import { MatrixView } from '../../viz/matrix/MatrixView';
import styles from '../category01/Category01.module.css';

// 21. Word2Vec (CBOW vs Skip-gram)
export const Word2VecViz: React.FC = () => {
  const [modelType, setModelType] = useState<'cbow' | 'skipgram'>('skipgram');
  const [windowIdx, setWindowIdx] = useState(2);

  const sentence = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];
  const centerWord = sentence[windowIdx];
  const contextWords = [
    sentence[windowIdx - 1],
    sentence[windowIdx + 1],
  ].filter(Boolean);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{modelType === 'cbow' ? 'Continuous Bag of Words (CBOW)' : 'Skip-Gram with Negative Sampling'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Center: "{centerWord}"
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', overflowX: 'auto' }}>
            {sentence.map((w, idx) => {
              const isCenter = idx === windowIdx;
              const isContext = idx === windowIdx - 1 || idx === windowIdx + 1;

              return (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: isCenter ? 'var(--accent-color)' : isContext ? 'var(--accent-muted)' : 'var(--bg-secondary)',
                    color: isCenter ? '#ffffff' : isContext ? 'var(--accent-color)' : 'var(--text-muted)',
                    fontWeight: isCenter ? 700 : isContext ? 600 : 400,
                    border: isCenter ? '2px solid #ffffff' : '1px solid var(--border-color)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                  }}
                >
                  {w}
                </div>
              );
            })}
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {modelType === 'cbow' ? (
              <div>
                <strong>Input:</strong> Context words [{contextWords.map((c) => `"${c}"`).join(', ')}] → <strong>Predict Target:</strong> "{centerWord}"
              </div>
            ) : (
              <div>
                <strong>Input:</strong> Target word "{centerWord}" → <strong>Predict Context:</strong> [{contextWords.map((c) => `"${c}"`).join(', ')}]
              </div>
            )}
          </div>

          {modelType === 'cbow' ? (
            <MathBlock math={`P(w_t \\mid w_{t-1}, w_{t+1}) = \\frac{\\exp\\left(\\mathbf{v}'_{w_t}^T \\bar{\\mathbf{v}}\\right)}{\\sum_{w \\in V} \\exp\\left(\\mathbf{v}'_w^T \\bar{\\mathbf{v}}\\right)}`} />
          ) : (
            <MathBlock math={`\\mathcal{L}_{\\text{SGNS}} = \\log \\sigma(\\mathbf{v}'_{w_c}^T \\mathbf{v}_{w_t}) + \\sum_{k=1}^K \\mathbb{E}_{w_k \\sim P_n} [\\log \\sigma(-\\mathbf{v}'_{w_k}^T \\mathbf{v}_{w_t})]`} />
          )}
        </div>

        <ControlPanel title="Word2Vec Controls" onReset={() => { setModelType('skipgram'); setWindowIdx(2); }}>
          <RadioGroup
            label="Architecture"
            value={modelType}
            options={[
              { value: 'skipgram', label: 'Skip-Gram' },
              { value: 'cbow', label: 'CBOW' },
            ]}
            onChange={(v) => setModelType(v as 'cbow' | 'skipgram')}
          />
          <Slider
            label="Window Position (t)"
            value={windowIdx}
            min={1}
            max={sentence.length - 2}
            step={1}
            onChange={setWindowIdx}
            formatValue={(v) => `Token #${v} ("${sentence[v]}")`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 22. GloVe (Global Vectors)
export const GloVeViz: React.FC = () => {
  // Sample co-occurrence matrix between words
  const coMatrix = [
    [0.9, 0.1, 0.8, 0.05, 0.7],
    [0.1, 0.9, 0.05, 0.85, 0.7],
    [0.8, 0.05, 0.85, 0.02, 0.5],
    [0.05, 0.85, 0.02, 0.9, 0.6],
    [0.7, 0.7, 0.5, 0.6, 0.95],
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Global Co-occurrence Probability Matrix</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Log-Bilinear Model
            </span>
          </div>

          <MatrixView
            matrix={coMatrix}
            title="Co-occurrence Probabilities P(k | w) for [ice, steam, solid, gas, water]"
            cellSize={44}
            minValue={0}
            maxValue={1}
          />

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.82rem' }}>
            Probability Ratio: <br />
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-color)' }}>
              P(solid | ice) / P(solid | steam) = 0.8 / 0.05 = 16.0 (Strong Ice association)<br />
              P(gas | ice) / P(gas | steam) = 0.05 / 0.85 = 0.058 (Strong Steam association)
            </span>
          </div>

          <MathBlock math={`J = \\sum_{i,j=1}^V f(X_{ij}) \\left( w_i^T \\tilde{w}_j + b_i + \\tilde{b}_j - \\log X_{ij} \\right)^2`} />
        </div>

        <ControlPanel title="GloVe Information" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            GloVe combines global matrix factorization with local context window methods. Ratios of co-occurrence probabilities encode semantic distinctions directly in vector differences.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 23. FastText (Subword Embeddings)
export const FastTextViz: React.FC = () => {
  const [word, setWord] = useState('where');

  const subwords = extractSubwords(word, 3, 5);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Subword N-Gram Representation</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {subwords.length} Character N-Grams + Special Tokens
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ padding: '6px 12px', background: 'var(--accent-color)', color: '#ffffff', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.82rem' }}>
              &lt;{word}&gt; (Full Word)
            </div>
            {subwords.map((sub, idx) => (
              <div
                key={idx}
                style={{
                  padding: '6px 12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                }}
              >
                "{sub}"
              </div>
            ))}
          </div>

          <MathBlock math={`\\mathbf{v}_{w} = \\sum_{g \\in \\mathcal{G}_w} \\mathbf{z}_g \\quad (\\text{Sum of Subword Vector Embeddings})`} />
        </div>

        <ControlPanel title="FastText Inputs" onReset={() => setWord('where')}>
          <TextInput label="Input Word (Supports Out-Of-Vocabulary)" value={word} onChange={setWord} />
        </ControlPanel>
      </div>
    </div>
  );
};
