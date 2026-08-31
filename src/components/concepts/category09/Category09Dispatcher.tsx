import React from 'react';
import {
  FineTuningIntroViz,
  SftLossMaskingViz,
  CatastrophicForgettingViz,
} from './FineTuningSftCatastrophicViz';
import {
  LoRAViz,
  QLoRAViz,
  DoRAViz,
} from './LoRAQLoRADoRAViz';
import {
  AdaptersViz,
  PrefixTuningViz,
  PromptTuningViz,
  Ia3Viz,
} from './AdaptersPrefixPromptIa3Viz';
import {
  MultiTaskFineTuningViz,
  InstructionTuningViz,
  ChatTemplatesViz,
} from './MultiTaskInstructionChatTemplatesViz';

interface Category09DispatcherProps {
  slug: string;
}

export const Category09Dispatcher: React.FC<Category09DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'fine-tuning-intro':
      return <FineTuningIntroViz />;
    case 'sft':
      return <SftLossMaskingViz />;
    case 'catastrophic-forgetting':
      return <CatastrophicForgettingViz />;
    case 'lora':
      return <LoRAViz />;
    case 'qlora':
      return <QLoRAViz />;
    case 'dora':
      return <DoRAViz />;
    case 'adapters':
      return <AdaptersViz />;
    case 'prefix-tuning':
      return <PrefixTuningViz />;
    case 'prompt-tuning':
      return <PromptTuningViz />;
    case 'ia3':
      return <Ia3Viz />;
    case 'multi-task-fine-tuning':
      return <MultiTaskFineTuningViz />;
    case 'instruction-tuning':
      return <InstructionTuningViz />;
    case 'chat-templates':
      return <ChatTemplatesViz />;
    default:
      return <FineTuningIntroViz />;
  }
};
