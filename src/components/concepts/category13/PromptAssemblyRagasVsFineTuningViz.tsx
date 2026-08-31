import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeRagasMetrics } from './category13Math';
import styles from '../category01/Category01.module.css';

// 161. Prompt Assembly for RAG
export const PromptAssemblyRagViz: React.FC = () => {
  const [includeSources, setIncludeSources] = useState(true);

  const promptTemplate = `SYSTEM:
You are an AI assistant. Answer user queries truthfully using ONLY the provided verified context below.
If the answer cannot be deduced from the context, state "I do not have sufficient information to answer this question."

<context>
  <document id="doc_01" title="Transformer Attention (2017)">
    Self-attention computes dynamic weights across all token pairs simultaneously, allowing O(1) sequential path length.
  </document>
  <document id="doc_02" title="LLaMA Model Card (2023)">
    LLaMA is a collection of foundation language models ranging from 7B to 65B parameters trained on 1.4 trillion tokens.
  </document>
</context>

USER:
What is the sequential path length of self-attention, and what is the training token volume of LLaMA?

ASSISTANT:
${includeSources ? 'Based on [doc_01], self-attention has a sequential path length of O(1). According to [doc_02], LLaMA was trained on 1.4 trillion tokens.' : 'Self-attention has an O(1) sequential path length and LLaMA was trained on 1.4 trillion tokens.'}`;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Structured Prompt Assembly with Grounded XML Context</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Token Budget: 184 / 4096 Tokens Used
            </span>
          </div>

          <pre
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              lineHeight: 1.4,
              overflowX: 'auto',
              maxHeight: '280px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {promptTemplate}
          </pre>

          <MathBlock math={`\\text{Total Prompt Tokens} = \\operatorname{len}(\\text{System}) + \\sum_{i=1}^k \\operatorname{len}(\\text{Chunk}_i) + \\operatorname{len}(\\text{Query}) \\le \\text{Context Window}`} />
        </div>

        <ControlPanel title="Assembly Options" onReset={() => setIncludeSources(true)}>
          <button
            type="button"
            onClick={() => setIncludeSources((prev) => !prev)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: includeSources ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
              border: includeSources ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
              color: includeSources ? 'var(--accent-color)' : 'var(--text-primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {includeSources ? 'Strict Source Citations Enabled [doc_id]' : 'Standard Completion'}
          </button>
        </ControlPanel>
      </div>
    </div>
  );
};

// 162. RAG Evaluation (RAGAS Framework)
export const RagEvaluationViz: React.FC = () => {
  const [retrievedRelevant, setRetrievedRelevant] = useState<number>(4);
  const totalRetrieved = 5;
  const groundTruthRelevant = 4;
  const supportedClaims = 4;
  const totalClaims = 4;

  const { contextPrecision, contextRecall, faithfulness, ragasHarmonicMean } = computeRagasMetrics(
    retrievedRelevant,
    totalRetrieved,
    groundTruthRelevant,
    supportedClaims,
    totalClaims
  );

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>RAGAS Evaluation Framework (Automated Quality Metrics)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Overall RAGAS Score: {(ragasHarmonicMean * 100).toFixed(1)}%
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Context Precision</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>{(contextPrecision * 100).toFixed(0)}%</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Signal to noise in top-k</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Context Recall</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{(contextRecall * 100).toFixed(0)}%</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>All required facts found</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Faithfulness</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', margin: '4px 0' }}>{(faithfulness * 100).toFixed(0)}%</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Zero hallucinations</div>
            </div>
          </div>

          <MathBlock math={`\\text{RAGAS Harmonic Score} = \\frac{3}{\\frac{1}{\\text{Precision}} + \\frac{1}{\\text{Recall}} + \\frac{1}{\\text{Faithfulness}}} = ${(ragasHarmonicMean * 100).toFixed(1)}\\%`} />
        </div>

        <ControlPanel title="RAGAS Simulator" onReset={() => setRetrievedRelevant(4)}>
          <Slider
            label="Relevant Chunks in Top-5"
            value={retrievedRelevant}
            min={1}
            max={5}
            step={1}
            onChange={setRetrievedRelevant}
            formatValue={(v) => `${v} / 5 chunks relevant`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 163. RAG vs Fine-tuning
export const RagVsFineTuningViz: React.FC = () => {
  const criteria = [
    { dimension: 'Primary Purpose', rag: 'Access dynamic external factual knowledge', ft: 'Adapt tone, style, syntax, and behavioral rules' },
    { dimension: 'Data Updates', rag: 'Instant (add vector to database in ms)', ft: 'Slow (requires full retraining pipeline)' },
    { dimension: 'Hallucination Rate', rag: 'Low (grounded with source citations)', ft: 'Moderate to High (can hallucinate facts)' },
    { dimension: 'Compute & Cost', rag: 'Low training cost, query vector lookup', ft: 'High GPU fine-tuning and checkpoint cost' },
    { dimension: 'Domain Syntax/Format', rag: 'Requires strict prompt engineering', ft: 'Native (model outputs schema naturally)' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>RAG vs Fine-Tuning Decision Rubric</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Knowledge Injection vs Behavioral Adaptation
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            {criteria.map((c, idx) => (
              <div key={idx} style={{ padding: '10px 12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{c.dimension}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.74rem' }}>
                  <div style={{ color: '#38bdf8' }}><strong>RAG:</strong> {c.rag}</div>
                  <div style={{ color: '#10b981' }}><strong>Fine-Tuning:</strong> {c.ft}</div>
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{Production Architecture: } \\operatorname{LLM}_{\\text{Fine-Tuned for Syntax}}(\\operatorname{RAG}_{\\text{Dynamic Private Knowledge}}(\\text{Query}))`} />
        </div>

        <ControlPanel title="Decision Strategy" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Best practice in enterprise AI is hybrid: fine-tune for domain behavior and JSON output syntax, and use RAG for live dynamic knowledge.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
