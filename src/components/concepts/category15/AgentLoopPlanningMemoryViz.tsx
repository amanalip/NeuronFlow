import React, { useState } from 'react';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { computeTopologicalSort, AgentTaskNode } from './category15Math';
import styles from '../category01/Category01.module.css';

// 178. Agent Loop & 179. Tool Use Pipeline
export const AgentLoopViz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const loopSteps = [
    { title: '1. Observe', color: '#38bdf8', desc: 'Read user goal and analyze environment feedback / previous tool output.' },
    { title: '2. Reason & Plan', color: '#f59e0b', desc: 'Synthesize internal Chain of Thought and choose next subtask action.' },
    { title: '3. Act / Tool Call', color: '#10b981', desc: 'Format structured JSON payload and dispatch API / sandbox command.' },
    { title: '4. Environment Feedback', color: '#a855f7', desc: 'Execute tool in isolated container, capture stdout/stderr, and update state.' },
  ];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>The Autonomous Agent Loop (Observe &rarr; Reason &rarr; Act &rarr; Feedback)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Cycle State: {loopSteps[currentStep].title}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', margin: '14px 0' }}>
            {loopSteps.map((st, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '6px',
                  backgroundColor: currentStep === idx ? 'var(--accent-muted)' : 'var(--bg-primary)',
                  border: currentStep === idx ? `2px solid ${st.color}` : '1px solid var(--border-color)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: st.color }}>{st.title}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {st.desc}
                </div>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{State Transition: } s_{t+1} = \\operatorname{Environment}\\left(s_t, \\, a_t\\right), \\quad a_t \\sim \\pi_{\\theta}\\left(a \\mid s_t, \\, \\text{Memory}\\right)`} />
        </div>

        <ControlPanel title="Loop Stepper" onReset={() => setCurrentStep(0)}>
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev + 1) % loopSteps.length)}
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
            Advance Step &rarr;
          </button>
        </ControlPanel>
      </div>
    </div>
  );
};

// 180. Planning & Task Decomposition (DAG)
export const PlanningTaskDecompositionViz: React.FC = () => {
  const sampleTasks: AgentTaskNode[] = [
    { id: 't1', name: 'Scaffold React App', dependencies: [], status: 'completed' },
    { id: 't2', name: 'Define Data Schema', dependencies: ['t1'], status: 'completed' },
    { id: 't3', name: 'Build API Endpoints', dependencies: ['t2'], status: 'in_progress' },
    { id: 't4', name: 'Build UI Components', dependencies: ['t1'], status: 'in_progress' },
    { id: 't5', name: 'Run Integration Tests', dependencies: ['t3', 't4'], status: 'pending' },
  ];

  const executionOrder = computeTopologicalSort(sampleTasks);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Task Decomposition (Directed Acyclic Dependency Graph)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Topological Order: {executionOrder.join(' &rarr; ')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
            {sampleTasks.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-primary)',
                  borderLeft: `4px solid ${t.status === 'completed' ? '#10b981' : t.status === 'in_progress' ? '#38bdf8' : 'var(--border-color)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                    [{t.id.toUpperCase()}] {t.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Dependencies: {t.dependencies.length > 0 ? t.dependencies.join(', ').toUpperCase() : 'None (Root)'}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: t.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : t.status === 'in_progress' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-tertiary)',
                    color: t.status === 'completed' ? '#10b981' : t.status === 'in_progress' ? '#38bdf8' : 'var(--text-muted)',
                    fontWeight: 600,
                  }}
                >
                  {t.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <MathBlock math={`\\text{Topological Sort: } u \\prec v \\iff (u, v) \\in E \\quad (\\text{Guaranteed Valid Execution Pipeline})`} />
        </div>

        <ControlPanel title="DAG Planning" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Agents break ambiguous user goals into dependent subtasks and schedule independent branches concurrently.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 181. Memory Short-Term & 182. Memory Long-Term
export const AgentMemoryViz: React.FC = () => {
  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Agent Memory Systems (Working Buffer vs Episodic Vector Store)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Dual-Tier Memory Hierarchy
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #38bdf8' }}>
              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.84rem' }}>Short-Term / Working Memory</div>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Resides directly inside LLM active context window</li>
                <li>Sliding buffer of recent dialogue turns</li>
                <li>Recursive rolling summaries to compress historical turns</li>
                <li>Fast, zero-latency immediate recall</li>
              </ul>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid #10b981' }}>
              <div style={{ fontWeight: 600, color: '#10b981', fontSize: '0.84rem' }}>Long-Term / Episodic Memory ★</div>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Stored in external persistent vector database</li>
                <li>Extracts salient facts, decisions, and preferences</li>
                <li>Retrieved via cosine semantic search dynamically</li>
                <li>Persists across weeks, sessions, and system reboots</li>
              </ul>
            </div>
          </div>

          <MathBlock math={`\\text{Context Injection: } \\mathbf{C} = [\\text{System Directive}, \\, \\operatorname{Retrieve}_{\\text{LongTerm}}(q), \\, \\text{Working Buffer Summary}, \\, q]`} />
        </div>

        <ControlPanel title="Memory Architecture" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Working memory handles active execution while episodic vector memory provides persistent personalized intelligence.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};
