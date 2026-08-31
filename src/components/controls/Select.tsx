import React from 'react';
import styles from './Controls.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
}) => {
  return (
    <div className={styles.controlGroup}>
      {label && <div className={styles.labelRow}>{label}</div>}
      <select
        className={styles.selectInput}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
