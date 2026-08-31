// Mathematical and algorithmic helpers for Category 2: Text Representation

export function computeCosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator < 1e-7) return 0;
  return dot / denominator;
}

export function computeTf(term: string, docTokens: string[]): number {
  if (docTokens.length === 0) return 0;
  const count = docTokens.filter((t) => t.toLowerCase() === term.toLowerCase()).length;
  return count / docTokens.length;
}

export function computeIdf(term: string, allDocsTokens: string[][]): number {
  const numDocsContaining = allDocsTokens.filter((doc) =>
    doc.some((t) => t.toLowerCase() === term.toLowerCase())
  ).length;
  if (numDocsContaining === 0) return 0;
  return Math.log((allDocsTokens.length + 1) / (numDocsContaining + 1)) + 1;
}

export function computeTfIdf(term: string, docTokens: string[], allDocsTokens: string[][]): number {
  return computeTf(term, docTokens) * computeIdf(term, allDocsTokens);
}

export function extractNgrams(text: string, n: number): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < n) return [];
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

export function extractSubwords(word: string, minN = 3, maxN = 5): string[] {
  const formatted = `<${word.toLowerCase()}>`;
  const subwords: string[] = [];
  for (let n = minN; n <= maxN; n++) {
    for (let i = 0; i <= formatted.length - n; i++) {
      subwords.push(formatted.slice(i, i + n));
    }
  }
  return subwords;
}

export interface WordVector {
  word: string;
  x: number;
  y: number;
  z: number;
  category: 'royalty' | 'gender' | 'animals' | 'cities' | 'actions';
}

export const EMBEDDING_VOCAB: WordVector[] = [
  { word: 'king', x: 2.1, y: 1.8, z: 0.5, category: 'royalty' },
  { word: 'queen', x: 2.0, y: -1.7, z: 0.6, category: 'royalty' },
  { word: 'prince', x: 1.7, y: 1.6, z: 0.3, category: 'royalty' },
  { word: 'princess', x: 1.6, y: -1.8, z: 0.4, category: 'royalty' },
  { word: 'man', x: 0.5, y: 1.9, z: -0.2, category: 'gender' },
  { word: 'woman', x: 0.4, y: -1.9, z: -0.1, category: 'gender' },
  { word: 'boy', x: 0.2, y: 1.5, z: -0.5, category: 'gender' },
  { word: 'girl', x: 0.1, y: -1.6, z: -0.4, category: 'gender' },
  { word: 'dog', x: -1.8, y: 0.5, z: 1.8, category: 'animals' },
  { word: 'cat', x: -1.9, y: -0.4, z: 1.7, category: 'animals' },
  { word: 'puppy', x: -1.6, y: 0.7, z: 1.5, category: 'animals' },
  { word: 'kitten', x: -1.7, y: -0.6, z: 1.4, category: 'animals' },
  { word: 'paris', x: -0.2, y: 0.1, z: -2.1, category: 'cities' },
  { word: 'rome', x: -0.1, y: 0.3, z: -2.0, category: 'cities' },
  { word: 'tokyo', x: 0.3, y: -0.2, z: -2.3, category: 'cities' },
];

export function findNearestWord(target: [number, number, number], excludeWords: string[] = []): { word: string; dist: number } {
  let bestWord = '';
  let bestDist = Infinity;

  EMBEDDING_VOCAB.forEach((item) => {
    if (excludeWords.includes(item.word)) return;
    const dx = item.x - target[0];
    const dy = item.y - target[1];
    const dz = item.z - target[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < bestDist) {
      bestDist = dist;
      bestWord = item.word;
    }
  });

  return { word: bestWord, dist: bestDist };
}
