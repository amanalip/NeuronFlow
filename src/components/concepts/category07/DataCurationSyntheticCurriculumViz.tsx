import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 81. Data Curation Pipeline
export const DataCurationPipelineViz: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages = [
    { title: '1. Raw Web Crawl', count: '100 TB', desc: 'Raw HTML dumps from Common Crawl, news feeds, and public web archives.' },
    { title: '2. Quality Filtering', count: '40 TB', desc: 'fastText classifier, language identification, symbol ratio, and perplexity thresholding.' },
    { title: '3. Deduplication', count: '15 TB', desc: 'MinHash LSH and suffix array exact substring deduplication to remove SEO spam.' },
    { title: '4. PII Redaction', count: '14.8 TB', desc: 'Regex and NER models strip emails, phone numbers, IP addresses, and private records.' },
    { title: '5. Domain Blending', count: '15 TB (5T Tokens)', desc: 'Upsampling high-value domains: code repositories, mathematical proofs, textbooks, and synthetic reasoning.' },
  ];

  const current = stages[activeStage - 1];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Pre-training Data Filtering Pipeline</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Stage {activeStage} of 5 ({current.count})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stages.map((st, idx) => {
              const isSelected = activeStage === idx + 1;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStage(idx + 1)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'var(--accent-muted)' : 'var(--bg-primary)',
                    border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.84rem', color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                    {st.title}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {st.count}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', marginTop: '6px' }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-color)', fontSize: '0.84rem' }}>{current.title}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{current.desc}</p>
          </div>

          <MathBlock math={`\\mathcal{D}_{\\text{clean}} = \\operatorname{Blend}\\left(\\operatorname{Filter}\\left(\\operatorname{DeDup}(\\mathcal{D}_{\\text{raw}})\\right)\\right)`} />
        </div>

        <ControlPanel title="Pipeline Stages" onReset={() => setActiveStage(1)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            High-quality filtering and deduplication often yields greater downstream benchmark improvements than scaling parameter count.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 82. Synthetic Data Generation (Evol-Instruct Flywheel)
export const SyntheticDataGenerationViz: React.FC = () => {
  const [mutation, setMutation] = useState<'deepen' | 'complicate' | 'concretize'>('deepen');

  const seed = 'Write a Python function to sort a list.';

  const evolved = {
    deepen: 'Write an optimized in-place quicksort in Python with dual-pivot partitioning and explain why it outperforms single-pivot on random arrays.',
    complicate: 'Write a Python sorting function that handles custom objects with missing keys, supports arbitrary comparator lambdas, and runs asynchronously.',
    concretize: 'Implement an external merge sort in Python capable of sorting a 50GB log file with a 500MB memory ceiling using temporary chunk files.',
  };

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Evol-Instruct Synthetic Flywheel (WizardLM / Cosmopedia)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Mutation: {mutation.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seed Prompt:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>"{seed}"</div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', border: '1px solid var(--accent-color)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>Evolved Complex Prompt ({mutation}):</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                "{evolved[mutation]}"
              </div>
            </div>
          </div>

          <MathBlock math={`\\text{Model}_{t+1} = \\operatorname{Train}\\left(\\mathcal{D}_{\\text{human}} \\cup \\operatorname{Filter}(\\text{Model}_t(\\text{Evolve}(\\mathcal{P})))\\right)`} />
        </div>

        <ControlPanel title="Evolution Mutation" onReset={() => setMutation('deepen')}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['deepen', 'complicate', 'concretize'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMutation(m)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: mutation === m ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                  color: mutation === m ? '#ffffff' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                  textTransform: 'capitalize',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

// 83. Curriculum Learning
export const CurriculumLearningViz: React.FC = () => {
  const [phase, setPhase] = useState<number>(3);

  const curriculumPhases = [
    { title: 'Phase 1: General Web & Grammar', progress: '0% - 40%', mix: 'Common Crawl, Wikipedia, Web Dumps' },
    { title: 'Phase 2: High-Quality Knowledge', progress: '40% - 70%', mix: 'Textbooks, ArXiv Papers, Clean Articles' },
    { title: 'Phase 3: Code & Mathematical Reasoning', progress: '70% - 90%', mix: 'GitHub, StackOverflow, Math Olympiad, Synthetic Proofs' },
    { title: 'Phase 4: Annealing & Decay (Cooling)', progress: '90% - 100%', mix: 'Ultra-curated multi-turn dialogues, reasoning chains, high-weight instruction data' },
  ];

  const active = curriculumPhases[phase - 1];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Staged Pre-training Curriculum & Annealing</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {active.title}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            {curriculumPhases.map((cp, idx) => {
              const isSelected = phase === idx + 1;
              return (
                <div
                  key={idx}
                  onClick={() => setPhase(idx + 1)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'var(--accent-muted)' : 'var(--bg-secondary)',
                    border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)' }}>{cp.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cp.progress}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Data Mix: {cp.mix}</div>
                </div>
              );
            })}
          </div>

          <MathBlock math={`\\mathcal{L}_{\\text{total}} = \\sum_{s=1}^S \\mathbb{E}_{x \\sim \\mathcal{D}_s} [-\\log P(x; \\theta_s)] \\quad (\\text{Data Mix Shift across Training Steps})`} />
        </div>

        <ControlPanel title="Curriculum Schedule" onReset={() => setPhase(3)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Annealing (cooling) in the final 5-10% of training steps using high-quality synthetic and reasoning datasets yields dramatic capability boosts.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
