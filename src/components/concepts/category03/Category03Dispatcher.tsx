import React from 'react';
import { TokenizationIntroViz, BpeViz, WordPieceViz } from './TokenizationIntroBpeViz';
import {
  UnigramTokenizerViz,
  ByteLevelBpeViz,
  SentencePieceViz,
} from './UnigramByteLevelSentencePieceViz';
import { TiktokenViz, SpecialTokensViz } from './TiktokenSpecialTokensViz';
import {
  VocabSizeViz,
  TokenHealingViz,
  TokenizationArtifactsViz,
} from './VocabSizeHealingArtifactsViz';
import { MultilingualTokenizationViz } from './MultilingualTokenizationViz';

interface Category03DispatcherProps {
  slug: string;
}

export const Category03Dispatcher: React.FC<Category03DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'tokenization-intro':
      return <TokenizationIntroViz />;
    case 'bpe':
      return <BpeViz />;
    case 'wordpiece':
      return <WordPieceViz />;
    case 'unigram-tokenizer':
      return <UnigramTokenizerViz />;
    case 'byte-level-bpe':
      return <ByteLevelBpeViz />;
    case 'sentencepiece':
      return <SentencePieceViz />;
    case 'tiktoken':
      return <TiktokenViz />;
    case 'special-tokens':
      return <SpecialTokensViz />;
    case 'vocabulary-size':
      return <VocabSizeViz />;
    case 'token-healing':
      return <TokenHealingViz />;
    case 'tokenization-artifacts':
      return <TokenizationArtifactsViz />;
    case 'multilingual-tokenization':
      return <MultilingualTokenizationViz />;
    default:
      return <TokenizationIntroViz />;
  }
};
