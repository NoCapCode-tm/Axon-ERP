import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import styles from '../CSS/Attendance.module.css';
import TeacherTopbar from '../components/TeacherTopbar';

const classes = {
  school: { label: 'Overall', students: 80, present: 72 },
  xA: { label: 'Class X', students: 40, present: 37 },
  ixB: { label: 'Class IX', students: 40, present: 35 },
};

const periodData = {
  Today: { xA: 37, ixB: 35 },
  'This Week': { xA: 37, ixB: 35 },
  'This Month': { xA: 30, ixB: 32 },
  'This Year': { xA: 20, ixB: 24 },
};

const initialPending = [
  { classKey: 'xA', className: 'Class X-A', subject: 'Mathematics', time: '08:00 - 08:45', date: 'Jun 19, 2026' },
  { classKey: 'ixB', className: 'Class IX-B', subject: 'Mathematics', time: '09:00 - 09:45', date: 'Jun 19, 2026' },
  { classKey: 'xA', className: 'Class X-A', subject: 'Mathematics', time: '10:00 - 10:45', date: 'Jun 19, 2026' },
  { classKey: 'ixB', className: 'Class IX-B', subject: 'Mathematics', time: '11:00 - 11:45', date: 'Jun 19, 2026' },
  { classKey: 'xA', className: 'Class X-A', subject: 'Mathematics', time: '12:00 - 12:45', date: 'Jun 19, 2026' },
];

