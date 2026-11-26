import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/Calendar.module.css';

const previousArrow = (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M2.79844 6L7.39844 10.6L5.99844 12L-0.00156312 6L5.99844 1.22392e-07L7.39844 1.4L2.79844 6Z" fill="#4B5563" />
  </svg>
);

const nextArrow = (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="#4B5563" />
  </svg>
);

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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

const calendarEvents = {
  '2026-06-29': { title: 'Assignment due', detail: 'Worksheet 3' },
  '2026-06-30': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-03': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-06': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-08': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-14': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-15': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-17': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-21': { title: 'Assignment due', detail: 'Worksheet 3' },
  '2026-07-22': { title: 'Assignment due', detail: 'Worksheet 3' },
  '2026-07-23': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-24': { title: 'Assignment due', detail: 'Worksheet 3' },
  '2026-07-25': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-27': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-07-29': { title: 'Assignment due', detail: 'Worksheet 3' },
  '2026-07-30': { title: 'Exam', detail: 'Worksheet 3' },
  '2026-08-01': { title: 'Exam', detail: 'Worksheet 3' },
};

function getDateKey(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function CalendarContent() {
  const [selectedDate, setSelectedDate] = useState(new Date(Date.UTC(2026, 5, 19)));
  const visibleMonth = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth() + 1, 1));
  const monthStart = new Date(Date.UTC(visibleMonth.getUTCFullYear(), visibleMonth.getUTCMonth(), 1));
  const calendarStart = new Date(monthStart);
  calendarStart.setUTCDate(1 - monthStart.getUTCDay());
  const daysInMonth = new Date(Date.UTC(visibleMonth.getUTCFullYear(), visibleMonth.getUTCMonth() + 1, 0)).getUTCDate();
  const weekCount = Math.ceil((monthStart.getUTCDay() + daysInMonth) / 7);
  const days = Array.from({ length: weekCount * 7 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setUTCDate(calendarStart.getUTCDate() + index);
    return date;
  });

  const moveMonth = (amount) => {
    setSelectedDate((current) => new Date(Date.UTC(
      current.getUTCFullYear(),
      current.getUTCMonth() + amount,
      current.getUTCDate(),
    )));
  };

  return (
    <div className={styles.calendarContent}>
      <div className={styles.calendarDatePicker} aria-label="Calendar date">
        <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>
          {previousArrow}
        </button>
        <span>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span>
        <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>
          {nextArrow}
        </button>
      </div>

      <section className={styles.calendarPanel} aria-label="Teacher calendar">
        <div className={styles.calendarGrid} style={{ '--calendar-week-count': weekCount }}>
          {weekDays.map((day) => (
            <div className={styles.calendarWeekday} key={day}>{day}</div>
          ))}
          {days.map((date, index) => {
            const event = calendarEvents[getDateKey(date)];
            const isVisibleMonth = date.getUTCMonth() === visibleMonth.getUTCMonth();
            return (
              <div
                className={`${styles.calendarDay} ${index >= weekCount * 7 ? styles.calendarDayOverflow : ''}`}
                key={getDateKey(date)}
              >
                <span className={`${styles.calendarDayNumber} ${isVisibleMonth ? '' : styles.calendarDayOutside}`}>
                  {date.getUTCDate()}
                </span>
                {event && (
                  <article className={styles.calendarEvent}>
                    <span className={styles.calendarEventDot} aria-hidden="true" />
                    <strong>{event.title}</strong>
                    <span>{event.detail}</span>
                    <time>11.59AM</time>
                  </article>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TabletAttendanceCalendar() {
  const navigate = useNavigate();
  const [attendanceMonth, setAttendanceMonth] = useState(new Date(Date.UTC(2026, 6, 1)));
  const [selectedDate, setSelectedDate] = useState(null);
  const monthStart = new Date(Date.UTC(
    attendanceMonth.getUTCFullYear(),
    attendanceMonth.getUTCMonth(),
    1,
  ));
  const daysInMonth = new Date(Date.UTC(
    monthStart.getUTCFullYear(),
    monthStart.getUTCMonth() + 1,
    0,
  )).getUTCDate();
  const weekCount = Math.ceil((daysInMonth + 1) / 7);
  const days = Array.from({ length: weekCount * 7 }, (_, index) => {
    if (index === 0) return null;
    return new Date(Date.UTC(
      monthStart.getUTCFullYear(),
      monthStart.getUTCMonth(),
      index,
    ));
  });
  const monthLabel = `${monthStart.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })}, ${monthStart.getUTCFullYear()}`;
  const monthAttendance = attendanceRows.find(([label]) => label === monthLabel);
  const schoolDays = Array.from({ length: daysInMonth }, (_, index) => (
    new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth(), index + 1))
  )).filter((date) => date.getUTCDay() > 0 && date.getUTCDay() < 6);
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
    1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'present',
    8: 'present', 9: 'present', 10: 'present', 11: 'present', 12: 'present',
    15: 'present', 16: 'present', 17: 'present', 18: 'present', 19: 'present',
    22: 'absent', 23: 'leave', 24: 'leave', 25: 'leave', 26: 'present',
    29: 'present', 30: 'present', 31: 'present',
  };
  const attendanceByDay = monthStart.getUTCMonth() === 6
    ? julyAttendanceByDay
    : hasMonthAttendance ? generatedAttendanceByDay : {};
  const changeMonth = (amount) => {
    setAttendanceMonth((current) => new Date(Date.UTC(
      current.getUTCFullYear(),
      current.getUTCMonth() + amount,
      1,
    )));
    setSelectedDate(null);
  };
  const downloadAttendance = () => {
    const rows = [
      ['Month', 'Present', 'Absent', 'Late', 'Attendance'],
      ...attendanceRows,
    ].map((row) => row.join(','));
    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'teacher-attendance-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.calendarTabletView}>
      <div className={styles.calendarTabletToolbar}>
        <button
          type="button"
          className={styles.calendarTabletBackButton}
          aria-label="Back to dashboard"
          onClick={() => navigate('/teacher/dashboard')}
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.calendarTabletDetailGrid}>
        <section className={styles.calendarTabletCard} aria-labelledby="teacher-attendance-calendar">
          <h2 id="teacher-attendance-calendar">Calendar</h2>
          <div className={styles.calendarTabletSurface}>
            <div className={styles.calendarTabletMonthBar}>
              <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>
                {previousArrow}
              </button>
              <span className={styles.calendarTabletMonthLabel}>
                {monthStart.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })}, {monthStart.getUTCFullYear()}
              </span>
              <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>
                {nextArrow}
              </button>
            </div>
            <div
              className={styles.calendarTabletDaysGrid}
              role="grid"
              aria-label="Attendance calendar"
              style={{ '--calendar-tablet-week-count': weekCount }}
            >
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <span className={styles.calendarTabletWeekday} role="columnheader" key={day}>{day}</span>
              ))}
              {days.map((date, index) => {
                if (!date) {
                  return <span className={styles.calendarTabletEmptyDay} aria-hidden="true" key={`empty-${index}`} />;
                }
                const isCurrentMonth = date.getUTCMonth() === monthStart.getUTCMonth();
                const status = isCurrentMonth ? attendanceByDay[date.getUTCDate()] : undefined;
                const dateKey = getDateKey(date);
                const isSelected = selectedDate === dateKey;
                const dayClass = [
                  styles.calendarTabletDay,
                  isCurrentMonth ? '' : styles.calendarTabletDayOutside,
                  status ? styles[`calendarTabletDay${status[0].toUpperCase()}${status.slice(1)}`] : '',
                  isSelected ? styles.calendarTabletDaySelected : '',
                ].filter(Boolean).join(' ');
                return (
                  <button
                    type="button"
                    className={dayClass}
                    aria-label={date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                    aria-pressed={isSelected}
                    disabled={!isCurrentMonth}
                    onClick={() => setSelectedDate(dateKey)}
                    key={dateKey}
                  >
                    {date.getUTCDate()}
                  </button>
                );
              })}
            </div>
            <div className={styles.calendarTabletLegend}>
              <span><i className={styles.calendarTabletDayPresent} />Present</span>
              <span><i className={styles.calendarTabletDayAbsent} />Absent</span>
              <span><i className={styles.calendarTabletDayLeave} />Leave</span>
              <span><i className={styles.calendarTabletDayToday} />Today</span>
            </div>
          </div>
        </section>

        <section className={styles.calendarTabletReportCard} aria-labelledby="teacher-attendance-report">
          <div className={styles.calendarTabletReportHeading}>
            <h2 id="teacher-attendance-report">Attendance Report</h2>
            <button type="button" className={styles.calendarTabletDownload} onClick={downloadAttendance}>Download</button>
          </div>
          <div className={styles.calendarTabletReportTableWrap}>
            <table className={styles.calendarTabletReportTable}>
              <thead>
                <tr>
                  {['Month', 'Present', 'Absent', 'Late', 'Attendance'].map((heading) => (
                    <th scope="col" key={heading}>
                      {heading === 'Attendance' ? (
                        <>
                          <span className={styles.calendarTabletHeaderFull}>{heading}</span>
                          <span className={styles.calendarTabletHeaderShort}>At.</span>
                        </>
                      ) : heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendanceRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => index === 0
                      ? (
                        <th scope="row" key={cell}>
                          <span className={styles.calendarTabletMonthFull}>{cell}</span>
                          <span className={styles.calendarTabletMonthShort}>
                            {`${cell.slice(0, 3)}${cell.slice(cell.indexOf(','))}`}
                          </span>
                        </th>
                      )
                      : <td key={`${row[0]}-${index}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <main className={styles.calendarPage}>
      <div className={styles.calendarDesktopView}>
        <CalendarContent />
      </div>
      <TabletAttendanceCalendar />
    </main>
  );
}

export default Calendar;