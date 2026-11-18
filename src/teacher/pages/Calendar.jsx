import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../CSS/Calendar.module.css';

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
  const days = Array.from({ length: 42 }, (_, index) => {
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
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <span>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</span>
        <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>
          <ChevronRight size={16} aria-hidden="true" />
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

function Calendar() {
  return (
    <main className={styles.calendarPage}>
      <CalendarContent />
    </main>
  );
}

export default Calendar;