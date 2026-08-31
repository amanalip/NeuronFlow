import React from 'react';
import styles from './Controls.module.css';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
}) => {
  return (
    <div className={styles.controlGroup}>
      {label && <div className={styles.labelRow}>{label}</div>}
      <div className={styles.segmentedGroup}>
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              className={`${styles.segmentedBtn} ${isActive ? styles.segmentedBtnActive : ''}`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