const students = Array.from({ length: 20 }, (_, index) => ({
  roll: String(index + 1).padStart(2, '0'),
  className: 'X-A',
  studentName: 'Aarav Sharma',
  parentName: index % 2 ? 'Mr. Rajesh Sharma' : 'Mrs. Neha Sharma',
  phone: '9876543210',
}));

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function AttendanceEntry({ date, onBack, onSave }) {
  const [query, setQuery] = useState('');
  const [statuses, setStatuses] = useState(() => {
    const stored = readStorage('teacher-attendance-entry', {});
    return Object.fromEntries(students.map((student) => [student.roll, stored[student.roll] || 'Present']));
  });
  const [openStatusRoll, setOpenStatusRoll] = useState(null);
  const [entryDate, setEntryDate] = useState(() => new Date(date));
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [profileStudent, setProfileStudent] = useState(null);
  const filteredStudents = students.filter((student) => (
    student.studentName.toLowerCase().includes(query.toLowerCase())
    && (statusFilter === 'All' || statuses[student.roll] === statusFilter)
  ));

  const setStatus = (roll, status) => setStatuses((current) => ({ ...current, [roll]: status }));
  const setAll = (status) => setStatuses(Object.fromEntries(students.map((student) => [student.roll, status])));
  const save = () => {
    window.localStorage.setItem('teacher-attendance-entry', JSON.stringify(statuses));
    onSave(statuses);
  };
  const moveDate = (amount) => setEntryDate((current) => {
    const next = new Date(current);
    next.setDate(next.getDate() + amount);
    return next;
  });
  const exportAttendance = () => {
    const rows = ['Roll No.,Student Name,Status', ...students.map((student) => `${student.roll},${student.studentName},${statuses[student.roll] || 'Unmarked'}`)];
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    link.download = 'attendance.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const openMessages = () => {
    const messagesButton = Array.from(document.querySelectorAll('button[aria-label="Messages"]'))
      .find((button) => !button.closest('[class*="entryPage"]'));
    messagesButton?.click();
    onBack();
  };

  return (
    <main className={styles.entryPage}>
      <div className={styles.entryHeader}>
        <TeacherTopbar
          title="Attendance Entry"
          subtitle="Mathematics • Senior Section • Academic Year 2025 - 26 • Term 1"
          onMessagesClick={openMessages}
          onRouteAction={onBack}
        />
      </div>
      <div className={styles.mobileEntryHeading}>
        <h1>Attendance Entry</h1>
        <p>Mathematics - Senior Section - Academic Year 2025 - 26 - Term 1</p>
      </div>
      <button type="button" className={styles.entryBackButton} onClick={onBack} aria-label="Back">
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M13 5.00079H3L6.29 1.71079C6.38373 1.61783 6.45812 1.50723 6.50889 1.38537C6.55966 1.26351 6.5858 1.1328 6.5858 1.00079C6.5858 0.86878 6.55966 0.738074 6.50889 0.616215C6.45812 0.494356 6.38373 0.383755 6.29 0.290792C6.10264 0.104541 5.84919 0 5.585 0C5.32081 0 5.06736 0.104541 4.88 0.290792L0.59 4.59079C0.214412 4.96414 0.00223279 5.47121 0 6.00079V6.00079C0.00486659 6.52689 0.216844 7.02989 0.59 7.40078L4.88 11.7008C4.97324 11.7934 5.0838 11.8667 5.20537 11.9165C5.32694 11.9664 5.45714 11.9918 5.58854 11.9913C5.71993 11.9909 5.84995 11.9645 5.97116 11.9138C6.09238 11.8631 6.20242 11.789 6.295 11.6958C6.38758 11.6025 6.46089 11.492 6.51075 11.3704C6.5606 11.2488 6.58602 11.1186 6.58556 10.9872C6.58509 10.8558 6.55875 10.7258 6.50804 10.6046C6.45733 10.4834 6.38324 10.3734 6.29 10.2808L3 7.00078H13C13.2652 7.00078 13.5196 6.89543 13.7071 6.70789C13.8946 6.52035 14 6.266 14 6.00079C14 5.73557 13.8946 5.48122 13.7071 5.29368C13.5196 5.10614 13.2652 5.00079 13 5.00079Z" fill="#4B5563"/>
        </svg>
      </button>
      <div className={styles.entryDateBar}>
        <div className={styles.entryDateNavigation}>
          <button type="button" onClick={() => moveDate(-1)} aria-label="Previous date"><ChevronLeft size={18} /></button>
          <span>{entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <button type="button" onClick={() => moveDate(1)} aria-label="Next date"><ChevronRight size={18} /></button>
        </div>
        <div className={styles.entryDateActions}>
          <span className={styles.filterControl}>
            <button type="button" className={styles.filterButton} onClick={() => setFilterOpen((current) => !current)} aria-expanded={filterOpen} aria-haspopup="listbox" aria-label="Filter">
              <svg width="75" height="36" viewBox="0 0 75 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="75" height="36" rx="4" fill="#E5F588"/>
                <path d="M11.0568 22.5V13.7727H16.2898V14.7102H12.1136V17.6591H15.8977V18.5966H12.1136V22.5H11.0568ZM17.9634 22.5V15.9545H18.9691V22.5H17.9634ZM18.4748 14.8636C18.2788 14.8636 18.1097 14.7969 17.9677 14.6634C17.8285 14.5298 17.7589 14.3693 17.7589 14.1818C17.7589 13.9943 17.8285 13.8338 17.9677 13.7003C18.1097 13.5668 18.2788 13.5 18.4748 13.5C18.6708 13.5 18.8384 13.5668 18.9776 13.7003C19.1197 13.8338 19.1907 13.9943 19.1907 14.1818C19.1907 14.3693 19.1197 14.5298 18.9776 14.6634C18.8384 14.7969 18.6708 14.8636 18.4748 14.8636ZM21.8168 13.7727V22.5H20.8111V13.7727H21.8168ZM26.5053 15.9545V16.8068H23.1133V15.9545H26.5053ZM24.1019 14.3864H25.1076V20.625C25.1076 20.9091 25.1488 21.1222 25.2312 21.2642C25.3164 21.4034 25.4244 21.4972 25.555 21.5455C25.6886 21.5909 25.8292 21.6136 25.9769 21.6136C26.0877 21.6136 26.1786 21.608 26.2496 21.5966C26.3207 21.5824 26.3775 21.571 26.4201 21.5625L26.6246 22.4659C26.5565 22.4915 26.4613 22.517 26.3391 22.5426C26.217 22.571 26.0621 22.5852 25.8746 22.5852C25.5906 22.5852 25.3121 22.5241 25.0394 22.402C24.7695 22.2798 24.5451 22.0938 24.3661 21.8438C24.19 21.5938 24.1019 21.2784 24.1019 20.8977V14.3864ZM30.6921 22.6364C30.0614 22.6364 29.5174 22.4972 29.06 22.2188C28.6055 21.9375 28.2546 21.5455 28.0075 21.0426C27.7631 20.5369 27.641 19.9489 27.641 19.2784C27.641 18.608 27.7631 18.017 28.0075 17.5057C28.2546 16.9915 28.5984 16.5909 29.0387 16.304C29.4819 16.0142 29.9989 15.8693 30.5898 15.8693C30.9308 15.8693 31.2674 15.9261 31.5998 16.0398C31.9322 16.1534 32.2347 16.3381 32.5075 16.5938C32.7802 16.8466 32.9975 17.1818 33.1594 17.5994C33.3214 18.017 33.4023 18.5312 33.4023 19.142V19.5682H28.3569V18.6989H32.3796C32.3796 18.3295 32.3058 18 32.158 17.7102C32.0131 17.4205 31.8058 17.1918 31.5359 17.0241C31.2688 16.8565 30.9535 16.7727 30.5898 16.7727C30.1893 16.7727 29.8427 16.8722 29.5501 17.071C29.2603 17.267 29.0373 17.5227 28.881 17.8381C28.7248 18.1534 28.6467 18.4915 28.6467 18.8523V19.4318C28.6467 19.9261 28.7319 20.3452 28.9023 20.6889C29.0756 21.0298 29.3157 21.2898 29.6225 21.4688C29.9293 21.6449 30.2859 21.733 30.6921 21.733C30.9563 21.733 31.195 21.696 31.408 21.6222C31.6239 21.5455 31.81 21.4318 31.9663 21.2812C32.1225 21.1278 32.2433 20.9375 32.3285 20.7102L33.3001 20.983C33.1978 21.3125 33.0259 21.6023 32.7844 21.8523C32.543 22.0994 32.2447 22.2926 31.8896 22.4318C31.5344 22.5682 31.1353 22.6364 30.6921 22.6364ZM34.9322 22.5V15.9545H35.9038V16.9432H35.9719C36.0913 16.6193 36.3072 16.3565 36.6197 16.1548C36.9322 15.9531 37.2844 15.8523 37.6765 15.8523C37.7504 15.8523 37.8427 15.8537 37.9535 15.8565C38.0643 15.8594 38.1481 15.8636 38.2049 15.8693V16.892C38.1708 16.8835 38.0927 16.8707 37.9705 16.8537C37.8512 16.8338 37.7248 16.8239 37.5913 16.8239C37.2731 16.8239 36.989 16.8906 36.739 17.0241C36.4918 17.1548 36.2958 17.3366 36.1509 17.5696C36.0089 17.7997 35.9379 18.0625 35.9379 18.358V22.5H34.9322Z" fill="#111827"/>
                <path d="M61.4726 15.4736C61.4106 15.4111 61.3369 15.3615 61.2556 15.3276C61.1744 15.2938 61.0872 15.2764 60.9992 15.2764C60.9112 15.2764 60.8241 15.2938 60.7428 15.3276C60.6616 15.3615 60.5879 15.4111 60.5259 15.4736L57.4726 18.5269C57.4106 18.5894 57.3369 18.639 57.2556 18.6728C57.1744 18.7067 57.0872 18.7241 56.9992 18.7241C56.9112 18.7241 56.8241 18.7067 56.7428 18.6728C56.6616 18.639 56.5879 18.589 56.5259 18.5269L53.4726 15.4736C53.4106 15.4111 53.3369 15.3615 53.2556 15.3276C53.1744 15.2938 53.0872 15.2764 52.9992 15.2764C52.9112 15.2764 52.8241 15.2938 52.7428 15.3276C52.6616 15.3615 52.5879 15.4111 52.5259 15.4736C52.4017 15.5985 52.332 15.7674 52.332 15.9436C52.332 16.1197 52.4017 16.2887 52.5259 16.4136L55.5859 19.4736C55.9609 19.8481 56.4692 20.0585 56.9992 20.0585C57.5292 20.0585 58.0376 19.8481 58.4126 19.4736L61.4726 16.4136C61.5967 16.2887 61.6664 16.1197 61.6664 15.9436C61.6664 15.7674 61.5967 15.5985 61.4726 15.4736V15.4736Z" fill="#171717"/>
              </svg>
            </button>
            {filterOpen && <span className={styles.filterMenu} role="listbox">{['All', 'Present', 'Absent', 'Late'].map((option) => <button key={option} type="button" className={styles.filterOption} onClick={() => { setStatusFilter(option); setFilterOpen(false); }} role="option" aria-selected={statusFilter === option}>{option}</button>)}</span>}
          </span>
          <button type="button" className={styles.secondaryButton} onClick={exportAttendance}>Export</button>
        </div>
      </div>
      <section className={styles.entrySection}>
        <div className={styles.entryTitleRow}>
          <h2>Student List</h2>
          <label className={styles.searchBox}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student by name" /></label>
          <button type="button" className={styles.secondaryButton} onClick={() => setAll('Present')}>Mark All Present</button>
          <button type="button" className={styles.secondaryButton} onClick={() => setAll('Absent')}>Mark All Absent</button>
          <button type="button" className={styles.secondaryButton} onClick={save}>Save</button>
        </div>
        <div className={styles.entryTable}>
          <div className={styles.entryTableHeader}><span>Roll No.</span><span>Class</span><span>Student Name</span><span>Parent Name</span><span>Phone Number</span><span>Status</span><span>Mark Activity</span><span>Actions</span></div>
          {filteredStudents.map((student) => (
            <div className={styles.entryRow} key={student.roll}>
              <span>{student.roll}</span><span>{student.className}</span><span className={styles.studentIdentity}>
                <span className={styles.initialsAvatar} aria-hidden="true">AS</span>
                <span className={styles.studentDetails}><strong>{student.studentName}</strong><small>ID 8989</small></span>
              </span><span>{student.parentName}</span><span>{student.phone}</span><span className={styles.activeStatus}>Active</span>
              <span className={styles.statusButtons}>
                <button
                  className={`${styles.statusTrigger} ${styles[(statuses[student.roll] || 'Present').toLowerCase()] || styles.present}`}
                  type="button"
                  onClick={() => setOpenStatusRoll((current) => current === student.roll ? null : student.roll)}
                  aria-expanded={openStatusRoll === student.roll}
                >
                  {statuses[student.roll] || 'Present'}
                </button>
                {openStatusRoll === student.roll && (
                  <span className={styles.statusMenu}>
                    {['Present', 'Absent', 'Late'].map((status) => (
                      <button
                        key={status}
                        className={styles[status.toLowerCase()]}
                        type="button"
                        onClick={() => { setStatus(student.roll, status); setOpenStatusRoll(null); }}
                      >
                        {status}
                      </button>
                    ))}
                  </span>
                )}
              </span>
              <button type="button" className={styles.profileButton} onClick={() => setProfileStudent(student)}>View Profile</button>
            </div>
          ))}
        </div>
        {profileStudent && <p className={styles.profileSummary}>Viewing {profileStudent.studentName} • {profileStudent.parentName} • {profileStudent.phone}</p>}
      </section>
    </main>
  );
}

function Attendance() {
  const [dateOffset, setDateOffset] = useState(0);
  const [filter] = useState('school');
  const [period, setPeriod] = useState('This Week');
  const [markedRows, setMarkedRows] = useState({});
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryStatuses, setEntryStatuses] = useState(() => readStorage('teacher-attendance-entry', {}));

  useEffect(() => {
    if (!entryOpen) return undefined;
    const entryPage = document.querySelector('[class*="entryPage"]');
    const workspace = entryPage && entryPage.parentElement;
    const sharedHeader = workspace && Array.from(workspace.children).find((child) => child.tagName === 'HEADER');
    if (!sharedHeader) return undefined;
    const previousDisplay = sharedHeader.style.display;
    sharedHeader.style.display = 'none';
    return () => {
      sharedHeader.style.display = previousDisplay;
    };
  }, [entryOpen]);

  const date = useMemo(() => {
    const start = new Date(Date.UTC(2026, 5, 13 + dateOffset * 7));
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6);
    const format = (value) => value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    return `${format(start)} - ${format(end)}`;
  }, [dateOffset]);

  const selectedData = useMemo(() => {
    const values = periodData[period];
    const savedPresent = Object.values(entryStatuses).filter((status) => status === 'Present').length;
    const entryPresent = savedPresent ? Math.round((savedPresent / students.length) * 40) : values.xA;
    if (filter === 'xA') return { ...classes.xA, present: entryPresent };
    if (filter === 'ixB') return { ...classes.ixB, present: values.ixB };
    return { ...classes.school, present: values.xA + values.ixB };
  }, [entryStatuses, filter, period]);
  const percentage = Math.min(100, Math.round((selectedData.present / selectedData.students) * 100));
  const classRows = filter === 'school'
    ? [['Class x', 40, 37], ['Class x', 40, 37], ['Class x', 40, 37], ['Class x', 40, 37]]
    : [['Class x', classes[filter].students, 37]];
  const visiblePending = initialPending.filter((row) => filter === 'school' || row.classKey === filter);

  if (entryOpen) {
    return <AttendanceEntry date={date.split(' - ')[1]} onBack={() => setEntryOpen(false)} onSave={(statuses) => { setEntryStatuses(statuses); setEntryOpen(false); }} />;
  }

  const markAttendance = (index) => {
    const key = `${date}-${visiblePending[index].classKey}-${index}`;
    const next = { ...markedRows, [key]: true };
    setMarkedRows(next);
  };

  return (
    <main className={styles.page}>
      <div className={styles.dateToolbar}><button type="button" aria-label="Previous week" onClick={() => setDateOffset((value) => value - 1)}><ChevronLeft size={18} /></button><span>{date}</span><button type="button" aria-label="Next week" onClick={() => setDateOffset((value) => value + 1)}><ChevronRight size={18} /></button></div>
      <button type="button" className={styles.filterButton} aria-label="Attendance filter"><span>Filter</span><ChevronDown size={16} /></button>
      <section className={styles.summaryGrid} aria-label="Attendance summary">
        {[['Average Attendance', `${percentage}%`, 'Calculated attendance'], ['Total Classes', filter === 'school' ? '25' : '12', period], ['Class Completed', filter === 'school' ? '20' : '10', '80 percent'], ['Classes Pending', '05', '20 percent'], ["Today's Attendance", String(selectedData.present), `Out of ${selectedData.students}`], ['Students Absent Today', String(selectedData.students - selectedData.present), `Out of ${selectedData.students}`]].map(([label, value, note]) => <article className={styles.summaryCard} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}
      </section>
      <section className={`${styles.section} ${styles.pendingSection}`}><header className={styles.sectionHeader}><h2>Pending Attendance</h2><button type="button" className={styles.secondaryButton} onClick={() => { setEntryOpen(true); }}>View All</button></header><div className={styles.pendingTable} role="table"><div className={styles.tableHeader}><span>Class</span><span>Section</span><span>Subject</span><span>Time</span><span>Date</span><span>Attendance Status</span></div>{visiblePending.map((row, index) => { const key = `${date}-${row.classKey}-${index}`; const marked = Boolean(markedRows[key]); return <div className={styles.pendingRow} role="row" key={key}><div><span>Class x</span><span className={styles.pendingClassMobile}>{row.className}</span><small>{row.time}</small></div><span>A</span><span>{row.subject}</span><span>{row.time}</span><span>{row.date}</span><button type="button" className={marked ? styles.markedButton : styles.markButton} onClick={() => markAttendance(index)}>{marked ? 'Marked' : 'Mark Now'}</button></div>; })}</div></section>
      <section className={`${styles.section} ${styles.classSection}`}><header className={styles.sectionHeader}><h2>Class-wise Attendance</h2><label className={styles.periodButton}><span>{period}</span><ChevronDown size={14} /><select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Attendance period"><option>Today</option><option>This Week</option><option>This Month</option><option>This Year</option></select></label></header><div className={styles.classTable} role="table"><div className={styles.tableHeader}><span>Class</span><span>Students</span><span>Present</span><span>Absent</span><span>Attendance</span></div>{classRows.map(([name, total, present], index) => { const rowPercentage = Math.min(100, Math.round((present / total) * 100)); return <div className={styles.classRow} role="row" key={`${name}-${index}`}><span>{name}</span><span>{total}</span><span>{present}</span><span>{total - present}</span><span className={styles.progress}><i style={{ width: `${rowPercentage}%` }} /></span></div>; })}</div></section>
    </main>
  );
}

export default Attendance;
