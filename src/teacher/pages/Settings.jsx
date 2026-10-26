import React from 'react';
import styles from '../CSS/Dashboard.module.css';

function Settings() {
  return (
    <main className={styles.dashboard}>
      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>Settings</h2>
        </div>
        <p className={styles.emptyState}>Teacher settings will appear here.</p>
      </section>
    </main>
  );
}

export default Settings;
