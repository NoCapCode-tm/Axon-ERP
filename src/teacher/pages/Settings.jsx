import React from 'react';
import styles from '../CSS/Dashboard.module.css';

function Settings() {
  return (
    <main className={styles.dashboard}>
      <section className={styles.panel}>
        <p className={styles.emptyState}>Teacher settings will appear here.</p>
      </section>
    </main>
  );
}

export default Settings;
