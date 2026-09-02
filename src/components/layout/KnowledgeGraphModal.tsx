import React, { useState, useEffect } from 'react';
import { Network, X, CheckCircle2, Circle, Compass, Sparkles } from 'lucide-react';
import { GUIDED_LEARNING_TRACKS, LearningTrack } from '../../model/learningPaths';
import { CONCEPTS } from '../../model/concept-registry';
import { Concept } from '../../model/types';
import { useStore } from '../../store/useStore';
import { PipelineDiagram, PipelineStage, PipelineConnection } from '../viz/diagrams/PipelineDiagram';
import styles from './KnowledgeGraphModal.module.css';

interface KnowledgeGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept: (concept: Concept) => void;
}

const MILESTONE_STAGES: PipelineStage[] = [
  { id: '1', label: '1. Perceptron', badge: 'Foundations', role: 'input', description: 'Weights, bias, activations' },
  { id: '19', label: '19. Word2Vec', badge: 'Vectors', role: 'layer', description: 'Dense continuous embeddings' },
  { id: '38', label: '38. Recurrent NN', badge: 'Sequences', role: 'layer', description: 'Hidden recurrent memory' },
  { id: '48', label: '48. Self-Attention', badge: 'Transformers', role: 'layer', description: 'Scaled dot-product Q, K, V' },
  { id: '114', label: '114. Supervised FT', badge: 'Alignment', role: 'layer', description: 'Instruction tuning' },
  { id: '152', label: '152. RAG Pipeline', badge: 'Retrieval', role: 'layer', description: 'Vector store knowledge' },
  { id: '178', label: '178. Agent Loop', badge: 'Autonomy', role: 'output', description: 'Tool calling and planning' },
];

const MILESTONE_CONNECTIONS: PipelineConnection[] = [
  { from: '1', to: '19', label: 'Representations' },
  { from: '19', to: '38', label: 'Temporal dynamics' },
  { from: '38', to: '48', label: 'Direct attention' },
  { from: '48', to: '114', label: 'Pre-training base' },
  { from: '114', to: '152', label: 'Instruction aligned' },
  { from: '152', to: '178', label: 'Augmented context' },
];

export const KnowledgeGraphModal: React.FC<KnowledgeGraphModalProps> = ({
  isOpen,
  onClose,
  onSelectConcept,
}) => {
  const [activeTab, setActiveTab] = useState<'tracks' | 'graph'>('tracks');
  const { isConceptComplete } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConceptClick = (conceptNumber: number) => {
    const found = CONCEPTS.find((c) => c.number === conceptNumber);
    if (found) {
      onSelectConcept(found);
      window.location.hash = `#/${found.categorySlug}/${found.slug}`;
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.brandIcon}>
              <Network size={20} />
            </div>
            <div className={styles.title}>Knowledge Pathways</div>
          </div>

          <div className={styles.tabRow}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'tracks' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('tracks')}
            >
              <Compass size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
              Guided Tracks
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'graph' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              <Sparkles size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
              Architecture Flow
            </button>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {activeTab === 'tracks' ? (
            <div className={styles.tracksList}>
              {GUIDED_LEARNING_TRACKS.map((track: LearningTrack) => {
                const completedCount = track.conceptNumbers.filter((num) => {
                  const c = CONCEPTS.find((concept) => concept.number === num);
                  return c ? isConceptComplete(c.id) : false;
                }).length;
                const total = track.conceptNumbers.length;
                const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

                const diffClass =
                  track.difficulty === 'Beginner'
                    ? styles.diffBeginner
                    : track.difficulty === 'Intermediate'
                    ? styles.diffIntermediate
                    : styles.diffAdvanced;

                return (
                  <div key={track.id} className={styles.trackCard}>
                    <div className={styles.trackHeader}>
                      <div>
                        <div className={styles.trackTitle}>{track.title}</div>
                        <div className={styles.trackDesc}>{track.description}</div>
                      </div>
                      <span className={`${styles.diffBadge} ${diffClass}`}>
                        {track.difficulty}
                      </span>
                    </div>

                    <div className={styles.trackProgressRow}>
                      <div className={styles.trackProgressBar}>
                        <div
                          className={styles.trackProgressFill}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={styles.trackProgressText}>
                        {completedCount}/{total} completed ({pct}%)
                      </span>
                    </div>

                    <div className={styles.conceptChipsGrid}>
                      {track.conceptNumbers.map((num) => {
                        const concept = CONCEPTS.find((c) => c.number === num);
                        if (!concept) return null;
                        const complete = isConceptComplete(concept.id);

                        return (
                          <button
                            key={num}
                            type="button"
                            className={`${styles.conceptChip} ${
                              complete ? styles.conceptChipCompleted : ''
                            }`}
                            onClick={() => handleConceptClick(num)}
                            title={concept.title}
                          >
                            {complete ? (
                              <CheckCircle2 size={12} className={styles.chipCheck} />
                            ) : (
                              <Circle size={12} style={{ opacity: 0.3 }} />
                            )}
                            <span className={styles.chipNum}>#{num}</span>
                            <span>{concept.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.graphContainer}>
              <div className={styles.graphHint}>
                <span>Core evolutionary milestones from single perceptrons to autonomous agents</span>
                <span>Interactive diagram (zoom and pan supported)</span>
              </div>
              <div className={styles.graphCanvas}>
                <PipelineDiagram
                  stages={MILESTONE_STAGES}
                  connections={MILESTONE_CONNECTIONS}
                  direction="horizontal"
                  height={480}
                  showMiniMap={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
