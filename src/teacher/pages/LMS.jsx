import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from '../CSS/LMS.module.css';

const metrics = [
  { label: 'Average Attendance', value: '00', note: '5% less from last week' },
  { label: 'Total Classes', value: '00', note: 'This week' },
  { label: 'Class Completed', value: '00', note: '80 percent' },
  { label: 'Classes Pending', value: '00', note: '20 percent' },
];

const assignments = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: 'Linear Equation Notes',
  subject: 'Mathematics',
  className: 'X-A',
  dueDate: 'Oct 16, 2025',
  submissionCount: 37,
  status: 'Open',
}));

function LMS() {
  const outletContext = useOutletContext() || {};
  const { onCreateAssignment, onUploadStudyMaterial } = outletContext;
  const [showAll, setShowAll] = useState(false);
  const evaluatedAssignmentIds = outletContext.evaluatedAssignmentIds || [];
  const assignmentRows = assignments.map((assignment) => ({
    ...assignment,
    status: evaluatedAssignmentIds.includes(assignment.id) ? 'Evaluated' : assignment.status,
  }));
  const visibleAssignments = showAll ? assignmentRows : assignmentRows.slice(0, 6);

  const createAssignment = () => {
    if (onCreateAssignment) onCreateAssignment();
  };

  const openEvaluation = (assignmentId) => {
    if (onUploadStudyMaterial) onUploadStudyMaterial(assignmentId);
  };

  const viewAllButton = (
    <button
      type="button"
      className={styles.secondaryButton}
      aria-expanded={showAll}
      onClick={() => setShowAll((current) => !current)}
    >
      {showAll ? 'Show Less' : 'View All'}
    </button>
  );

  return (
    <main className={styles.page}>
      <div className={styles.createBar}>
        <button type="button" className={styles.primaryButton} onClick={createAssignment}>
          Create Assignment
        </button>
      </div>

      <section className={styles.metricGrid} aria-label="LMS overview">
        {metrics.map((metric) => (
          <article className={styles.metricCard} key={metric.label}>
            <span className={styles.metricIcon} aria-hidden="true" />
            <div className={styles.metricContent}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.note}</small>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.pendingPanel} aria-label="LMS assignments">
        <header className={styles.sectionHeader}>
          <h2 id="pending-assignments-heading" className={styles.desktopTitle}>Pending Attendance</h2>
          <h2 id="pending-assignments-heading-mobile" className={styles.compactTitle}>Exam Overview</h2>
          <div className={styles.sectionActions}>
            <button type="button" className={`${styles.secondaryButton} ${styles.addButton}`} onClick={createAssignment}>
              Add
            </button>
            {viewAllButton}
          </div>
        </header>

        <div className={styles.desktopTableWrap}>
          <table className={styles.assignmentTable}>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Subject</th>
                <th scope="col">Class</th>
                <th scope="col">Due Date</th>
                <th scope="col">Submission Count</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.subject}</td>
                  <td>{assignment.className}</td>
                  <td>{assignment.dueDate}</td>
                  <td>{assignment.submissionCount}</td>
                  <td>{assignment.status}</td>
                  <td>
                    <button
                      type="button"
                      className={assignment.status === 'Evaluated' ? styles.evaluatedButton : styles.evaluateButton}
                      disabled={assignment.status === 'Evaluated' || !onUploadStudyMaterial}
                      onClick={() => openEvaluation(assignment.id)}
                    >
                      {assignment.status === 'Evaluated' ? 'Evaluated' : 'Evaluate Now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.mobileAssignmentList}>
          {visibleAssignments.map((assignment) => (
            <article className={styles.mobileAssignment} key={assignment.id}>
              <div className={styles.mobileAssignmentInfo}>
                <h3>Linear Equation</h3>
                <p>{assignment.className} <span>•</span> 08:00 <span>•</span> 1 hr 30 mins <span>•</span> 08:00-08:45</p>
              </div>
              <button
                type="button"
                className={assignment.status === 'Evaluated' ? styles.evaluatedButton : styles.evaluateButton}
                disabled={assignment.status === 'Evaluated' || !onUploadStudyMaterial}
                onClick={() => openEvaluation(assignment.id)}
              >
                {assignment.status === 'Evaluated' ? 'Evaluated' : 'Evaluate Now'}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default LMS;
