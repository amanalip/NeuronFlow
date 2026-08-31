import React from 'react';
import { X, Keyboard, ArrowLeft, ArrowRight, Search, BookOpen } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K  /  ⌘ + K', desc: 'Open Global Concept & AI Glossary Search', icon: <Search size={14} /> },
    { key: '← (Left Arrow)', desc: 'Navigate to Previous Concept', icon: <ArrowLeft size={14} /> },
    { key: '→ (Right Arrow)', desc: 'Navigate to Next Concept', icon: <ArrowRight size={14} /> },
    { key: '? / Shift + /', desc: 'Open Keyboard Shortcuts Cheat Sheet', icon: <Keyboard size={14} /> },
    { key: 'Tab', desc: 'Accessible Keyboard Focus Traversal', icon: <BookOpen size={14} /> },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '520px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={18} color="var(--accent-color)" />
            <h2 id="shortcuts-title" style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
              Keyboard Shortcuts & Accessibility
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts dialog"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                {s.icon}
                <span>{s.desc}</span>
              </div>
              <kbd
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-color)',
                }}
              >
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
