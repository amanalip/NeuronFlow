import React from 'react';
import { Concept } from '../../model/types';
import { Category01Dispatcher } from './category01/Category01Dispatcher';
import { Category02Dispatcher } from './category02/Category02Dispatcher';
import { Category03Dispatcher } from './category03/Category03Dispatcher';
import { Category04Dispatcher } from './category04/Category04Dispatcher';
import { Category05Dispatcher } from './category05/Category05Dispatcher';
import { Category06Dispatcher } from './category06/Category06Dispatcher';
import { Category07Dispatcher } from './category07/Category07Dispatcher';
import { Category08Dispatcher } from './category08/Category08Dispatcher';
import { Category09Dispatcher } from './category09/Category09Dispatcher';
import { Category10Dispatcher } from './category10/Category10Dispatcher';
import { Category11Dispatcher } from './category11/Category11Dispatcher';
import { Category12Dispatcher } from './category12/Category12Dispatcher';
import { Category13Dispatcher } from './category13/Category13Dispatcher';
import { Category14Dispatcher } from './category14/Category14Dispatcher';
import { Category15Dispatcher } from './category15/Category15Dispatcher';
import { Category16Dispatcher } from './category16/Category16Dispatcher';
import { Sparkles } from 'lucide-react';
import styles from '../layout/MainCanvas.module.css';

interface ConceptVisualizerProps {
  concept: Concept;
}

export const ConceptVisualizer: React.FC<ConceptVisualizerProps> = ({ concept }) => {
  if (concept.categoryNumber === 1) {
    return <Category01Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 2) {
    return <Category02Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 3) {
    return <Category03Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 4) {
    return <Category04Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 5) {
    return <Category05Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 6) {
    return <Category06Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 7) {
    return <Category07Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 8) {
    return <Category08Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 9) {
    return <Category09Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 10) {
    return <Category10Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 11) {
    return <Category11Dispatcher slug={concept.slug} />;
  }

  if (concept.categoryNumber === 12) {
    return <Category12Dispatcher concept={concept} />;
  }

  if (concept.categoryNumber === 13) {
    return <Category13Dispatcher concept={concept} />;
  }

  if (concept.categoryNumber === 14) {
    return <Category14Dispatcher concept={concept} />;
  }

  if (concept.categoryNumber === 15) {
    return <Category15Dispatcher concept={concept} />;
  }

  if (concept.categoryNumber === 16) {
    return <Category16Dispatcher concept={concept} />;
  }

  return (
    <div className={styles.placeholderCard}>
      <Sparkles size={36} color="var(--accent-color)" />
      <h3>{concept.title} Interactive Visualization</h3>
      <p style={{ color: 'var(--text-secondary)' }}>{concept.summary}</p>
    </div>
  );
};
