import React, { useMemo, useState } from 'react';
import { Bell, Mail, Menu, Plus, Search, Settings, Upload, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import styles from '../CSS/StudentMaterial.module.css';

const initialMaterials = [
  ...Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    title: 'Linear Equation Notes',
    className: 'X-A',
    subject: 'Mathematics',
    type: 'PDF',
    uploaded: 'Oct 16, 2025',
    visibility: 'Shared',
    time: '08:00-08:45',
  })),
];

const emptyMaterial = {
  title: '',
  className: '',
  subject: '',
  type: 'PDF',
  uploaded: 'Oct 16, 2025',
  visibility: 'Visible',
  time: '08:00-08:45',
};

function StudentMaterial() {
  const outletContext = useOutletContext() || {};
  const [materials, setMaterials] = useState(initialMaterials);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyMaterial);
  const [statusMessage, setStatusMessage] = useState('');

  const matchingMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();
    return materials.filter((material) =>
      [material.title, material.className, material.subject, material.type]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [materials, search]);

  const filteredMaterials = showAll ? matchingMaterials : matchingMaterials.slice(0, 10);
  const tabletMaterials = showAll ? matchingMaterials : matchingMaterials.slice(0, 12);

  const openNewMaterial = () => {
    setForm(emptyMaterial);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setForm(emptyMaterial);
  };

  const saveMaterial = (event) => {
    event.preventDefault();
    const updated = {
      ...form,
      id: Date.now(),
    };
    setMaterials((current) => [updated, ...current]);
    setStatusMessage('Material uploaded successfully.');
    closeForm();
  };

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeading}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Open navigation menu"
            onClick={outletContext.onOpenSidebar}
          >
            <Menu size={23} aria-hidden="true" />
          </button>
          <div>
            <h1>Study Material</h1>
            <p>Mathematics · Senior Section · Academic Year 2025 - 26 · Term 1</p>
          </div>
        </div>
        <div className={styles.headerActions} aria-label="Page actions">
          <button type="button" aria-label="Messages"><Mail size={24} /></button>
          <button type="button" aria-label="Notifications"><Bell size={24} /></button>
          <button type="button" aria-label="Settings"><Settings size={24} /></button>
        </div>
      </header>

      <header className={styles.toolbar}>
        <label className={styles.searchBox}>
          <input
            type="search"
            aria-label="Search materials"
            placeholder="Search material"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Search size={25} aria-hidden="true" />
        </label>
        <button
          type="button"
          className={styles.uploadButton}
          onClick={outletContext.onUploadResources || openNewMaterial}
        >
          <Upload size={17} aria-hidden="true" />
          <span>Upload Resources</span>
        </button>
      </header>

      <section className={styles.materialPanel} aria-labelledby="materials-heading">
        <header className={styles.panelHeader}>
          <h2 id="materials-heading">Materials Overview</h2>
          <button
            type="button"
            className={styles.viewAllButton}
            aria-expanded={showAll}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? 'View Less' : 'View All'}
          </button>
        </header>

        <div className={styles.tableWrap}>
          <table className={styles.materialTable}>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Class</th>
                <th scope="col">Subject</th>
                <th scope="col">Type</th>
                <th scope="col">Uploaded On</th>
                <th scope="col">Visibility</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material.id}>
                  <td className={styles.materialTitle}>{material.title}</td>
                  <td>{material.className}</td>
                  <td>{material.subject}</td>
                  <td>{material.type}</td>
                  <td>{material.uploaded}</td>
                  <td>{material.visibility}</td>
                  <td>
                    <button type="button" className={styles.editButton}>
                      Edit Material
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>No materials found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.materialCards} aria-label="Study materials" role="list">
          {tabletMaterials.map((material) => (
            <article className={styles.materialCard} key={`card-${material.id}`} role="listitem">
              <span className={styles.fileBadge} aria-hidden="true">pdf.</span>
              <div className={styles.cardDetails}>
                <strong>{material.title.replace(/ Notes$/, '')}</strong>
                <span>{material.time || '08:00-08:45'}</span>
              </div>
              <button type="button" className={styles.cardEditButton}>
                Edit Material
              </button>
            </article>
          ))}
          {tabletMaterials.length === 0 && (
            <p className={styles.emptyState}>No materials found.</p>
          )}
        </div>
      </section>

      {statusMessage && <p className={styles.status} role="status">{statusMessage}</p>}

      {isFormOpen && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeForm();
        }}>
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="material-dialog-title">
            <header className={styles.dialogHeader}>
              <h2 id="material-dialog-title">Upload Resources</h2>
              <button type="button" className={styles.closeButton} aria-label="Close dialog" onClick={closeForm}>
                <X size={20} />
              </button>
            </header>
            <form className={styles.materialForm} onSubmit={saveMaterial}>
              <label>
                Material Title
                <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </label>
              <label>
                Class / Section
                <input required value={form.className} onChange={(event) => setForm({ ...form, className: event.target.value })} />
              </label>
              <label>
                Subject
                <input required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
              </label>
              <div className={styles.formRow}>
                <label>
                  Type
                  <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                    <option>PDF</option>
                    <option>Worksheet</option>
                    <option>Presentation</option>
                    <option>Document</option>
                  </select>
                </label>
                <label>
                  Visibility
                  <select value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value })}>
                    <option>Visible</option>
                    <option>Hidden</option>
                  </select>
                </label>
              </div>
              <label className={styles.filePicker}>
                Select file
                <input type="file" />
              </label>
              <div className={styles.dialogActions}>
                <button type="button" className={styles.cancelButton} onClick={closeForm}>Cancel</button>
                <button type="submit" className={styles.uploadButton}><Plus size={16} />Upload Resource</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default StudentMaterial;