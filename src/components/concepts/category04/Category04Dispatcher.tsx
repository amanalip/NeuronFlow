import React from 'react';
import {
  RecurrentNeuralNetworksViz,
  VanishingGradientsViz,
} from './RNNGradientsViz';
import { LstmArchitectureViz, GruViz } from './LSTMGRUViz';
import {
  BidirectionalRnnViz,
  Seq2SeqArchitectureViz,
  InformationBottleneckViz,
} from './BiRNNSeq2SeqBottleneckViz';
import {
  BahdanauAttentionViz,
  LuongAttentionViz,
} from './BahdanauLuongAttentionViz';
import { TeacherForcingViz } from './TeacherForcingViz';

interface Category04DispatcherProps {
  slug: string;
}

export const Category04Dispatcher: React.FC<Category04DispatcherProps> = ({ slug }) => {
  switch (slug) {
    case 'recurrent-neural-networks':
      return <RecurrentNeuralNetworksViz />;
    case 'vanishing-exploding-gradients':
      return <VanishingGradientsViz />;
    case 'lstm-architecture':
      return <LstmArchitectureViz />;
    case 'gru':
      return <GruViz />;
    case 'bidirectional-rnns':
      return <BidirectionalRnnViz />;
    case 'seq2seq-architecture':
      return <Seq2SeqArchitectureViz />;
    case 'information-bottleneck':
      return <InformationBottleneckViz />;
    case 'bahdanau-additive-attention':
      return <BahdanauAttentionViz />;
    case 'luong-multiplicative-attention':
      return <LuongAttentionViz />;
    case 'teacher-forcing':
      return <TeacherForcingViz />;
    default:
      return <RecurrentNeuralNetworksViz />;
  }
};
