import React from 'react';
import { Concept } from '../../../model/types';
import { RagPipelineViz, DocumentChunkingViz, EmbeddingDocumentsViz } from './RagPipelineChunkingOverlapEmbeddingViz';
import { VectorStoreSimilarityViz, HnswViz, HybridSearchViz, ReRankingViz } from './VectorStoreHnswHybridRerankingViz';
import { PromptAssemblyRagViz, RagEvaluationViz, RagVsFineTuningViz } from './PromptAssemblyRagasVsFineTuningViz';

interface Category13DispatcherProps {
  concept: Concept;
}

export const Category13Dispatcher: React.FC<Category13DispatcherProps> = ({ concept }) => {
  switch (concept.slug) {
    case 'rag-pipeline':
    case '152-rag-pipeline':
      return <RagPipelineViz />;

    case 'document-chunking':
    case '153-document-chunking':
    case 'chunk-overlap':
    case '154-chunk-overlap':
      return <DocumentChunkingViz />;

    case 'embedding-documents':
    case '155-embedding-documents':
      return <EmbeddingDocumentsViz />;

    case 'vector-store':
    case '156-vector-store':
    case 'similarity-search':
    case '157-similarity-search':
      return <VectorStoreSimilarityViz />;

    case 'hnsw':
    case '158-hnsw':
      return <HnswViz />;

    case 'hybrid-search':
    case '159-hybrid-search':
      return <HybridSearchViz />;

    case 're-ranking':
    case '160-re-ranking':
      return <ReRankingViz />;

    case 'prompt-assembly-rag':
    case '161-prompt-assembly-rag':
      return <PromptAssemblyRagViz />;

    case 'rag-evaluation':
    case '162-rag-evaluation':
      return <RagEvaluationViz />;

    case 'rag-vs-fine-tuning':
    case '163-rag-vs-fine-tuning':
      return <RagVsFineTuningViz />;

    default:
      return <RagPipelineViz />;
  }
};
