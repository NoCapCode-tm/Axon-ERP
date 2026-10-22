import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BookMarked,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  UsersRound,
} from 'lucide-react';
import styles from '../CSS/Dashboard.module.css';

const navigation = [
  { label: 'Dashboard', path: '/teacher/dashboard', Icon: LayoutDashboard },
  { label: 'Schedule', path: '/teacher/schedule', Icon: CalendarDays },
  { label: 'Attendance', path: '/teacher/attendance', Icon: ClipboardCheck },
  { label: 'LMS', path: '/teacher/lms', Icon: BookOpen },
  { label: 'Study Material', path: '/teacher/student-material', Icon: BookMarked },
  { label: 'Exams', path: '/teacher/exams', Icon: GraduationCap },
  { label: 'Student Profiles', path: '/teacher/study-profiles', Icon: UsersRound },
  { label: 'Reports', path: '/teacher/reports', Icon: BarChart3 },
  { label: 'Calendar', path: '/teacher/calendar', Icon: CalendarDays },
];

function TeacherSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Logo</div>
      <nav className={styles.navigation} aria-label="Teacher navigation">
        {navigation.map(({ label, path, Icon }) => (
          <NavLink
            className={({ isActive }) =>
              `${styles.navigationLink}${isActive ? ` ${styles.activeLink}` : ''}`
            }
            key={path}
            to={path}
          >
            <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default TeacherSidebar;
