import React from 'react';
import { Bell, CircleUserRound, MessageCircle } from 'lucide-react';
import styles from '../CSS/Dashboard.module.css';

function TeacherTopbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.welcome}>
        <h1>Welcome, Ms. Priya Kapoor</h1>
        <p>
          <span>Mathematics</span>
          <span>Senior Section</span>
          <span>Academic Year 2025 - 26 Term 1</span>
        </p>
      </div>
      <div className={styles.topbarActions} role="group" aria-label="Teacher account actions">
        <button type="button" aria-label="Messages" title="Messages">
          <MessageCircle aria-hidden="true" size={23} />
        </button>
        <button type="button" aria-label="Notifications" title="Notifications">
          <Bell aria-hidden="true" size={23} fill="currentColor" />
        </button>
        <button type="button" aria-label="Profile" title="Profile">
          <CircleUserRound aria-hidden="true" size={23} />
        </button>
      </div>
    </header>
  );
}

export default TeacherTopbar;
