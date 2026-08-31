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
    <div className={styles.controlGroup}>
      <div
        className={styles.toggleRow}
        onClick={() => !disabled && onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
      >
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{label}</span>
          {description && (
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
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
