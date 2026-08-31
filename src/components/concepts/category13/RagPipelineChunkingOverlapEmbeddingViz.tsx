import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { chunkTextWithOverlap, computeCosineSimilarity } from './category13Math';
import styles from '../category01/Category01.module.css';

// 152. RAG Pipeline (Full)
export const RagPipelineViz: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    { title: '1. Ingestion & Extraction', desc: 'Parse raw PDFs, HTML, Word docs, and markdown into clean plain text streams.' },
    { title: '2. Text Chunking', desc: 'Split text into semantic segments (e.g. 256 tokens) with 50-token sliding overlap.' },
    { title: '3. Vector Embedding', desc: 'Convert text chunks into dense 1536-dimensional vectors using bi-encoder models.' },
    { title: '4. Vector Indexing', desc: 'Store embeddings in an HNSW / IVF vector database with attached metadata attributes.' },
    { title: '5. Query Retrieval', desc: 'Encode user query and retrieve top-k nearest neighbor document chunks.' },
    { title: '6. Cross-Encoder Rerank', desc: 'Score query-chunk pairs jointly to promote most authoritative context.' },
    { title: '7. Prompt Generation', desc: 'Assemble grounded prompt with system instructions and emit accurate completion.' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>End-to-End Retrieval-Augmented Generation Architecture</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Stage {activeStage + 1} of {stages.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0' }}>
            {stages.map((st, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStage(idx)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: activeStage === idx ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: activeStage === idx ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: activeStage === idx ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                  {st.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {st.desc}
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{Grounded Response: } y = \\operatorname{LLM}\\left([\\text{System Directive}, \\, \\operatorname{Retrieve}_{k}(\\text{Query}, \\mathcal{D}), \\, \\text{Query}]\\right)`} />
        </div>

        <ControlPanel title="Pipeline Inspector" onReset={() => setActiveStage(0)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Click on any pipeline stage to inspect its data transformation and role in grounding model responses.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 153. Document Chunking & 154. Chunk Overlap
export const DocumentChunkingViz: React.FC = () => {
  const sampleDoc =
    'Transformer neural networks rely on multi-head self-attention mechanisms to compute pairwise token interactions across entire sequences in parallel. Positional encodings provide crucial order information because self-attention is permutation-invariant. Layer normalization and residual connections stabilize deep gradient propagation during training, enabling architectures like LLaMA and GPT-4 to scale effectively across billions of parameters.';

  const [chunkSize, setChunkSize] = useState<number>(18);
  const [overlap, setOverlap] = useState<number>(5);

  const chunks = chunkTextWithOverlap(sampleDoc, chunkSize, overlap);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Document Chunking & Sliding Overlap Window</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {chunks.length} Total Chunks Generated
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0', maxHeight: '280px', overflowY: 'auto' }}>
            {chunks.map((c) => (
              <div
                key={c.chunkIndex}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--accent-color)' }}>Chunk #{c.chunkIndex + 1}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Words {c.startWord} to {c.endWord}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  &ldquo;{c.text}&rdquo;
                </p>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{Step Size: } S = C - O = ${chunkSize} - ${overlap} = ${Math.max(1, chunkSize - overlap)} \\text{ words per step}`} />
        </div>

        <ControlPanel title="Chunking Parameters" onReset={() => { setChunkSize(18); setOverlap(5); }}>
          <Slider
            label="Chunk Size (Words)"
            value={chunkSize}
            min={10}
            max={35}
            step={1}
            onChange={setChunkSize}
            formatValue={(v) => `${v} words`}
          />

          <Slider
            label="Overlap Window (Words)"
            value={overlap}
            min={0}
            max={Math.min(12, chunkSize - 1)}
            step={1}
            onChange={setOverlap}
            formatValue={(v) => `${v} words (${Math.round((v / chunkSize) * 100)}% overlap)`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 155. Embedding Documents (Dense Vectors)
export const EmbeddingDocumentsViz: React.FC = () => {
  const [metric, setMetric] = useState<'cosine' | 'dot'>('cosine');

  const queryVector = [0.45, 0.72, -0.18, 0.33];
  const docVector = [0.42, 0.68, -0.22, 0.38];
  const irrelVector = [-0.65, 0.12, 0.58, -0.31];

  const relevantSim = computeCosineSimilarity(queryVector, docVector);
  const irrelSim = computeCosineSimilarity(queryVector, irrelVector);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Dense Passage Embeddings (Bi-Encoder Geometry)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Normalized Vector Dot Product
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Semantic Match: Relevant Passage</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{(relevantSim * 100).toFixed(1)}% Match</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Cosine Similarity: {relevantSim.toFixed(4)}</div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #ef4444' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Semantic Divergence: Irrelevant Passage</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ef4444', margin: '4px 0' }}>{(irrelSim * 100).toFixed(1)}% Match</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Cosine Similarity: {irrelSim.toFixed(4)}</div>
            </div>
          </div>

          <MathBlock math={`\\operatorname{sim}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2} = \\frac{\\sum_{i=1}^d u_i v_i}{\\sqrt{\\sum u_i^2} \\sqrt{\\sum v_i^2}}`} />
        </div>

        <ControlPanel title="Similarity Metric" onReset={() => setMetric('cosine')}>
          <RadioGroup
            label="Distance Function"
            value={metric}
            options={[
              { value: 'cosine', label: 'Cosine Similarity (Normalized [-1, 1])' },
              { value: 'dot', label: 'Inner Dot Product (Requires L2-normalized vectors)' },
            ]}
            onChange={(v) => setMetric(v as 'cosine' | 'dot')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
