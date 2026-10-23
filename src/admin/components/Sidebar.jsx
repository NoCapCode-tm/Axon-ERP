import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, User, UserCog, FileText, Clock, CheckSquare, BookOpen,
  Banknote, ClipboardList, BarChart3, CalendarDays, GraduationCap, PlusCircle,
} from 'lucide-react';
import styles from '../CSS/Sidebar.module.css';
import logo from '../../asset/axon-og.png';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Student', to: '/admin/students', icon: User },
  { label: 'Teachers & Staff', to: '/admin/staff', icon: UserCog },
  { label: 'Academic structure', to: '/admin/academic-structure', icon: FileText },
  { label: 'Timetable', to: '/admin/timetable', icon: Clock },
  { label: 'Attendance', to: '/admin/attendance', icon: CheckSquare },
  { label: 'Exam & results', to: '/admin/exams', icon: BookOpen },
  { label: 'Fees & finance', to: '/admin/finance', icon: Banknote },
  { label: 'Assignment & LMS', to: '/admin/lms', icon: ClipboardList },
  { label: 'Reports & Analysis', to: '/admin/reports', icon: BarChart3 },
  { label: 'Calendar', to: '/admin/calendar', icon: CalendarDays },
];

// Mobile bottom tabs (only visible <= 640px)
const bottomTabs = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Student', to: '/admin/students', icon: GraduationCap },
  { label: 'Actions', to: '/admin/actions', icon: PlusCircle },
  { label: 'Academics', to: '/admin/academic-structure', icon: BookOpen },
  { label: 'Teacher', to: '/admin/staff', icon: User },
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
          <img src={logo} alt="" className={styles.logo} />
          <span className={styles.brandName}>Axon</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              <Icon size={22} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <nav className={styles.bottomNav} aria-label="Quick navigation">
        {bottomTabs.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
          >
            <Icon size={24} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}