import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MathBlock, InlineMath } from './MathBlock';

describe('MathBlock & InlineMath Components', () => {
  it('renders KaTeX math formulas into HTML spans', () => {
    const { container } = render(<MathBlock math="z = \sum_{i=1}^n w_i x_i + b" />);
    expect(container.querySelector('.katex')).toBeInTheDocument();
  });

  it('renders InlineMath cleanly', () => {
    const { container } = render(<InlineMath math="O(n^2)" />);
    expect(container.querySelector('.katex')).toBeInTheDocument();
  });

  it('handles empty or malformed math gracefully', () => {
    render(<MathBlock math="" />);
    expect(screen.queryByText('undefined')).not.toBeInTheDocument();
  });
});
