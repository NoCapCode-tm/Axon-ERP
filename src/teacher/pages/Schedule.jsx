import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../CSS/Schedule.module.css';

const days = [
  { label: 'Mon', offset: 0 },
  { label: 'Tue', offset: 1 },
  { label: 'Wed', offset: 2 },
  { label: 'Thurs', offset: 3 },
  { label: 'Fri', offset: 4 },
  { label: 'Sat', offset: 5 },
];

const periods = [
  { id: 1, time: '08:00 - 08:45' },
  { id: 2, time: '09:00 - 09:45' },
  { id: 3, time: '10:00 - 10:45' },
  { id: 4, time: '11:00 - 11:45' },
  { id: 5, time: '12:00 - 12:45' },
  { id: 6, time: '01:00 - 01:45' },
  { id: 7, time: '02:00 - 02:45' },
];

const timetable = [
  ['Class X - A', 'Class IX - B', 'Class X - A', 'Class IX - B', 'Class X - A', null],
  ['Class X - A', 'Class IX - B', 'Class X - A', 'Class IX - B', 'Class X - A', null],
  ['Class X - A', 'Class X - A', 'Class IX - B', 'Class X - A', 'Class IX - B', null],
  ['Class X - A', 'Class IX - B', 'Class X - A', 'Class IX - B', 'Class X - A', null],
  ['Class X - A', 'Class IX - B', 'Class X - A', 'Class IX - B', 'Class X - A', null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
];

const rooms = {
  'Class X - A': '201',
  'Class IX - B': '203',
};

const upcomingEvents = [
  { name: 'Unit Test - Calculus', className: 'Class X - A', date: 'Oct 21, 2025' },
  { name: 'Unit Test - Calculus', className: 'Class X - A', date: 'Oct 21, 2025' },
  { name: 'Unit Test - Calculus', className: 'Class X - A', date: 'Oct 21, 2025' },
];

const initialWeek = new Date(2026, 5, 15);

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function Schedule() {
  const [weekStart, setWeekStart] = useState(initialWeek);
  const [selectedClass, setSelectedClass] = useState({ dayIndex: 0, periodIndex: 0 });
  const [actionMessage, setActionMessage] = useState('');

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 5);

  const selectedDay = days[selectedClass.dayIndex];
  const selectedPeriod = periods[selectedClass.periodIndex];
  const selectedClassName = timetable[selectedClass.periodIndex][selectedClass.dayIndex];

  const moveWeek = (offset) => {
    setWeekStart((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + offset * 7);
      return next;
    });
  };

  const runAction = (action) => {
    setActionMessage(`${action} selected.`);
  };

  return (
    <main className={styles.schedulePage}>
      <div className={styles.scheduleToolbar}>
        <div className={styles.weekPicker} aria-label="Schedule week">
          <button type="button" aria-label="Previous week" onClick={() => moveWeek(-1)}>
            <ChevronLeft size={17} aria-hidden="true" />
          </button>
          <span>{formatDate(weekStart)} - {formatDate(weekEnd)}, {weekEnd.getFullYear()}</span>
          <button type="button" aria-label="Next week" onClick={() => moveWeek(1)}>
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        </div>
        <div className={styles.scheduleActions}>
          {['Upload Marks', 'Mark Attendance', 'Upload Study Material', 'Create Assignment'].map((action) => (
            <button className={styles.actionButton} type="button" key={action} onClick={() => runAction(action)}>
              {action}
            </button>
          ))}
        </div>
      </div>
      {actionMessage && <p className={styles.actionMessage} role="status">{actionMessage}</p>}

      <div className={styles.scheduleContent}>
        <section className={styles.timetablePanel} aria-labelledby="timetable-title">
          <h2 id="timetable-title">Timetable</h2>
          <div className={styles.tableScroll}>
            <table className={styles.timetable}>
              <thead>
                <tr>
                  <th scope="col">Time / Day</th>
                  {days.map((day) => {
                    const date = new Date(weekStart);
                    date.setDate(date.getDate() + day.offset);
                    return (
                      <th scope="col" key={day.label}>
                        <span>{formatDate(date)}</span>
                        <span>{day.label}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {periods.map((period, periodIndex) => (
                  <tr key={period.id}>
                    <th className={styles.periodHeading} scope="row">
                      <strong>P{period.id}</strong>
                      <span>{period.time}</span>
                    </th>
                    {days.map((day, dayIndex) => {
                      const className = timetable[periodIndex][dayIndex];
                      const isSelected = selectedClass.periodIndex === periodIndex
                        && selectedClass.dayIndex === dayIndex;
                      return (
                        <td
                          className={className ? styles.classCell : styles.emptyCell}
                          key={day.label}
                        >
                          {className ? (
                            <button
                              className={`${styles.classButton}${isSelected ? ` ${styles.selectedClass}` : ''}`}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => setSelectedClass({ dayIndex, periodIndex })}
                            >
                              <strong>{className}</strong>
                              <span>Room {rooms[className]}</span>
                            </button>
                          ) : <span aria-label="No class">-</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className={styles.scheduleAside}>
          <section className={styles.detailsPanel} aria-labelledby="class-details-title">
            <h2 id="class-details-title">Class Details</h2>
            {selectedClassName ? (
              <dl className={styles.classDetails}>
                <div><dt>Class :</dt><dd>{selectedClassName}</dd></div>
                <div><dt>Subject :</dt><dd>Mathematics</dd></div>
                <div><dt>Time :</dt><dd>{selectedDay.label}, P{selectedPeriod.id}</dd></div>
                <div><dt>Room :</dt><dd>{rooms[selectedClassName]}</dd></div>
                <div><dt>Students :</dt><dd>{selectedClassName === 'Class X - A' ? '38' : '32'}</dd></div>
              </dl>
            ) : (
              <p className={styles.noClass}>Select a class in the timetable to see its details.</p>
            )}
          </section>

          <section className={styles.eventsPanel} aria-labelledby="upcoming-events-title">
            <div className={styles.eventsHeading}>
              <h2 id="upcoming-events-title">Upcoming Events</h2>
              <button type="button" onClick={() => runAction('View all events')}>View All</button>
            </div>
            <div className={styles.eventList}>
              {upcomingEvents.map((event, index) => (
                <article className={styles.eventItem} key={`${event.name}-${index}`}>
                  <h3>{event.name}</h3>
                  <div><span>{event.className}</span><time>{event.date}</time></div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default Schedule;
