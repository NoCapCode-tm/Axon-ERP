import React, { useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import styles from '../CSS/MarksEntry.module.css';

const students = Array.from({ length: 40 }, (_, index) => ({
  roll: String(index + 1).padStart(2, '0'),
  name: 'Aarav Sharma',
  studentId: '8989',
  status: 'Active',
}));

function getGrade(mark) {
  if (mark === '' || mark == null) return '-';
  const score = Number(mark);
  if (!Number.isFinite(score)) return '-';
  if (score >= 90) return 'A+';
  if (score >= 74) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function MarksEntry({ onBack }) {
  const [marks, setMarks] = useState(() => Object.fromEntries(
    students.map(({ roll }) => [roll, '74']),
  ));
  const [statusFilter, setStatusFilter] = useState('All');
  const [message, setMessage] = useState('');
  const [profileStudent, setProfileStudent] = useState(null);
  const importInput = useRef(null);

  const enteredMarks = useMemo(
    () => Object.values(marks)
      .filter((mark) => mark !== '')
      .map(Number)
      .filter(Number.isFinite),
    [marks],
  );
  const average = enteredMarks.length
    ? (enteredMarks.reduce((total, mark) => total + mark, 0) / enteredMarks.length).toFixed(1)
    : '-';
  const highest = enteredMarks.length ? Math.max(...enteredMarks) : '-';
  const lowest = enteredMarks.length ? Math.min(...enteredMarks) : '-';
  const visibleStudents = students.filter((student) => (
    statusFilter === 'All' || student.status === statusFilter
  ));

  const updateMark = (roll, value) => {
    if (value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 100)) {
      return;
    }
    setMarks((current) => ({ ...current, [roll]: value }));
    setMessage('');
  };

  const exportMarks = () => {
    const rows = [
      'Roll No.,Student Name,Status,Marks Obtained,Grade',
      ...students.map((student) => (
        `${student.roll},${student.name},${student.status},${marks[student.roll] ?? ''},${getGrade(marks[student.roll])}`
      )),
    ];
    const file = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'marks-entry.csv';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Marks exported.');
  };

  const importMarks = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const [headerLine, ...lines] = (await file.text()).trim().split(/\r?\n/);
      const headers = headerLine.split(',').map((header) => header.trim().toLowerCase());
      const rollIndex = headers.indexOf('roll no.');
      const marksIndex = headers.indexOf('marks obtained');
      if (rollIndex < 0 || marksIndex < 0) {
        setMessage('CSV must include Roll No. and Marks Obtained columns.');
        return;
      }

      const imported = {};
      lines.forEach((line) => {
        const cells = line.split(',').map((cell) => cell.trim());
        const roll = cells[rollIndex];
        const mark = cells[marksIndex];
        if (students.some((student) => student.roll === roll)
          && mark !== ''
          && Number.isFinite(Number(mark))
          && Number(mark) >= 0
          && Number(mark) <= 100) {
          imported[roll] = mark;
        }
      });
      setMarks((current) => ({ ...current, ...imported }));
      setMessage(`${Object.keys(imported).length} marks imported.`);
    } catch (error) {
      setMessage(`Unable to import marks: ${error.message}`);
    }
  };

  return (
    <main className={styles.marksPage}>
      <button className={styles.backButton} type="button" onClick={onBack} aria-label="Back to schedule">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <section className={styles.summaryCards} aria-label="Marks summary">
        <article className={styles.summaryCard}>
          <span>Total Students</span>
          <strong>40</strong>
        </article>
        <article className={styles.summaryCard}>
          <span>Class Average</span>
          <strong>{average}</strong>
        </article>
        <article className={styles.summaryCard}>
          <span>Highest Marks</span>
          <strong>{highest}</strong>
        </article>
        <article className={styles.summaryCard}>
          <span>Lowest Marks</span>
          <strong>{lowest}</strong>
        </article>
      </section>

      <section className={styles.studentPanel} aria-labelledby="student-list-title">
        <div className={styles.panelToolbar}>
          <h2 id="student-list-title">Student List</h2>
          <div className={styles.actions}>
            <button type="button" onClick={() => setMessage('Marks published successfully.')}>Publish</button>
            <button
              type="button"
              onClick={() => {
                setMarks({});
                setMessage('Marks reset.');
              }}
            >
              Reset
            </button>
            <button type="button" onClick={exportMarks}>Export</button>
            <button type="button" onClick={() => importInput.current?.click()}>Import</button>
            <label className={styles.filterControl}>
              <span className={styles.visuallyHidden}>Filter students</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="All">Filter</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={13} aria-hidden="true" />
            </label>
            <input
              ref={importInput}
              className={styles.fileInput}
              type="file"
              accept=".csv,text/csv"
              aria-label="Import marks CSV"
              onChange={importMarks}
            />
          </div>
        </div>

        {message && <p className={styles.statusMessage} role="status">{message}</p>}

        <div className={styles.tableScroller}>
          <table className={styles.marksTable}>
            <thead>
              <tr>
                <th scope="col">Roll No.</th>
                <th scope="col">Student Name</th>
                <th scope="col">Status</th>
                <th scope="col">Marks Obtained</th>
                <th scope="col">Grade</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student) => (
                <tr key={student.roll}>
                  <td className={styles.rollCell} data-label="Roll No.">{student.roll}</td>
                  <td className={styles.studentCell} data-label="Student Name">
                    <button
                      className={styles.studentIdentity}
                      type="button"
                      aria-label={`View profile for ${student.name}, ID ${student.studentId}`}
                      onClick={() => setProfileStudent(student)}
                    >
                      <span className={styles.studentDetails}>
                        <strong>{student.name}</strong>
                        <small>ID {student.studentId}</small>
                      </span>
                    </button>
                  </td>
                  <td className={`${styles.activeStatus} ${styles.statusCell}`} data-label="Status">{student.status}</td>
                  <td className={styles.marksCell} data-label="Marks">
                    <input
                      className={styles.markInput}
                      type="number"
                      min="0"
                      max="100"
                      aria-label={`Marks for ${student.name}, roll ${student.roll}`}
                      value={marks[student.roll] ?? ''}
                      onChange={(event) => updateMark(student.roll, event.target.value)}
                    />
                  </td>
                  <td className={styles.gradeCell} data-label="Grade">
                    <span className={styles.gradeValue}>{getGrade(marks[student.roll])}</span>
                  </td>
                  <td className={styles.actionsCell} data-label="Actions">
                    <button
                      className={styles.profileButton}
                      type="button"
                      onClick={() => setProfileStudent(student)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {profileStudent && (
        <div className={styles.dialogBackdrop} onClick={() => setProfileStudent(null)}>
          <section
            className={styles.profileDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-profile-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="student-profile-title">Student Profile</h2>
            <p>{profileStudent.name}</p>
            <p>Roll No. {profileStudent.roll} · Class X-A</p>
            <button type="button" onClick={() => setProfileStudent(null)}>Close</button>
          </section>
        </div>
      )}
    </main>
  );
}

export default MarksEntry;
