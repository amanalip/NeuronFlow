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

  return (
    <div className={styles.controlGroup}>
      <div className={styles.labelRow}>
        <span>{label}</span>
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
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};
