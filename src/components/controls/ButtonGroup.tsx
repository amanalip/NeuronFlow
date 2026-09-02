import React from 'react';
import styles from './Controls.module.css';

export interface ActionButtonConfig {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}

interface ButtonGroupProps {
  actions: ActionButtonConfig[];
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ actions }) => {
  return (
    <div className={styles.buttonGroup}>
      {actions.map((act, idx) => (
        <button
          key={idx}
          type="button"
          className={`${styles.actionBtn} ${act.active ? styles.actionBtnActive : ''}`}
          onClick={act.onClick}
          disabled={act.disabled}
        >
          {act.icon}
          <span>{act.label}</span>
        </button>
      ))}
    </div>
  );
};
