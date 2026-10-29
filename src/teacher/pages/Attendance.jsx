import React from 'react';
import styles from '../CSS/Dashboard.module.css';

function Attendance() {
  return (
    <main className={styles.dashboard}>
      <section className={styles.panel}>
        <p className={styles.emptyState}>Teacher attendance will appear here.</p>
      </section>
    </main>
  );
}

export default Attendance;
