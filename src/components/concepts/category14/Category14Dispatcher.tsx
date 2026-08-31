import React from 'react';
import { Concept } from '../../../model/types';
import { PromptStructureViz, ZeroShotVsFewShotViz, ChainAndTreeOfThoughtViz } from './PromptStructureZeroFewCotTotViz';
import { ReactViz, SelfConsistencyViz, ToolUseStructuredOutputViz } from './ReactToolCallingStructuredOutputViz';
import { TokenCountingPricingViz, PromptInjectionViz, NeedleInAHaystackViz, PromptCachingViz } from './TokenPricingInjectionNiahCachingViz';

interface Category14DispatcherProps {
  concept: Concept;
}

export const Category14Dispatcher: React.FC<Category14DispatcherProps> = ({ concept }) => {
  switch (concept.slug) {
    case 'prompt-structure':
    case '164-prompt-structure':
    case 'system-prompts':
    case '165-system-prompts':
      return <PromptStructureViz />;

    case 'zero-shot':
    case '166-zero-shot':
    case 'few-shot':
    case '167-few-shot':
      return <ZeroShotVsFewShotViz />;

    case 'chain-of-thought':
    case '168-chain-of-thought':
    case 'tree-of-thought':
    case '169-tree-of-thought':
      return <ChainAndTreeOfThoughtViz />;

    case 'react':
    case '170-react':
      return <ReactViz />;

    case 'self-consistency':
    case '171-self-consistency':
      return <SelfConsistencyViz />;

    case 'tool-use-function-calling':
    case '172-tool-use-function-calling':
    case 'structured-output-schema':
    case '173-structured-output-schema':
      return <ToolUseStructuredOutputViz />;

    case 'token-counting-pricing':
    case '174-token-counting-pricing':
      return <TokenCountingPricingViz />;

    case 'prompt-injection':
    case '175-prompt-injection':
      return <PromptInjectionViz />;

    case 'context-stuffing':
    case '176-context-stuffing':
      return <NeedleInAHaystackViz />;

    case 'prompt-caching':
    case '177-prompt-caching':
      return <PromptCachingViz />;

    default:
      return <PromptStructureViz />;
  }
};
