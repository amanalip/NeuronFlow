import React from 'react';
import styles from './ProbabilityBar.module.css';

export interface ProbabilityItem {
  token: string;
  probability: number;
  logit?: number;
  highlight?: boolean;
}

interface ProbabilityBarProps {
  data: ProbabilityItem[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
  showLogits?: boolean;
}

export const ProbabilityBar: React.FC<ProbabilityBarProps> = ({
  data,
  title = 'Token Probabilities',
  subtitle,
  maxItems = 10,
  showLogits = false,
}) => {
  const sorted = [...data].sort((a, b) => b.probability - a.probability).slice(0, maxItems);
  const maxProb = Math.max(...sorted.map((d) => d.probability), 0.0001);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div>
          <div className={styles.chartTitle}>{title}</div>
          {subtitle && <div className={styles.chartSubtitle}>{subtitle}</div>}
        </div>
      </div>

      <div className={styles.barsWrapper}>
        {sorted.map((item, index) => {
          const widthPercent = (item.probability / maxProb) * 100;
          const displayPercent = (item.probability * 100).toFixed(1);
          const isTop = index === 0;

          return (
            <div key={`${item.token}-${index}`} className={styles.barRow}>
              <span className={styles.tokenLabel} title={item.token}>
                {item.token === ' ' ? '␣ [space]' : item.token === '\n' ? '\\n' : item.token}
              </span>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${isTop ? styles.barFillTop : ''}`}
                  style={{ width: `${Math.max(widthPercent, 2)}%` }}
                >
                  {widthPercent > 18 && (
                    <span className={styles.percentLabel}>{displayPercent}%</span>
                  )}
                </div>
              </div>
              <span className={styles.valLabel}>
                {showLogits && item.logit !== undefined
                  ? `${item.logit.toFixed(2)}`
                  : `${displayPercent}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
