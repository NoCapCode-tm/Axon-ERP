import React, { useRef, useState } from 'react';
import { ChevronLeft, Search, Upload, UploadCloud } from 'lucide-react';
import styles from '../CSS/UploadResources.module.css';

const acceptedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'jpg', 'jpeg', 'png'];
const maxFileSize = 100 * 1024 * 1024;

function UploadResources({ onBack }) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [descriptionLength, setDescriptionLength] = useState(0);
  const fileInput = useRef(null);

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

  const submitResource = (event) => {
    event.preventDefault();
    setMessage(files.length
      ? 'Resources uploaded successfully.'
      : 'Resource details saved. Add an attachment when ready.');
  };

  return (
    <main className={styles.page}>
      <div className={styles.backRow}>
        <button className={styles.backButton} type="button" onClick={onBack} aria-label="Back to Study Material">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <div className={styles.tabletActions}>
          <button type="button" className={styles.cancelButton} onClick={onBack}>Cancel</button>
          <button type="submit" form="upload-resource-form" className={styles.createButton}>Create Assignment</button>
        </div>
      </div>

      <form className={styles.form} id="upload-resource-form" onSubmit={submitResource}>
        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <input type="search" aria-label="Search resources" placeholder="Value" />
            <Search size={17} aria-hidden="true" />
          </label>
          <button className={styles.uploadButton} type="submit">
            <span>Upload Resources</span>
            <Upload size={17} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.columns}>
          <section className={styles.panel} aria-labelledby="resource-details-heading">
            <h2 id="resource-details-heading">Resource Details</h2>
            <div className={styles.fields}>
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
                  <option>PDF</option>
                  <option>Document</option>
                  <option>Presentation</option>
                  <option>Worksheet</option>
                  <option>Link</option>
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

          <section className={`${styles.panel} ${styles.attachmentsPanel}`} aria-labelledby="resource-attachments-heading">
            <h2 id="resource-attachments-heading">Attachments</h2>
            <p>Attach files or links to support this assignment (Optional)</p>
            <div
              className={styles.dropZone}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                addFiles(event.dataTransfer.files);
              }}
            >
              <UploadCloud size={21} aria-hidden="true" />
              <span className={styles.dropInstruction}>Drag &amp; Drop a file</span>
              <span className={styles.orLabel}>OR</span>
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
            <small className={styles.fileHint}>Supported formats: PDF, DOC, DOCX, PPT, PPTX, ZIP, JPG, PNG (Max size :100 MB)</small>
            {files.length > 0 && (
              <ul className={styles.fileList}>
                {files.map((file, index) => <li key={`${file.name}-${index}`}>{file.name}</li>)}
              </ul>
            )}
          </section>
        </div>
        {message && <p className={styles.statusMessage} role="status">{message}</p>}
      </form>
    </main>
  );
}

export default UploadResources;
