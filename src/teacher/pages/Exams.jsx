import React, { useState } from 'react';
import { Pencil, Upload } from 'lucide-react';
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
                  <Pencil size={15} aria-hidden="true" />
                </button>
                <button type="button" className={styles.iconAction} aria-label={`Upload question paper for ${responsiveExamDetails.name}`}>
                  <Upload size={15} aria-hidden="true" />
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
