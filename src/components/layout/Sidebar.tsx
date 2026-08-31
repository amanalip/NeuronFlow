import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
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
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const toggleCategory = (catNum: number) => {
    setOpenCategories((prev) => ({ ...prev, [catNum]: !prev[catNum] }));
  };

  const filteredConcepts = concepts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q)
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
            placeholder="Search 215 concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.categoryList}>
        {categories.map((cat) => {
          const catConcepts = filteredConcepts.filter((c) => c.categoryNumber === cat.number);
          if (searchQuery.trim() && catConcepts.length === 0) return null;
          const isOpen = searchQuery.trim() ? true : !!openCategories[cat.number];

          return (
            <div key={cat.number} className={styles.categoryGroup}>
              <button
                className={styles.categoryHeader}
                onClick={() => toggleCategory(cat.number)}
              >
                <div className={styles.categoryTitle}>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>{cat.number}. {cat.title}</span>
                </div>
                <span className={styles.conceptNumber}>{catConcepts.length}</span>
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
                          href={`#/${concept.categorySlug}/${concept.slug}`}
                          className={`${styles.conceptItem} ${isActive ? styles.activeConcept : ''}`}
                          onClick={() => onSelectConcept?.(concept)}
                        >
                          <div className={styles.conceptInfo}>
                            {completed ? (
                              <CheckCircle2 size={13} className={styles.completedIcon} />
                            ) : (
                              <Circle size={13} color="var(--text-muted)" />
                            )}
                            <span className={styles.conceptNumber}>#{concept.number}</span>
                            <span>{concept.title}</span>
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
