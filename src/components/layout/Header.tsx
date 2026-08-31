import React from 'react';
import { Menu, Moon, Sun, Share2, Download, BookOpen, CheckCircle2, Info, Search } from 'lucide-react';
import { useStore } from '../../store/useStore';
import styles from './Header.module.css';

interface HeaderProps {
  currentConceptTitle?: string;
  totalConcepts?: number;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentConceptTitle: _currentConceptTitle,
  totalConcepts = 215,
  onOpenSearch,
}) => {
  const { theme, toggleTheme, toggleSidebar, completedConcepts, explanationOpen, toggleExplanation } = useStore();
  const completedCount = completedConcepts.size;
  const progressPercent = totalConcepts > 0 ? Math.round((completedCount / totalConcepts) * 100) : 0;

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          className={styles.toggleBtn}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar navigation"
          title="Toggle sidebar navigation"
        >
          <Menu size={18} />
        </button>
        <a href="#/" className={styles.brand}>
          <BookOpen size={20} className={styles.brandIcon} />
          <span>NeuronFlow</span>
          <span className={styles.tagline}>See how machines learn</span>
        </a>
      </div>

      <div className={styles.centerSection}>
        <div className={styles.progressContainer}>
          <CheckCircle2 size={15} color="var(--success-color)" />
          <span>
            {completedCount} / {totalConcepts} concepts ({progressPercent}%)
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        {onOpenSearch && (
          <button
            className={styles.actionBtn}
            onClick={onOpenSearch}
            aria-label="Open global search (Ctrl+K)"
            title="Search concepts and AI glossary (Ctrl+K)"
          >
            <Search size={15} />
            <span>Search</span>
            <kbd style={{ fontSize: '0.65rem', padding: '1px 4px', background: 'var(--bg-primary)', borderRadius: '3px', border: '1px solid var(--border-color)' }}>Ctrl+K</kbd>
          </button>
        )}
        <button
          className={`${styles.actionBtn} ${explanationOpen ? styles.actionBtnActive : ''}`}
          onClick={toggleExplanation}
          aria-label="Toggle explanation panel"
          title="Toggle explanation panel"
        >
          <Info size={15} />
          <span>Info</span>
        </button>
        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard.');
            }
          }}
          title="Share current concept"
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => {
            window.print();
          }}
          title="Export view"
        >
          <Download size={15} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
