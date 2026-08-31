import React, { useState, useMemo } from 'react';
import { encode } from 'gpt-tokenizer';
import { TextInput } from '../../controls/TextInput';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 32. Live Tiktoken (GPT-4 cl100k_base)
export const TiktokenViz: React.FC = () => {
  const [text, setText] = useState('NeuronFlow: See how machines learn.');

  const tokenIds = useMemo(() => {
    try {
      return encode(text);
    } catch {
      return [];
    }
  }, [text]);

  const colors = ['#38bdf8', '#818cf8', '#f59e0b', '#10b981', '#ec4899', '#a855f7'];

  const charsPerToken = tokenIds.length > 0 ? (text.length / tokenIds.length).toFixed(2) : '0';
  const estCostPer1M = ((tokenIds.length / 1000000) * 2.5).toFixed(6);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Live GPT-4 cl100k_base Tokenizer</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {tokenIds.length} Tokens | {text.length} Characters
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', minHeight: '80px', alignItems: 'center' }}>
            {tokenIds.map((id, idx) => {
              const bgCol = colors[idx % colors.length];
              return (
                <div
                  key={idx}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderLeft: `4px solid ${bgCol}`,
                    borderTop: '1px solid var(--border-color)',
                    borderRight: '1px solid var(--border-color)',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>#{id}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Token Count</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-color)' }}>{tokenIds.length}</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chars / Token</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{charsPerToken}</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est Cost (USD)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>${estCostPer1M}</div>
            </div>
          </div>

          <MathBlock math={`\\text{Token Efficiency} = \\frac{\\text{Total Characters}}{\\text{Total Tokens}} = \\frac{${text.length}}{${tokenIds.length || 1}} = ${charsPerToken} \\text{ chars/token}`} />
        </div>

        <ControlPanel title="Live Text Input" onReset={() => setText('NeuronFlow: See how machines learn.')}>
          <TextInput label="Type Prompt or Code" value={text} onChange={setText} />
        </ControlPanel>
      </div>
    </div>
  );
};

// 33. Special Tokens Visualizer
export const SpecialTokensViz: React.FC = () => {
  const [modelFamily, setModelFamily] = useState<'bert' | 'gpt' | 'llama'>('gpt');

  const templates: Record<string, { desc: string; sequence: { token: string; type: 'special' | 'text' }[] }> = {
    bert: {
      desc: 'BERT Bidirectional Classification & Separation',
      sequence: [
        { token: '[CLS]', type: 'special' },
        { token: 'The movie was fantastic', type: 'text' },
        { token: '[SEP]', type: 'special' },
        { token: 'I loved the acting', type: 'text' },
        { token: '[SEP]', type: 'special' },
      ],
    },
    gpt: {
      desc: 'OpenAI GPT Autoregressive ChatML Format',
      sequence: [
        { token: '<|im_start|>system', type: 'special' },
        { token: 'You are a helpful coding assistant.', type: 'text' },
        { token: '<|im_end|>', type: 'special' },
        { token: '<|im_start|>user', type: 'special' },
        { token: 'Explain BPE tokenization.', type: 'text' },
        { token: '<|im_end|>', type: 'special' },
        { token: '<|im_start|>assistant', type: 'special' },
      ],
    },
    llama: {
      desc: 'Meta LLaMA Instruct Template',
      sequence: [
        { token: '<s>[INST]', type: 'special' },
        { token: '<<SYS>>\\nYou are an expert.\\n<</SYS>>\\n\\nWrite a poem.', type: 'text' },
        { token: '[/INST]', type: 'special' },
      ],
    },
  };

  const active = templates[modelFamily];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{active.desc}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {modelFamily.toUpperCase()} Format
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {active.sequence.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: item.type === 'special' ? 'var(--accent-muted)' : 'var(--bg-secondary)',
                  border: item.type === 'special' ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: item.type === 'special' ? 'var(--accent-color)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.84rem',
                  fontWeight: item.type === 'special' ? 700 : 400,
                }}
              >
                {item.token}
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Special tokens steer model attention, mark dialogue roles, and signal generation termination. Masking or corrupting special tokens breaks conversational alignment.
          </p>

          <MathBlock math={`\\text{Prompt} = \\langle\\text{BOS}\\rangle \\circ \\text{Tokens} \\circ \\langle\\text{EOS}\\rangle`} />
        </div>

        <ControlPanel title="Template Model" onReset={() => setModelFamily('gpt')}>
          <RadioGroup
            label="Model Family"
            value={modelFamily}
            options={[
              { value: 'gpt', label: 'GPT (ChatML)' },
              { value: 'bert', label: 'BERT ([CLS]/[SEP])' },
              { value: 'llama', label: 'LLaMA (<s>/[INST])' },
            ]}
            onChange={(v) => setModelFamily(v as 'bert' | 'gpt' | 'llama')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
