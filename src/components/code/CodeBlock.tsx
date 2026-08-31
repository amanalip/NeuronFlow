import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { Copy, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language?: 'javascript' | 'json' | 'python' | 'text';
  filename?: string;
  readOnly?: boolean;
  onChange?: (val: string) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  filename,
  readOnly = true,
  onChange,
}) => {
  const theme = useStore((state) => state.theme);
  const [copied, setCopied] = useState(false);

  const extensions = [];
  if (language === 'javascript' || language === 'python') {
    extensions.push(javascript({ jsx: true, typescript: true }));
  } else if (language === 'json') {
    extensions.push(json());
  }

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.filename}>{filename || language}</span>
        <button type="button" className={styles.copyBtn} onClick={handleCopy} title="Copy code">
          {copied ? <Check size={13} color="var(--success-color)" /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className={styles.editorWrapper}>
        <CodeMirror
          value={code}
          extensions={extensions}
          theme={theme === 'dark' ? 'dark' : 'light'}
          readOnly={readOnly}
          editable={!readOnly}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: false,
            foldGutter: false,
          }}
        />
      </div>
    </div>
  );
};
