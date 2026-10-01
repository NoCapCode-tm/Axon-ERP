import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Bell, Settings, Menu, MoreVertical } from 'lucide-react';
import styles from '../CSS/Topbar.module.css';

// Laptop: title + mail + bell + settings. Mobile: hamburger + title + three-dot menu.
export default function Topbar({ title, subtitle, onMenuClick }) {
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const go = (path) => { setMoreOpen(false); navigate(path); };

  return (
    <header className={styles.topbar}>
      <button className={styles.menu} onClick={onMenuClick} aria-label="Open menu"><Menu size={26} /></button>

      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      <div className={styles.icons}>
        {/* No messages page yet: connect it when you build one */}
        <button className={styles.iconBtn} aria-label="Messages"><Mail size={26} /></button>
        <button className={styles.iconBtn} aria-label="Notifications" onClick={() => go('/superadmin/notifications')}><Bell size={26} /></button>
        <button className={styles.iconBtn} aria-label="Settings" onClick={() => go('/superadmin/settings')}><Settings size={26} /></button>
      </div>

      <div className={styles.more}>
        <button className={styles.iconBtn} aria-label="More options" aria-expanded={moreOpen} onClick={() => setMoreOpen((o) => !o)}>
          <MoreVertical size={22} />
        </button>
        {moreOpen && (
          <div className={styles.dropdown} role="menu">
            <button role="menuitem" onClick={() => go('/superadmin/notifications')}>Notifications</button>
            <button role="menuitem" onClick={() => go('/superadmin/settings')}>Settings</button>
          </div>
        )}
      </div>
    </header>
  );
}