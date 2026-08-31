import React, { useState } from 'react';
import { Copy, Check, ExternalLink, X, BookMarked, ArrowRight } from 'lucide-react';
import { Concept } from '../../model/types';
import { useStore } from '../../store/useStore';
import { getRelatedConceptNumbers } from '../../model/glossary';
import { CONCEPTS } from '../../model/concept-registry';
import styles from './ExplanationPanel.module.css';

interface ExplanationPanelProps {
  concept?: Concept;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ concept }) => {
  const { explanationOpen, toggleExplanation } = useStore();
  const [copied, setCopied] = useState(false);

  const copyExplanation = () => {
    if (!concept) return;
    const text = [
      `${concept.title} (#${concept.number})`,
      '',
      'WHAT IT IS:',
      concept.explanation.what,
      '',
      'WHY IT MATTERS:',
      concept.explanation.why,
      '',
      'HOW IT WORKS:',
      ...concept.explanation.how.map((step, idx) => `${idx + 1}. ${step}`),
      '',
      'KEY TAKEAWAY:',
      concept.explanation.keyTakeaway,
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const relatedNumbers = concept ? getRelatedConceptNumbers(concept.number) : [];
  const relatedConcepts = relatedNumbers
    .map((num) => CONCEPTS.find((c) => c.number === num))
    .filter((c): c is Concept => !!c);

  return (
    <aside className={`${styles.panel} ${!explanationOpen ? styles.panelClosed : ''}`}>
      <div className={styles.panelHeader}>
        <div className={styles.headerTitle}>Explanation</div>
        <div className={styles.headerActions}>
          {concept && (
            <button
              className={styles.iconBtn}
              onClick={copyExplanation}
              title="Copy explanation text"
              aria-label="Copy explanation"
            >
              {copied ? <Check size={15} color="var(--success-color)" /> : <Copy size={15} />}
            </button>
          )}
          <button
            className={styles.iconBtn}
            onClick={toggleExplanation}
            title="Close explanation panel"
            aria-label="Close explanation panel"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className={styles.panelBody}>
        {!concept ? (
          <div className={styles.emptyNotice}>
            <BookMarked size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p>Select a concept to view its full technical explanation and references.</p>
          </div>
        ) : (
          <>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>What It Is</div>
              <p className={styles.sectionContent}>{concept.explanation.what}</p>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Why It Matters</div>
              <p className={styles.sectionContent}>{concept.explanation.why}</p>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>How It Works</div>
              <ol className={styles.stepList}>
                {concept.explanation.how.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Key Takeaway</div>
              <div className={styles.keyTakeawayBox}>
                {concept.explanation.keyTakeaway}
              </div>
            </div>

            {/* Related Concepts (See Also) Cross-References */}
            {relatedConcepts.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>See Also & Related Concepts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {relatedConcepts.map((rc) => (
                    <button
                      key={rc.id}
                      type="button"
                      onClick={() => {
                        window.location.hash = `#/${rc.categorySlug}/${rc.slug}`;
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span>#{rc.number} {rc.title}</span>
                      <ArrowRight size={12} color="var(--accent-color)" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {concept.explanation.sources && concept.explanation.sources.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Sources & References</div>
                <ul className={styles.sourcesList}>
                  {concept.explanation.sources.map((src, idx) => (
                    <li key={idx}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={styles.sourceLink}
                      >
                        <ExternalLink size={12} />
                        <span>
                          {src.title}
                          {src.year ? ` (${src.year})` : ''}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
