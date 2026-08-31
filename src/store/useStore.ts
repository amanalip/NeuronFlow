import { create } from 'zustand';
import { ThemeMode } from '../theme';

interface UIState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  explanationOpen: boolean;
  setExplanationOpen: (open: boolean) => void;
  toggleExplanation: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface ProgressState {
  completedConcepts: Set<string>;
  toggleConceptComplete: (id: string) => void;
  markConceptComplete: (id: string) => void;
  markConceptIncomplete: (id: string) => void;
  isConceptComplete: (id: string) => boolean;
}

interface ConceptControlState {
  controlValues: Record<string, Record<string, unknown>>;
  setControlValue: (conceptId: string, controlKey: string, value: unknown) => void;
  getControlValue: <T>(conceptId: string, controlKey: string, defaultValue: T) => T;
  resetControls: (conceptId: string) => void;
}

const STORAGE_KEYS = {
  THEME: 'neuronflow_theme',
  COMPLETED: 'neuronflow_completed_concepts',
  CONTROLS: 'neuronflow_control_values',
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const getInitialCompleted = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
};

export const useStore = create<UIState & ProgressState & ConceptControlState>((set, get) => ({
  // UI State
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  explanationOpen: true,
  setExplanationOpen: (explanationOpen) => set({ explanationOpen }),
  toggleExplanation: () => set((state) => ({ explanationOpen: !state.explanationOpen })),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // Progress State
  completedConcepts: getInitialCompleted(),
  toggleConceptComplete: (id) => {
    const current = new Set(get().completedConcepts);
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(Array.from(current)));
    set({ completedConcepts: current });
  },
  markConceptComplete: (id) => {
    const current = new Set(get().completedConcepts);
    current.add(id);
    localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(Array.from(current)));
    set({ completedConcepts: current });
  },
  markConceptIncomplete: (id) => {
    const current = new Set(get().completedConcepts);
    current.delete(id);
    localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(Array.from(current)));
    set({ completedConcepts: current });
  },
  isConceptComplete: (id) => get().completedConcepts.has(id),

  // Control State
  controlValues: {},
  setControlValue: (conceptId, controlKey, value) => {
    set((state) => {
      const currentValues = state.controlValues[conceptId] || {};
      return {
        controlValues: {
          ...state.controlValues,
          [conceptId]: {
            ...currentValues,
            [controlKey]: value,
          },
        },
      };
    });
  },
  getControlValue: (conceptId, controlKey, defaultValue) => {
    const conceptMap = get().controlValues[conceptId];
    if (conceptMap && controlKey in conceptMap) {
      return conceptMap[controlKey] as typeof defaultValue;
    }
    return defaultValue;
  },
  resetControls: (conceptId) => {
    set((state) => {
      const next = { ...state.controlValues };
      delete next[conceptId];
      return { controlValues: next };
    });
  },
}));
