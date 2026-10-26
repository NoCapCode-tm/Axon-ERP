import React from 'react';
import { Bell, Mail, Menu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/Dashboard.module.css';

const noop = () => {};

function TeacherTopbar({
  title = 'Welcome, Ms. Priya Kapoor',
  onMenuClick = noop,
  onMessagesClick = noop,
  onRouteAction = noop,
  menuOpen = false,
  messagesActive = false,
  notificationsActive = false,
}) {
  const navigate = useNavigate();

  return (
    <header className={styles.topbar}>
      <button
        className={styles.topbarMenu}
        type="button"
        aria-label="Open navigation menu"
        aria-controls="teacher-navigation"
        aria-expanded={menuOpen}
        onClick={onMenuClick}
      >
        <Menu aria-hidden="true" size={22} />
      </button>
      <div className={styles.welcome}>
        <h1>{title}</h1>
        <p>
          <span>Mathematics</span>
          <span>Senior Section</span>
          <span>Academic Year 2025 - 26 Term 1</span>
        </p>
      </div>
      <div className={styles.topbarActions} role="group" aria-label="Teacher account actions">
        <button
          className={messagesActive ? styles.topbarActionActive : ''}
          type="button"
          aria-label="Messages"
          title="Messages"
          aria-pressed={messagesActive}
          onClick={onMessagesClick}
        >
          <Mail aria-hidden="true" size={20} />
        </button>
        <button
          className={notificationsActive ? styles.topbarActionActive : ''}
          type="button"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => {
            onRouteAction();
            navigate('/teacher/notifications');
          }}
        >
          <Bell aria-hidden="true" size={20} />
        </button>
        <button
          type="button"
          aria-label="Settings"
          title="Settings"
          onClick={() => {
            onRouteAction();
            navigate('/teacher/settings');
          }}
        >
          <Settings aria-hidden="true" size={20} />
        </button>
      </div>
    </header>
  );
}

export default TeacherTopbar;
