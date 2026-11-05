import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';
import styles from '../CSS/EvaluationWorkspace.module.css';

const students = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  roll: '01',
  name: 'Aarav Sharma',
  status: 'Submitted',
}));

const rubric = [
  { key: 'concept', label: 'Understanding of concept', max: 5, value: 5 },
  { key: 'application', label: 'Application of formula/method', max: 5, value: 4 },
  { key: 'accuracy', label: 'Accuracy & calculation', max: 5, value: 3 },
  { key: 'presentation', label: 'Presentation & Neatness', max: 5, value: 2 },
];

const acceptedFileTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

function EvaluationWorkspace({ onBack }) {
  const [selectedStudent, setSelectedStudent] = useState(0);
  const [scores, setScores] = useState(() => Object.fromEntries(
    rubric.map(({ key, value }) => [key, value]),
  ));
  const [feedback, setFeedback] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewPage, setPreviewPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [message, setMessage] = useState('');
  const fileInput = useRef(null);
  const total = Object.values(scores).reduce((sum, score) => sum + Number(score || 0), 0);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const moveStudent = (offset) => {
    setSelectedStudent((current) => Math.min(students.length - 1, Math.max(0, current + offset)));
    setMessage('');
  };

  const setFile = (file) => {
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(extension)) {
      setMessage('Choose a PDF, DOC, DOCX, JPG, or PNG file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage('The attachment must be 10 MB or smaller.');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setAttachment(file);
    setPreviewUrl(/\.(jpg|jpeg|png)$/i.test(file.name) ? URL.createObjectURL(file) : '');
    setMessage(`${file.name} attached.`);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
  };

  return (
    <main className={styles.page}>
      <button className={styles.backButton} type="button" onClick={onBack} aria-label="Back to schedule">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <section className={styles.assignmentInfo} aria-label="Assignment details">
        <article><span>Assignment</span><strong>Linear Equations</strong></article>
        <article><span>Subject</span><strong>Mathematics</strong></article>
        <article><span>Class</span><strong>X-A</strong></article>
        <article><span>Type</span><strong>Worksheet</strong></article>
        <article><span>Due Date</span><strong>October 23, 2026</strong></article>
        <article><span>Marks</span><strong>20</strong></article>
      </section>

      <div className={styles.actionBar}>
        <button type="button" onClick={() => setMessage('Draft saved.')}>Save Draft</button>
        <button type="button" onClick={() => setMessage('Evaluation published.')}>Publish</button>
        <button type="button" onClick={() => moveStudent(-1)} disabled={selectedStudent === 0}>
          <ArrowLeft size={14} aria-hidden="true" />
          Previous Student
        </button>
        <button type="button" onClick={() => moveStudent(1)} disabled={selectedStudent === students.length - 1}>
          Next Student
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>

      {message && <p className={styles.statusMessage} role="status">{message}</p>}

      <div className={styles.workspaceGrid}>
        <div className={styles.submissionColumn}>
          <section className={`${styles.panel} ${styles.previewPanel}`} aria-labelledby="submission-preview-heading">
            <h2 id="submission-preview-heading">Submission Preview</h2>
            <div className={styles.previewCanvas} aria-label={`Submission page ${previewPage} preview`}>
              {previewUrl && <img src={previewUrl} alt={`Submission page ${previewPage}`} />}
            </div>
            <div className={styles.previewControls}>
              <div className={styles.zoomControls}>
                <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(50, value - 10))}>
                  <Minus size={13} aria-hidden="true" />
                </button>
                <span>{zoom}%</span>
                <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(150, value + 10))}>
                  <Plus size={13} aria-hidden="true" />
                </button>
              </div>
              <div className={styles.pageControls}>
                <span>Page {previewPage} of 4</span>
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={previewPage === 1}
                  onClick={() => setPreviewPage((page) => page - 1)}
                >
                  <ChevronLeft size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={previewPage === 4}
                  onClick={() => setPreviewPage((page) => page + 1)}
                >
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>

          <section className={`${styles.panel} ${styles.submissionDetails}`} aria-labelledby="submission-details-heading">
            <h2 id="submission-details-heading">Submission Details</h2>
            <dl>
              <div><dt>Submission Type</dt><dd>Online</dd></div>
              <div><dt>Submitted On</dt><dd>Oct 21, 2025, 08:45 AM</dd></div>
              <div><dt>Time Taken</dt><dd>1h 15m</dd></div>
              <div><dt>File Name</dt><dd>{attachment?.name || 'Aarav_Sharma_Linear_Equations.pdf'}</dd></div>
              <div><dt>Comments</dt><dd>Please check my answers and let me know where I can improve</dd></div>
            </dl>
          </section>
        </div>

        <section className={`${styles.panel} ${styles.studentPanel}`} aria-labelledby="student-list-heading">
          <h2 id="student-list-heading">Student List</h2>
          <div className={styles.studentTable}>
            <div className={styles.studentHeader} role="row">
              <span>Roll No.</span><span>Student Name</span><span>Status</span>
            </div>
            {students.map((student, index) => (
              <button
                className={`${styles.studentRow}${selectedStudent === index ? ` ${styles.selectedStudent}` : ''}`}
                type="button"
                key={student.id}
                aria-pressed={selectedStudent === index}
                onClick={() => {
                  setSelectedStudent(index);
                  setMessage('');
                }}
              >
                <span>{student.roll}</span>
                <span>{student.name}</span>
                <span>{student.status}</span>
              </button>
            ))}
          </div>
        </section>

        <div className={styles.evaluationColumn}>
          <section className={`${styles.panel} ${styles.rubricPanel}`} aria-labelledby="evaluation-heading">
            <h2 id="evaluation-heading">Evaluation</h2>
            <div className={styles.rubricRows}>
              {rubric.map(({ key, label, max }) => (
                <label key={key}>
                  <span>{label}</span>
                  <input
                    type="number"
                    min="0"
                    max={max}
                    aria-label={label}
                    value={scores[key]}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value === '' || (Number(value) >= 0 && Number(value) <= max)) {
                        setScores((current) => ({ ...current, [key]: value }));
                      }
                    }}
                  />
                </label>
              ))}
              <div className={styles.totalRow}><span>Total</span><strong>{total}</strong></div>
            </div>
          </section>

          <section className={`${styles.panel} ${styles.feedbackPanel}`} aria-labelledby="feedback-heading">
            <h2 id="feedback-heading">Marks &amp; Feedback</h2>
            <div className={styles.totalScore}><span>Total score</span><strong>{total}</strong></div>
            <label className={styles.feedbackLabel} htmlFor="student-feedback">Add Feedback for student</label>
            <textarea
              id="student-feedback"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
            />
            <div
              className={styles.dropZone}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <span>{attachment ? attachment.name : 'Drag & Drop a file'}</span>
              <span>OR</span>
              <button type="button" onClick={() => fileInput.current?.click()}>
                {attachment ? 'Change file' : 'Choose file'}
              </button>
              <input
                ref={fileInput}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                aria-label="Attach feedback file"
                onChange={(event) => setFile(event.target.files[0])}
              />
            </div>
            <p className={styles.fileHint}>Supported formats: PDF, DOC, DOCX, JPG, PNG (Max size: 10 MB) (optional)</p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default EvaluationWorkspace;
