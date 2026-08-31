import React, { useState } from 'react';
import { RadioGroup } from '../../controls/RadioGroup';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import styles from '../category01/Category01.module.css';

// 164. Prompt Structure & 165. System Prompts
export const PromptStructureViz: React.FC = () => {
  const [templateType, setTemplateType] = useState<'chatml' | 'llama3'>('chatml');

  const chatMlExample = `<|im_start|>system
You are a knowledgeable AI research assistant. Provide concise and verified technical explanations.<|im_end|>
<|im_start|>user
What is the primary advantage of multi-head attention over single-head attention?<|im_end|>
<|im_start|>assistant
Multi-head attention allows the model to jointly attend to information from different representation subspaces at different sequence positions simultaneously.<|im_end|>`;

  const llama3Example = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a knowledgeable AI research assistant. Provide concise and verified technical explanations.<|eot_id|><|start_header_id|>user<|end_header_id|>

What is the primary advantage of multi-head attention over single-head attention?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Multi-head attention allows the model to jointly attend to information from different representation subspaces at different sequence positions simultaneously.<|eot_id|>`;

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Prompt Structure & Chat Template Token Delimiters</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Format: {templateType === 'chatml' ? 'ChatML (<|im_start|>)' : 'LLaMA-3 (<|start_header_id|>)'}
            </span>
          </div>

          <pre
            style={{
              padding: '14px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.76rem',
              lineHeight: 1.45,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              margin: '12px 0',
            }}
          >
            {templateType === 'chatml' ? chatMlExample : llama3Example}
          </pre>

          <MathBlock math={`\\text{Raw Token Sequence: } [\\text{System Delimiter}] \\circ \\mathbf{s} \\circ [\\text{End}] \\circ [\\text{User Delimiter}] \\circ \\mathbf{u} \\circ [\\text{End}] \\circ [\\text{Assistant Delimiter}]`} />
        </div>

        <ControlPanel title="Chat Template" onReset={() => setTemplateType('chatml')}>
          <RadioGroup
            label="Delimiter Convention"
            value={templateType}
            options={[
              { value: 'chatml', label: 'ChatML Standard (OpenAI / Qwen)' },
              { value: 'llama3', label: 'LLaMA-3 Token Hierarchy (Meta)' },
            ]}
            onChange={(v) => setTemplateType(v as 'chatml' | 'llama3')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 166. Zero-Shot vs 167. Few-Shot Prompting
export const ZeroShotVsFewShotViz: React.FC = () => {
  const [mode, setMode] = useState<'zero' | 'few'>('few');

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>{mode === 'zero' ? 'Zero-Shot Prompting' : 'Few-Shot In-Context Learning (3 Examples)'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {mode === 'zero' ? 'Pure Pre-trained Generalization' : 'Steered Syntax & Output Taxonomy'}
            </span>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '12px 0' }}>
            {mode === 'zero' ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong>Instruction:</strong> Classify the sentiment of the following customer review as POSITIVE, NEGATIVE, or NEUTRAL.<br /><br />
                <strong>Input:</strong> The battery life exceeded all my expectations, lasting over two full days on a single charge.<br />
                <strong>Output:</strong> POSITIVE
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>Example 1:</strong> &ldquo;Screen broke on day one.&rdquo; &rarr; <code>{'{"sentiment": "NEGATIVE", "confidence": 0.98}'}</code><br />
                <strong>Example 2:</strong> &ldquo;Arrived on Tuesday as expected.&rdquo; &rarr; <code>{'{"sentiment": "NEUTRAL", "confidence": 0.85}'}</code><br />
                <strong>Example 3:</strong> &ldquo;Exceptional sound quality!&rdquo; &rarr; <code>{'{"sentiment": "POSITIVE", "confidence": 0.99}'}</code><br /><br />
                <strong>Target Input:</strong> &ldquo;The battery life exceeded all my expectations.&rdquo;<br />
                <strong>Target Output:</strong> <code>{'{"sentiment": "POSITIVE", "confidence": 0.97}'}</code>
              </div>
            )}
          </div>

          <MathBlock math={mode === 'zero' ? `P(y \\mid x, \\text{Instruction})` : `P(y \\mid (x_1, y_1), \\, (x_2, y_2), \\, \\dots, \\, (x_k, y_k), \\, x)`} />
        </div>

        <ControlPanel title="Prompting Mode" onReset={() => setMode('few')}>
          <RadioGroup
            label="In-Context Examples"
            value={mode}
            options={[
              { value: 'zero', label: 'Zero-Shot (No Examples Provided)' },
              { value: 'few', label: 'Few-Shot (3 Structured Demonstrations)' },
            ]}
            onChange={(v) => setMode(v as 'zero' | 'few')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};

// 168. Chain of Thought (CoT) & 169. Tree of Thought (ToT)
export const ChainAndTreeOfThoughtViz: React.FC = () => {
  const [strategy, setStrategy] = useState<'standard' | 'cot' | 'tot'>('cot');

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Reasoning Strategies (Direct vs CoT vs Tree of Thought)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Test-Time Compute Expansion
            </span>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '6px', margin: '12px 0' }}>
            {strategy === 'standard' && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>Direct Answering:</strong><br />
                Question: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?<br /><br />
                <strong>Model Output:</strong> 11 (High error risk on multi-step arithmetic without intermediate tokens).
              </div>
            )}

            {strategy === 'cot' && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>Chain of Thought (&ldquo;Let&rsquo;s think step by step&rdquo;):</strong><br />
                1. Roger starts with 5 tennis balls.<br />
                2. 2 cans with 3 tennis balls each = 2 * 3 = 6 tennis balls.<br />
                3. Total tennis balls = 5 + 6 = 11.<br />
                <strong>Final Answer:</strong> 11 tennis balls.
              </div>
            )}

            {strategy === 'tot' && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>Tree of Thought (BFS Search over Reasoning Branches):</strong><br />
                - Branch 1: Add cans first (2 cans) &rarr; Score: 0.3 (Pruned)<br />
                - Branch 2: Calculate balls per can (2 * 3 = 6 balls) &rarr; Score: 0.95 (Expanded)<br />
                &nbsp;&nbsp;&nbsp;&rarr; Sub-Branch 2a: Add initial balls (6 + 5 = 11) &rarr; Score: 1.0 (Solution Found!)<br />
                <strong>Backtracking & Pruning:</strong> Explores state space with heuristic lookahead.
              </div>
            )}
          </div>

          <MathBlock math={strategy === 'tot' ? `\\text{ToT Search: } \\max_{p \\in \\text{Paths}} \\prod_{t=1}^T V(s_t, z_t) \\quad (\\text{Lookahead Tree Search})` : `P(y \\mid x) = \\sum_{z} P(y \\mid z, x) P(z \\mid x) \\quad (z = \\text{intermediate reasoning tokens})`} />
        </div>

        <ControlPanel title="Reasoning Paradigm" onReset={() => setStrategy('cot')}>
          <RadioGroup
            label="Thought Expansion"
            value={strategy}
            options={[
              { value: 'standard', label: 'Standard Prompt (Direct Output)' },
              { value: 'cot', label: 'Chain of Thought (Step-by-Step)' },
              { value: 'tot', label: 'Tree of Thought (Branching Search)' },
            ]}
            onChange={(v) => setStrategy(v as 'standard' | 'cot' | 'tot')}
          />
        </ControlPanel>
      </div>
    </div>
  );
};
