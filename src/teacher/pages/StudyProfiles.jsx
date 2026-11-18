import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Menu,
  MoreVertical,
  Plus,
  Search,
  Settings,
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../CSS/StudyProfiles.module.css';
import { CalendarContent } from './Calendar';

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

const attendanceRows = [
  ['January, 2026', '28', '2', '1', '95%'],
  ['February, 2026', '28', '2', '1', '95%'],
  ['March, 2026', '28', '2', '1', '95%'],
  ['April, 2026', '28', '2', '1', '95%'],
  ['May, 2026', '28', '2', '1', '95%'],
  ['June, 2026', '28', '2', '1', '95%'],
  ['July, 2026', '28', '2', '1', '95%'],
  ['August, 2026', '00', '00', '00', '00'],
  ['September, 2026', '00', '00', '00', '00'],
  ['October, 2026', '00', '00', '00', '00'],
  ['November, 2026', '00', '00', '00', '00'],
  ['December, 2026', '00', '00', '00', '00'],
];

function AttendanceReportCard({ profileStudent }) {
  const downloadAttendance = () => {
    const rows = [
      ['Month', 'Present', 'Absent', 'Late', 'Attendance'],
      ...attendanceRows,
    ].map((row) => row.join(','));
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    link.download = `${profileStudent.name.toLowerCase().replace(/\s+/g, '-')}-attendance-report.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <section className={styles.attendanceReportCard} aria-labelledby="student-attendance-report">
      <div className={styles.attendanceReportHeading}>
        <h2 id="student-attendance-report">Attendance Report</h2>
        <button type="button" className={styles.profileAction} onClick={downloadAttendance}>Download</button>
      </div>
      <div className={styles.attendanceReportTableWrap}>
        <table className={styles.attendanceReportTable}>
          <thead>
            <tr>
              {['Month', 'Present', 'Absent', 'Late', 'Attendance'].map((heading) => (
                <th scope="col" aria-label={heading} key={heading}>
                  {heading === 'Attendance'
                    ? <>
                        <span className={styles.attendanceHeadingFull}>{heading}</span>
                        <span className={styles.attendanceHeadingShort} aria-hidden="true">At.</span>
                      </>
                    : heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceRows.map((row) => (
              <tr key={row[0]}>{row.map((cell, index) => index === 0
                ? <th scope="row" key={cell}>{cell}</th>
                : <td key={`${row[0]}-${index}`}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AttendanceDesktopDetails({
  profileStudent,
  onOpenSidebar,
  onBack,
  navigate,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const [attendanceMonth, setAttendanceMonth] = useState(new Date(Date.UTC(2026, 6, 1)));
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(null);
  const monthStart = new Date(Date.UTC(attendanceMonth.getUTCFullYear(), attendanceMonth.getUTCMonth(), 1));
  const calendarStart = new Date(monthStart);
  calendarStart.setUTCDate(1 - ((monthStart.getUTCDay() + 6) % 7));
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setUTCDate(calendarStart.getUTCDate() + index);
    return date;
  });
  const calendarStartSunday = new Date(monthStart);
  calendarStartSunday.setUTCDate(1 - monthStart.getUTCDay());
  const calendarDaysSundayFirst = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStartSunday);
    date.setUTCDate(calendarStartSunday.getUTCDate() + index);
    return date;
  });
  const monthLabel = `${monthStart.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })}, ${monthStart.getUTCFullYear()}`;
  const monthAttendance = attendanceRows.find(([label]) => label === monthLabel);
  const schoolDays = calendarDays.filter((date) => (
    date.getUTCMonth() === monthStart.getUTCMonth()
    && date.getUTCFullYear() === monthStart.getUTCFullYear()
    && date.getUTCDay() > 0
    && date.getUTCDay() < 6
  ));
  const hasMonthAttendance = monthAttendance
    && Number(monthAttendance[1]) + Number(monthAttendance[2]) + Number(monthAttendance[3]) > 0;
  const absentCount = hasMonthAttendance ? Math.min(Number(monthAttendance[2]), schoolDays.length) : 0;
  const absentDayIndices = new Set(Array.from({ length: absentCount }, (_, index) => (
    Math.floor(((index + 1) * schoolDays.length) / (absentCount + 1))
  )));
  const generatedAttendanceByDay = Object.fromEntries(schoolDays.map((date, index) => [
    date.getUTCDate(),
    absentDayIndices.has(index) ? 'absent' : 'present',
  ]));
  const julyAttendanceByDay = {
    2: 'present', 3: 'present', 4: 'present', 5: 'present', 6: 'present',
    9: 'present', 10: 'present', 11: 'present', 12: 'present', 13: 'present',
    14: 'present', 15: 'present', 16: 'present', 17: 'present', 18: 'present',
    19: 'leave', 20: 'leave', 21: 'leave', 22: 'present', 23: 'leave',
    24: 'leave', 25: 'leave', 26: 'present', 27: 'present', 30: 'present',
  };
  const attendanceByDay = monthStart.getUTCMonth() === 6
    ? julyAttendanceByDay
    : hasMonthAttendance ? generatedAttendanceByDay : {};
  const renderCalendarDay = (date) => {
    const isCurrentMonth = date.getUTCMonth() === monthStart.getUTCMonth();
    const status = isCurrentMonth ? attendanceByDay[date.getUTCDate()] : undefined;
    const dateKey = date.toISOString().slice(0, 10);
    const isSelected = selectedAttendanceDate === dateKey;
    const dayClass = [
      styles.calendarDay,
      isCurrentMonth ? '' : styles.calendarDayOutside,
      status ? styles[`calendarDay${status[0].toUpperCase()}${status.slice(1)}`] : '',
      isSelected ? styles.calendarDaySelected : '',
    ].filter(Boolean).join(' ');
    return (
      <button
        type="button"
        className={dayClass}
        aria-label={date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
        aria-pressed={isSelected}
        disabled={!isCurrentMonth}
        onClick={() => setSelectedAttendanceDate(dateKey)}
        key={date.toISOString()}
      >
        {date.getUTCDate()}
      </button>
    );
  };
  const changeMonth = (amount) => {
    setAttendanceMonth((current) => new Date(Date.UTC(
      current.getUTCFullYear(),
      current.getUTCMonth() + amount,
      1,
    )));
    setSelectedAttendanceDate(null);
  };
  return (
    <main className={`${styles.page} ${styles.profilePage} ${styles.attendanceDetailsDesktop}`}>
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
            <h1>Student Profile</h1>
            <p>Mathematics · Senior Section · Academic Year 2025 - 26 · Term 1</p>
          </div>
        </div>
        <div className={styles.headerActions} role="group" aria-label="Teacher account actions">
          <button type="button" aria-label="Messages"><Mail size={21} aria-hidden="true" /></button>
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
      </header>

      <div className={styles.profileToolbar}>
        <button type="button" className={styles.profileBack} aria-label="Back to student profile" onClick={onBack}>
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.attendanceDetailGrid}>
        <section className={styles.attendanceCalendarCard} aria-labelledby="student-attendance-calendar">
          <h2 id="student-attendance-calendar">Calendar</h2>
          <div className={styles.calendarSurface}>
            <div className={styles.calendarMonthBar}>
              <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <span className={styles.calendarMonthDesktop}>
                {monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
              </span>
              <span className={styles.calendarMonthMobile}>
                {monthStart.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })}, {monthStart.getUTCFullYear()}
              </span>
              <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
            <div className={`${styles.calendarDaysGrid} ${styles.calendarDaysGridDesktop}`} role="grid" aria-label="Attendance calendar">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span className={styles.calendarWeekday} role="columnheader" key={day}>{day}</span>
              ))}
              {calendarDays.map(renderCalendarDay)}
            </div>
            <div className={`${styles.calendarDaysGrid} ${styles.calendarDaysGridMobile}`} role="grid" aria-label="Attendance calendar">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <span className={styles.calendarWeekday} role="columnheader" key={day}>{day}</span>
              ))}
              {calendarDaysSundayFirst.map(renderCalendarDay)}
            </div>
            <div className={styles.calendarLegend}>
              <span><i className={styles.calendarDayPresent} />Present</span>
              <span><i className={styles.calendarDayAbsent} />Absent</span>
              <span><i className={styles.calendarDayLeave} />Leave</span>
              <span><i className={styles.calendarDayToday} />Today</span>
            </div>
          </div>
        </section>

        <AttendanceReportCard profileStudent={profileStudent} />
      </div>
    </main>
  );
}

function StudyProfiles() {
  const { onOpenSidebar = () => {} } = useOutletContext() || {};
  const navigate = useNavigate();
  const students = initialStudents;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileStudent, setProfileStudent] = useState(null);
  const [attendanceDetailsOpen, setAttendanceDetailsOpen] = useState(false);

  const visibleStudents = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return students.filter((student) => (
      student.name.toLowerCase().includes(searchTerm)
      && (filter === 'All' || student.status === filter)
    ));
  }, [filter, query, students]);

  if (profileStudent) {
    const reportRows = [
      ['Mathematics', '88%', '92%', '90%', '95%', '91%', 'A+'],
      ['Science', '70%', '75%', '65%', '62%', '68%', 'B'],
      ['English', '85%', '80%', '78%', '82%', '81%', 'A'],
      ['Social Studies', '90%', '88%', '85%', '92%', '89%', 'A+'],
      ['Hindi', '78%', '82%', '80%', '85%', '81%', 'A'],
      ['Computer', '95%', '92%', '90%', '93%', '93%', 'A+'],
    ];

    if (attendanceDetailsOpen) {
      return (
        <>
        <main className={`${styles.page} ${styles.profilePage} ${styles.attendanceDetailsTablet}`}>
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
                <h1>Calendar</h1>
              </div>
            </div>
            <div className={styles.headerActions} role="group" aria-label="Teacher account actions">
              <button type="button" aria-label="Messages"><Mail size={21} aria-hidden="true" /></button>
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

          <div className={styles.profileToolbar}>
            <button
              type="button"
              className={styles.profileBack}
              aria-label="Back to student profile"
              onClick={() => setAttendanceDetailsOpen(false)}
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
          </div>
          <CalendarContent />
          <AttendanceReportCard profileStudent={profileStudent} />
        </main>
        <AttendanceDesktopDetails
          profileStudent={profileStudent}
          onOpenSidebar={onOpenSidebar}
          onBack={() => setAttendanceDetailsOpen(false)}
          navigate={navigate}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        </>
      );
    }

    return (
      <main className={`${styles.page} ${styles.profilePage}`}>
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
              <h1>Student Profile</h1>
              <p>Mathematics · Senior Section · Academic Year 2025 - 26 · Term 1</p>
            </div>
          </div>
          <div className={styles.headerActions} role="group" aria-label="Teacher account actions">
            <button type="button" aria-label="Messages"><Mail size={21} aria-hidden="true" /></button>
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

        <div className={styles.profileToolbar}>
          <button
            type="button"
            className={styles.profileBack}
            aria-label="Back to student list"
            onClick={() => setProfileStudent(null)}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <div className={styles.profileToolbarActions}>
            <a href={`mailto:${profileStudent.parentEmail || 'rajesh.sharma@example.com'}`} className={styles.profileAction}>
              Message Parent
            </a>
            <button type="button" className={styles.profileAction}>View Legal Documents</button>
          </div>
        </div>

        <section className={styles.profileHero} aria-label="Student summary">
          <div className={styles.profileIdentity}>
            <span className={styles.profilePhoto} aria-hidden="true" />
            <div className={styles.profileIdentityText}>
              <h2>{profileStudent.name}<span className={styles.activeDot} aria-label={profileStudent.status} /></h2>
              <div className={styles.profileIdentityFacts}>
                <span><span className={`${styles.profileFactLabel} ${styles.profileFactLabelSpaced}`}>Roll No</span><strong>{profileStudent.roll}</strong></span>
                <span><span className={`${styles.profileFactLabel} ${styles.profileFactLabelSpaced}`}>Admission No</span><strong>2025/1001</strong></span>
                <span><span className={`${styles.profileFactLabel} ${styles.profileFactLabelSpaced}`}>Class</span><strong>{profileStudent.className.split('-')[0]}</strong></span>
              </div>
            </div>
          </div>
          <div className={styles.profileMiddleFacts}>
            <span><span className={`${styles.profileFactLabel} ${styles.profileFactLabelSpaced}`}>Section</span><strong>A</strong></span>
            <span><span className={`${styles.profileFactLabel} ${styles.profileFactLabelSpaced}`}>Blood Group</span><strong>O+</strong></span>
            <span><span className={`${styles.profileFactLabel} ${styles.profileFactLabelSpaced}`}>Class Teacher</span><strong>Ms. Priya Kapoor</strong></span>
          </div>
          <address className={styles.profileContact}>
            <strong>Contact</strong>
            <a href={`tel:${profileStudent.phone}`}>{profileStudent.phone}</a>
            <a href={`mailto:${profileStudent.parentEmail || 'aarav.sharma@example.com'}`}>
              {profileStudent.parentEmail || 'aarav.sharma@example.com'}
            </a>
            <span>123 Green Avenue, Delhi, India</span>
          </address>
        </section>

        <div className={styles.profileDetailsGrid}>
          <section className={styles.profileInfoCard}>
            <h2>Parent / Guardian Details</h2>
            <dl>
              <div><dt>Father Name</dt><dd>{profileStudent.parent}</dd></div>
              <div><dt>Mother Name</dt><dd>Mrs. Neha Sharma</dd></div>
              <div><dt>Parent Phone</dt><dd>{profileStudent.phone}</dd></div>
              <div><dt>Parent Email</dt><dd>rajesh.sharma@example.com</dd></div>
              <div><dt>Relationship</dt><dd>Father</dd></div>
            </dl>
          </section>
          <section className={styles.profileInfoCard}>
            <h2>Academic Details</h2>
            <dl>
              <div><dt>Date of Birth</dt><dd>Apr 12, 2010</dd></div>
              <div><dt>Admission Date</dt><dd>Apr 5, 2025</dd></div>
              <div><dt>Previous School</dt><dd>St. John&apos;s School</dd></div>
              <div><dt>RTE</dt><dd>No</dd></div>
              <div><dt>Student Category</dt><dd>General</dd></div>
            </dl>
          </section>
          <section className={styles.profileInfoCard}>
            <div className={styles.profileCardHeading}>
              <h2>Attendance Summary</h2>
              <button type="button" className={styles.profileAction} onClick={() => setAttendanceDetailsOpen(true)}>View Details</button>
            </div>
            <div className={styles.attendanceSummary}>
              <div className={styles.attendanceDonut} role="img" aria-label="92 percent attendance">
                <span>92%</span>
              </div>
              <div className={styles.attendanceLegend}>
                <span><i className={styles.presentSwatch} />Present <strong>83 Days (92%)</strong></span>
                <span><i className={styles.absentSwatch} />Absent <strong>7 Days (8%)</strong></span>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.profileMetrics} aria-label="Academic performance summary">
          {[
            ['Overall Average', '82%', 'This term.'],
            ['Class Rank', '5/40', 'This term.'],
            ['Total Subjects', '06', 'This term.'],
            ['Highest Score', '95%', 'Mathematics'],
            ['Attendance', '92%', 'This term.'],
          ].map(([label, value, note]) => (
            <article className={styles.profileMetric} key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{note}</small>
            </article>
          ))}
        </section>

        <section className={styles.academicReport}>
          <div className={styles.profileCardHeading}>
            <h2>Academic Report</h2>
            <button type="button" className={styles.profileAction}>Export</button>
          </div>
          <div className={styles.reportTableWrap}>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  {['Subject', 'Assessment 1', 'Assessment 2', 'Mid Term', 'Final Term', 'Average', 'Grade'].map((heading) => (
                    <th scope="col" key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => index === 0
                      ? <th scope="row" key={cell}>{cell}</th>
                      : <td key={`${row[0]}-${index}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    );
  }

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

    </main>
  );
}

export default StudyProfiles;
