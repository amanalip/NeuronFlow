import React from 'react';
import { getLinearColorScale } from '../utils/colorScales';
import styles from './ConfusionHeatmap.module.css';

interface ConfusionHeatmapProps {
  matrix: number[][];
  labels: string[];
  title?: string;
  cellSize?: number;
}

export const ConfusionHeatmap: React.FC<ConfusionHeatmapProps> = ({
  matrix,
  labels,
  title = 'Confusion Matrix',
  cellSize = 44,
}) => {
  const allVals = matrix.flat();
  const minVal = Math.min(...allVals, 0);
  const maxVal = Math.max(...allVals, 1);
  const colorScale = getLinearColorScale(minVal, maxVal, 'rgba(56, 189, 248, 0.08)', '#38bdf8');

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>

      <div className={styles.heatmapLayout}>
        <div className={styles.axisLabel}>Predicted Class</div>

        <div className={styles.colLabels}>
          {labels.map((lbl, idx) => (
            <div
              key={idx}
              className={styles.colLabel}
              style={{ width: cellSize }}
              title={lbl}
            >
              {lbl.slice(0, 4)}
            </div>
          ))}
        </div>

        <div className={styles.gridWrapper}>
          <div className={styles.rowLabels}>
            {labels.map((lbl, idx) => (
              <div
                key={idx}
                className={styles.rowLabel}
                style={{ height: cellSize, width: 60 }}
                title={lbl}
              >
                {lbl.slice(0, 6)}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${labels.length}, ${cellSize}px)`,
              gap: 2,
              backgroundColor: 'var(--border-color)',
              padding: 2,
              borderRadius: 6,
            }}
          >
            {matrix.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const bg = colorScale(val);
                const isDiagonal = rIdx === cIdx;

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      color: val > maxVal * 0.5 ? '#ffffff' : 'var(--text-primary)',
                      border: isDiagonal ? '1px solid var(--accent-color)' : 'none',
                      borderRadius: 2,
                    }}
                    title={`True: ${labels[rIdx]}, Pred: ${labels[cIdx]} -> ${val}`}
                  >
                    {val}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
