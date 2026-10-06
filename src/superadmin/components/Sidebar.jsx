import { useEffect } from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, Landmark, CheckSquare, Banknote, Ticket, SlidersHorizontal, User } from 'lucide-react';
import styles from '../CSS/Sidebar.module.css';
import logo from "../../asset/axon-og.png"

const navItems = [
  { label: 'Dashboard', to: '/superadmin/dashboard', icon: LayoutDashboard },
  { label: 'School', to: '/superadmin/schools', icon: Landmark },
  { label: 'Subscription', to: '/superadmin/subscriptions', icon: CheckSquare },
  { label: 'Revenue & Analysis', to: '/superadmin/analytics', icon: Banknote },
  { label: 'Support & Tickets', to: '/superadmin/tickets', icon: Ticket },
  { label: 'Feature Control', to: '/superadmin/feature-control', icon: SlidersHorizontal },
  { label: 'All Users', to: '/superadmin/users', icon: User },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`${styles.backdrop} ${open ? styles.show : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`} aria-label="Main navigation">
        <div className={styles.brand}>
          <img src={logo} alt='Axon' className={styles.logo} />
          <span className={`${styles.brandName} ${styles.hideOnTablet}`}>Axon</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose} title={label}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <Icon size={22} aria-hidden="true" />
              <span className={styles.hideOnTablet}>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}