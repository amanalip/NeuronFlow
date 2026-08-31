import React, { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Concept } from '../../model/types';
import { useStore } from '../../store/useStore';
import { ConceptVisualizer } from '../concepts/ConceptVisualizer';
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

  return (
    <main className={styles.canvasContainer}>
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <div className={styles.breadcrumbs}>
            <span>Category {concept.categoryNumber}</span>
            <span>/</span>
            <span>{concept.category}</span>
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
