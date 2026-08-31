import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 208. Evolution Timeline
export const EvolutionTimelineViz: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2017);

  const timelineEvents: Record<number, { title: string; desc: string; significance: string }> = {
    2013: { title: 'Word2Vec (Mikolov et al.)', desc: 'Introduced dense distributed word embeddings (Skip-gram, CBOW), replacing sparse one-hot encodings.', significance: 'Represented words as continuous vectors capturing geometric semantic relationships.' },
    2014: { title: 'Seq2Seq (Sutskever et al.)', desc: 'Encoder-Decoder architecture using multi-layer LSTMs for machine translation.', significance: 'Enabled variable-length input to variable-length output sequence mapping.' },
    2015: { title: 'Attention Mechanism (Bahdanau et al.)', desc: 'Introduced dynamic soft alignment across encoder hidden states.', significance: 'Broke the information bottleneck of fixed-size recurrent context vectors.' },
    2017: { title: 'The Transformer (Vaswani et al.)', desc: 'Attention Is All You Need: Eliminated recurrence entirely in favor of parallel Self-Attention.', significance: 'Enabled massive parallel GPU pre-training, laying foundation for modern LLMs.' },
    2018: { title: 'BERT & GPT-1 (Devlin / Radford)', desc: 'Pre-training on massive unlabelled text followed by task fine-tuning (Masked LM & Autoregressive LM).', significance: 'Established the pre-train + fine-tune paradigm in modern NLP.' },
    2020: { title: 'GPT-3 (Brown et al.)', desc: 'Scaled autoregressive models to 175B parameters, demonstrating Few-Shot In-Context Learning.', significance: 'Showed that scale alone yields emergent instruction-following capabilities.' },
    2022: { title: 'InstructGPT & ChatGPT (Ouyang et al.)', desc: 'Reinforcement Learning from Human Feedback (RLHF) aligned models with user intent.', significance: 'Ignited the global consumer AI era.' },
    2023: { title: 'LLaMA & Open Weights (Meta)', desc: 'High-quality open-weight foundation models trained on trillions of tokens.', significance: 'Democratized private fine-tuning and local edge AI deployment.' },
    2024: { title: 'Native Multimodal & Frontier Agents', desc: 'GPT-4o, Claude 3.5 Sonnet, and LLaMA 3 with omni-modal audio/vision and autonomous tool use.', significance: 'Shifted AI from text generators to proactive multi-modal reasoning agents.' },
  };

  const current = timelineEvents[selectedYear] || timelineEvents[2017];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>The Evolution of Modern AI (2013 &ndash; Present)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Year: {selectedYear}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '8px 0', margin: '8px 0' }}>
            {Object.keys(timelineEvents).map((y) => {
              const yr = Number(y);
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    backgroundColor: selectedYear === yr ? 'var(--accent-muted)' : 'var(--bg-primary)',
                    border: selectedYear === yr ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    color: selectedYear === yr ? 'var(--accent-color)' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                  }}
                >
                  {yr}
                </button>
              );
            })}
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '10px 0', borderLeft: '4px solid var(--accent-color)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {current.title}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
              {current.desc}
            </p>
            <div style={{ fontSize: '0.74rem', color: 'var(--accent-color)', fontWeight: 600 }}>
              ★ Historical Impact: {current.significance}
            </div>
          </div>

          <MathBlock math={`\\text{Compounding AI Breakthroughs: } \\text{Vectors (2013)} \\longrightarrow \\text{Attention (2015)} \\longrightarrow \\text{Transformer (2017)} \\longrightarrow \\text{RLHF (2022)}`} />
        </div>

        <ControlPanel title="Timeline Navigation" onReset={() => setSelectedYear(2017)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Click along the milestone buttons above to step through landmark moments in deep learning and NLP history.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 209. Model Family Tree
export const ModelFamilyTreeViz: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('gpt');

  const branches: Record<string, { name: string; color: string; lineage: string[]; desc: string }> = {
    gpt: {
      name: 'OpenAI GPT Lineage',
      color: '#38bdf8',
      lineage: ['GPT-1 (117M, 2018)', 'GPT-2 (1.5B, 2019)', 'GPT-3 (175B, 2020)', 'InstructGPT (RLHF, 2022)', 'GPT-4 (1.8T MoE, 2023)', 'GPT-4o (Omni, 2024)'],
      desc: 'Pioneered pure autoregressive decoder scaling, in-context few-shot learning, and RLHF alignment.',
    },
    llama: {
      name: 'Meta LLaMA Open Ecosystem',
      color: '#10b981',
      lineage: ['LLaMA-1 (7B-65B, 2023)', 'LLaMA-2 (7B-70B, 2023)', 'Code Llama (2023)', 'LLaMA-3 (8B-405B, 2024)', 'LLaMA-3.3 (70B, 2024)'],
      desc: 'Foundation of global open-source AI, compute-optimal Chinchilla token scaling, and local fine-tuning.',
    },
    anthropic: {
      name: 'Anthropic Claude Lineage',
      color: '#f59e0b',
      lineage: ['Claude 1 (2023)', 'Claude 2 (100k context, 2023)', 'Claude 3 Opus/Sonnet/Haiku (2024)', 'Claude 3.5 Sonnet (Artifacts, 2024)'],
      desc: 'Pioneered Constitutional AI (RLAIF), prompt caching, and long-context reasoning benchmarks.',
    },
    mistral: {
      name: 'Mistral & Sparse MoE Lineage',
      color: '#a855f7',
      lineage: ['Mistral 7B (GQA + SWA, 2023)', 'Mixtral 8x7B (Sparse MoE, 2023)', 'Mixtral 8x22B (2024)', 'Mistral Large 2 (123B, 2024)'],
      desc: 'Led modern open Mixture-of-Experts architectures delivering frontier throughput at fraction of active compute.',
    },
  };

  const current = branches[selectedBranch];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Model Family Tree & Branching Lineages</span>
            <span style={{ fontSize: '0.8rem', color: current.color }}>
              Lineage: {current.name}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', margin: '12px 0' }}>
            {Object.keys(branches).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSelectedBranch(k)}
                style={{
                  padding: '8px 4px',
                  borderRadius: '4px',
                  backgroundColor: selectedBranch === k ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: selectedBranch === k ? `2px solid ${branches[k].color}` : '1px solid var(--border-color)',
                  color: selectedBranch === k ? branches[k].color : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.74rem',
                  textAlign: 'center',
                }}
              >
                {branches[k].name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '10px 0' }}>
            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: current.color, marginBottom: '6px' }}>
              {current.name}
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              {current.desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {current.lineage.map((item, idx) => (
                <div key={idx} style={{ fontSize: '0.76rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {idx > 0 ? '↳ ' : '• '}{item}
                </div>
              ))}
            </div>
          </div>

          <MathBlock math={`\\text{Shared Ancestor: } \\operatorname{Transformer}_{2017} \\longrightarrow \\operatorname{Lineage}_{\\text{OpenAI}} \\; \\| \\; \\operatorname{Lineage}_{\\text{Meta}} \\; \\| \\; \\operatorname{Lineage}_{\\text{Anthropic}}`} />
        </div>

        <ControlPanel title="Family Branches" onReset={() => setSelectedBranch('gpt')}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            All modern LLMs descend from the 2017 Transformer paper, evolving into distinct proprietary and open-weight branches.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
