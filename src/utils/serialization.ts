import LZString from 'lz-string';

export function serializeState<T>(state: T): string {
  try {
    const json = JSON.stringify(state);
    return LZString.compressToEncodedURIComponent(json);
  } catch {
    return '';
  }
}

export function deserializeState<T>(encoded: string, fallback: T): T {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return fallback;
    return JSON.parse(decompressed) as T;
  } catch {
    return fallback;
  }
}

export function buildShareableUrl(
  categorySlug: string,
  conceptSlug: string,
  state?: Record<string, unknown>
): string {
  const base = `${window.location.origin}${window.location.pathname}#/${categorySlug}/${conceptSlug}`;
  if (!state || Object.keys(state).length === 0) return base;
  const serialized = serializeState(state);
  return `${base}?s=${serialized}`;
}

export function parseStateFromUrl<T>(fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const hash = window.location.hash;
  const queryIdx = hash.indexOf('?s=');
  if (queryIdx === -1) return fallback;
  const param = hash.slice(queryIdx + 3);
  return deserializeState<T>(param, fallback);
}
