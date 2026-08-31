import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProbabilityBar, ProbabilityItem } from './ProbabilityBar';

describe('ProbabilityBar Component', () => {
  const sampleData: ProbabilityItem[] = [
    { token: 'apple', probability: 0.65, logit: 4.2 },
    { token: 'banana', probability: 0.25, logit: 3.1 },
    { token: 'cherry', probability: 0.10, logit: 1.8 },
  ];

  it('renders token labels and percentages', () => {
    render(<ProbabilityBar data={sampleData} title="Next Token Probabilities" />);
    expect(screen.getByText('Next Token Probabilities')).toBeInTheDocument();
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getAllByText('65.0%').length).toBeGreaterThan(0);
  });

  it('sorts and displays top candidate accurately', () => {
    render(<ProbabilityBar data={sampleData} title="Fruits" />);
    const labels = screen.getAllByTitle(/apple|banana|cherry/);
    expect(labels[0]).toHaveTextContent('apple');
  });
});
