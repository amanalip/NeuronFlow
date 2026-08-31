import { describe, it, expect } from 'vitest';
import {
  calculateLoraParameters,
  renderChatTemplate,
  ChatMessage,
} from './category09Math';

describe('Category 09: Fine-Tuning & Adaptation Math', () => {
  it('computes LoRA parameter reduction ratio accurately', () => {
    // 4096 x 4096, rank = 8, 4 matrices
    const { originalParams, loraParams, reductionRatio } = calculateLoraParameters(4096, 4096, 8, 4);

    expect(originalParams).toBe(4 * 4096 * 4096);
    expect(loraParams).toBe(4 * 8 * (4096 + 4096));
    expect(reductionRatio).toBeGreaterThan(99.0); // >99% reduction
  });

  it('renders chat templates correctly across multiple model families', () => {
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: 'Hello!' },
    ];

    const chatml = renderChatTemplate(messages, 'chatml');
    expect(chatml).toContain('<|im_start|>system');
    expect(chatml).toContain('<|im_end|>');
    expect(chatml).toContain('<|im_start|>user');

    const llama3 = renderChatTemplate(messages, 'llama3');
    expect(llama3).toContain('<|start_header_id|>system');
    expect(llama3).toContain('<|eot_id|>');

    const gemma = renderChatTemplate(messages, 'gemma');
    expect(gemma).toContain('<start_of_turn>system');
    expect(gemma).toContain('<end_of_turn>');
  });
});
