import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeBahdanauAlignment, computeLuongAlignment } from './category04Math';
import { ProbabilityBar, ProbabilityItem } from '../../viz/charts/ProbabilityBar';
import styles from '../category01/Category01.module.css';

// 45. Bahdanau Additive Attention
export const BahdanauAttentionViz: React.FC = () => {
  const [decStateVal, setDecStateVal] = useState(1.2);

  const sourceWords = ['the', 'black', 'cat', 'slept'];
  const encoderStates = [
    [0.2, 0.4],
    [0.9, 0.8],
    [1.5, 1.2],
    [0.1, 0.3],
  ];

  const decoderState = [decStateVal, decStateVal * 0.8];
  const alphaWeights = computeBahdanauAlignment(decoderState, encoderStates);

  const probData: ProbabilityItem[] = sourceWords.map((w, idx) => ({
    token: `h_${idx + 1} ("${w}")`,
    probability: alphaWeights[idx],
  }));

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Bahdanau Additive Attention Alignment</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Target Focus: "{sourceWords[alphaWeights.indexOf(Math.max(...alphaWeights))]}"
            </span>
          </div>

          <ProbabilityBar
            data={probData}
            title="Alignment Distribution (α_ij) over Source Tokens"
          />

          <MathBlock math={`e_{ij} = v_a^T \\tanh(W_a s_{i-1} + U_a h_j), \\quad c_i = \\sum_{j=1}^{T_x} \\alpha_{ij} h_j`} />
        </div>

        <ControlPanel title="Decoder Query State" onReset={() => setDecStateVal(1.2)}>
          <Slider
            label="Decoder State Magnitude (s_{i-1})"
            value={decStateVal}
            min={-2.0}
            max={2.0}
            step={0.1}
            onChange={setDecStateVal}
            formatValue={(v) => v.toFixed(1)}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 46. Luong Multiplicative Attention
export const LuongAttentionViz: React.FC = () => {
  const [scoreType, setScoreType] = useState<'dot' | 'general' | 'concat'>('dot');

  const sourceWords = ['le', 'chat', 'noir', 'dort'];
  const encoderStates = [
    [0.1, 0.2],
    [1.4, 1.1],
    [0.8, 0.9],
    [0.3, 0.4],
  ];
  const decoderState = [1.2, 1.0];

  const weights = computeLuongAlignment(decoderState, encoderStates);

  const probData: ProbabilityItem[] = sourceWords.map((w, idx) => ({
    token: `h_${idx + 1} ("${w}")`,
    probability: weights[idx],
  }));

  const formulas: Record<string, string> = {
    dot: '\\text{score}(s_t, h_i) = s_t^T h_i \\quad (\\text{Simplest Matrix Dot Product})',
    general: '\\text{score}(s_t, h_i) = s_t^T W_a h_i \\quad (\\text{Learned Bilinear Matrix})',
    concat: '\\text{score}(s_t, h_i) = v_a^T \\tanh(W_a [s_t; h_i]) \\quad (\\text{Concatenation})',
  };

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Luong Multiplicative Score Function</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Type: {scoreType.toUpperCase()}
            </span>
          </div>

          <ProbabilityBar
            data={probData}
            title="Luong Attention Weights (α_t)"
          />

          <MathBlock math={formulas[scoreType]} />
        </div>

        <ControlPanel title="Score Function" onReset={() => setScoreType('dot')}>
          <RadioGroup
            label="Alignment Score"
            value={scoreType}
            options={[
              { value: 'dot', label: 'Dot Product' },
              { value: 'general', label: 'General (Bilinear)' },
              { value: 'concat', label: 'Concat' },
            ]}
            onChange={(v) => setScoreType(v as 'dot' | 'general' | 'concat')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
