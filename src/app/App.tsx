import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { MainCanvas } from '../components/layout/MainCanvas';
import { ExplanationPanel } from '../components/layout/ExplanationPanel';
import { QuickSearchModal } from '../components/layout/QuickSearchModal';
import { useRouter } from './Router';
import { useStore } from '../store/useStore';
import { Concept } from '../model/types';
import { CATEGORIES } from '../model/categories';
import { CONCEPTS, getConceptBySlug } from '../model/concept-registry';
import styles from './App.module.css';

export const App: React.FC = () => {
  const { route, navigate } = useRouter();
  const theme = useStore((state) => state.theme);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Find active concept
  const activeConcept = useMemo(() => {
    if (route.categorySlug && route.conceptSlug) {
      const found = getConceptBySlug(route.categorySlug, route.conceptSlug);
      if (found) return found;
    }
    if (route.conceptSlug) {
      const found = CONCEPTS.find(
        (c) => c.slug === route.conceptSlug || c.id === route.conceptSlug
      );
      if (found) return found;
    }
    return CONCEPTS[0];
  }, [route.categorySlug, route.conceptSlug]);

  const activeIndex = CONCEPTS.findIndex((c) => c.id === activeConcept?.id);
  const prevConcept = activeIndex > 0 ? CONCEPTS[activeIndex - 1] : undefined;
  const nextConcept =
    activeIndex < CONCEPTS.length - 1 ? CONCEPTS[activeIndex + 1] : undefined;

  const handleSelectConcept = (concept: Concept) => {
    navigate(concept.categorySlug, concept.slug);
  };

  return (
    <div className={styles.appShell}>
      <Header
        currentConceptTitle={activeConcept?.title}
        totalConcepts={CONCEPTS.length}
        onOpenSearch={() => setSearchOpen(true)}
      />
      <div className={styles.workspace}>
        <Sidebar
          categories={CATEGORIES}
          concepts={CONCEPTS}
          activeConceptId={activeConcept?.id}
          onSelectConcept={handleSelectConcept}
        />
        <MainCanvas
          concept={activeConcept}
          prevConcept={prevConcept}
          nextConcept={nextConcept}
          onNavigate={handleSelectConcept}
        />
        <ExplanationPanel concept={activeConcept} />
      </div>

      <QuickSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectConcept={handleSelectConcept}
      />
    </div>
  );
};

export default App;
