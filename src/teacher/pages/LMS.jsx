import React from 'react';
import styles from '../CSS/Dashboard.module.css';

function LMS() {
  return (
    <main className={styles.dashboard}>
      <section className={styles.panel}>
        <p className={styles.emptyState}>Teacher learning materials will appear here.</p>
      </section>
    </main>
  );
}

export default LMS;
