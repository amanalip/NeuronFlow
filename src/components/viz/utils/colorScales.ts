import { interpolateBlues, interpolatePurples, interpolateViridis, interpolateInferno } from 'd3-scale-chromatic';
import { scaleSequential, scaleLinear } from 'd3-scale';

export type ColorSchemeName = 'blues' | 'purples' | 'viridis' | 'inferno' | 'custom';

export function getSequentialColorScale(
  min: number,
  max: number,
  scheme: ColorSchemeName = 'blues'
) {
  const interpolator =
    scheme === 'purples'
      ? interpolatePurples
      : scheme === 'viridis'
      ? interpolateViridis
      : scheme === 'inferno'
      ? interpolateInferno
      : interpolateBlues;

  return scaleSequential(interpolator).domain([min, max]);
}

export function getLinearColorScale(
  min: number,
  max: number,
  minColor = '#1e293b',
  maxColor = '#38bdf8'
) {
  return scaleLinear<string>().domain([min, max]).range([minColor, maxColor]);
}
