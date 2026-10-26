import React, { useEffect } from 'react';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  CalendarRange,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styles from '../CSS/Dashboard.module.css';
import axonMark from '../assets/axon-mark.jpeg';

const navigation = [
  { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Schedule', icon: CalendarRange, local: true },
  { label: 'Attendance', path: '/teacher/attendance', icon: ClipboardCheck },
  { label: 'LMS', path: '/teacher/lms', icon: BookOpen },
  { label: 'Study Material', path: '/teacher/student-material', icon: FileText },
  { label: 'Exams', path: '/teacher/exams', icon: GraduationCap },
  { label: 'Student Profiles', path: '/teacher/study-profiles', icon: Users },
  { label: 'Reports', path: '/teacher/reports', icon: BarChart3 },
  { label: 'Calendar', path: '/teacher/calendar', icon: CalendarDays },
];

const noop = () => {};

function TeacherSidebar({
  open = false,
  onClose = noop,
  onScheduleClick = noop,
  scheduleActive = false,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <button
        className={`${styles.backdrop}${open ? ` ${styles.backdropVisible}` : ''}`}
        type="button"
        aria-label="Close navigation menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        className={`${styles.sidebar}${open ? ` ${styles.sidebarOpen}` : ''}`}
        aria-label="Teacher navigation"
      >
        <div className={styles.brand}>
          <img className={styles.brandMark} src={axonMark} alt="" />
          <span className={styles.brandName}>Axon</span>
        </div>
        <nav className={styles.navigation} id="teacher-navigation" aria-label="Teacher navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            path ? (
              <NavLink
                className={({ isActive }) =>
                  `${styles.navigationLink}${isActive && !scheduleActive ? ` ${styles.activeLink}` : ''}`
                }
                aria-current={scheduleActive ? 'false' : 'page'}
                key={path}
                to={path}
                onClick={onClose}
              >
                <Icon size={22} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ) : (
              <button
                className={`${styles.navigationLink}${scheduleActive ? ` ${styles.activeLink}` : ''}`}
                key={label}
                type="button"
                aria-current={scheduleActive ? 'page' : undefined}
                onClick={() => {
                  onClose();
                  onScheduleClick();
                }}
              >
                <Icon size={22} aria-hidden="true" />
                <span>{label}</span>
              </button>
            )
          ))}
        </nav>
      </aside>
    </>
  );
}

export default TeacherSidebar;
