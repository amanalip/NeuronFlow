import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 186. Autonomous Agents & 187. Orchestration Patterns
export const AutonomousOrchestrationPatternsViz: React.FC = () => {
  const [activePattern, setActivePattern] = useState<string>('orchestrator');

  const patterns: Record<string, { title: string; flow: string; bestFor: string; latency: string }> = {
    chaining: {
      title: '1. Prompt Chaining (Sequential)',
      flow: 'Input &rarr; Step 1 (Parse) &rarr; Step 2 (Transform) &rarr; Step 3 (Format) &rarr; Output',
      bestFor: 'Deterministic multi-step workflows with fixed subtask structures.',
      latency: 'Proportional to sum of all step latencies (Sequential).',
    },
    routing: {
      title: '2. Routing (Classifier Dispatch)',
      flow: 'Input &rarr; Intent Classifier Router &rarr; Route A (Billing) / Route B (Tech Support) / Route C (General)',
      bestFor: 'Directing distinct categories of queries to specialized prompt pipelines.',
      latency: '1 Router step + 1 Execution step (Fast & Cost-Efficient).',
    },
    parallel: {
      title: '3. Parallelization (Sectioning / Voting)',
      flow: 'Input &rarr; [Worker 1, Worker 2, Worker 3 concurrently] &rarr; Aggregator / Voter &rarr; Output',
      bestFor: 'Guardrail checking, self-consistency voting, and independent sub-queries.',
      latency: 'Bounded by slowest worker (Low Latency).',
    },
    orchestrator: {
      title: '4. Orchestrator-Workers (Hierarchical)',
      flow: 'Goal &rarr; Central Orchestrator &rarr; Dynamically Dispatches Subtasks to Worker 1..N &rarr; Synthesizes Result',
      bestFor: 'Complex, unpredictable tasks requiring dynamic planning (SWE-bench coding agents).',
      latency: 'Variable based on dynamic subtask count and replanning turns.',
    },
  };

  const current = patterns[activePattern];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Agent Orchestration Patterns (Anthropic Architectural Reference)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {current.title}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', margin: '14px 0' }}>
            {Object.keys(patterns).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setActivePattern(k)}
                style={{
                  padding: '8px 6px',
                  borderRadius: '4px',
                  backgroundColor: activePattern === k ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: activePattern === k ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: activePattern === k ? 'var(--accent-color)' : 'var(--text-primary)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {patterns[k].title.split(' ')[1]}
              </button>
            ))}
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '10px 0' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '6px' }}>
              {current.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: '8px', padding: '6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
              {current.flow}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <strong>Best For:</strong> {current.bestFor}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <strong>Latency Profile:</strong> {current.latency}
            </div>
          </div>

          <MathBlock math={`\\text{Hierarchical Dispatch: } y = \\operatorname{Synthesize}\\left(\\{\\operatorname{Worker}_i(\\operatorname{Subtask}_i)\\}_{i=1}^M, \\; \\text{Goal}\\right)`} />
        </div>

        <ControlPanel title="Pattern Selection" onReset={() => setActivePattern('orchestrator')}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Start with simple sequential chains and routing before escalating to complex autonomous supervisor-worker hierarchies.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
