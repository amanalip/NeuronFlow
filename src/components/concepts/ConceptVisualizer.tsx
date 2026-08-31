import React from 'react';
import { Concept } from '../../model/types';
import { Category01Dispatcher } from './category01/Category01Dispatcher';
import { Sparkles } from 'lucide-react';
import styles from '../layout/MainCanvas.module.css';

interface ConceptVisualizerProps {
  concept: Concept;
}

export const ConceptVisualizer: React.FC<ConceptVisualizerProps> = ({ concept }) => {
  if (concept.categoryNumber === 1) {
    return <Category01Dispatcher slug={concept.slug} />;
  }

  return (
    <div className={styles.placeholderCard}>
      <Sparkles size={36} color="var(--accent-color)" />
      <h3>{concept.title} Interactive Visualization</h3>
      <p style={{ color: 'var(--text-secondary)' }}>{concept.summary}</p>
    </div>
  );
};
