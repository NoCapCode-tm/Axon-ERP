import { useMemo, useState } from 'react';
import { Search, SquarePen, Check } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import styles from '../CSS/FeatureControl.module.css';

// dummy data. Order of `plans` is: Basic, Pro, Elite, Adv, Ent
const plans = [
  { id: 'basic', label: 'Basic' },
  { id: 'pro', label: 'Pro' },
  { id: 'elite', label: 'Elite' },
  { id: 'adv', label: 'Adv' },
  { id: 'ent', label: 'Ent' },
];

const initialFeatures = [
  { id: 'attendance', name: 'Attendance Module', desc: 'Daily attendance tracking for students and staff', on: [1, 1, 1, 1, 1] },
  { id: 'fees', name: 'Fee Management', desc: 'Online fee collections, receipts and reminders', on: [1, 1, 1, 1, 1] },
  { id: 'timetable', name: 'Timetable Builder', desc: 'Drag and drop timetable scheduling tool', on: [1, 1, 1, 1, 1] },
  { id: 'reports', name: 'Custom Report', desc: 'Build and export custom analytics reports', on: [0, 0, 1, 1, 1] },
  { id: 'ai-grade', name: 'AI Grade Prediction', desc: 'ML based early warning for at risk students', on: [0, 0, 0, 1, 1] },
  { id: 'multi-branch', name: 'Multi Branch Support', desc: 'Manage multiple campuses under one account', on: [0, 0, 0, 1, 1] },
  { id: 'sms', name: 'SMS Notifications', desc: 'Automated SMS alerts for parents and staff', on: [0, 1, 1, 1, 1] },
  { id: 'material', name: 'Material Management', desc: 'Book catalogue, issue/return and fine tracking', on: [1, 1, 1, 1, 1] },
  { id: 'transport', name: 'Transport Tracking', desc: 'GPS based live bus tracking for parents', on: [0, 0, 0, 1, 1] },
  { id: 'exam', name: 'Exam & Result Portal', desc: 'Online exams, grading and result publishing', on: [0, 1, 1, 1, 1] },
  { id: 'hr', name: 'HR & Payroll', desc: 'Staff salary, leaves and appraisal management', on: [0, 0, 1, 1, 1] },
];

// one dot in the matrix. Plain dot normally, a toggle button while the row is being edited.
function PlanDot({ on, editing, label, onToggle }) {
  const cls = `${styles.dot} ${on ? styles.dotOn : styles.dotOff}`;
  if (!editing) {
    return <span className={cls} role="img" aria-label={`${label}: ${on ? 'included' : 'not included'}`} />;
  }
  return (
    <button
      type="button"
      className={`${cls} ${styles.dotBtn}`}
      aria-pressed={on}
      aria-label={label}
      onClick={onToggle}
    />
  );
}

export default function FeatureControl() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [features, setFeatures] = useState(initialFeatures);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return features;
    return features.filter((f) => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q));
  }, [features, query]);

  const togglePlan = (featureId, index) =>
    setFeatures((list) =>
      list.map((f) =>
        f.id === featureId ? { ...f, on: f.on.map((v, i) => (i === index ? (v ? 0 : 1) : v)) } : f
      )
    );

  const handleAction = (id) => {
    if (editingId === id) {
      // TODO: send features to the API here
      console.log('save feature', features.find((f) => f.id === id));
      setEditingId(null);
    } else {
      setEditingId(id);
    }
  };

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar
          title="Feature Control"
          subtitle="Academic Year 2025 - 26"
          onMenuClick={() => setMenuOpen(true)}
        />

        <section className={styles.card}>
          <header className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Feature Matrix</h2>
            <label className={styles.search}>
              <span className={styles.srOnly}>Search features</span>
              <input
                type="search"
                placeholder="Search features"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search size={26} aria-hidden="true" />
            </label>
          </header>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <colgroup>
                <col className={styles.colFeature} />
                <col className={styles.colDesc} />
                {plans.map((p) => <col key={p.id} className={styles.colPlan} />)}
                <col className={styles.colAction} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Description</th>
                  {plans.map((p) => <th key={p.id} scope="col">{p.label}</th>)}
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((f) => {
                  const editing = editingId === f.id;
                  return (
                    <tr key={f.id} className={editing ? styles.editingRow : ''}>
                      <th scope="row" className={styles.featureName}>{f.name}</th>
                      <td className={styles.desc}>{f.desc}</td>
                      {plans.map((p, i) => (
                        <td key={p.id}>
                          <PlanDot
                            on={Boolean(f.on[i])}
                            editing={editing}
                            label={`${f.name} on ${p.label}`}
                            onToggle={() => togglePlan(f.id, i)}
                          />
                        </td>
                      ))}
                      <td>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleAction(f.id)}
                          aria-label={`${editing ? 'Save' : 'Edit'} ${f.name}`}
                        >
                          {editing ? <Check size={18} aria-hidden="true" /> : <SquarePen size={18} aria-hidden="true" />}
                          <span className={styles.editText}>{editing ? 'Save' : 'Edit'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {visible.length === 0 && (
              <p className={styles.empty}>No features match "{query}". Try a different word.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}