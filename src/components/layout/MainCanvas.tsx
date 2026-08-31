import React from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
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
  const { isConceptComplete, toggleConceptComplete } = useStore();

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
        </div>

        <div className={styles.actionsRow}>
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
