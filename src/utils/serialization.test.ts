import { describe, it, expect } from 'vitest';
import { serializeState, deserializeState, buildShareableUrl } from './serialization';

describe('State Serialization Utilities', () => {
  it('serializes and deserializes arbitrary state objects correctly', () => {
    const original = { learningRate: 0.01, activation: 'relu', epochs: 50 };
    const serialized = serializeState(original);
    expect(typeof serialized).toBe('string');
    expect(serialized.length).toBeGreaterThan(0);

    const deserialized = deserializeState(serialized, {});
    expect(deserialized).toEqual(original);
  });

  it('handles invalid serialized strings gracefully with fallback', () => {
    const fallback = { count: 0 };
    const result = deserializeState('invalid-corrupted-string', fallback);
    expect(result).toEqual(fallback);
  });

  it('builds shareable URLs with hash state parameters', () => {
    const url = buildShareableUrl('neural-foundations', 'perceptron', { w1: 0.5, b: -0.2 });
    expect(url).toContain('#/neural-foundations/perceptron?s=');
  });
});
