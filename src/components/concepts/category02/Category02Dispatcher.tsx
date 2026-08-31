import React from 'react';
import { OneHotEncodingViz, BagOfWordsViz } from './OneHotBoWViz';
import { TfIdfViz, NgramsViz } from './TfIdfNgramsViz';
import { WordEmbeddings3DViz } from './WordEmbeddings3DViz';
import { Word2VecViz, GloVeViz, FastTextViz } from './Word2VecGloVeFastTextViz';
import { CosineSimilarityViz, EmbeddingArithmeticViz } from './CosineSimilarityArithmeticViz';

interface Category02DispatcherProps {
  slug: string;
}

export const Category02Dispatcher: React.FC<Category02DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'one-hot-encoding':
      return <OneHotEncodingViz />;
    case 'bag-of-words':
      return <BagOfWordsViz />;
    case 'tf-idf':
      return <TfIdfViz />;
    case 'n-grams':
      return <NgramsViz />;
    case 'word-embeddings':
      return <WordEmbeddings3DViz />;
    case 'word2vec':
      return <Word2VecViz />;
    case 'glove':
      return <GloVeViz />;
    case 'fasttext':
      return <FastTextViz />;
    case 'cosine-similarity':
      return <CosineSimilarityViz />;
    case 'embedding-arithmetic':
      return <EmbeddingArithmeticViz />;
    default:
      return <OneHotEncodingViz />;
  }
};
