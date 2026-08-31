import React, { useMemo } from 'react';
import katex from 'katex';
import styles from './MathBlock.module.css';

interface MathBlockProps {
  math: string;
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({ math, className }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return null;
    }
  }, [math]);

  if (!html) {
    return <div className={styles.mathError}>{math}</div>;
  }

  return (
    <div
      className={`${styles.mathBlock} ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const InlineMath: React.FC<MathBlockProps> = ({ math, className }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return null;
    }
  }, [math]);

  if (!html) {
    return <span className={styles.mathError}>{math}</span>;
  }

  return (
    <span
      className={`${styles.inlineMath} ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
