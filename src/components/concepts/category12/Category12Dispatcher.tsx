import React from 'react';
import { Concept } from '../../../model/types';
import { MoeRoutingViz, MambaViz, RwkvViz } from './MoeRoutingMambaRwkvViz';
import { VitViz, MultimodalTextImageViz, MultimodalTextAudioViz, DiffusionModelsViz } from './VitMultimodalDiffusionViz';
import { EncoderDecoderVsDecoderOnlyViz, GptVsBertVsT5Viz, RetrievalAugmentedModelsViz, HyenaViz } from './ArchitectureComparisonsHyenaViz';

interface Category12DispatcherProps {
  concept: Concept;
}

export const Category12Dispatcher: React.FC<Category12DispatcherProps> = ({ concept }) => {
  switch (concept.slug) {
    case 'moe':
    case '140-moe':
    case 'expert-routing':
    case '141-expert-routing':
      return <MoeRoutingViz />;

    case 'mamba':
    case '142-mamba':
      return <MambaViz />;

    case 'rwkv':
    case '143-rwkv':
      return <RwkvViz />;

    case 'vit':
    case '144-vit':
      return <VitViz />;

    case 'multimodal-text-image':
    case '145-multimodal-text-image':
      return <MultimodalTextImageViz />;

    case 'multimodal-text-audio':
    case '146-multimodal-text-audio':
      return <MultimodalTextAudioViz />;

    case 'diffusion-models':
    case '147-diffusion-models':
      return <DiffusionModelsViz />;

    case 'encoder-decoder-vs-decoder-only':
    case '148-encoder-decoder-vs-decoder-only':
      return <EncoderDecoderVsDecoderOnlyViz />;

    case 'gpt-vs-bert-vs-t5':
    case '149-gpt-vs-bert-vs-t5':
      return <GptVsBertVsT5Viz />;

    case 'retrieval-augmented-models':
    case '150-retrieval-augmented-models':
      return <RetrievalAugmentedModelsViz />;

    case 'hyena':
    case '151-hyena':
      return <HyenaViz />;

    default:
      return <MoeRoutingViz />;
  }
};
