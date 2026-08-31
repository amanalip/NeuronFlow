import React from 'react';
import { RotateCcw } from 'lucide-react';
import styles from './Controls.module.css';

interface ControlPanelProps {
  title?: string;
  onReset?: () => void;
  children: React.ReactNode;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  title = 'Interactive Controls',
  onReset,
  children,
}) => {
  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>{title}</span>
        {onReset && (
          <button type="button" className={styles.resetBtn} onClick={onReset} title="Reset all controls">
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>
      <div className={styles.controlsBody}>{children}</div>
    </div>
  );
};
