import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeReciprocalRankFusion } from './category13Math';
import styles from '../category01/Category01.module.css';

// 156. Vector Store & 157. Similarity Search (kNN vs ANN)
export const VectorStoreSimilarityViz: React.FC = () => {
  const [dbSize, setDbSize] = useState<number>(500); // in thousands of vectors

  const knnTimeMs = (dbSize * 0.08).toFixed(1);
  const annTimeMs = (Math.log2(dbSize) * 0.45 + 0.5).toFixed(2);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Exhaustive kNN vs Approximate Nearest Neighbors (ANN)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Database Scale: {dbSize.toLocaleString()}k Vectors
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #ef4444' }}>
              <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>Exhaustive Exact kNN (Linear O(N))</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, margin: '4px 0' }}>{knnTimeMs} ms</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Calculates dot product on every vector</div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Graph-Based ANN (Logarithmic O(log N))</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, margin: '4px 0' }}>{annTimeMs} ms (99.2% Recall)</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>HNSW hierarchical graph routing</div>
            </div>
          </div>

          <MathBlock math={`\\text{ANN Speedup: } \\frac{T_{\\text{kNN}}}{T_{\\text{ANN}}} = \\frac{${knnTimeMs} \\text{ ms}}{${annTimeMs} \\text{ ms}} \\approx ${(parseFloat(knnTimeMs) / Math.max(0.01, parseFloat(annTimeMs))).toFixed(0)}\\times \\text{ faster}`} />
        </div>

        <ControlPanel title="Vector Index Scale" onReset={() => setDbSize(500)}>
          <Slider
            label="Vector Count (Thousands)"
            value={dbSize}
            min={10}
            max={2000}
            step={50}
            onChange={setDbSize}
            formatValue={(v) => `${v.toLocaleString()},000 Vectors`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 158. HNSW (Hierarchical Navigable Small World)
export const HnswViz: React.FC = () => {
  const [currentLayer, setCurrentLayer] = useState<number>(2);

  const layers = [
    { level: 2, name: 'Layer 2: Express Highway', density: 'Very Sparse', linkRange: 'Long-range global hops across vector space' },
    { level: 1, name: 'Layer 1: Regional Roads', density: 'Moderate', linkRange: 'Intermediate-range local cluster traversal' },
    { level: 0, name: 'Layer 0: Local Streets', density: 'Dense (All Vectors)', linkRange: 'Fine-grained nearest neighbor selection' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>HNSW: Multi-Layer Proximity Graph (Malkov & Yashunin)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Logarithmic-Time Vector Routing
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            {layers.map((l) => (
              <div
                key={l.level}
                onClick={() => setCurrentLayer(l.level)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: currentLayer === l.level ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: currentLayer === l.level ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.84rem', color: currentLayer === l.level ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                    {l.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    Density: {l.density}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {l.linkRange}
                </p>
              </div>
            ))}
          </div>

          <MathBlock math={`P(\\text{node in layer } l) = \\exp\\left(-l / m_L\\right) \\quad \\text{where } m_L = \\frac{1}{\\ln(M)}`} />
        </div>

        <ControlPanel title="HNSW Hierarchy" onReset={() => setCurrentLayer(2)}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            HNSW skips through upper sparse layers to rapidly approach the neighborhood of the query vector before fine-tuning in bottom layers.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 159. Hybrid Search (BM25 + Vector RRF)
export const HybridSearchViz: React.FC = () => {
  const [bm25Rank, setBm25Rank] = useState<number>(1);
  const [vectorRank, setVectorRank] = useState<number>(4);

  const rrfScore = computeReciprocalRankFusion(bm25Rank, vectorRank, 60);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Hybrid Search: Reciprocal Rank Fusion (RRF)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Combined Fusion Score: {rrfScore.toFixed(5)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BM25 Keyword Rank</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b', margin: '4px 0' }}>#{bm25Rank}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>1 / (60 + {bm25Rank}) = {(1 / (60 + bm25Rank)).toFixed(5)}</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dense Vector Rank</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>#{vectorRank}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>1 / (60 + {vectorRank}) = {(1 / (60 + vectorRank)).toFixed(5)}</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fused RRF Score</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', margin: '4px 0' }}>{rrfScore.toFixed(5)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Balanced rank sum</div>
            </div>
          </div>

          <MathBlock math={`\\operatorname{RRF}(d) = \\frac{1}{k + r_{\\text{BM25}}(d)} + \\frac{1}{k + r_{\\text{Vector}}(d)} = \\frac{1}{60 + ${bm25Rank}} + \\frac{1}{60 + ${vectorRank}} = ${rrfScore.toFixed(5)}`} />
        </div>

        <ControlPanel title="Candidate Ranks" onReset={() => { setBm25Rank(1); setVectorRank(4); }}>
          <Slider
            label="BM25 Lexical Rank"
            value={bm25Rank}
            min={1}
            max={20}
            step={1}
            onChange={setBm25Rank}
            formatValue={(v) => `Rank #${v}`}
          />

          <Slider
            label="Vector Semantic Rank"
            value={vectorRank}
            min={1}
            max={20}
            step={1}
            onChange={setVectorRank}
            formatValue={(v) => `Rank #${v}`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 160. Re-ranking (Bi-Encoder vs Cross-Encoder)
export const ReRankingViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Two-Stage Retrieval & Cross-Encoder Re-ranking</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Stage 1 (Recall) $\to$ Stage 2 (Precision)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.84rem' }}>Stage 1: Bi-Encoder (Fast Search)</div>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Embeds Query and Documents independently</li>
                <li>Retrieves Top-100 candidates in &lt; 5 ms</li>
                <li>No cross-token interaction during search</li>
              </ul>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--accent-color)' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-color)', fontSize: '0.84rem' }}>Stage 2: Cross-Encoder (Precise Score) ★</div>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Processes [CLS] Query [SEP] Document together</li>
                <li>Full cross-attention across all query & passage tokens</li>
                <li>Re-orders candidates and emits top-5 to prompt</li>
              </ul>
            </div>
          </div>

          <MathBlock math={`\\text{Cross-Encoder Score: } s = \\operatorname{Softmax}\\left(\\operatorname{BERT}(\\text{[CLS]} \\circ Q \\circ \\text{[SEP]} \\circ D)\\right)`} />
        </div>

        <ControlPanel title="Re-ranking Benefits" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Two-stage retrieval delivers both high recall across massive collections and maximum semantic precision for LLM generation.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
