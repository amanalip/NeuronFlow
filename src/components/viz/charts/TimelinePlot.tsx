import React from 'react';
import styles from './TimelinePlot.module.css';

export interface TimelineEvent {
  year: number | string;
  title: string;
  description: string;
  category?: string;
}

interface TimelinePlotProps {
  events: TimelineEvent[];
  title?: string;
}

export const TimelinePlot: React.FC<TimelinePlotProps> = ({
  events,
  title = 'Chronological Progression',
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.timelineTrack}>
        {events.map((ev, index) => (
          <div key={index} className={styles.eventCard}>
            <div className={styles.eventNode} />
            <div className={styles.eventHeader}>
              <span className={styles.eventTitle}>{ev.title}</span>
              <span className={styles.eventYear}>{ev.year}</span>
            </div>
            <p className={styles.eventDesc}>{ev.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
