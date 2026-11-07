import React, { useRef, useState } from 'react';
import { ChevronLeft, UploadCloud } from 'lucide-react';
import styles from '../CSS/CreateAssignment.module.css';

const acceptedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'jpg', 'jpeg', 'png'];
const maxFileSize = 100 * 1024 * 1024;

function CreateAssignment({ onBack, backLabel = 'Back to schedule' }) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [dates, setDates] = useState({});
  const fileInput = useRef(null);

  const renderDateInput = (name, accessibleName, required = false) => (
    <span className={styles.dateInput}>
      <input
        className={dates[name] ? styles.dateHasValue : ''}
        aria-label={accessibleName}
        name={name}
        type="date"
        required={required}
        value={dates[name] || ''}
        onChange={(event) => setDates((current) => ({ ...current, [name]: event.target.value }))}
      />
      {!dates[name] && <span aria-hidden="true">Select date</span>}
    </span>
  );

  const addFiles = (selectedFiles) => {
    const incomingFiles = Array.from(selectedFiles || []);
    const invalidFile = incomingFiles.find((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return !acceptedExtensions.includes(extension) || file.size > maxFileSize;
    });

    if (invalidFile) {
      const extension = invalidFile.name.split('.').pop()?.toLowerCase();
      setMessage(!acceptedExtensions.includes(extension)
        ? 'Choose a supported file format.'
        : 'Each attachment must be 100 MB or smaller.');
      return;
    }

    setFiles((current) => [...current, ...incomingFiles]);
    setMessage(incomingFiles.length ? `${incomingFiles.length} file${incomingFiles.length === 1 ? '' : 's'} attached.` : '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('Assignment created successfully.');
  };

  return (
    <main className={styles.page}>
      <button className={styles.backButton} type="button" onClick={onBack} aria-label={backLabel}>
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.columns}>
          <div className={styles.mainColumn}>
            <section className={styles.panel} aria-labelledby="assignment-details-heading">
              <h2 id="assignment-details-heading">Assignment Details</h2>
              <div className={styles.detailsFields}>
                <label className={styles.field}>
                  <span>Title <b>*</b></span>
                  <input name="title" type="text" placeholder="Enter assignment title" required />
                </label>
                <label className={styles.field}>
                  <span>Subject <b>*</b></span>
                  <select name="subject" defaultValue="" required>
                    <option value="" disabled>Select subject</option>
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>Social Studies</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Assign to Class / Section <b>*</b></span>
                  <select name="classSection" defaultValue="" required>
                    <option value="" disabled>Select class / section</option>
                    <option>Class X - A</option>
                    <option>Class IX - B</option>
                    <option>Class X - B</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Type <b>*</b></span>
                  <select name="type" defaultValue="" required>
                    <option value="" disabled>Select type</option>
                    <option>Homework</option>
                    <option>Worksheet</option>
                    <option>Quiz</option>
                    <option>Project</option>
                    <option>Assessment</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Reference Material (Optional)</span>
                  <input name="referenceMaterial" type="text" placeholder="Enter reference material or links" />
                </label>
                <label className={`${styles.field} ${styles.instructionsField}`}>
                  <span>Description / Instructions <b>*</b></span>
                  <textarea
                    name="description"
                    aria-label="Description / Instructions *"
                    placeholder="Enter detailed instructions for students"
                    maxLength={1000}
                    required
                    onChange={(event) => setDescriptionLength(event.target.value.length)}
                  />
                  <span className={styles.characterCount}>{descriptionLength}/1000</span>
                </label>
              </div>
            </section>

            <section className={`${styles.panel} ${styles.datesPanel}`} aria-labelledby="assignment-dates-heading">
              <h2 id="assignment-dates-heading">Dates</h2>
              <div className={styles.dateFields}>
                <label className={styles.field}>
                  <span>Assign On <b>*</b></span>
                  {renderDateInput('assignOn', 'Assign On *', true)}
                </label>
                <label className={styles.field}>
                  <span>Due Date <b>*</b></span>
                  {renderDateInput('dueDate', 'Due Date *', true)}
                </label>
                <label className={styles.field}>
                  <span>Submission Start (Optional)</span>
                  {renderDateInput('submissionStart', 'Submission Start (Optional)')}
                </label>
                <label className={styles.field}>
                  <span>Submission End (Optional)</span>
                  {renderDateInput('submissionEnd', 'Submission End (Optional)')}
                </label>
              </div>
            </section>
          </div>

          <div className={styles.sideColumn}>
            <section className={styles.panel} aria-labelledby="assignment-settings-heading">
              <h2 id="assignment-settings-heading">Settings</h2>
              <div className={styles.settingsGrid}>
                <fieldset className={styles.radioGroup}>
                  <legend>Submission Type <b>*</b></legend>
                  <label className={styles.choice}>
                    <input type="radio" name="submissionType" value="online" defaultChecked />
                    <span><strong>Online Submission</strong><small>Students can submit online</small></span>
                  </label>
                  <label className={styles.choice}>
                    <input type="radio" name="submissionType" value="offline" />
                    <span><strong>Offline Submission</strong><small>Students can submit offline</small></span>
                  </label>
                  <label className={styles.choice}>
                    <input type="radio" name="submissionType" value="both" />
                    <span><strong>Both</strong></span>
                  </label>
                </fieldset>
                <div className={styles.settingFields}>
                  <label className={styles.choice}>
                    <input type="checkbox" name="allowLateSubmission" defaultChecked />
                    <span><strong>Allow Late Submission</strong><small>Students can submit after due date</small></span>
                  </label>
                  <label className={styles.field}>
                    <span>Late Submission Deduction</span>
                    <div className={styles.suffixInput}>
                      <input name="lateDeduction" type="number" min="0" max="100" defaultValue="0" aria-label="Late Submission Deduction" />
                      <span>%</span>
                    </div>
                    <small>Marks will be deducted for late submissions</small>
                  </label>
                  <label className={styles.field}>
                    <span>Max Marks <b>*</b></span>
                    <input name="maxMarks" type="number" min="1" placeholder="Enter max marks" required />
                  </label>
                </div>
              </div>
            </section>

            <section className={`${styles.panel} ${styles.attachmentsPanel}`} aria-labelledby="assignment-attachments-heading">
              <h2 id="assignment-attachments-heading">Attachments</h2>
              <p>Attach files or links to support this assignment (Optional)</p>
              <div
                className={styles.dropZone}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  addFiles(event.dataTransfer.files);
                }}
              >
                <UploadCloud size={19} aria-hidden="true" />
                <span>Drag &amp; Drop a file</span>
                <span>OR</span>
                <button type="button" onClick={() => fileInput.current?.click()}>Choose file</button>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.jpeg,.png"
                  aria-label="Choose attachment files"
                  onChange={(event) => {
                    addFiles(event.target.files);
                    event.target.value = '';
                  }}
                />
              </div>
              <small className={styles.fileHint}>Supported formats: PDF, DOC, DOCX, PPT, PPTX, ZIP, JPG, PNG (Max size: 100 MB)</small>
              {files.length > 0 && <ul className={styles.fileList}>{files.map((file, index) => <li key={`${file.name}-${index}`}>{file.name}</li>)}</ul>}
            </section>

            <section className={styles.panel} aria-labelledby="additional-settings-heading">
              <h2 id="additional-settings-heading">Additional Settings</h2>
              <div className={styles.additionalChoices}>
                <label className={styles.choice}>
                  <input type="checkbox" name="publishAssignment" defaultChecked />
                  <span><strong>Publish Assignment</strong><small>Make Assignment visible to students</small></span>
                </label>
                <label className={styles.choice}>
                  <input type="checkbox" name="sendNotifications" />
                  <span><strong>Send Notifications</strong><small>Notify students about this assignment</small></span>
                </label>
                <label className={styles.choice}>
                  <input type="checkbox" name="addToCalendar" />
                  <span><strong>Add to calendar</strong><small>Add assignment to class timetable</small></span>
                </label>
              </div>
            </section>
          </div>
        </div>

        <div className={styles.footer}>
          {message && <p className={styles.statusMessage} role="status">{message}</p>}
          <div>
            <button type="button" className={styles.cancelButton} onClick={onBack}>Cancel</button>
            <button type="submit" className={styles.submitButton}>Create Assignment</button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default CreateAssignment;
