import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { PRECISION_FORMATS, FloatFormatInfo } from './category07Math';
import styles from '../category01/Category01.module.css';

export const NumericalPrecisionViz: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>('BF16');

  const active: FloatFormatInfo =
    PRECISION_FORMATS.find((f) => f.name === selectedFormat) || PRECISION_FORMATS[2];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>IEEE Floating Point & Integer Bit Formats</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {active.name} ({active.totalBits}-bit)
            </span>
          </div>

          {/* Bit Allocation Bar */}
          <div style={{ display: 'flex', height: '44px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)', margin: '14px 0' }}>
            {active.signBits > 0 && (
              <div
                style={{
                  flex: active.signBits,
                  background: '#ef4444',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Sign ({active.signBits}b)
              </div>
            )}
            {active.expBits > 0 && (
              <div
                style={{
                  flex: active.expBits,
                  background: '#38bdf8',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Exponent ({active.expBits}b)
              </div>
            )}
            <div
              style={{
                flex: active.mantissaBits,
                background: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Mantissa / Magnitude ({active.mantissaBits}b)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dynamic Range</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--accent-color)', marginTop: '4px' }}>
                {active.dynamicRange}
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Typical Use Case</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                {active.useCase}
              </div>
            </div>
          </div>

          <MathBlock math={`\\text{Value} = (-1)^{\\text{sign}} \\times 2^{\\text{exp} - \\text{bias}} \\times \\left(1 + \\sum_{i=1}^m b_i 2^{-i}\\right)`} />
        </div>

        <ControlPanel title="Precision Format" onReset={() => setSelectedFormat('BF16')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {PRECISION_FORMATS.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setSelectedFormat(f.name)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: selectedFormat === f.name ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
                  border: selectedFormat === f.name ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: selectedFormat === f.name ? 'var(--accent-color)' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{f.name}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{f.totalBits} bits</span>
              </button>
            ))}
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};
