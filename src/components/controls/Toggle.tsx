import React from 'react';
import styles from './Controls.module.css';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  description,
  disabled = false,
}) => {
  return (
    <div className={`${styles.controlGroup} ${disabled ? styles.controlDisabled : ''}`}>
      <div
        className={styles.toggleRow}
        onClick={() => !disabled && onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
      >
        <div className={styles.toggleLabelCol}>
          <span className={styles.toggleLabel}>{label}</span>
          {description && (
            <div className={styles.toggleDesc}>
              {description}
            </div>
          )}
        </div>
        <div className={`${styles.toggleSwitch} ${checked ? styles.toggleSwitchOn : ''}`}>
          <div className={`${styles.toggleThumb} ${checked ? styles.toggleThumbOn : ''}`} />
        </div>
      </div>
    </div>
  );
};
