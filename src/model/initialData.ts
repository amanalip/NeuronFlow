import { Category, Concept } from './types';

export const initialCategories: Category[] = [
  {
    number: 1,
    title: 'Neural Network Foundations',
    slug: 'neural-foundations',
    summary: 'Core building blocks of artificial neural networks.',
    conceptCount: 15,
    range: [1, 15],
  },
  {
    number: 2,
    title: 'Text Representation',
    slug: 'text-representation',
    summary: 'Methods for turning words and sentences into vectors.',
    conceptCount: 12,
    range: [16, 27],
  },
];

export const initialConcepts: Concept[] = [
  {
    id: '01-perceptron',
    number: 1,
    title: 'Perceptron',
    slug: 'perceptron',
    category: 'Neural Network Foundations',
    categorySlug: 'neural-foundations',
    categoryNumber: 1,
    difficulty: 'Beginner',
    summary: 'Single artificial neuron computing a weighted sum followed by a threshold activation.',
    explanation: {
      what: 'The perceptron is the simplest model of an artificial neuron. It takes multiple inputs, multiplies each by a weight, adds a bias term, and passes the sum through an activation function.',
      why: 'It forms the fundamental building block of all modern neural networks and deep learning models.',
      how: [
        'Multiply each input value x_i by its corresponding weight w_i.',
        'Calculate the sum of all weighted inputs.',
        'Add the scalar bias term b to the sum.',
        'Pass the resulting value through an activation function to generate the output.',
      ],
      keyTakeaway: 'A perceptron computes a linear decision boundary to classify inputs.',
      sources: [
        {
          title: 'The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain',
          url: 'https://psycnet.apa.org/record/1959-09865-001',
          year: 1958,
          authors: 'Frank Rosenblatt',
        },
      ],
    },
  },
  {
    id: '02-activation-functions',
    number: 2,
    title: 'Activation Functions',
    slug: 'activation-functions',
    category: 'Neural Network Foundations',
    categorySlug: 'neural-foundations',
    categoryNumber: 1,
    difficulty: 'Beginner',
    summary: 'Non-linear mathematical transformations that enable networks to learn complex functions.',
    explanation: {
      what: 'Activation functions are non-linear mathematical operations applied to the output of a neuron.',
      why: 'Without non-linear activations, stacking multiple layers would still only compute a single linear transformation.',
      how: [
        'Compute the linear combination of inputs, weights, and bias.',
        'Apply a mathematical function such as ReLU, Sigmoid, Tanh, or GELU.',
        'Pass the activated output to downstream layers.',
      ],
      keyTakeaway: 'Non-linear activation functions give deep neural networks their expressive power.',
      sources: [
        {
          title: 'Deep Learning',
          url: 'https://www.deeplearningbook.org/',
          year: 2016,
          authors: 'Goodfellow, Bengio, Courville',
        },
      ],
    },
  },
];
