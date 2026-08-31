import { describe, it, expect } from 'vitest';
import {
  computeTrainingFlops,
  computeEmergenceMetric,
} from './category18Math';

describe('Category 18 Mathematics & Historical Scaling Algorithms', () => {
  it('computes training compute FLOPs (6ND) and GPU-hours', () => {
    const { flops, log10Flops, gpuHoursH100 } = computeTrainingFlops(70, 15);

    expect(flops).toBeCloseTo(6 * 70e9 * 15e12, -15);
    expect(log10Flops).toBeGreaterThan(24.5);
    expect(gpuHoursH100).toBeGreaterThan(1000);
  });

  it('evaluates emergent ability phase transition vs continuous metrics', () => {
    const preThreshold = computeEmergenceMetric(22.0, 23.5, true);
    const postThreshold = computeEmergenceMetric(25.0, 23.5, true);

    expect(preThreshold).toBeLessThan(0.1);
    expect(postThreshold).toBeGreaterThan(0.5);

    const linearScore = computeEmergenceMetric(23.0, 23.5, false);
    expect(linearScore).toBeGreaterThan(0.4);
    expect(linearScore).toBeLessThan(0.6);
  });
});
