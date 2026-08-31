import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import styles from './StepAnimation.module.css';

interface StepAnimationProps {
  totalSteps: number;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  children: (currentStep: number) => React.ReactNode;
  autoPlayInterval?: number;
}

export const StepAnimation: React.FC<StepAnimationProps> = ({
  totalSteps,
  currentStep: controlledStep,
  onStepChange,
  children,
  autoPlayInterval = 1500,
}) => {
  const [internalStep, setInternalStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const activeStep = controlledStep !== undefined ? controlledStep : internalStep;

  const setStep = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(totalSteps - 1, next));
      if (controlledStep === undefined) {
        setInternalStep(clamped);
      }
      onStepChange?.(clamped);
    },
    [totalSteps, controlledStep, onStepChange]
  );

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((activeStep + 1) % totalSteps);
      }, autoPlayInterval / speedMultiplier);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, activeStep, totalSteps, autoPlayInterval, speedMultiplier, setStep]);

  return (
    <div className={styles.container}>
      <div className={styles.controlsBar}>
        <div className={styles.buttonGroup}>
          <button
            className={styles.btn}
            onClick={() => setStep(0)}
            title="Reset to beginning"
            aria-label="Reset"
          >
            <RotateCcw size={14} />
          </button>
          <button
            className={styles.btn}
            onClick={() => setStep(activeStep - 1)}
            disabled={activeStep <= 0}
            title="Step backward"
            aria-label="Step backward"
          >
            <SkipBack size={14} />
          </button>
          <button
            className={styles.btn}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            className={styles.btn}
            onClick={() => setStep(activeStep + 1)}
            disabled={activeStep >= totalSteps - 1}
            title="Step forward"
            aria-label="Step forward"
          >
            <SkipForward size={14} />
          </button>
        </div>

        <div className={styles.stepIndicator}>
          Step {activeStep + 1} / {totalSteps}
        </div>

        <div className={styles.speedGroup}>
          <span>Speed:</span>
          <select
            className={styles.speedSelect}
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={2}>2.0x</option>
          </select>
        </div>
      </div>

      <div className={styles.contentWrapper}>{children(activeStep)}</div>
    </div>
  );
};
