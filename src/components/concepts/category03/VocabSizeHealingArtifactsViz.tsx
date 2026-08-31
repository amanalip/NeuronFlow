import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { Toggle } from '../../controls/Toggle';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { LossCurve, LossDataPoint } from '../../viz/charts/LossCurve';
import styles from '../category01/Category01.module.css';

// 34. Vocabulary Size Tradeoffs
export const VocabSizeViz: React.FC = () => {
  const [vocabK, setVocabK] = useState(50); // in thousands (e.g. 50k)
  const dModel = 4096;

  // Embedding table parameter count: V * d_model
  const embedParamsM = (vocabK * 1000 * dModel) / 1000000;
  // Compression: tokens per word drops as vocab grows
  const tokensPerWord = Math.max(1.1, 2.5 - Math.log10(vocabK) * 0.7);

  const curveData: LossDataPoint[] = [
    { step: 10, trainLoss: 2.2, valLoss: 1.0 },
    { step: 32, trainLoss: 1.5, valLoss: 1.3 },
    { step: 50, trainLoss: 1.3, valLoss: 1.6 },
    { step: 100, trainLoss: 1.1, valLoss: 2.3 },
    { step: 200, trainLoss: 0.95, valLoss: 3.5 },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Vocabulary Size Frontier</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {vocabK}k Vocab Size ({embedParamsM.toFixed(1)}M Embedding Params)
            </span>
          </div>

          <LossCurve
            data={curveData}
            title="Compression vs Parameter Overhead Tradeoff"
            xLabel="Vocab Size (k)"
            yLabel="Relative Metric"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compression (Tokens/Word)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{tokensPerWord.toFixed(2)}</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Embedding Table Size</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{embedParamsM.toFixed(1)}M parameters</div>
            </div>
          </div>

          <MathBlock math={`\\text{Embedding Matrix Parameters} = |V| \\times d_{\\text{model}} = (${vocabK}\\text{k}) \\times ${dModel} = ${embedParamsM.toFixed(1)}\\text{M}`} />
        </div>

        <ControlPanel title="Vocabulary Budget" onReset={() => setVocabK(50)}>
          <Slider
            label="Vocabulary Size (|V| in thousands)"
            value={vocabK}
            min={10}
            max={200}
            step={5}
            onChange={setVocabK}
            formatValue={(v) => `${v}k tokens`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 35. Token Healing
export const TokenHealingViz: React.FC = () => {
  const [healingEnabled, setHealingEnabled] = useState(true);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Token Boundary Bias Resolution</span>
            <span style={{ fontSize: '0.8rem', color: healingEnabled ? 'var(--success-color)' : 'var(--error-color)' }}>
              {healingEnabled ? 'Healing Enabled (Optimal)' : 'Greedy Cutoff (Biased)'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>User Prompt Ending:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                "The server returned an err"
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: healingEnabled ? '1px solid var(--success-color)' : '1px solid var(--error-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {healingEnabled ? 'With Token Healing:' : 'Without Token Healing (Boundary Trap):'}
              </div>
              {healingEnabled ? (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--success-color)' }}>
                  Backtracks last subtoken → Completes as single token: <strong>"error"</strong> ✓
                </div>
              ) : (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--error-color)' }}>
                  Forces next token from " err" → Biased completion: <strong>" err" + "atic"</strong> (Misinterpretation ✗)
                </div>
              )}
            </div>
          </div>

          <MathBlock math={`\\text{Healed Prompt} = \\text{Prompt}[:-1] \\quad \\cup \\quad \\operatorname{PrefixMatch}(\\text{Token}_{\\text{last}})`} />
        </div>

        <ControlPanel title="Token Healing Controls" onReset={() => setHealingEnabled(true)}>
          <Toggle
            label="Enable Guidance Token Healing"
            checked={healingEnabled}
            onChange={setHealingEnabled}
            description="Eliminates trailing token boundary bias by allowing the model to complete the final prefix word."
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 36. Tokenization Artifacts
export const TokenizationArtifactsViz: React.FC = () => {
  const artifacts = [
    {
      title: 'Glitch Tokens ("SolidGoldMagikarp")',
      desc: 'Tokens appearing in the tokenizer vocabulary from raw web scrapes that were never trained in the LLM, resulting in hallucinated strings.',
    },
    {
      title: 'Leading Space Asymmetry',
      desc: '" Apple" and "Apple" map to two completely different token IDs (e.g. #30456 vs #12891), causing sensitive prompt completions.',
    },
    {
      title: 'Multi-Language Token Inequality',
      desc: 'Non-Latin scripts (Hindi, Arabic, Japanese) get fragmented into byte pieces, requiring 2x to 5x more tokens and cost per sentence.',
    },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Known Tokenizer Anomalies & Artifacts</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--warning-color)' }}>
              Subword Failure Modes
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {artifacts.map((art, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--accent-color)' }}>{art.title}</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{art.desc}</p>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{ID}(\\text{" Apple"}) \\neq \\text{ID}(\\text{"Apple"})`} />
        </div>

        <ControlPanel title="Artifacts Summary" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Tokenizer design directly influences prompt robustness, numerical calculation, and multi-lingual cost equity across LLMs.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
