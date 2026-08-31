import React, { useState } from 'react';
import { TextInput } from '../../controls/TextInput';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { MatrixView } from '../../viz/matrix/MatrixView';
import styles from '../category01/Category01.module.css';

// 16. One-Hot Encoding
export const OneHotEncodingViz: React.FC = () => {
  const [vocabSize, setVocabSize] = useState(6);
  const [selectedWordIdx, setSelectedWordIdx] = useState(2);

  const sampleWords = ['apple', 'banana', 'cat', 'dog', 'elephant', 'forest', 'galaxy', 'horizon'];
  const activeVocab = sampleWords.slice(0, vocabSize);

  // Generate one-hot matrix: rows = words, cols = one-hot vectors
  const matrix = activeVocab.map((_, rIdx) =>
    Array.from({ length: vocabSize }).map((_, cIdx) => (rIdx === cIdx ? 1 : 0))
  );

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>One-Hot Orthogonal Vector Space</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>
              Dim: {vocabSize}, Sparsity: {(((vocabSize - 1) / vocabSize) * 100).toFixed(1)}%
            </span>
          </div>

          <MatrixView
            matrix={matrix}
            title="Vocabulary Indicator Matrix (N x N)"
            showValues={true}
            cellSize={36}
            minColor="var(--bg-primary)"
            maxColor="#38bdf8"
          />

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Selected Word: <strong style={{ color: 'var(--accent-color)' }}>{activeVocab[selectedWordIdx] || 'apple'}</strong>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              e_{selectedWordIdx} = [
              {Array.from({ length: vocabSize })
                .map((_, i) => (i === selectedWordIdx ? '1' : '0'))
                .join(', ')}
              ]
            </div>
          </div>

          <MathBlock math={`\\mathbf{e}_i^T \\mathbf{e}_j = \\begin{cases} 1 & \\text{if } i = j \\\\ 0 & \\text{if } i \\neq j \\quad (\\text{Orthogonal: Cosine Similarity} = 0) \\end{cases}`} />
        </div>

        <ControlPanel title="Encoding Configuration" onReset={() => { setVocabSize(6); setSelectedWordIdx(2); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select Target Word</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {activeVocab.map((w, idx) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSelectedWordIdx(idx)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    backgroundColor: selectedWordIdx === idx ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                    color: selectedWordIdx === idx ? '#ffffff' : 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

// 17. Bag-of-Words
export const BagOfWordsViz: React.FC = () => {
  const [docA, setDocA] = useState('not good, very bad');
  const [docB, setDocB] = useState('very good, not bad');

  const tokenize = (text: string) =>
    text.toLowerCase().replace(/[^\w\s]/g, '').trim().split(/\s+/).filter(Boolean);

  const tokensA = tokenize(docA);
  const tokensB = tokenize(docB);

  // Unified vocab
  const vocab = Array.from(new Set([...tokensA, ...tokensB])).sort();

  const countVecA = vocab.map((w) => tokensA.filter((t) => t === w).length);
  const countVecB = vocab.map((w) => tokensB.filter((t) => t === w).length);

  const vectorsIdentical =
    countVecA.length === countVecB.length &&
    countVecA.every((val, idx) => val === countVecB[idx]);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Order Insensitivity Demonstration</span>
            <span style={{ fontSize: '0.82rem', color: vectorsIdentical ? 'var(--warning-color)' : 'var(--success-color)' }}>
              {vectorsIdentical ? 'Identical Vectors (Word Order Lost)' : 'Distinct Vectors'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--accent-color)' }}>Doc A</div>
              <div style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: '4px 0' }}>"{docA}"</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>[{countVecA.join(', ')}]</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#f59e0b' }}>Doc B</div>
              <div style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: '4px 0' }}>"{docB}"</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>[{countVecB.join(', ')}]</div>
            </div>
          </div>

          <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Vocabulary Index:</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              {vocab.map((v, i) => `${i}: "${v}"`).join(' | ')}
            </div>
          </div>

          <MathBlock math={`\\text{BoW}(D) = \\begin{bmatrix} \\text{count}(w_1), & \\text{count}(w_2), & \\dots, & \\text{count}(w_{|V|}) \\end{bmatrix}`} />
        </div>

        <ControlPanel title="Document Inputs" onReset={() => { setDocA('not good, very bad'); setDocB('very good, not bad'); }}>
          <TextInput label="Document A" value={docA} onChange={setDocA} />
          <TextInput label="Document B" value={docB} onChange={setDocB} />
        </ControlPanel>
      </div>
    </div>
  );
};
