export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ConceptSource {
  title: string;
  url: string;
  year?: number;
  authors?: string;
}

export interface ConceptExplanation {
  what: string;
  why: string;
  how: string[];
  keyTakeaway: string;
  sources: ConceptSource[];
}

export interface Concept {
  id: string;
  number: number;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  categoryNumber: number;
  difficulty: Difficulty;
  summary: string;
  explanation: ConceptExplanation;
  prerequisites?: string[];
  relatedConcepts?: string[];
}

export interface Category {
  number: number;
  title: string;
  slug: string;
  summary: string;
  conceptCount: number;
  range: [number, number];
}

export interface UserProgress {
  completedConceptIds: string[];
  lastVisitedConceptId: string | null;
}
