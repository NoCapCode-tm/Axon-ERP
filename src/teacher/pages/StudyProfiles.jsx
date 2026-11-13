import React, { useMemo, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Eye,
  Mail,
  Menu,
  MoreVertical,
  Plus,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../CSS/StudyProfiles.module.css';

const initialStudents = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  roll: '01',
  className: 'X-A',
  name: 'Aarav Sharma',
  parent: 'Mr. Rajesh Sharma',
  phone: '9876543210',
  status: index < 15 ? 'Active' : 'Inactive',
  studentId: '8989',
}));

const metrics = [
  { label: 'Total Students', value: '810' },
  { label: 'Male', value: '420' },
  { label: 'Female', value: '390' },
  { label: 'Active Students', value: '805' },
  { label: 'Inactive Students', value: '5' },
];

function StudyProfiles() {
  const { onOpenSidebar = () => {} } = useOutletContext() || {};
  const navigate = useNavigate();
  const students = initialStudents;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileStudent, setProfileStudent] = useState(null);

  const visibleStudents = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return students.filter((student) => (
      student.name.toLowerCase().includes(searchTerm)
      && (filter === 'All' || student.status === filter)
    ));
  }, [filter, query, students]);

  const closeProfileDialog = () => {
    setProfileStudent(null);
  };

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Open navigation menu"
            aria-controls="teacher-navigation"
            onClick={onOpenSidebar}
          >
            <Menu size={24} aria-hidden="true" />
          </button>
          <div className={styles.pageTitle}>
            <h1>Student Profiles</h1>
            <p>Mathematics · Senior Section · Academic Year 2025 - 26 · Term 1</p>
          </div>
        </div>
        <div className={styles.headerActions} role="group" aria-label="Teacher account actions">
          <button type="button" aria-label="Messages">
            <Mail size={21} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Notifications" onClick={() => navigate('/teacher/notifications')}>
            <Bell size={21} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Settings" onClick={() => navigate('/teacher/settings')}>
            <Settings size={21} aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          className={styles.mobileMore}
          aria-label="More options"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <MoreVertical size={22} aria-hidden="true" />
        </button>
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <button type="button" onClick={() => navigate('/teacher/notifications')}>
              <Bell size={17} aria-hidden="true" /> Notifications
            </button>
            <button type="button" onClick={() => navigate('/teacher/settings')}>
              <Settings size={17} aria-hidden="true" /> Settings
            </button>
          </div>
        )}
      </header>

      <div className={styles.controls}>
        <label className={styles.searchBox}>
          <input
            type="search"
            aria-label="Search students"
            placeholder="Search student by name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Search size={22} aria-hidden="true" />
        </label>
        <div className={styles.filterControl}>
          <button
            type="button"
            className={styles.filterButton}
            aria-haspopup="listbox"
            aria-expanded={filterOpen}
            aria-controls="student-filter-options"
            onClick={() => setFilterOpen((open) => !open)}
          >
            <span>Filter</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          {filterOpen && (
            <div className={styles.filterMenu} id="student-filter-options" role="listbox" aria-label="Filter students">
              {['All', 'Active', 'Inactive'].map((option) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={filter === option}
                  key={option}
                  onClick={() => {
                    setFilter(option);
                    setFilterOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" className={styles.addButton}>
          <span>Add Students</span>
          <Plus size={17} aria-hidden="true" />
        </button>
      </div>

      <section className={styles.metrics} aria-label="Student summary">
        {metrics.map((metric, index) => (
          <article className={styles.metricCard} key={metric.label}>
            {index === 0 && <span className={`${styles.metricIcon} ${styles.primaryIcon}`} aria-hidden="true"><span /></span>}
            <div className={styles.metricCopy}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.studentPanel} aria-labelledby="student-list-heading">
        <header className={styles.panelHeader}>
          <h2 id="student-list-heading">Student List</h2>
        </header>
        <div className={styles.studentTableWrap}>
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th scope="col">Roll No.</th>
                <th scope="col">Class</th>
                <th scope="col">Student Name</th>
                <th scope="col">Parent Name</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.roll}</td>
                  <td>{student.className}</td>
                  <td>{student.name}</td>
                  <td>{student.parent}</td>
                  <td>{student.phone}</td>
                  <td className={student.status === 'Active' ? styles.activeStatus : styles.inactiveStatus}>{student.status}</td>
                  <td>
                    <button type="button" className={styles.profileButton} onClick={() => setProfileStudent(student)}>
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {visibleStudents.length === 0 && (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.studentList} aria-label="Students">
          {visibleStudents.map((student, index) => (
            <article className={styles.studentCard} key={`card-${student.id}`}>
              <span className={`${styles.avatar} ${styles[`avatarTone${index % 5}`]}`} aria-hidden="true" />
              <span className={styles.studentDetails}>
                <strong>{student.name}</strong>
                <span>ID {student.studentId}</span>
              </span>
              <span className={styles.studentActions}>
                <a className={styles.iconButton} href={`tel:${student.phone}`} aria-label={`Call ${student.name}`}>
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="44" height="44" rx="22" fill="#E5F588" />
                    <path d="M31.4602 23.9548L31.8442 27.1494C31.8749 27.4305 31.8067 27.6751 31.6397 27.883C31.4727 28.0909 31.2486 28.2101 30.9675 28.2408C28.8324 28.5567 26.7699 28.423 24.7799 27.8399C22.7898 27.2567 21.0282 26.3493 19.495 25.1176C17.9617 23.886 16.6991 22.364 15.7072 20.5517C14.7152 18.7394 14.1368 16.7515 13.972 14.5882C13.9413 14.307 14.0095 14.0625 14.1765 13.8546C14.3435 13.6467 14.5676 13.5274 14.8488 13.4967L18.051 13.183C18.3087 13.1549 18.537 13.21 18.7359 13.3484C18.9347 13.4867 19.0651 13.677 19.1271 13.9192L20.0102 17.4505C20.0515 17.612 20.0564 17.7656 20.0249 17.9113C19.9933 18.057 19.9254 18.1948 19.821 18.3247L18.0361 20.5466C18.4046 21.0992 18.8122 21.6297 19.2589 22.1381C19.7056 22.6466 20.2018 23.12 20.7475 23.5584C21.2932 23.9968 21.8625 24.3793 22.4553 24.7058C23.0481 25.0324 23.654 25.316 24.273 25.5567L26.0579 23.3349C26.1622 23.2049 26.2822 23.1089 26.4176 23.0467C26.5531 22.9845 26.7041 22.9561 26.8707 22.9617L30.5094 23.0627C30.7592 23.071 30.9731 23.1574 31.1511 23.3217C31.3291 23.486 31.4321 23.6971 31.4602 23.9548ZM26.3332 26.1856C26.8666 26.2934 27.4105 26.3615 27.9648 26.39C28.5192 26.4184 29.11 26.4281 29.7373 26.4189L29.584 25.013L27.3039 24.9772L26.3332 26.1856ZM17.0092 18.6314L17.9486 17.462L17.4221 15.2433L16.0476 15.3576C16.153 15.9981 16.282 16.5828 16.4345 17.1114C16.587 17.6401 16.7786 18.1468 17.0092 18.6314Z" fill="#1D1B20" />
                  </svg>
                </a>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label={`View ${student.name} profile`}
                  onClick={() => setProfileStudent(student)}
                >
                  <Eye size={21} aria-hidden="true" />
                </button>
              </span>
            </article>
          ))}
          {visibleStudents.length === 0 && <p className={styles.emptyState}>No students found.</p>}
        </div>
      </section>

      {profileStudent && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeProfileDialog();
          }}
        >
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title">
            <header className={styles.dialogHeader}>
              <h2 id="profile-dialog-title">Student Profile</h2>
              <button type="button" className={styles.closeButton} aria-label="Close dialog" onClick={closeProfileDialog}>
                <X size={20} aria-hidden="true" />
              </button>
            </header>
            <div className={styles.profileDetails}>
              <span className={`${styles.profileAvatar} ${styles.avatarTone0}`} aria-hidden="true" />
              <strong>{profileStudent.name}</strong>
              <span>ID {profileStudent.studentId}</span>
              <span>Class {profileStudent.className}</span>
              <span>{profileStudent.parent}</span>
              <a href={`tel:${profileStudent.phone}`}>{profileStudent.phone}</a>
              <span>{profileStudent.status}</span>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default StudyProfiles;
