import React, { useMemo, useState } from 'react';
import { ChevronDown, Eye, Phone, Plus, Search, UserRound, X } from 'lucide-react';
import styles from '../CSS/StudyProfiles.module.css';

const initialStudents = [
  { id: '8989', name: 'Aarav Sharma', grade: 'Class 10 - A', phone: '+91 98765 43210', status: 'Active' },
  { id: '8990', name: 'Ananya Patel', grade: 'Class 10 - A', phone: '+91 98765 43211', status: 'Active' },
  { id: '8991', name: 'Vihaan Kumar', grade: 'Class 10 - A', phone: '+91 98765 43212', status: 'Active' },
  { id: '8992', name: 'Diya Singh', grade: 'Class 10 - A', phone: '+91 98765 43213', status: 'Active' },
  { id: '8993', name: 'Aditya Verma', grade: 'Class 10 - A', phone: '+91 98765 43214', status: 'Active' },
  { id: '8994', name: 'Isha Gupta', grade: 'Class 10 - A', phone: '+91 98765 43215', status: 'Active' },
  { id: '8995', name: 'Kabir Mehta', grade: 'Class 10 - A', phone: '+91 98765 43216', status: 'Active' },
  { id: '8996', name: 'Meera Nair', grade: 'Class 10 - A', phone: '+91 98765 43217', status: 'Inactive' },
  { id: '8997', name: 'Arjun Reddy', grade: 'Class 10 - A', phone: '+91 98765 43218', status: 'Active' },
  { id: '8998', name: 'Sara Khan', grade: 'Class 10 - A', phone: '+91 98765 43219', status: 'Active' },
];

const metrics = [
  { label: 'Total Students', value: '810' },
  { label: 'Male', value: '420' },
  { label: 'Female', value: '390' },
  { label: 'Active Students', value: '805' },
  { label: 'Inactive Students', value: '5' },
];

function StudyProfiles() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Students');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', id: '', phone: '' });
  const [statusMessage, setStatusMessage] = useState('');

  const visibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch = `${student.name} ${student.id}`.toLowerCase().includes(query);
      const matchesFilter = filter === 'All Students' || student.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, students]);

  const addStudent = (event) => {
    event.preventDefault();
    setStudents((current) => [
      { ...newStudent, grade: 'Class 10 - A', status: 'Active' },
      ...current,
    ]);
    setNewStudent({ name: '', id: '', phone: '' });
    setAddOpen(false);
    setStatusMessage('Student added successfully.');
  };

  return (
    <main className={styles.page}>
      <section className={styles.metrics} aria-label="Student summary">
        {metrics.map((metric, index) => (
          <article className={styles.metricCard} key={metric.label}>
            <span className={`${styles.metricIcon} ${index === 0 ? styles.primaryIcon : ''}`} aria-hidden="true">
              <span />
            </span>
            <div className={styles.metricCopy}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.studentPanel} aria-labelledby="student-list-heading">
        <header className={styles.panelHeader}>
          <h1 id="student-list-heading">Student List</h1>
          <div className={styles.controls}>
            <label className={styles.searchBox}>
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                aria-label="Search students"
                placeholder="Search student by name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <div className={styles.filterControl}>
              <button
                type="button"
                className={styles.filterButton}
                aria-expanded={filterOpen}
                aria-haspopup="listbox"
                onClick={() => setFilterOpen((current) => !current)}
              >
                <span>Filter</span>
                <ChevronDown size={16} aria-hidden="true" />
              </button>
              {filterOpen && (
                <div className={styles.filterMenu} role="listbox" aria-label="Filter students">
                  {['All Students', 'Active', 'Inactive'].map((option) => (
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
            <button type="button" className={styles.addButton} onClick={() => setAddOpen(true)}>
              <Plus size={18} aria-hidden="true" />
              <span>Add Students</span>
            </button>
          </div>
        </header>

        <div className={styles.studentList}>
          {visibleStudents.map((student, index) => (
            <article className={styles.studentCard} key={student.id}>
              <div className={`${styles.avatar} ${styles[`avatarTone${index % 5}`]}`} aria-hidden="true">
                <UserRound size={25} strokeWidth={1.8} />
              </div>
              <div className={styles.studentDetails}>
                <strong>{student.name}</strong>
                <span>ID {student.id}</span>
              </div>
              <div className={styles.studentActions}>
                <a className={styles.iconButton} href={`tel:${student.phone.replace(/[^\d+]/g, '')}`} aria-label={`Call ${student.name}`}>
                  <Phone size={20} strokeWidth={2} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label={`View ${student.name}`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <Eye size={20} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
          {visibleStudents.length === 0 && (
            <p className={styles.emptyState}>No students match your search.</p>
          )}
        </div>
      </section>

      {statusMessage && <p className={styles.status} role="status">{statusMessage}</p>}

      {selectedStudent && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedStudent(null);
        }}>
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title">
            <header className={styles.dialogHeader}>
              <h2 id="profile-dialog-title">Student Profile</h2>
              <button type="button" className={styles.closeButton} aria-label="Close profile" onClick={() => setSelectedStudent(null)}>
                <X size={20} />
              </button>
            </header>
            <div className={styles.profileDetails}>
              <div className={styles.profileAvatar}>{selectedStudent.name.split(' ').map((part) => part[0]).join('')}</div>
              <strong>{selectedStudent.name}</strong>
              <span>Student ID - {selectedStudent.id}</span>
              <span>{selectedStudent.grade}</span>
              <a href={`tel:${selectedStudent.phone.replace(/[^\d+]/g, '')}`}>{selectedStudent.phone}</a>
            </div>
          </section>
        </div>
      )}

      {addOpen && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAddOpen(false);
        }}>
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="add-student-title">
            <header className={styles.dialogHeader}>
              <h2 id="add-student-title">Add Student</h2>
              <button type="button" className={styles.closeButton} aria-label="Close dialog" onClick={() => setAddOpen(false)}>
                <X size={20} />
              </button>
            </header>
            <form className={styles.studentForm} onSubmit={addStudent}>
              <label>
                Student Name
                <input required value={newStudent.name} onChange={(event) => setNewStudent({ ...newStudent, name: event.target.value })} />
              </label>
              <label>
                Student ID
                <input required value={newStudent.id} onChange={(event) => setNewStudent({ ...newStudent, id: event.target.value })} />
              </label>
              <label>
                Phone Number
                <input type="tel" required value={newStudent.phone} onChange={(event) => setNewStudent({ ...newStudent, phone: event.target.value })} />
              </label>
              <div className={styles.dialogActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setAddOpen(false)}>Cancel</button>
                <button type="submit" className={styles.addButton}>Add Student</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default StudyProfiles;