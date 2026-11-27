import React, { useState } from 'react';
import styles from '../CSS/Exams.module.css';

const exams = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  name: 'Unit Test Algebra',
  className: 'X-A',
  subject: 'Mathematics',
  date: 'October 20, 2025',
  time: '08:00 AM',
  duration: '1h 30m',
  students: '38',
}));

const metrics = [
  { label: 'Total Exams', value: '24', note: 'This term.' },
  { label: 'Upcoming Exams', value: '06', note: 'Next 30 days.' },
  { label: 'Completed Exams', value: '10', note: 'This term.' },
  { label: 'Students Appeared', value: '312', note: 'This term.' },
  { label: 'Average Score', value: '68%', note: 'This term.' },
];

const responsiveExamDetails = {
  name: 'Linear Equation',
  className: 'X-A',
  time: '08:00',
  duration: '1hr 30mins',
  date: '16/08/2026',
};

const editExamIcon = (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect width="44" height="44" rx="22" fill="#E5F588" />
    <path d="M13 31V26.75L26.2 13.575C26.4 13.3917 26.6208 13.25 26.8625 13.15C27.1042 13.05 27.3583 13 27.625 13C27.8917 13 28.15 13.05 28.4 13.15C28.65 13.25 28.8667 13.4 29.05 13.6L30.425 15C30.625 15.1833 30.7708 15.4 30.8625 15.65C30.9542 15.9 31 16.15 31 16.4C31 16.6667 30.9542 16.9208 30.8625 17.1625C30.7708 17.4042 30.625 17.625 30.425 17.825L17.25 31H13ZM27.6 17.8L29 16.4L27.6 15L26.2 16.4L27.6 17.8Z" fill="#1D1B20" />
  </svg>
);

const uploadExamIcon = (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect width="44" height="44" rx="22" fill="#E5F588" />
    <path d="M28 24V26.6667C28 27.0203 27.8595 27.3594 27.6095 27.6095C27.3594 27.8595 27.0203 28 26.6667 28H17.3333C16.9797 28 16.6406 27.8595 16.3905 27.6095C16.1405 27.3594 16 27.0203 16 26.6667V24M18.6667 19.3333L22 16L25.3333 19.3333M22 16V24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" stroke="#111827" />
  </svg>
);

function Exams() {
  const [showAll, setShowAll] = useState(false);
  const visibleExams = showAll ? exams : exams.slice(0, 6);

  return (
    <main className={styles.page}>
      <section className={styles.metrics} aria-label="Exam summary">
        {metrics.map((metric) => (
          <article className={styles.metricCard} key={metric.label}>
            <span className={styles.metricLabel}>{metric.label}</span>
            <strong className={styles.metricValue}>{metric.value}</strong>
            <span className={styles.metricNote}>{metric.note}</span>
          </article>
        ))}
      </section>

      <section className={styles.examPanel} aria-labelledby="exams-overview-heading">
        <header className={styles.panelHeader}>
          <h2 id="exams-overview-heading">Exams Overview</h2>
          <div className={styles.panelActions}>
            <button type="button" className={styles.actionButton}>Add</button>
            <button
              type="button"
              className={styles.actionButton}
              aria-expanded={showAll}
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? 'View Less' : 'View All'}
            </button>
          </div>
        </header>

        <div className={styles.tableWrap}>
          <table className={styles.examTable}>
            <thead>
              <tr>
                <th scope="col">Exam Name</th>
                <th scope="col">Class</th>
                <th scope="col">Subject</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Duration</th>
                <th scope="col">Students</th>
                <th scope="col">Marks Details</th>
                <th scope="col">Question Paper</th>
              </tr>
            </thead>
            <tbody>
              {visibleExams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.name}</td>
                  <td>{exam.className}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.date}</td>
                  <td>{exam.time}</td>
                  <td>{exam.duration}</td>
                  <td>{exam.students}</td>
                  <td><button type="button" className={styles.rowAction}>Enter Marks</button></td>
                  <td><button type="button" className={styles.rowAction}>Upload</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.examCards} aria-label="Exams">
          {exams.map((exam) => (
            <article className={styles.examCard} key={`card-${exam.id}`}>
              <div className={styles.examCardDetails}>
                <h3>{responsiveExamDetails.name}</h3>
                <p>
                  {responsiveExamDetails.className}
                  <span aria-hidden="true"> • </span>
                  {responsiveExamDetails.time}
                  <span aria-hidden="true"> • </span>
                  {responsiveExamDetails.duration}
                  <span aria-hidden="true"> • </span>
                  {responsiveExamDetails.date}
                </p>
              </div>
              <div className={styles.examCardActions}>
                <button type="button" className={styles.iconAction} aria-label={`Edit ${responsiveExamDetails.name}`}>
                  {editExamIcon}
                </button>
                <button type="button" className={styles.iconAction} aria-label={`Upload question paper for ${responsiveExamDetails.name}`}>
                  {uploadExamIcon}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Exams;
