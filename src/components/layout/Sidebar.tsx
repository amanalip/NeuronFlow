import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, CheckCircle2, Circle, X, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Concept, Category } from '../../model/types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  categories: Category[];
  concepts: Concept[];
  activeConceptId?: string;
  onSelectConcept?: (concept: Concept) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  concepts,
  activeConceptId,
  onSelectConcept,
}) => {
  const { sidebarOpen, searchQuery, setSearchQuery, isConceptComplete } = useStore();
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    categories.forEach((cat) => {
      initial[cat.number] = cat.number === 1;
    });
    return initial;
  });

  // Automatically open category containing the active concept and scroll to it
  useEffect(() => {
    if (activeConceptId) {
      const activeConcept = concepts.find((c) => c.id === activeConceptId);
      if (activeConcept) {
        setOpenCategories((prev) => ({
          ...prev,
          [activeConcept.categoryNumber]: true,
        }));
      }
    }
  }, [activeConceptId, concepts]);

  useEffect(() => {
    if (activeItemRef.current && typeof activeItemRef.current.scrollIntoView === 'function') {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeConceptId]);

  const toggleCategory = (catNum: number) => {
    setOpenCategories((prev) => ({ ...prev, [catNum]: !prev[catNum] }));
  };

  const filteredConcepts = concepts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      `#${c.number}`.includes(q)
    );
  });

  return (
    <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarClosed : ''}`}>
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={`Search ${concepts.length} concepts...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchQuery('');
            }}
          />
          {searchQuery && (
            <button
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery('')}
              aria-label="Clear search input"
              title="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
        {searchQuery.trim() && (
          <div className={styles.searchSummary}>
            {filteredConcepts.length} {filteredConcepts.length === 1 ? 'concept' : 'concepts'} found
          </div>
        )}
      </div>

      <div className={styles.categoryList}>
        {categories.map((cat) => {
          const catConcepts = filteredConcepts.filter((c) => c.categoryNumber === cat.number);
          if (searchQuery.trim() && catConcepts.length === 0) return null;
          const isOpen = searchQuery.trim() ? true : !!openCategories[cat.number];

          const completedInCat = catConcepts.filter((c) => isConceptComplete(c.id)).length;
          const isAllCompleted = catConcepts.length > 0 && completedInCat === catConcepts.length;

          return (
            <div key={cat.number} className={styles.categoryGroup}>
              <button
                className={`${styles.categoryHeader} ${isOpen ? styles.categoryHeaderOpen : ''}`}
                onClick={() => toggleCategory(cat.number)}
                aria-expanded={isOpen}
              >
                <div className={styles.categoryTitle}>
                  <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                    <ChevronRight size={13} />
                  </span>
                  <span className={styles.catBadge}>{cat.number}</span>
                  <span className={styles.catName}>{cat.title}</span>
                </div>
                <div className={styles.catStatus}>
                  {isAllCompleted ? (
                    <span className={styles.completedBadge} title="Category fully completed">
                      <Check size={11} />
                    </span>
                  ) : null}
                  <span className={styles.conceptCounter}>
                    {completedInCat > 0 ? (
                      <span className={styles.completedCount}>{completedInCat}/</span>
                    ) : null}
                    {catConcepts.length}
                  </span>
                </div>
              </button>

              {isOpen && (
                <ul className={styles.conceptList}>
                  {catConcepts.map((concept) => {
                    const isActive = concept.id === activeConceptId;
                    const completed = isConceptComplete(concept.id);

                    const badgeClass =
                      concept.difficulty === 'Beginner'
                        ? styles.badgeBeginner
                        : concept.difficulty === 'Intermediate'
                        ? styles.badgeIntermediate
                        : styles.badgeAdvanced;

                    return (
                      <li key={concept.id}>
                        <a
                          ref={isActive ? activeItemRef : undefined}
                          href={`#/${concept.categorySlug}/${concept.slug}`}
                          className={`${styles.conceptItem} ${isActive ? styles.activeConcept : ''}`}
                          onClick={() => onSelectConcept?.(concept)}
                        >
                          <div className={styles.conceptInfo}>
                            {completed ? (
                              <CheckCircle2 size={13} className={styles.completedIcon} />
                            ) : (
                              <Circle size={13} className={styles.uncompletedIcon} />
                            )}
                            <span className={styles.conceptNumber}>#{concept.number}</span>
                            <span className={styles.conceptTitle}>{concept.title}</span>
                          </div>
                          <span className={`${styles.difficultyBadge} ${badgeClass}`}>
                            {concept.difficulty}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
