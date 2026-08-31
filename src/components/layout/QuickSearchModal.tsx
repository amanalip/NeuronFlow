import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, BookMarked, ArrowRight } from 'lucide-react';
import { CONCEPTS } from '../../model/concept-registry';
import { GLOSSARY_TERMS } from '../../model/glossary';
import { Concept } from '../../model/types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept: (concept: Concept) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectConcept,
}) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'concepts' | 'glossary'>('concepts');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalized = query.toLowerCase().trim();

  const filteredConcepts = CONCEPTS.filter((c) => {
    if (!normalized) return true;
    return (
      c.title.toLowerCase().includes(normalized) ||
      c.summary.toLowerCase().includes(normalized) ||
      c.category.toLowerCase().includes(normalized) ||
      c.number.toString() === normalized
    );
  }).slice(0, 15);

  const filteredGlossary = GLOSSARY_TERMS.filter((g) => {
    if (!normalized) return true;
    return (
      g.term.toLowerCase().includes(normalized) ||
      g.definition.toLowerCase().includes(normalized)
    );
  }).slice(0, 15);

  const handleSelect = (c: Concept) => {
    onSelectConcept(c);
    window.location.hash = `#/${c.categorySlug}/${c.slug}`;
    onClose();
  };

  const handleGlossaryJump = (conceptNumber: number) => {
    const target = CONCEPTS.find((c) => c.number === conceptNumber);
    if (target) {
      handleSelect(target);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '640px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '75vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <Search size={18} color="var(--accent-color)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Quick jump to any concept, formula, or term (e.g. attention, LoRA, RLHF)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
            }}
          />
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
          <button
            type="button"
            onClick={() => setTab('concepts')}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'concepts' ? '2px solid var(--accent-color)' : 'none',
              color: tab === 'concepts' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <BookOpen size={14} />
            Concepts ({filteredConcepts.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('glossary')}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'glossary' ? '2px solid var(--accent-color)' : 'none',
              color: tab === 'glossary' ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <BookMarked size={14} />
            AI Glossary ({filteredGlossary.length})
          </button>
        </div>

        {/* List content */}
        <div style={{ overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tab === 'concepts' ? (
            filteredConcepts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No concepts matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              filteredConcepts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                      #{c.number} {c.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Category {c.categoryNumber}: {c.category} &bull; {c.difficulty}
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--accent-color)" />
                </button>
              ))
            )
          ) : (
            filteredGlossary.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No glossary terms matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              filteredGlossary.map((g, idx) => (
                <div
                  key={idx}
                  onClick={() => handleGlossaryJump(g.conceptNumber)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--accent-color)' }}>{g.term}</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Jump to #{g.conceptNumber} &rarr;</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{g.definition}</div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};
