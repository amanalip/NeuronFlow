import React, { useState } from 'react';
import { RadioGroup } from '../../controls/RadioGroup';
import { TextInput } from '../../controls/TextInput';
import { ControlPanel } from '../../controls/ControlPanel';
import { MathBlock } from '../../math/MathBlock';
import { renderChatTemplate, ChatMessage } from './category09Math';
import styles from '../category01/Category01.module.css';

// 110. Multi-Task Fine-Tuning (FLAN / T0)
export const MultiTaskFineTuningViz: React.FC = () => {
  const [activeCluster, setActiveCluster] = useState<string>('reasoning');

  const clusters: Record<string, { title: string; desc: string; sample: string }> = {
    reasoning: { title: 'Mathematical & Logical Reasoning', desc: 'Step-by-step chain-of-thought derivations and proof structures.', sample: 'Question: If 3x + 7 = 22, what is x? Answer: 3x = 15 => x = 5.' },
    translation: { title: 'Cross-Lingual Translation', desc: 'Direct mapping between 100+ natural languages with register preservation.', sample: 'Translate into Spanish: Good morning, how are you? -> Buenos días, ¿cómo estás?' },
    code: { title: 'Code Synthesis & Debugging', desc: 'Translating natural language specifications into idiomatic code.', sample: 'Write a regex matching email addresses -> ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
    qa: { title: 'Reading Comprehension QA', desc: 'Extracting factual answers grounded strictly in provided context documents.', sample: 'Context: Paris is the capital of France. Q: What is France’s capital? A: Paris.' },
  };

  const current = clusters[activeCluster];

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>FLAN Multi-Task Instruction Tuning (Wei et al.)</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {current.title}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{current.desc}</div>
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
              {current.sample}
            </div>
          </div>

          <MathBlock math={`\\mathcal{L}_{\\text{MultiTask}} = \\sum_{k=1}^K w_k \\mathbb{E}_{(x, y) \\sim \\mathcal{T}_k} [-\\log P(y \\mid x)] \\quad (K > 1{,}000 \\text{ Tasks})`} />
        </div>

        <ControlPanel title="Task Cluster" onReset={() => setActiveCluster('reasoning')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(clusters).map(([key, info]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCluster(key)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '4px',
                  backgroundColor: activeCluster === key ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
                  border: activeCluster === key ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: activeCluster === key ? 'var(--accent-color)' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                {info.title}
              </button>
            ))}
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

// 111. Instruction Tuning
export const InstructionTuningViz: React.FC = () => {
  const prompt = 'What is the capital of Australia?';
  const baseModelCompletion = 'What is the capital of New Zealand? What is the capital of Canada?';
  const instructModelResponse = 'The capital of Australia is Canberra.';

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Base Model Completion vs Instruction-Tuned Response</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Behavioral Alignment
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Input Prompt:</div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', marginTop: '4px' }}>"{prompt}"</div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--warning-color)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--warning-color)', fontWeight: 600 }}>Base Pre-Trained Model (Text Continuation):</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                "... {baseModelCompletion}"
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--success-color)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600 }}>Instruction-Tuned Assistant (Direct Answer) ★:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                "{instructModelResponse}"
              </div>
            </div>
          </div>

          <MathBlock math={`P(\\text{Answer} \\mid \\text{Question}) \\gg P(\\text{Continuation} \\mid \\text{Question})`} />
        </div>

        <ControlPanel title="Instruction Paradigm" onReset={() => {}}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Instruction tuning converts next-token document continuation into helpful, honest, and direct question answering.
          </p>
        </ControlPanel>
      </div>
    </div>
  );
};

// 112. Chat Templates (ChatML, LLaMA-3, Mistral, Gemma)
export const ChatTemplatesViz: React.FC = () => {
  const [template, setTemplate] = useState<'chatml' | 'llama3' | 'mistral' | 'gemma'>('chatml');
  const [systemMsg, setSystemMsg] = useState('You are a helpful coding assistant.');
  const [userMsg, setUserMsg] = useState('Explain LoRA in one sentence.');

  const messages: ChatMessage[] = [
    { role: 'system', content: systemMsg },
    { role: 'user', content: userMsg },
  ];

  const rendered = renderChatTemplate(messages, template);

  return (
    <div className={styles.vizContainer}>
      <div className={styles.twoColumnGrid}>
        <div className={styles.canvasCard}>
          <div className={styles.cardTitle}>
            <span>Chat Template Formatter ({template.toUpperCase()})</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              Structured Messages → Flat Token Stream
            </span>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '6px', overflowX: 'auto' }}>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-color)', margin: 0, whiteSpace: 'pre-wrap' }}>
              {rendered}
            </pre>
          </div>

          <MathBlock math={`\\text{Tokenized Stream} = \\operatorname{Tokenizer}(\\operatorname{RenderTemplate}(\\text{Messages}))`} />
        </div>

        <ControlPanel title="Template Format" onReset={() => { setTemplate('chatml'); setSystemMsg('You are a helpful coding assistant.'); setUserMsg('Explain LoRA in one sentence.'); }}>
          <RadioGroup
            label="Format Family"
            value={template}
            options={[
              { value: 'chatml', label: 'ChatML (OpenAI / Qwen)' },
              { value: 'llama3', label: 'LLaMA-3 (<|start_header_id|>)' },
              { value: 'mistral', label: 'Mistral ([INST] ... [/INST])' },
              { value: 'gemma', label: 'Gemma (<start_of_turn>)' },
            ]}
            onChange={(v) => setTemplate(v as 'chatml' | 'llama3' | 'mistral' | 'gemma')}
          />
          <TextInput label="System Message" value={systemMsg} onChange={setSystemMsg} />
          <TextInput label="User Message" value={userMsg} onChange={setUserMsg} />
        </ControlPanel>
      </div>
    </div>
  );
};
