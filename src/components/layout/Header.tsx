import React, { useState } from 'react';
import { Menu, Moon, Sun, Share2, Download, BookOpen, CheckCircle2, Info, Search, Keyboard, Check, Network } from 'lucide-react';
import { useStore } from '../../store/useStore';
import styles from './Header.module.css';

export interface HeaderProps {
  currentConceptTitle?: string;
  totalConcepts?: number;
  onOpenSearch?: () => void;
  onOpenShortcuts?: () => void;
  onOpenGraph?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentConceptTitle: _currentConceptTitle,
  totalConcepts = 215,
  onOpenSearch,
  onOpenShortcuts,
  onOpenGraph,
}) => {
  const { theme, toggleTheme, toggleSidebar, completedConcepts, explanationOpen, toggleExplanation } = useStore();
  const [copied, setCopied] = useState(false);

  const completedCount = completedConcepts.size;
  const progressPercent = totalConcepts > 0 ? Math.round((completedCount / totalConcepts) * 100) : 0;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          <div className={styles.brandIconBadge}>
            <BookOpen size={18} className={styles.brandIcon} />
          </div>
          <span className={styles.brandName}>NeuronFlow</span>
          <span className={styles.tagline}>See how machines learn</span>
        </a>
      </div>

      <div className={styles.centerSection}>
        <div className={styles.progressCapsule} title={`${completedCount} of ${totalConcepts} concepts completed`}>
          <CheckCircle2 size={14} className={styles.progressIcon} />
          <span className={styles.progressText}>
            <strong className={styles.progressCount}>{completedCount}</strong>
            <span className={styles.progressDivider}>/</span>
            <span>{totalConcepts}</span>
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={styles.progressPercent}>{progressPercent}%</span>
        </div>
      </div>

      <div className={styles.rightSection}>
        {onOpenSearch && (
          <button
            className={styles.searchCommandBtn}
            onClick={onOpenSearch}
            aria-label="Open global search (Ctrl+K)"
            title="Search concepts and AI glossary (Ctrl+K)"
          >
            <Search size={14} className={styles.searchIcon} />
            <span className={styles.searchLabel}>Search</span>
            <kbd className={styles.shortcutKbd}>Ctrl+K</kbd>
          </button>
        )}

        {onOpenGraph && (
          <button
            className={styles.actionBtn}
            onClick={onOpenGraph}
            aria-label="Open interactive curriculum graph"
            title="Interactive Curriculum Graph"
          >
            <Network size={15} />
            <span className={styles.btnLabel}>Curriculum Map</span>
          </button>
        )}

        {onOpenShortcuts && (
          <button
            className={styles.iconBtn}
            onClick={onOpenShortcuts}
            aria-label="Keyboard Shortcuts (?)"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard size={16} />
          </button>
        )}

        <button
          className={`${styles.actionBtn} ${explanationOpen ? styles.actionBtnActive : ''}`}
          onClick={toggleExplanation}
          aria-label="Toggle technical explanation panel"
          title="Toggle technical explanation panel"
        >
          <Info size={15} />
          <span className={styles.btnLabel}>Explanation</span>
        </button>

        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          className={`${styles.actionBtn} ${copied ? styles.copiedBtn : ''}`}
          onClick={handleShare}
          title="Copy link to current concept"
          aria-label="Share concept link"
        >
          {copied ? <Check size={14} color="var(--success-color)" /> : <Share2 size={14} />}
          <span className={styles.btnLabel}>{copied ? 'Copied' : 'Share'}</span>
        </button>

        <button
          className={styles.actionBtn}
          onClick={() => {
            window.print();
          }}
          title="Export current view to print or PDF"
          aria-label="Export view"
        >
          <Download size={14} />
          <span className={styles.btnLabel}>Export</span>
        </button>
      </div>
    </header>
  );
};
