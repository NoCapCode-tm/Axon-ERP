import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Mail } from 'lucide-react';
import styles from '../CSS/Notifications.module.css';

const initialNotifications = Array.from({ length: 14 }, (_, index) => ({
  id: `notification-${index + 1}`,
  title: 'New message from Ananya Singh (Parent)',
  description: 'Regarding the assignment submission',
  time: '1:30 AM',
  read: index >= 3,
}));

function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filteredNotifications = useMemo(
    () => notifications.filter((item) =>
      filter === 'All' || (filter === 'Unread' ? !item.read : item.read)
    ),
    [filter, notifications]
  );

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const toggleNotification = (notification) => {
    setNotifications((current) => current.map((item) =>
      item.id === notification.id ? { ...item, read: true } : item
    ));
    setExpandedId((current) => current === notification.id ? null : notification.id);
  };

  return (
    <main className={styles.notificationPage}>
      <div className={styles.notificationToolbar}>
        <button type="button" className={styles.markAllButton} onClick={markAllRead}>
          Mark all as read
        </button>
        <label className={styles.filter}>
          <span className={styles.visuallyHidden}>Filter notifications</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="All">Filter</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
          <ChevronDown size={14} aria-hidden="true" />
        </label>
      </div>

      <section className={styles.notificationList} aria-label="Notifications">
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Mail size={25} aria-hidden="true" />
            <p>No {filter.toLowerCase()} notifications.</p>
          </div>
        ) : filteredNotifications.map((notification) => (
          <article className={styles.notificationItem} key={notification.id}>
            <button
              type="button"
              className={`${styles.notificationButton}${notification.read ? '' : ` ${styles.unread}`}`}
              aria-expanded={expandedId === notification.id}
              aria-label={`${notification.read ? 'Read' : 'Unread'} notification: ${notification.title}`}
              onClick={() => toggleNotification(notification)}
            >
              <span className={styles.notificationIcon} aria-hidden="true" />
              <span className={styles.notificationCopy}>
                <span className={styles.notificationTitle}>{notification.title}</span>
                <span className={styles.notificationDescription}>{notification.description}</span>
              </span>
              <time className={styles.notificationTime}>{notification.time}</time>
              <ChevronRight className={styles.notificationChevron} size={17} aria-hidden="true" />
            </button>
            {expandedId === notification.id && (
              <p className={styles.notificationDetail}>
                Ananya Singh sent you a message about the latest assignment submission.
              </p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default Notifications;
