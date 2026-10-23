import React from 'react';
import { Bell, Mail, Settings } from 'lucide-react';
import styles from '../CSS/Dashboard.module.css';

function TeacherTopbar({ title = 'Welcome, Ms. Priya Kapoor' }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.welcome}>
        <h1>{title}</h1>
        <p>
          <span>Mathematics</span>
          <span>Senior Section</span>
          <span>Academic Year 2025 - 26 Term 1</span>
        </p>
      </div>
      <div className={styles.topbarActions} role="group" aria-label="Teacher account actions">
        <button type="button" aria-label="Messages" title="Messages">
          <Mail aria-hidden="true" size={20} />
        </button>
        <button type="button" aria-label="Notifications" title="Notifications">
          <Bell aria-hidden="true" size={20} />
        </button>
        <button type="button" aria-label="Settings" title="Settings">
          <Settings aria-hidden="true" size={20} />
        </button>
      </div>
    </header>
  );
}

export default TeacherTopbar;
