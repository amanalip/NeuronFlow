import React, { useEffect, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { MainCanvas } from '../components/layout/MainCanvas';
import { ExplanationPanel } from '../components/layout/ExplanationPanel';
import { useRouter } from './Router';
import { useStore } from '../store/useStore';
import { Concept } from '../model/types';
import { initialCategories, initialConcepts } from '../model/initialData';
import styles from './App.module.css';

export const App: React.FC = () => {
  const { route, navigate } = useRouter();
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Find active concept
  const activeConcept = useMemo(() => {
    if (!route.conceptSlug) {
      return initialConcepts[0];
    }
    return (
      initialConcepts.find(
        (c) => c.slug === route.conceptSlug || c.id === route.conceptSlug
      ) || initialConcepts[0]
    );
  }, [route.conceptSlug]);

  const activeIndex = initialConcepts.findIndex((c) => c.id === activeConcept?.id);
  const prevConcept = activeIndex > 0 ? initialConcepts[activeIndex - 1] : undefined;
  const nextConcept =
    activeIndex < initialConcepts.length - 1 ? initialConcepts[activeIndex + 1] : undefined;

  const handleSelectConcept = (concept: Concept) => {
    navigate(concept.categorySlug, concept.slug);
  };

  return (
    <div className={styles.appShell}>
      <Header currentConceptTitle={activeConcept?.title} totalConcepts={215} />
      <div className={styles.workspace}>
        <Sidebar
          categories={initialCategories}
          concepts={initialConcepts}
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
    </div>
  );
};

export default App;
