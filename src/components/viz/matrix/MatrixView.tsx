import React from 'react';
import { getLinearColorScale } from '../utils/colorScales';
import styles from './MatrixView.module.css';

interface MatrixViewProps {
  matrix: number[][];
  title?: string;
  subtitle?: string;
  cellSize?: number;
  showValues?: boolean;
  minColor?: string;
  maxColor?: string;
  minValue?: number;
  maxValue?: number;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  matrix,
  title,
  subtitle,
  cellSize = 36,
  showValues = true,
  minColor = '#0f172a',
  maxColor = '#0284c7',
  minValue,
  maxValue,
}) => {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  const allVals = matrix.flat();
  const actualMin = minValue !== undefined ? minValue : Math.min(...allVals, 0);
  const actualMax = maxValue !== undefined ? maxValue : Math.max(...allVals, 1);

  const colorScale = getLinearColorScale(actualMin, actualMax, minColor, maxColor);

  return (
    <div className={styles.container}>
      {(title || subtitle) && (
        <div className={styles.header}>
          <div>
            {title && <div className={styles.title}>{title}</div>}
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
        </div>
      )}

      <div
        className={styles.matrixGrid}
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {matrix.map((row, rIdx) =>
          row.map((val, cIdx) => {
            const bg = colorScale(val);
            const normalized = (val - actualMin) / Math.max(actualMax - actualMin, 0.0001);
            const textColor = normalized > 0.55 ? '#ffffff' : 'var(--text-primary)';

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={styles.matrixCell}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: bg,
                  color: textColor,
                }}
                title={`Row ${rIdx}, Col ${cIdx}: ${val.toFixed(3)}`}
              >
                {showValues && val.toFixed(2)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
