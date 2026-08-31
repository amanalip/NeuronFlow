import React, { useState } from 'react';
import { Slider } from '../../controls/Slider';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeReflexionRevision } from './category15Math';
import styles from '../category01/Category01.module.css';

// 183. Multi-Agent Systems
export const MultiAgentSystemsViz: React.FC = () => {
  const [activeRole, setActiveRole] = useState<string>('architect');

  const agents: Record<string, { title: string; color: string; responsibilities: string; protocol: string }> = {
    architect: {
      title: 'Architect Agent',
      color: '#38bdf8',
      responsibilities: 'Decomposes system specifications into modular interface definitions and data models.',
      protocol: 'Emits: System Design Document & Task DAG to Engineer.',
    },
    engineer: {
      title: 'Software Engineer Agent',
      color: '#10b981',
      responsibilities: 'Implements code logic, imports dependencies, and writes unit test suites.',
      protocol: 'Emits: Pull Request code patch to Reviewer.',
    },
    reviewer: {
      title: 'Code Reviewer Agent',
      color: '#f59e0b',
      responsibilities: 'Audits code for edge cases, security vulnerabilities, and adherence to style rules.',
      protocol: 'Emits: Detailed critique or Approval token to QA Tester.',
    },
    tester: {
      title: 'QA Tester Agent',
      color: '#a855f7',
      responsibilities: 'Executes automated end-to-end test suites in sandboxed runtime and verifies outputs.',
      protocol: 'Emits: Verification Report & Final Release Signal to Orchestrator.',
    },
  };

  const current = agents[activeRole];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Multi-Agent Collaborative Team Hierarchy (AutoGen / MetaGPT)</span>
            <span style={{ fontSize: '0.8rem', color: current.color }}>
              Active Persona: {current.title}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', margin: '14px 0' }}>
            {Object.entries(agents).map(([k, a]) => (
              <div
                key={k}
                onClick={() => setActiveRole(k)}
                style={{
                  padding: '10px 8px',
                  borderRadius: '6px',
                  backgroundColor: activeRole === k ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: activeRole === k ? `2px solid ${a.color}` : '1px solid var(--border-color)',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: a.color }}>{a.title}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', borderLeft: `4px solid ${current.color}` }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Role & Purpose:
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {current.responsibilities}
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>
              {current.protocol}
            </div>
          </div>

          <MathBlock math={`\\text{Multi-Agent Consensus: } \\mathbf{M}_{t+1} = \\operatorname{Agent}_k\\left(\\mathbf{M}_t, \\, \\operatorname{Inbox}_k\\right) \\quad (\\text{Peer Critique Protocol})`} />
        </div>

        <ControlPanel title="Agent Specialization" onReset={() => setActiveRole('architect')}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Division of labor across specialized personas drastically cuts hallucination rates and catches software edge cases.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 184. Code Execution Agents
export const CodeExecutionAgentsViz: React.FC = () => {
  const [iteration, setIteration] = useState<number>(1);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Iterative Sandbox Code Execution & Debugging Loop</span>
            <span style={{ fontSize: '0.8rem', color: iteration === 1 ? '#ef4444' : '#10b981' }}>
              {iteration === 1 ? 'Attempt 1: TypeError Raised in Sandbox' : 'Attempt 2: Bug Fixed & Tests Passed ✓'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '4px' }}>
                Generated Code ({iteration === 1 ? 'Draft' : 'Patched'}):
              </div>
              <pre style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--text-primary)' }}>
                {iteration === 1
                  ? `def compute_mean(values):\n    # Bug: values is string generator\n    return sum(values) / len(values)\n\ncompute_mean(map(str, [1, 2, 3]))`
                  : `def compute_mean(values):\n    # Fix: convert items to float\n    numeric = [float(v) for v in values]\n    return sum(numeric) / len(numeric)\n\ncompute_mean(['1', '2', '3']) # -> 2.0`}
              </pre>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: iteration === 1 ? '#ef4444' : '#10b981', marginBottom: '4px' }}>
                Sandbox stdout/stderr:
              </div>
              <pre style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.72rem', color: iteration === 1 ? '#ef4444' : '#10b981', border: iteration === 1 ? '1px solid #ef4444' : '1px solid #10b981' }}>
                {iteration === 1
                  ? `TypeError: unsupported operand type(s) for +: 'int' and 'str'\nTraceback (most recent call last):\n  File "script.py", line 3, in compute_mean`
                  : `Execution Succeeded:\nOutput: 2.0\nTests: 3/3 passed in 42ms`}
              </pre>
            </div>
          </div>

          <MathBlock math={`\\text{Self-Healing Loop: } \\operatorname{Prompt}_{t+1} = [\\operatorname{Code}_t, \\; \\text{Stderr Traceback}, \\; \\text{"Fix the error"}] \\longrightarrow \\operatorname{Code}_{t+1}`} />
        </div>

        <ControlPanel title="Sandbox Control" onReset={() => setIteration(1)}>
          <button
            type="button"
            onClick={() => setIteration((prev) => (prev === 1 ? 2 : 1))}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: 'var(--accent-muted)',
              border: '1px solid var(--accent-color)',
              color: 'var(--accent-color)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {iteration === 1 ? 'Feed Stderr Traceback to Agent &rarr; Fix' : 'Reset to Initial Buggy State'}
          </button>
        </ControlPanel>
      </div>
    </div>
  );
};

// 185. Reflection & Self-Correction
export const ReflectionSelfCorrectionViz: React.FC = () => {
  const [critiqueSeverity, setCritiqueSeverity] = useState<number>(0.8);
  const initialDraftScore = 0.55;

  const { revisedScore, improvement } = computeReflexionRevision(initialDraftScore, critiqueSeverity);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Reflexion: Verbal Self-Correction (Shinn et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              Score: {(initialDraftScore * 100).toFixed(0)}% &rarr; {(revisedScore * 100).toFixed(0)}% (+{(improvement * 100).toFixed(0)}% Gain)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, color: '#f59e0b', fontSize: '0.78rem' }}>Agent Self-Critique Trace:</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                &ldquo;My preliminary answer overlooked the edge case where the input list contains empty strings. I should add input validation and type coercion before processing.&rdquo;
              </p>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #10b981' }}>
              <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.78rem' }}>Revised Completion:</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                &ldquo;Cleaned and verified implementation that checks for falsy and non-numeric items gracefully with comprehensive unit test coverage.&rdquo;
              </p>
            </div>
          </div>

          <MathBlock math={`\\text{Verbal Memory: } M_{t+1} = M_t \\cup \\left\\{\\operatorname{Critique}\\left(\\operatorname{Trajectory}_t, \\, \\operatorname{Feedback}_t\\right)\\right\\}`} />
        </div>

        <ControlPanel title="Critique Depth" onReset={() => setCritiqueSeverity(0.8)}>
          <Slider
            label="Critique Rigor"
            value={critiqueSeverity}
            min={0.1}
            max={1.0}
            step={0.1}
            onChange={setCritiqueSeverity}
            formatValue={(v) => `Rigor: ${(v * 100).toFixed(0)}%`}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
