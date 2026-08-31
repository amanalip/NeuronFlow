import { describe, it, expect } from 'vitest';
import { getLinearColorScale, getSequentialColorScale } from './colorScales';

describe('Color Scale Utilities', () => {
  it('interpolates colors correctly with linear scale', () => {
    const scale = getLinearColorScale(0, 100, '#000000', '#ffffff');
    expect(scale(0)).toBe('rgb(0, 0, 0)');
    expect(scale(100)).toBe('rgb(255, 255, 255)');
  });

  it('generates sequential scales with valid color outputs', () => {
    const scale = getSequentialColorScale(0, 1, 'blues');
    const c1 = scale(0);
    const c2 = scale(1);
    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
    expect(typeof c1).toBe('string');
  });
});
