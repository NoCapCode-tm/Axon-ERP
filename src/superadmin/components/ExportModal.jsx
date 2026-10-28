import { useState } from 'react';
import Modal, { ModalForm, ModalFooter, Field } from './Modal';
import styles from '../CSS/Exportmodal.module.css';

const FORMATS = [
  { id: 'csv', label: 'CSV', ext: 'csv' },
  { id: 'excel', label: 'Excel', ext: 'xlsx' },
  { id: 'pdf', label: 'PDF', ext: 'pdf' },
  { id: 'json', label: 'JSON', ext: 'json' },
];

const INVALID_NAME = /[\\/:*?"<>|]/;

const STATUS_TEXT = {
  idle: 'Ready to export',
  busy: 'Preparing your file...',
  error: 'Export failed. Please try again.',
};

function ExportForm({ onClose, onExport }) {
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState('csv');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'busy') return;

    const form = e.currentTarget;
    const name = fileName.trim();
    const problem = !name
      ? 'Enter a file name'
      : INVALID_NAME.test(name)
        ? 'File name cannot contain \\ / : * ? " < > |'
        : '';
    if (problem) {
      setError(problem);
      form.elements.fileName?.focus();
      return;
    }

    const chosen = FORMATS.find((f) => f.id === format);
    setStatus('busy');
    try {
      await onExport?.({ fileName: `${name}.${chosen.ext}`, format: chosen.id });
      onClose();
    } catch {
      setStatus('error');
    }
  };

  return (
    <ModalForm onSubmit={handleSubmit}>
      <Field
        label="File name"
        name="fileName"
        required
        autoComplete="off"
        value={fileName}
        error={error}
        onChange={(e) => {
          setFileName(e.target.value);
          setError('');
          setStatus('idle');
        }}
      />

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>File format<span aria-hidden="true">*</span></legend>
        <div className={styles.formats}>
          {FORMATS.map((f) => (
            <label key={f.id} className={styles.format}>
              <input
                type="radio"
                name="format"
                value={f.id}
                checked={format === f.id}
                onChange={() => { setFormat(f.id); setStatus('idle'); }}
                className={styles.radio}
              />
              <span className={styles.tile}>{f.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className={`${styles.status} ${status === 'error' ? styles.statusError : ''}`} role="status">
        {STATUS_TEXT[status]}
      </p>

      <ModalFooter onCancel={onClose} submitLabel="Export List" />
    </ModalForm>
  );
}

// open / onClose: controlled by the page.
// onExport({ fileName, format }): fileName already has the extension. Return a promise; throw to show the error state.
export default function ExportModal({ open, onClose, onExport, title = 'Export Student List' }) {
  return (
    <Modal open={open} title={title} onClose={onClose} dismissOnOverlay={false}>
      <ExportForm onClose={onClose} onExport={onExport} />
    </Modal>
  );
}