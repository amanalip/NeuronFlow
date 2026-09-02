import React, { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen, Info, Clock, AlertCircle } from 'lucide-react';
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
          <div className={styles.metaRow}>
            <span className={styles.categoryPill}>
              Category {concept.categoryNumber}: {concept.category}
            </span>
            <span className={`${styles.difficultyPill} ${
              concept.difficulty === 'Beginner'
                ? styles.diffBeginner
                : concept.difficulty === 'Intermediate'
                ? styles.diffIntermediate
                : styles.diffAdvanced
            }`}>
              {concept.difficulty}
            </span>
            <span className={styles.readTimePill}>
              <Clock size={12} />
              {readMinutes} min read
            </span>
          </div>

          <div className={styles.titleRow}>
            <span className={styles.conceptNumberTag}>#{concept.number}</span>
            <h1 className={styles.conceptHeading}>{concept.title}</h1>
          </div>

          <p className={styles.conceptSummary}>{concept.summary}</p>
        </div>

        <div className={styles.actionsRow}>
          <button
            className={`${styles.actionBtn} ${showOverview ? styles.actionBtnActive : ''}`}
            onClick={() => setShowOverview((prev) => !prev)}
            title="Toggle quick overview and key takeaway"
            aria-label="Toggle quick overview"
          >
            <BookOpen size={15} />
            <span>Overview</span>
          </button>

          <button
            className={`${styles.actionBtn} ${explanationOpen ? styles.actionBtnActive : ''}`}
            onClick={toggleExplanation}
            title="Toggle technical explanation drawer"
            aria-label="Toggle technical explanation panel"
          >
            <Info size={15} />
            <span>Explanation</span>
          </button>

          <button
            className={`${styles.completeBtn} ${completed ? styles.completedActive : ''}`}
            onClick={() => toggleConceptComplete(concept.id)}
            title={completed ? 'Mark as incomplete' : 'Mark concept as completed'}
            aria-label={completed ? 'Completed' : 'Mark as complete'}
          >
            <CheckCircle2 size={15} />
            <span>{completed ? 'Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>

      <div className={styles.canvasBody}>
        {/* Prerequisite banner if any prerequisite is incomplete */}
        {incompletePrereqs.length > 0 && (
          <div className={styles.prereqBanner}>
            <div className={styles.prereqLeft}>
              <AlertCircle size={15} className={styles.prereqIcon} />
              <span className={styles.prereqText}>
                <strong>Recommended Prerequisite:</strong> Consider exploring{' '}
                {incompletePrereqs.map((pr, idx) => (
                  <React.Fragment key={pr.id}>
                    {idx > 0 && ', '}
                    <button
                      type="button"
                      onClick={() => onNavigate?.(pr)}
                      className={styles.prereqLink}
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

        {/* Quick Concept Overview Accordion */}
        {showOverview && (
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <div className={styles.overviewCardLabel}>What It Is</div>
              <p className={styles.overviewCardText}>{concept.explanation.what}</p>
            </div>
            <div className={styles.overviewCard}>
              <div className={styles.overviewCardLabel}>Why It Matters</div>
              <p className={styles.overviewCardText}>{concept.explanation.why}</p>
            </div>
            <div className={`${styles.overviewCard} ${styles.overviewCardHighlight}`}>
              <div className={styles.overviewCardLabel}>Key Takeaway</div>
              <p className={styles.overviewCardText}>{concept.explanation.keyTakeaway}</p>
            </div>
          </div>
        )}

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
