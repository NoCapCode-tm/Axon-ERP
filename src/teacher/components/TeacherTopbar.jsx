import React, { useState } from 'react';
import { Bell, Mail, Menu, MoreVertical, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/Dashboard.module.css';

const noop = () => {};

function TeacherTopbar({
  title = 'Dashboard',
  subtitle = '',
  onMenuClick = noop,
  onMessagesClick = noop,
  onRouteAction = noop,
  menuOpen = false,
}) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const selectAction = (action) => {
    setSelectedAction(action);
    closeMobileMenu();
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarTitleGroup}>
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
          <h1>{title || 'Dashboard'}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className={styles.topbarActions} role="group" aria-label="Teacher account actions">
        <button
          className={`${styles.topbarIconButton}${selectedAction === 'messages' ? ` ${styles.topbarIconButtonActive}` : ''}`}
          type="button"
          aria-label="Messages"
          onClick={() => {
            selectAction('messages');
            onMessagesClick();
          }}
        >
          <Mail size={20} aria-hidden="true" />
        </button>
        <button
          className={`${styles.topbarIconButton}${selectedAction === 'notifications' ? ` ${styles.topbarIconButtonActive}` : ''}`}
          type="button"
          aria-label="Notifications"
          onClick={() => {
            selectAction('notifications');
            onRouteAction();
            navigate('/teacher/notifications');
          }}
        >
          <Bell size={20} aria-hidden="true" />
        </button>
        <button
          className={`${styles.topbarIconButton}${selectedAction === 'settings' ? ` ${styles.topbarIconButtonActive}` : ''}`}
          type="button"
          aria-label="Settings"
          onClick={() => {
            selectAction('settings');
            onRouteAction();
            navigate('/teacher/settings');
          }}
        >
          <Settings size={20} aria-hidden="true" />
        </button>
      </div>
      <button
        className={styles.mobileTopbarMore}
        type="button"
        aria-label="More options"
        aria-expanded={mobileMenuOpen}
        aria-controls="teacher-mobile-actions"
        onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
      >
        <MoreVertical size={22} aria-hidden="true" />
      </button>
      {mobileMenuOpen && (
        <div className={styles.mobileTopbarMenu} id="teacher-mobile-actions">
          <button
            type="button"
            className={selectedAction === 'notifications' ? styles.mobileTopbarMenuActive : ''}
            onClick={() => {
              selectAction('notifications');
              navigate('/teacher/notifications');
            }}
          >
            <Bell size={18} aria-hidden="true" />
            <span>Notifications</span>
          </button>
          <button
            type="button"
            className={selectedAction === 'messages' ? styles.mobileTopbarMenuActive : ''}
            onClick={() => {
              selectAction('messages');
              onMessagesClick();
            }}
          >
            <Mail size={18} aria-hidden="true" />
            <span>Messages</span>
          </button>
          <button
            type="button"
            className={selectedAction === 'settings' ? styles.mobileTopbarMenuActive : ''}
            onClick={() => {
              selectAction('settings');
              navigate('/teacher/settings');
            }}
          >
            <Settings size={18} aria-hidden="true" />
            <span>Settings</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default TeacherTopbar;
