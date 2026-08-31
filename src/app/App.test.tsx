import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { parseHash } from './Router';
import { useStore } from '../store/useStore';

describe('NeuronFlow App Shell', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders application header and title', () => {
    render(<App />);
    expect(screen.getByText('NeuronFlow')).toBeInTheDocument();
    expect(screen.getByText('See how machines learn')).toBeInTheDocument();
  });

  it('parses hash routes correctly', () => {
    expect(parseHash('')).toEqual({});
    expect(parseHash('#/neural-foundations/perceptron')).toEqual({
      categorySlug: 'neural-foundations',
      conceptSlug: 'perceptron',
    });
  });

  it('toggles concept completion state in the store', () => {
    const store = useStore.getState();
    expect(store.isConceptComplete('test-concept')).toBe(false);

    store.markConceptComplete('test-concept');
    expect(useStore.getState().isConceptComplete('test-concept')).toBe(true);

    store.markConceptIncomplete('test-concept');
    expect(useStore.getState().isConceptComplete('test-concept')).toBe(false);
  });
});
