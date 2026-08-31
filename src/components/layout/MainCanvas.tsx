import React, { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen, Info, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react';
import { Concept } from '../../model/types';
import { useStore } from '../../store/useStore';
import { ConceptVisualizer } from '../concepts/ConceptVisualizer';
import { PREREQUISITES_MAP, getEstimatedReadMinutes } from '../../model/learningPaths';
import { CONCEPTS } from '../../model/concept-registry';
import styles from './MainCanvas.module.css';

interface MainCanvasProps {
  concept?: Concept;
  prevConcept?: Concept;
  nextConcept?: Concept;
  children?: React.ReactNode;
  onNavigate?: (concept: Concept) => void;
}

export const MainCanvas: React.FC<MainCanvasProps> = ({
  concept,
  prevConcept,
  nextConcept,
  children,
  onNavigate,
}) => {
  const { isConceptComplete, toggleConceptComplete, explanationOpen, toggleExplanation } = useStore();
  const [showOverview, setShowOverview] = useState(false);

  if (!concept) {
    return (
      <main className={styles.canvasContainer}>
        <div className={styles.canvasBody}>
          <div className={styles.placeholderCard}>
            <BookOpen size={48} color="var(--accent-color)" />
            <h2>Welcome to NeuronFlow</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Select a concept from the sidebar to explore interactive visualizations of neural networks, transformers, and LLMs.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const completed = isConceptComplete(concept.id);
  const readMinutes = getEstimatedReadMinutes(concept.difficulty);

  // Prerequisite resolution
  const prereqNumbers = PREREQUISITES_MAP[concept.number] || [];
  const incompletePrereqs = prereqNumbers
    .map((num) => CONCEPTS.find((c) => c.number === num))
    .filter((c): c is Concept => !!c && !isConceptComplete(c.id));

  return (
    <main className={styles.canvasContainer}>
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <div className={styles.breadcrumbs}>
            <span>Category {concept.categoryNumber}</span>
            <span>/</span>
            <span>{concept.category}</span>
            <span>&bull;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-color)' }}>
              <Clock size={12} />
              {readMinutes} min read
            </span>
          </div>
          <div className={styles.titleRow}>
            <h1 className={styles.conceptHeading}>
              #{concept.number} {concept.title}
            </h1>
          </div>
          <p className={styles.conceptSummary}>{concept.summary}</p>
        </div>

        <div className={styles.actionsRow}>
          <button
            className={`${styles.infoToggleBtn} ${explanationOpen ? styles.infoToggleBtnActive : ''}`}
            onClick={toggleExplanation}
            title="Toggle technical explanation panel"
            aria-label="Toggle technical explanation panel"
          >
            <Info size={16} />
            <span>Explanation</span>
          </button>
          <button
            className={`${styles.completeBtn} ${completed ? styles.completedActive : ''}`}
            onClick={() => toggleConceptComplete(concept.id)}
          >
            <CheckCircle2 size={16} />
            <span>{completed ? 'Completed' : 'Mark as complete'}</span>
          </button>
        </div>
      </div>

      <div className={styles.canvasBody}>
        {/* Prerequisite gentle reminder if any prerequisite is incomplete */}
        {incompletePrereqs.length > 0 && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="#38bdf8" />
              <span>
                <strong>Prerequisite Suggestion:</strong> You might want to check out{' '}
                {incompletePrereqs.map((pr, idx) => (
                  <React.Fragment key={pr.id}>
                    {idx > 0 && ', '}
                    <button
                      type="button"
                      onClick={() => onNavigate?.(pr)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-color)',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontWeight: 600,
                        padding: 0,
                        font: 'inherit',
                      }}
                    >
                      #{pr.number} {pr.title}
                    </button>
                  </React.Fragment>
                ))}{' '}
                first.
              </span>
            </div>
          </div>
        )}

        {/* Quick Concept Overview Card */}
        <div className={styles.quickOverviewCard}>
          <button
            type="button"
            className={styles.quickOverviewHeader}
            onClick={() => setShowOverview((prev) => !prev)}
            aria-expanded={showOverview}
          >
            <div className={styles.quickOverviewTitle}>
              <Info size={16} color="var(--accent-color)" />
              <span>Concept Overview & Key Takeaway</span>
            </div>
            {showOverview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showOverview && (
            <div className={styles.quickOverviewContent}>
              <div className={styles.quickOverviewSection}>
                <strong>What It Is: </strong>
                <span>{concept.explanation.what}</span>
              </div>
              <div className={styles.quickOverviewSection}>
                <strong>Why It Matters: </strong>
                <span>{concept.explanation.why}</span>
              </div>
              <div className={styles.quickOverviewTakeaway}>
                <strong>Key Takeaway: </strong>
                <span>{concept.explanation.keyTakeaway}</span>
              </div>
            </div>
          )}
        </div>

        {children || <ConceptVisualizer concept={concept} />}
      </div>

      <footer className={styles.navBar}>
        <button
          className={styles.navBtn}
          disabled={!prevConcept}
          onClick={() => prevConcept && onNavigate?.(prevConcept)}
        >
          <ChevronLeft size={16} />
          <span>
            {prevConcept ? `#${prevConcept.number} ${prevConcept.title}` : 'Previous'}
          </span>
        </button>

        <button
          className={styles.navBtn}
          disabled={!nextConcept}
          onClick={() => nextConcept && onNavigate?.(nextConcept)}
        >
          <span>
            {nextConcept ? `#${nextConcept.number} ${nextConcept.title}` : 'Next'}
          </span>
          <ChevronRight size={16} />
        </button>
      </footer>
    </main>
  );
};
