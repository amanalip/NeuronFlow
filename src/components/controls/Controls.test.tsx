import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slider } from './Slider';
import { Toggle } from './Toggle';
import { RadioGroup } from './RadioGroup';
import { TextInput } from './TextInput';

describe('Interactive Control Components', () => {
  it('renders Slider and fires onChange events', () => {
    const handleChange = vi.fn();
    render(
      <Slider
        label="Learning Rate"
        value={0.01}
        min={0.001}
        max={0.1}
        step={0.001}
        onChange={handleChange}
      />
    );

    expect(screen.getByText('Learning Rate')).toBeInTheDocument();
    expect(screen.getByText('0.01')).toBeInTheDocument();

    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '0.05' } });
    expect(handleChange).toHaveBeenCalledWith(0.05);
  });

  it('renders Toggle and switches state on click', () => {
    const handleToggle = vi.fn();
    render(<Toggle label="Enable Bias" checked={false} onChange={handleToggle} />);

    expect(screen.getByText('Enable Bias')).toBeInTheDocument();
    const switchEl = screen.getByRole('switch');
    fireEvent.click(switchEl);
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it('renders RadioGroup and switches options', () => {
    const handleChange = vi.fn();
    const options = [
      { value: 'relu', label: 'ReLU' },
      { value: 'sigmoid', label: 'Sigmoid' },
    ];

    render(
      <RadioGroup
        label="Activation"
        value="relu"
        options={options}
        onChange={handleChange}
      />
    );

    expect(screen.getByText('Activation')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Sigmoid'));
    expect(handleChange).toHaveBeenCalledWith('sigmoid');
  });

  it('renders TextInput and handles typing and clearing', () => {
    const handleChange = vi.fn();
    render(
      <TextInput
        label="Prompt"
        value="hello world"
        placeholder="Enter text"
        onChange={handleChange}
      />
    );

    expect(screen.getByDisplayValue('hello world')).toBeInTheDocument();
    const clearBtn = screen.getByTitle('Clear text');
    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
