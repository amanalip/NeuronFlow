import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import styles from './LossCurve.module.css';

export interface LossDataPoint {
  step: number;
  trainLoss: number;
  valLoss?: number;
}

interface LossCurveProps {
  data: LossDataPoint[];
  title?: string;
  subtitle?: string;
  xLabel?: string;
  yLabel?: string;
  logScale?: boolean;
}

export const LossCurve: React.FC<LossCurveProps> = ({
  data,
  title = 'Training & Validation Loss',
  subtitle,
  xLabel = 'Step',
  yLabel = 'Loss',
  logScale = false,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.dot} style={{ backgroundColor: '#38bdf8' }} />
            <span>Train Loss</span>
          </div>
          {data.some((d) => d.valLoss !== undefined) && (
            <div className={styles.legendItem}>
              <div className={styles.dot} style={{ backgroundColor: '#f59e0b' }} />
              <span>Val Loss</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="step"
              stroke="var(--text-muted)"
              fontSize={11}
              label={{ value: xLabel, position: 'insideBottom', offset: -5, fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <YAxis
              scale={logScale ? 'log' : 'auto'}
              domain={['auto', 'auto']}
              stroke="var(--text-muted)"
              fontSize={11}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--text-primary)',
              }}
            />
            <Line
              type="monotone"
              dataKey="trainLoss"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="valLoss"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
