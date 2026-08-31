import React from 'react';
import { X } from 'lucide-react';
import styles from './Controls.module.css';

interface TextInputProps {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  placeholder,
  onChange,
  disabled = false,
}) => {
  return (
    <div className={styles.controlGroup}>
      {label && <div className={styles.labelRow}>{label}</div>}
      <div className={styles.textInputWrapper}>
        <input
          type="text"
          className={styles.textInput}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
        {value.length > 0 && !disabled && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => onChange('')}
            title="Clear text"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
};
