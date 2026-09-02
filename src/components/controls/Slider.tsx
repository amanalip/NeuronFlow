import React from 'react';
import styles from './Controls.module.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  disabled = false,
}) => {
  const displayVal = formatValue ? formatValue(value) : value.toString();
  const percentage = max > min ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) : 0;

  return (
    <div className={styles.controlGroup}>
      <div className={styles.labelRow}>
        <span className={styles.controlLabel}>{label}</span>
        <span className={styles.valueDisplay}>{displayVal}</span>
      </div>
      <input
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        style={{
          background: `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percentage}%, var(--bg-tertiary) ${percentage}%, var(--bg-tertiary) 100%)`,
        }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};
