import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { MULTILINGUAL_BENCHMARK } from './category03Math';
import { ComparisonTable } from '../../viz/charts/ComparisonTable';
import styles from '../category01/Category01.module.css';

export const MultilingualTokenizationViz: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState('hi');

  const active = MULTILINGUAL_BENCHMARK.find((l) => l.code === selectedLang) || MULTILINGUAL_BENCHMARK[6];

  const columns = [
    { key: 'lang', header: 'Language' },
    { key: 'text', header: 'Sentence Sample' },
    { key: 'tokens', header: 'Tokens' },
    { key: 'ratio', header: 'Cost Multiplier vs EN' },
  ];

  const rows = MULTILINGUAL_BENCHMARK.map((b) => ({
    lang: <strong style={{ color: 'var(--accent-color)' }}>{b.language}</strong>,
    text: <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>"{b.text}"</span>,
    tokens: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{b.tokens}</span>,
    ratio: (
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          color: b.ratio === 1.0 ? 'var(--success-color)' : b.ratio > 2.5 ? 'var(--error-color)' : '#f59e0b',
          fontWeight: 600,
        }}
      >
        {b.ratio.toFixed(2)}x
      </span>
    ),
  }));

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Multilingual Tokenization & Cost Inequality</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              10 Languages Benchmarked
            </span>
          </div>

          <ComparisonTable columns={columns} rows={rows} />

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--accent-color)', marginBottom: '4px' }}>
              Selected Highlight: {active.language}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              "{active.text}" requires <strong>{active.tokens} tokens</strong> compared to <strong>7 tokens</strong> in English ({active.ratio.toFixed(2)}x cost multiplier).
            </p>
          </div>

          <MathBlock math={`\\text{Cost Multiplier} = \\frac{\\text{Tokens}(\\text{Language } L)}{\\text{Tokens}(\\text{English})}`} />
        </div>

        <ControlPanel title="Language Selection" onReset={() => setSelectedLang('hi')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select Language</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {MULTILINGUAL_BENCHMARK.map((b) => (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => setSelectedLang(b.code)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    backgroundColor: selectedLang === b.code ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                    color: selectedLang === b.code ? '#ffffff' : 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {b.language}
                </button>
              ))}
            </div>
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};
