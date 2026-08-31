// Mathematical and algorithmic helpers for Category 9: Fine-Tuning & Adaptation

export function calculateLoraParameters(
  dModel = 4096,
  dOut = 4096,
  rank = 8,
  numMatrices = 4 // W_q, W_k, W_v, W_o
): { originalParams: number; loraParams: number; reductionRatio: number } {
  const originalParams = numMatrices * dModel * dOut;
  // For each matrix: A is dModel x rank, B is rank x dOut => rank * (dModel + dOut)
  const loraParams = numMatrices * rank * (dModel + dOut);
  const reductionRatio = (1 - loraParams / originalParams) * 100;

  return { originalParams, loraParams, reductionRatio };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function renderChatTemplate(
  messages: ChatMessage[],
  template: 'chatml' | 'llama3' | 'mistral' | 'gemma'
): string {
  switch (template) {
    case 'chatml':
      return messages
        .map((m) => `<|im_start|>${m.role}\n${m.content}<|im_end|>`)
        .join('\n');
    case 'llama3':
      return messages
        .map(
          (m) =>
            `<|start_header_id|>${m.role}<|end_header_id|>\n\n${m.content}<|eot_id|>`
        )
        .join('');
    case 'mistral':
      return messages
        .map((m) => (m.role === 'user' ? `[INST] ${m.content} [/INST]` : m.content))
        .join(' ');
    case 'gemma':
      return messages
        .map(
          (m) =>
            `<start_of_turn>${m.role === 'assistant' ? 'model' : m.role}\n${m.content}<end_of_turn>`
        )
        .join('\n');
  }
}
