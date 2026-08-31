import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeSelfConsistencyMajority } from './category14Math';
import styles from '../category01/Category01.module.css';

// 170. ReAct (Reasoning + Acting)
export const ReactViz: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    { type: 'Thought 1', color: '#38bdf8', text: 'I need to check the current weather in Paris to recommend suitable outdoor activities.' },
    { type: 'Action 1', color: '#f59e0b', text: 'call_weather_api(city="Paris", units="metric")' },
    { type: 'Observation 1', color: '#10b981', text: '{"temperature": 21.5, "condition": "Sunny", "humidity": 45%}' },
    { type: 'Thought 2', color: '#38bdf8', text: 'The weather is mild and sunny. Walking around the Tuileries Garden and visiting the Eiffel Tower are ideal.' },
    { type: 'Final Answer', color: '#a855f7', text: 'Paris is currently sunny and 21.5°C. Great outdoor options today include visiting the Tuileries Garden and walking along the Seine.' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>ReAct: Interleaved Reasoning and Acting (Yao et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Step {activeStep + 1} of {steps.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            {steps.slice(0, activeStep + 1).map((st, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-primary)',
                  borderLeft: `4px solid ${st.color}`,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: st.color, marginBottom: '2px' }}>
                  {st.type}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: st.type.startsWith('Action') || st.type.startsWith('Observation') ? 'var(--font-mono)' : 'inherit' }}>
                  {st.text}
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{ReAct Trace: } \\dots \\longrightarrow \\text{Thought}_t \\longrightarrow \\text{Action}_t \\longrightarrow \\text{Observation}_t \\longrightarrow \\text{Thought}_{t+1} \\longrightarrow \\dots`} />
        </div>

        <ControlPanel title="ReAct Step Execution" onReset={() => setActiveStep(0)}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={activeStep >= steps.length - 1}
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: 'var(--accent-muted)',
                border: '1px solid var(--accent-color)',
                color: 'var(--accent-color)',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              Next Step &rarr;
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(0)}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
              }}
            >
              Reset
            </button>
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

// 171. Self-Consistency
export const SelfConsistencyViz: React.FC = () => {
  const samplePaths = [
    { path: 1, reasoning: '5 + (2 * 3) = 5 + 6 = 11', answer: '11' },
    { path: 2, reasoning: 'Roger buys 6 balls. 5 + 6 = 11', answer: '11' },
    { path: 3, reasoning: '2 cans with 3 each is 6. Initial 5 + 6 = 11', answer: '11' },
    { path: 4, reasoning: '5 balls + 2 cans = 7 cans * 3 = 21', answer: '21 (Erroneous path)' },
    { path: 5, reasoning: '3 * 2 = 6, 6 + 5 = 11', answer: '11' },
  ];

  const answers = samplePaths.map((p) => p.answer.split(' ')[0]);
  const { winner, voteCount, confidence } = computeSelfConsistencyMajority(answers);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Self-Consistency Majority Voting (Wang et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Consensus Winner: {winner} ({voteCount}/{answers.length} Votes, {(confidence * 100).toFixed(0)}% Confidence)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '14px 0' }}>
            {samplePaths.map((p) => {
              const isWinner = p.answer.startsWith(winner);
              return (
                <div
                  key={p.path}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-primary)',
                    border: isWinner ? '1px solid #10b981' : '1px solid #ef4444',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Path #{p.path}:</strong> {p.reasoning}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isWinner ? '#10b981' : '#ef4444' }}>
                    &rarr; {p.answer}
                  </span>
                </div>
              );
            })}
          </div>

          <MathBlock math={`\\hat{y} = \\operatorname{mode}\\left(\\{y^{(1)}, \\, y^{(2)}, \\, \\dots, \\, y^{(N)}\\}\\right) \\quad \\text{where } y^{(i)} \\sim P(y \\mid x, \\, T=0.7)`} />
        </div>

        <ControlPanel title="Ensemble Voting" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Self-consistency samples diverse reasoning paths at temperature &gt; 0 and filters out arithmetic slip-ups via majority consensus.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 172. Tool Use & Function Calling & 173. Structured Output & JSON Schema
export const ToolUseStructuredOutputViz: React.FC = () => {
  const schemaCode = `{
  "type": "function",
  "function": {
    "name": "calculate_flight_carbon",
    "description": "Computes flight route carbon emission in kg CO2",
    "parameters": {
      "type": "object",
      "properties": {
        "origin": { "type": "string", "description": "IATA 3-letter airport code (e.g. SFO)" },
        "destination": { "type": "string", "description": "IATA 3-letter airport code (e.g. JFK)" },
        "passengers": { "type": "integer", "minimum": 1, "default": 1 }
      },
      "required": ["origin", "destination"]
    }
  }
}`;

  const emittedCall = `{
  "name": "calculate_flight_carbon",
  "arguments": {
    "origin": "SFO",
    "destination": "JFK",
    "passengers": 2
  }
}`;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Tool Use (Function Calling) & JSON Schema Constraints</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              100% Deterministic Schema Conformance
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '12px 0' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '4px' }}>JSON Schema Definition:</div>
              <pre style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.7rem', maxHeight: '200px', overflowY: 'auto' }}>
                {schemaCode}
              </pre>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', marginBottom: '4px' }}>Model Emitted Tool Call:</div>
              <pre style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.7rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid #10b981' }}>
                {emittedCall}
              </pre>
            </div>
          </div>

          <MathBlock math={`\\text{Grammar-Constrained Decoding: } P(t_i \\in \\text{Valid JSON Mask} \\mid t_{<i}) = 1.0`} />
        </div>

        <ControlPanel title="Function Calling Schema" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Grammar masks restrict vocabulary logits to valid JSON tokens at each decoding step, preventing syntax parse errors.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
