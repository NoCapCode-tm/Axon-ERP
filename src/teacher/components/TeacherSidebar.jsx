import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../CSS/Dashboard.module.css';
import axonMark from '../assets/axon-mark.jpeg';
import dashboardIcon from '../assets/dashboard.png';
import attendanceIcon from '../assets/attendance.png';
import lmsIcon from '../assets/lms.png';
import studyMaterialIcon from '../assets/study-material.png';
import examsIcon from '../assets/exams.png';
import studentProfilesIcon from '../assets/student-profiles.png';
import reportsIcon from '../assets/reports.png';
import calendarIcon from '../assets/calendar.png';

const navigation = [
  { label: 'Dashboard', path: '/teacher/dashboard', icon: dashboardIcon },
  { label: 'Attendance', path: '/teacher/attendance', icon: attendanceIcon },
  { label: 'LMS', path: '/teacher/lms', icon: lmsIcon },
  { label: 'Study Material', path: '/teacher/student-material', icon: studyMaterialIcon },
  { label: 'Exams', path: '/teacher/exams', icon: examsIcon },
  { label: 'Student Profiles', path: '/teacher/study-profiles', icon: studentProfilesIcon },
  { label: 'Reports', path: '/teacher/reports', icon: reportsIcon },
  { label: 'Calendar', path: '/teacher/calendar', icon: calendarIcon },
];

function TeacherSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img className={styles.brandMark} src={axonMark} alt="" />
        <span className={styles.brandName}>Axon</span>
      </div>
      <nav className={styles.navigation} aria-label="Teacher navigation">
        {navigation.map(({ label, path, icon }) => (
          <NavLink
            className={({ isActive }) =>
              `${styles.navigationLink}${isActive ? ` ${styles.activeLink}` : ''}`
            }
            key={path}
            to={path}
          >
            <img className={styles.navigationIcon} src={icon} alt="" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default TeacherSidebar;
