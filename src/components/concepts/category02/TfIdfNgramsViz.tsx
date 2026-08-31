import React, { useState } from 'react';
import { TextInput } from '../../controls/TextInput';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { extractNgrams, computeIdf, computeTfIdf } from './category02Math';
import { ComparisonTable } from '../../viz/charts/ComparisonTable';
import styles from '../category01/Category01.module.css';

// 18. TF-IDF
export const TfIdfViz: React.FC = () => {
  const [doc1, setDoc1] = useState('the cat sat on the mat');
  const [doc2, setDoc2] = useState('the dog chased the cat');
  const [doc3, setDoc3] = useState('birds fly over the forest');

  const tokenize = (text: string) =>
    text.toLowerCase().replace(/[^\w\s]/g, '').trim().split(/\s+/).filter(Boolean);

  const docs = [doc1, doc2, doc3];
  const allDocTokens = docs.map(tokenize);
  const vocab = Array.from(new Set(allDocTokens.flat())).sort();

  const columns = [
    { key: 'term', header: 'Term (t)' },
    { key: 'tf1', header: 'Doc 1 TF-IDF' },
    { key: 'tf2', header: 'Doc 2 TF-IDF' },
    { key: 'tf3', header: 'Doc 3 TF-IDF' },
    { key: 'idf', header: 'IDF Score' },
  ];

  const rows = vocab.map((term) => {
    const idfVal = computeIdf(term, allDocTokens);
    const score1 = computeTfIdf(term, allDocTokens[0], allDocTokens);
    const score2 = computeTfIdf(term, allDocTokens[1], allDocTokens);
    const score3 = computeTfIdf(term, allDocTokens[2], allDocTokens);

    return {
      term: <strong style={{ color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>{term}</strong>,
      tf1: <span style={{ fontFamily: 'var(--font-mono)' }}>{score1.toFixed(3)}</span>,
      tf2: <span style={{ fontFamily: 'var(--font-mono)' }}>{score2.toFixed(3)}</span>,
      tf3: <span style={{ fontFamily: 'var(--font-mono)' }}>{score3.toFixed(3)}</span>,
      idf: <span style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>{idfVal.toFixed(3)}</span>,
    };
  });

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>TF-IDF Term Weighting Matrix</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Corpus: 3 Documents, Vocab: {vocab.length} terms
            </span>
          </div>

          <ComparisonTable columns={columns} rows={rows} />

          <MathBlock math={`\\text{TF-IDF}(t, d, D) = \\text{TF}(t, d) \\times \\left(\\ln\\frac{|D| + 1}{|\\{d \\in D : t \\in d\\}| + 1} + 1\\right)`} />
        </div>

        <ControlPanel title="Corpus Documents" onReset={() => { setDoc1('the cat sat on the mat'); setDoc2('the dog chased the cat'); setDoc3('birds fly over the forest'); }}>
          <TextInput label="Document 1" value={doc1} onChange={setDoc1} />
          <TextInput label="Document 2" value={doc2} onChange={setDoc2} />
          <TextInput label="Document 3" value={doc3} onChange={setDoc3} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 19. N-grams
export const NgramsViz: React.FC = () => {
  const [text, setText] = useState('the neural network predicted the next word');
  const [n, setN] = useState(2);

  const ngrams = extractNgrams(text, n);

  const nLabel = n === 1 ? 'Unigrams (1-grams)' : n === 2 ? 'Bigrams (2-grams)' : n === 3 ? 'Trigrams (3-grams)' : `${n}-grams`;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{nLabel} Extraction</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {ngrams.length} Total Windows
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {ngrams.map((gram, idx) => (
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
                "{gram}"
              </div>
            ))}
          </div>

          <MathBlock math={`P(w_t \\mid w_{t-1}, \\dots, w_{t-n+1}) = \\frac{\\text{count}(w_{t-n+1}, \\dots, w_t)}{\\text{count}(w_{t-n+1}, \\dots, w_{t-1})}`} />
        </div>

        <ControlPanel title="N-gram Settings" onReset={() => { setText('the neural network predicted the next word'); setN(2); }}>
          <Slider label="Window Size (N)" value={n} min={1} max={4} step={1} onChange={setN} />
          <TextInput label="Input Text" value={text} onChange={setText} />
        </ControlPanel>
      </div>
    </div>
  );
};
