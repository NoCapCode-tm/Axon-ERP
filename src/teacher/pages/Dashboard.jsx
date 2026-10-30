import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/Dashboard.module.css';

const metrics = [
  { label: 'Next: Class X-C at 10:00', value: '5', detail: 'Classes Today' },
  { label: 'Pending Attendance', value: '2', detail: 'Classes Today' },
  { label: 'Assignment to Review', value: '47', detail: 'Across 3 classes' },
  { label: 'Unread Messages', value: '2', detail: '1 from admin' },
];

const schedule = [
  { period: 'P1', subject: 'Class XI - B', time: '12:00 - 12:45' },
  { period: 'P2', subject: 'Class XI - B', time: '12:00 - 12:45' },
  { period: 'P3', subject: 'Class XI - B', time: '12:00 - 12:45' },
  { period: 'P4', subject: 'Class XI - B', time: '12:00 - 12:45' },
  { period: 'P5', subject: 'Class XI - B', time: '12:00 - 12:45' },
  { period: 'P6', subject: 'Class XI - B', time: '12:00 - 12:45' },
  { period: 'P7', subject: 'Class XI - B', time: '12:00 - 12:45' },
  { period: 'P8', subject: 'Class XI - B', time: '12:00 - 12:45' },
];

const exams = [
  { name: 'Unit Test - Calculus', className: 'Class X - A', date: 'Oct 21, 2025' },
  { name: 'Unit Test - Calculus', className: 'Class X - A', date: 'Oct 21, 2025' },
  { name: 'Unit Test - Calculus', className: 'Class X - A', date: 'Oct 21, 2025' },
  { name: 'Unit Test - Calculus', className: 'Class X - A', date: 'Oct 21, 2025' },
];

const assignments = [
  { name: 'Calculus Problem Set', className: 'Class X - A', submitted: '28/38', progress: 74 },
  { name: 'Algebra Worksheet', className: 'Class X - A', submitted: '35/42', progress: 83 },
  { name: 'Geometry Proof Task', className: 'Class X - C', submitted: '12/36', progress: 33 },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <main className={styles.dashboard}>
      <section className={styles.primaryColumn} aria-label="Teaching overview">
        <div className={styles.metricGrid}>
          {metrics.map((metric) => (
            <article className={styles.metricCard} key={metric.label}>
              <p className={styles.metricLabel}>{metric.label}</p>
              <p className={styles.metricValue}>{metric.value}</p>
              <p className={styles.metricDetail}>{metric.detail}</p>
            </article>
          ))}
        </div>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <h2>Today’s Schedule</h2>
            <span>Monday, Oct 16</span>
          </div>
          <div className={styles.scheduleList}>
            {schedule.map((item, index) => (
              <div className={styles.scheduleRow} key={`${item.period}-${index}`}>
                <span className={styles.period}>{item.period}</span>
                <div className={styles.classDetails}>
                  <span>{item.subject}</span>
                  <span>{item.time}</span>
                </div>
                <button
                  className={styles.actionButton}
                  type="button"
                  onClick={() => navigate('/teacher/attendance')}
                >
                  Mark Attendance
                </button>
              </div>
            ))}
          </div>
        </section>
      </section>

      <aside className={styles.secondaryColumn} aria-label="Upcoming work">
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <h2>Upcoming Exams</h2>
            <button
              className={styles.viewAll}
              type="button"
              onClick={() => navigate('/teacher/exams')}
            >
              View All
            </button>
          </div>
          <div className={styles.examList}>
            {exams.map((exam, index) => (
              <article className={styles.examItem} key={`${exam.name}-${index}`}>
                <h3>{exam.name}</h3>
                <div className={styles.itemMeta}>
                  <span>{exam.className}</span>
                  <time>{exam.date}</time>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.assignmentPanel}`}>
          <div className={styles.panelHeading}>
            <h2>Pending Assignments Submission</h2>
            <button
              className={styles.viewAll}
              type="button"
              onClick={() => navigate('/teacher/lms')}
            >
              View All
            </button>
          </div>
          <div className={styles.assignmentList}>
            {assignments.map((assignment) => (
              <article className={styles.assignmentItem} key={assignment.name}>
                <div className={styles.assignmentMeta}>
                  <h3>{assignment.name}</h3>
                  <span>{assignment.className}</span>
                  <span>{assignment.submitted}</span>
                </div>
                <div
                  className={styles.progressTrack}
                  role="progressbar"
                  aria-label={`${assignment.name} submissions`}
                  aria-valuenow={assignment.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <span style={{ width: `${assignment.progress}%` }} />
                </div>
              </article>
            ))}
          </div>
          <button
            className={styles.evaluateButton}
            type="button"
            onClick={() => navigate('/teacher/lms')}
          >
            Evaluate Pending Assignment
          </button>
        </section>
      </aside>
    </main>
  );
}

export default Dashboard;