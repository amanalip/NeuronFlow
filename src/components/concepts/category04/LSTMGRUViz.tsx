import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { simulateLstmCell } from './category04Math';
import styles from '../category01/Category01.module.css';

// 40. LSTM Architecture
export const LstmArchitectureViz: React.FC = () => {
  const [x, setX] = useState(1.0);
  const [hPrev, setHPrev] = useState(0.5);
  const [cPrev, setCPrev] = useState(0.8);
  const [activeGate, setActiveGate] = useState<'f' | 'i' | 'c' | 'o'>('f');

  const { f, i, cTilde, c, o, h } = simulateLstmCell(x, hPrev, cPrev);

  const gateDetails = {
    f: {
      name: 'Forget Gate (f_t)',
      formula: `f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f) = ${f.toFixed(3)}`,
      desc: 'Controls how much of the past cell state memory C_{t-1} to discard (0 = forget completely, 1 = retain).',
    },
    i: {
      name: 'Input Gate (i_t) & Candidate (C̃_t)',
      formula: `i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i) = ${i.toFixed(3)}, \\quad \\tilde{C}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c) = ${cTilde.toFixed(3)}`,
      desc: 'Determines what fraction of the new candidate information C̃_t gets added to the long-term cell state.',
    },
    c: {
      name: 'Cell State Highway (C_t)',
      formula: `C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t = (${f.toFixed(2)} \\times ${cPrev.toFixed(2)}) + (${i.toFixed(2)} \\times ${cTilde.toFixed(2)}) = ${c.toFixed(3)}`,
      desc: 'The uninterrupted linear highway where gradients flow backward without exponential vanishing decay.',
    },
    o: {
      name: 'Output Gate (o_t) & Hidden State (h_t)',
      formula: `o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o) = ${o.toFixed(3)}, \\quad h_t = o_t \\odot \\tanh(C_t) = ${h.toFixed(3)}`,
      desc: 'Filters the cell state to produce the visible external hidden state h_t passed to next layer/step.',
    },
  };

  const current = gateDetails[activeGate];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>LSTM Gating Highway & Cell State</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              h_t = {h.toFixed(3)}, C_t = {c.toFixed(3)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {(['f', 'i', 'c', 'o'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveGate(key)}
                style={{
                  padding: '10px 6px',
                  borderRadius: '6px',
                  backgroundColor: activeGate === key ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: activeGate === key ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: activeGate === key ? 'var(--accent-color)' : 'var(--text-primary)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{key.toUpperCase()}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gate</div>
              </button>
            ))}
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-color)', marginBottom: '4px' }}>{current.name}</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{current.desc}</p>
            <MathBlock math={current.formula} />
          </div>
        </div>

        <ControlPanel title="Cell Inputs" onReset={() => { setX(1.0); setHPrev(0.5); setCPrev(0.8); }}>
          <Slider label="Input (x_t)" value={x} min={-2} max={2} step={0.1} onChange={setX} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Previous Hidden State (h_{t-1})" value={hPrev} min={-1} max={1} step={0.1} onChange={setHPrev} formatValue={(v) => v.toFixed(1)} />
          <Slider label="Previous Cell State (C_{t-1})" value={cPrev} min={-2} max={2} step={0.1} onChange={setCPrev} formatValue={(v) => v.toFixed(1)} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 41. GRU Architecture
export const GruViz: React.FC = () => {
  const [resetVal, setResetVal] = useState(0.8);
  const [updateVal, setUpdateVal] = useState(0.6);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Gated Recurrent Unit (GRU)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              2 Gates (No separate cell state)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8' }}>Reset Gate (r_t) = {resetVal.toFixed(2)}</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Determines how to combine new input with previous memory.
              </p>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, color: '#10b981' }}>Update Gate (z_t) = {updateVal.toFixed(2)}</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Acts as forget and input gate simultaneously.
              </p>
            </div>
          </div>

          <MathBlock math={`h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t, \\quad \\tilde{h}_t = \\tanh(W x_t + U (r_t \\odot h_{t-1}))`} />
        </div>

        <ControlPanel title="GRU Gates" onReset={() => { setResetVal(0.8); setUpdateVal(0.6); }}>
          <Slider label="Reset Gate (r_t)" value={resetVal} min={0} max={1} step={0.05} onChange={setResetVal} formatValue={(v) => v.toFixed(2)} />
          <Slider label="Update Gate (z_t)" value={updateVal} min={0} max={1} step={0.05} onChange={setUpdateVal} formatValue={(v) => v.toFixed(2)} />
        </ControlPanel>
      </div>
    </div>
  );
};
