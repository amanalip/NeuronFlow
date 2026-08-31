import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computePerplexity, computeBleuScore } from './category16Math';
import styles from '../category01/Category01.module.css';

// 188. Perplexity
export const PerplexityViz: React.FC = () => {
  const [loss, setLoss] = useState<number>(2.3);
  const ppl = computePerplexity(loss);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Perplexity (PPL): Language Model Uncertainty & Surprise</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Perplexity: {ppl.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cross-Entropy Loss (nats)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>{loss.toFixed(2)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Negative log-likelihood per token</div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Effective Branching Factor</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>~{Math.round(ppl)} Tokens</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Equivalent uniform vocabulary choices</div>
            </div>
          </div>

          <MathBlock math={`\\text{PPL} = \\exp\\left(-\\frac{1}{N} \\sum_{i=1}^N \\ln P(w_i \\mid w_{<i})\\right) = e^{\\mathcal{L}} = e^{${loss.toFixed(2)}} = ${ppl.toFixed(2)}`} />
        </div>

        <ControlPanel title="Loss Parameters" onReset={() => setLoss(2.3)}>
          <Slider
            label="Cross-Entropy Loss (nats)"
            value={loss}
            min={0.5}
            max={5.0}
            step={0.1}
            onChange={setLoss}
            formatValue={(v) => `Loss: ${v.toFixed(1)}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 189. BLEU & 190. ROUGE Scores
export const BleuRougeViz: React.FC = () => {
  const reference = 'the fast brown fox jumped over the lazy sleeping dog';
  const candidate = 'the quick brown fox leaped over the sleeping dog';

  const refWords = reference.split(' ');
  const candWords = candidate.split(' ');
  const { p1, p2, brevityPenalty, bleuScore } = computeBleuScore(candWords, refWords);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>N-Gram Overlap Evaluation (BLEU & ROUGE)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              BLEU Score: {(bleuScore * 100).toFixed(1)}%
            </span>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '12px 0', fontSize: '0.78rem' }}>
            <div style={{ marginBottom: '6px' }}><strong>Reference:</strong> &ldquo;{reference}&rdquo;</div>
            <div><strong>Candidate:</strong> &ldquo;{candidate}&rdquo;</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '10px 0' }}>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1-Gram Precision</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{(p1 * 100).toFixed(0)}%</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>2-Gram Precision</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{(p2 * 100).toFixed(0)}%</div>
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Brevity Penalty</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{brevityPenalty.toFixed(2)}</div>
            </div>
          </div>

          <MathBlock math={`\\text{BLEU} = \\text{BP} \\times \\exp\\left(\\sum_{n=1}^N w_n \\ln p_n\\right) = ${brevityPenalty.toFixed(2)} \\times \\sqrt{${p1.toFixed(2)} \\times ${p2.toFixed(2)}} = ${(bleuScore * 100).toFixed(1)}\\%`} />
        </div>

        <ControlPanel title="Metric Summary" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            BLEU evaluates exact n-gram precision for translation, while ROUGE measures recall of reference tokens for summarization.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 191. Human Evaluation & Annotator Agreement
export const HumanEvaluationViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Blind Side-by-Side Human Preference Evaluation</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Inter-Annotator Agreement: &kappa; = 0.74 (Substantial)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.82rem', marginBottom: '4px' }}>Model A Response (Blind)</div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                &ldquo;Self-attention computes dynamic weights across all pairs of positions in a sequence in $O(1)$ sequential operations.&rdquo;
              </p>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.82rem', marginBottom: '4px' }}>Model B Response (Blind)</div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                &ldquo;Attention is an important mechanism in neural networks that lets them remember past words.&rdquo;
              </p>
            </div>
          </div>

          <MathBlock math={`\\text{Cohen's Kappa Agreement: } \\kappa = \\frac{P_o - P_e}{1 - P_e} = \\frac{0.86 - 0.46}{1 - 0.46} = 0.74 \\quad (\\text{Substantial Consensus})`} />
        </div>

        <ControlPanel title="Human Rating Arena" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Human evaluation provides the ground-truth standard for helpfulness, nuanced tone, and factual grounding.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
