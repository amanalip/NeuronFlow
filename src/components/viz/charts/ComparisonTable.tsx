import React from 'react';
import styles from './ComparisonTable.module.css';

export interface ComparisonColumn {
  key: string;
  header: string;
}

interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: Record<string, React.ReactNode>[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ columns, rows }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className={styles.tr}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
