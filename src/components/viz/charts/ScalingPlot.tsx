import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import styles from './ScalingPlot.module.css';

export interface ScalingPoint {
  compute: number;
  loss: number;
  name?: string;
  optimal?: boolean;
}

interface ScalingPlotProps {
  data: ScalingPoint[];
  title?: string;
  subtitle?: string;
  xLabel?: string;
  yLabel?: string;
}

export const ScalingPlot: React.FC<ScalingPlotProps> = ({
  data,
  title = 'Compute Scaling Frontier',
  subtitle = 'Log-log scaling curve showing compute budget versus test loss.',
  xLabel = 'Compute (FLOPs, 10^21)',
  yLabel = 'Test Loss',
}) => {
  const standardPoints = data.filter((d) => !d.optimal);
  const optimalPoints = data.filter((d) => d.optimal);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>

      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              type="number"
              dataKey="compute"
              name="Compute"
              scale="log"
              domain={['auto', 'auto']}
              stroke="var(--text-muted)"
              fontSize={11}
              label={{ value: xLabel, position: 'insideBottom', offset: -8, fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="loss"
              name="Loss"
              scale="log"
              domain={['auto', 'auto']}
              stroke="var(--text-muted)"
              fontSize={11}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'var(--text-primary)',
              }}
            />
            <Scatter name="Empirical" data={standardPoints} fill="#38bdf8" />
            <Scatter name="Chinchilla Optimal" data={optimalPoints} fill="#10b981" shape="diamond" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
