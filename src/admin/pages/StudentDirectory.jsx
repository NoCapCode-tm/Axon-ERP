import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, CalendarDays, ChevronDown, ChevronLeft, ChevronRight,
  Eye, FileText, Pencil, Phone, Search, Trash2, X,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import dash from '../CSS/Dashboard.module.css'; // shell, page, card, btn, select, menu...
import styles from '../CSS/StudentDirectory.module.css';
import pf from '../CSS/StudentProfile.module.css'; // profile / attendance / documents / activity views

/* ---------- constants + dummy data (replace with API data) ---------- */

const PAGE_SIZE = 12;
const MAX_BYTES = 5 * 1024 * 1024;
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const PHOTO_TYPES = ['image/jpeg', 'image/png'];

const CLASSES = Array.from({ length: 12 }, (_, i) => String(i + 1));
const SECTIONS = ['A', 'B', 'C', 'D'];
const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const FIRST = ['Aarav', 'Priya', 'Vihaan', 'Ananya', 'Aditya', 'Diya', 'Arjun', 'Ishita', 'Kabir', 'Meera', 'Rohan', 'Saanvi'];
const LAST = ['Sharma', 'Verma', 'Iyer', 'Patel', 'Nair', 'Reddy', 'Singh', 'Kulkarni'];
const TEACHERS = ['Priya Venkat', 'Rahul Menon', 'Sunita Rao', 'Amit Desai'];

const STUDENTS = Array.from({ length: 120 }, (_, i) => {
  const last = LAST[(i * 3 + 1) % LAST.length];
  return {
    id: 1001 + i,
    name: `${FIRST[i % FIRST.length]} ${last}`,
    cls: CLASSES[i % CLASSES.length],
    section: SECTIONS[Math.floor(i / CLASSES.length) % SECTIONS.length],
    teacher: TEACHERS[i % TEACHERS.length],
    parent: `Rajesh ${last}`,
    phone: String(9876543210 + i),
    photo: '', // image URL from API
  };
});

const STEPS = ['Basic Info', 'Academic Info', 'Parents Details', 'Document Upload', 'Review'];

const DOC_FIELDS = [
  { key: 'aadhaar', label: 'Aadhaar card' },
  { key: 'birth', label: 'Birth Certificate' },
  { key: 'tc', label: 'Transfer Certificate (TC)' },
  { key: 'other', label: 'Other Documents' },
];

const EMPTY_PARENT = { name: '', mobile: '', email: '', occupation: '' };
const EMPTY_ADDRESS = { line1: '', line2: '', city: '', state: '', pin: '', country: 'India' };
const EMPTY_FORM = {
  name: '', dob: '', gender: '', blood: '', photo: null,
  admissionNo: '', cls: '', section: '', admissionDate: '', prevSchool: '',
  father: EMPTY_PARENT, mother: EMPTY_PARENT,
  cur: EMPTY_ADDRESS, perm: EMPTY_ADDRESS, sameAddr: false,
};

/* ---------- helpers ---------- */

const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
const formatDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '—');
const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} mb`;
const todayLocal = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const MOBILE_RE = /^[6-9]\d{9}$/;
const PIN_RE = /^[1-9]\d{5}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkFile(file, types) {
  if (!types.includes(file.type)) return 'Unsupported file type';
  if (file.size > MAX_BYTES) return 'File must be 5 MB or smaller';
  return '';
}

function validateParent(e, group, p, who) {
  if (!p.name.trim()) e[`${group}.name`] = `Enter ${who} name`;
  if (!MOBILE_RE.test(p.mobile)) e[`${group}.mobile`] = 'Enter a valid 10-digit mobile number';
  if (p.email && !EMAIL_RE.test(p.email)) e[`${group}.email`] = 'Enter a valid email address';
}

function validateAddress(e, group, a) {
  if (!a.line1.trim()) e[`${group}.line1`] = 'Required';
  if (!a.line2.trim()) e[`${group}.line2`] = 'Required';
  if (!a.city.trim()) e[`${group}.city`] = 'Required';
  if (!a.state) e[`${group}.state`] = 'Required';
  if (!PIN_RE.test(a.pin)) e[`${group}.pin`] = 'Enter a 6-digit pin-code';
  if (!a.country.trim()) e[`${group}.country`] = 'Required';
}

function validateStep(step, f) {
  const e = {};
  if (step === 0) {
    if (!f.name.trim()) e.name = 'Enter the student name';
    if (!f.dob) e.dob = 'Select the date of birth';
    else if (f.dob > todayLocal()) e.dob = 'Date cannot be in the future';
  }
  if (step === 1) {
    if (!f.admissionNo.trim()) e.admissionNo = 'Enter the admission number';
    if (!f.cls) e.cls = 'Select a class';
    if (!f.section) e.section = 'Select a section';
    if (!f.admissionDate) e.admissionDate = 'Select the admission date';
  }
  if (step === 2) {
    validateParent(e, 'father', f.father, "father's");
    validateParent(e, 'mother', f.mother, "mother's");
    validateAddress(e, 'cur', f.cur);
    if (!f.sameAddr) validateAddress(e, 'perm', f.perm);
  }
  return e;
}

/* ---------- small building blocks ---------- */

function Avatar({ student }) {
  return student.photo
    ? <img className={styles.avatar} src={student.photo} alt="" />
    : <span className={styles.avatar} aria-hidden="true">{initials(student.name)}</span>;
}

function MiniSelect({ label, value, onChange, options }) {
  return (
    <label className={`${dash.select} ${dash.selectPlain}`}>
      <span className={dash.srOnly}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={18} aria-hidden="true" />
    </label>
  );
}

function SearchBar({ value, onChange, small = false }) {
  return (
    <form
      className={`${styles.search} ${small ? styles.searchSm : ''}`}
      onSubmit={(e) => e.preventDefault()}
      role="search"
    >
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search student by name"
        aria-label="Search student by name"
      />
      <button type="submit" aria-label="Search"><Search size={small ? 22 : 26} /></button>
    </form>
  );
}

function Pagination({ page, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.max(1, Math.min(page - 1, pages - 2));
  const nums = Array.from({ length: Math.min(3, pages) }, (_, i) => start + i);
  const shown = Math.max(0, Math.min(PAGE_SIZE, total - (page - 1) * PAGE_SIZE));

  return (
    <footer className={styles.footer}>
      <p className={styles.showing}>Showing {shown} of {total} students</p>
      <nav className={styles.pager} aria-label="Pagination">
        <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={22} />
        </button>
        {nums.map((n) => (
          <button
            key={n}
            type="button"
            className={n === page ? styles.pagerActive : ''}
            aria-current={n === page ? 'page' : undefined}
            onClick={() => onPage(n)}
          >
            {n}
          </button>
        ))}
        <button type="button" aria-label="Next page" disabled={page === pages} onClick={() => onPage(page + 1)}>
          <ChevronRight size={22} />
        </button>
      </nav>
    </footer>
  );
}

/* ---------- form fields ---------- */

function Field({ label, required, error, className = '', children }) {
  return (
    <label className={`${styles.field} ${className}`}>
      <span className={styles.label}>{label}{required ? '*' : ''}</span>
      {children}
      {error && <span className={styles.error} role="alert">{error}</span>}
    </label>
  );
}

function Input({ label, required, error, value, onChange, className, ...rest }) {
  return (
    <Field label={label} required={required} error={error} className={className}>
      <input
        className={`${styles.control} ${error ? styles.invalid : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        {...rest}
      />
    </Field>
  );
}

function DateInput({ label, required, error, value, onChange, max }) {
  return (
    <Field label={label} required={required} error={error}>
      <span className={styles.selectWrap}>
        <input
          type="date"
          max={max}
          className={`${styles.control} ${error ? styles.invalid : ''} ${!value ? styles.placeholder : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
        />
        <CalendarDays size={24} aria-hidden="true" />
      </span>
    </Field>
  );
}

function Dropdown({ label, required, error, value, onChange, options, placeholder, className, disabled }) {
  return (
    <Field label={label} required={required} error={error} className={className}>
      <span className={styles.selectWrap}>
        <select
          className={`${styles.control} ${error ? styles.invalid : ''} ${!value ? styles.placeholder : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={20} aria-hidden="true" />
      </span>
    </Field>
  );
}

/* ---------- list view ---------- */

function StudentList({ initialQuery, onPromoteAll, onPromoteManual, onAdd, onView }) {
  const [query, setQuery] = useState(initialQuery);
  const [cls, setCls] = useState('All');
  const [section, setSection] = useState('All');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENTS.filter((s) => (
      (!q || s.name.toLowerCase().includes(q))
      && (cls === 'All' || s.cls === cls)
      && (section === 'All' || s.section === section)
    ));
  }, [query, cls, section]);

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const reset = (fn) => (v) => { fn(v); setPage(1); };
  const view = (id) => onView(id);

  const classOptions = [{ value: 'All', label: 'All classes' }, ...CLASSES.map((c) => ({ value: c, label: `Class ${c}` }))];
  const sectionOptions = [{ value: 'All', label: 'All sections' }, ...SECTIONS.map((s) => ({ value: s, label: `Section ${s}` }))];

  const actions = [
    { id: 'all', label: 'Promote All Students', run: onPromoteAll },
    { id: 'manual', label: 'Promote Students Manually', run: onPromoteManual },
    { id: 'add', label: 'Add Students', run: onAdd },
  ];

  return (
    <>
      <SearchBar value={query} onChange={reset(setQuery)} />

      {/* tablet + mobile: Filter (and Options on mobile) */}
      <div className={styles.toolbar}>
        <div className={styles.filterWrap}>
          <button
            type="button"
            className={`${dash.btn} ${dash.btnIcon}`}
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((o) => !o)}
          >
            Filter <ChevronDown size={18} aria-hidden="true" />
          </button>
          {filterOpen && (
            <div className={dash.filterPanel}>
              <MiniSelect label="Class" value={cls} onChange={reset(setCls)} options={classOptions} />
              <MiniSelect label="Section" value={section} onChange={reset(setSection)} options={sectionOptions} />
            </div>
          )}
        </div>

        <div className={dash.optionsWrap}>
          <button
            type="button"
            className={`${dash.btn} ${dash.btnIcon}`}
            aria-expanded={optionsOpen}
            onClick={() => setOptionsOpen((o) => !o)}
          >
            Options <ChevronDown size={18} aria-hidden="true" />
          </button>
          {optionsOpen && (
            <div className={dash.menu} role="menu">
              {actions.map((a) => (
                <button key={a.id} role="menuitem" onClick={() => { setOptionsOpen(false); a.run(); }}>{a.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className={`${dash.card} ${styles.record}`}>
        <header className={styles.recordHead}>
          <h2 className={dash.sectionTitle}>Student Record</h2>
          <div className={dash.actions}>
            {actions.map((a) => (
              <button key={a.id} type="button" className={dash.btn} onClick={a.run}>{a.label}</button>
            ))}
          </div>
        </header>

        {/* laptop: table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Student Name</th>
                <th scope="col">Class &amp; Section</th>
                <th scope="col">Student ID</th>
                <th scope="col">Class Teacher</th>
                <th scope="col">Parent Name</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.cls}{s.section}</td>
                  <td>{s.id}</td>
                  <td>{s.teacher}</td>
                  <td>{s.parent}</td>
                  <td>{s.phone}</td>
                  <td>
                    <button type="button" className={styles.viewBtn} onClick={() => view(s.id)}>
                      View<span className={dash.srOnly}> {s.name}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* tablet + mobile: cards */}
        <ul className={styles.cardList}>
          {rows.map((s) => (
            <li key={s.id} className={styles.studentCard}>
              <Avatar student={s} />
              <div className={styles.studentInfo}>
                <p className={styles.studentName}>{s.name}</p>
                <p className={styles.studentId}>ID {s.id}</p>
              </div>
              <a className={styles.roundBtn} href={`tel:${s.phone}`} aria-label={`Call parent of ${s.name}`}>
                <Phone size={22} />
              </a>
              <button type="button" className={styles.roundBtn} onClick={() => view(s.id)} aria-label={`View ${s.name}`}>
                <Eye size={24} />
              </button>
            </li>
          ))}
        </ul>

        {rows.length === 0 && (
          <p className={styles.empty}>No students match your search. Try a different name or clear the filters.</p>
        )}

        <Pagination page={page} total={filtered.length} onPage={setPage} />
      </section>
    </>
  );
}

/* ---------- promote view ---------- */

function PromoteStudents({ onBack, onDone }) {
  const [cur, setCur] = useState({ cls: '', section: '' });
  const [next, setNext] = useState({ cls: '', section: '' });
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const ready = cur.cls && cur.section;
  const pool = useMemo(() => {
    if (!ready) return [];
    const q = query.trim().toLowerCase();
    return STUDENTS.filter((s) => s.cls === cur.cls && s.section === cur.section && (!q || s.name.toLowerCase().includes(q)));
  }, [ready, cur, query]);
  const rows = pool.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = pool.length > 0 && pool.every((s) => selected.has(s.id));

  const changeCurrent = (key) => (v) => {
    setCur((c) => ({ ...c, [key]: v }));
    setSelected(new Set()); // old selection no longer belongs to this class
    setPage(1);
    setError('');
  };
  const changeNext = (key) => (v) => { setNext((n) => ({ ...n, [key]: v })); setError(''); };

  const toggle = (id) => setSelected((prev) => {
    const copy = new Set(prev);
    if (copy.has(id)) copy.delete(id); else copy.add(id);
    return copy;
  });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(pool.map((s) => s.id)));

  const submit = () => {
    if (!next.cls || !next.section) return setError('Choose the promoted class and section.');
    if (cur.cls === next.cls && cur.section === next.section) return setError('Promoted class and section are the same as the current ones.');
    if (selected.size === 0) return setError('Select at least one student.');
    // TODO: POST /students/promote { studentIds: [...selected], toClass, toSection }
    return onDone(selected.size, `${next.cls}${next.section}`);
  };

  return (
    <section className={`${dash.card} ${styles.promote}`}>
      <button type="button" className={styles.back} onClick={onBack} aria-label="Back to student list">
        <ArrowLeft size={24} />
      </button>

      <div className={styles.promoteFilters}>
        <Dropdown label="Current Class" required value={cur.cls} onChange={changeCurrent('cls')} options={CLASSES} placeholder="Select Class" />
        <Dropdown label="Current Section" required value={cur.section} onChange={changeCurrent('section')} options={SECTIONS} placeholder="Select Section" />
        <Dropdown label="Promoted Class" required value={next.cls} onChange={changeNext('cls')} options={CLASSES} placeholder="Select class" />
        <Dropdown label="Promoted Section" required value={next.section} onChange={changeNext('section')} options={SECTIONS} placeholder="Select Section" />
      </div>

      <div className={styles.promoteHead}>
        <h2 className={dash.sectionTitle}>Students to be Promoted</h2>
        <div className={styles.promoteTools}>
          <SearchBar small value={query} onChange={(v) => { setQuery(v); setPage(1); }} />
          <button type="button" className={dash.btn} onClick={toggleAll} disabled={pool.length === 0}>
            {allSelected ? 'Clear All' : 'Select All'}
          </button>
        </div>
      </div>

      {!ready && <p className={styles.empty}>Choose the current class and section to see its students.</p>}
      {ready && pool.length === 0 && <p className={styles.empty}>No students found in Class {cur.cls}{cur.section}.</p>}

      {rows.length > 0 && (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Student Name</th>
                  <th scope="col">Student ID</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.id}</td>
                    <td>
                      <button
                        type="button"
                        className={`${styles.viewBtn} ${selected.has(s.id) ? styles.selected : ''}`}
                        aria-pressed={selected.has(s.id)}
                        onClick={() => toggle(s.id)}
                      >
                        {selected.has(s.id) ? 'Selected' : 'Select'}<span className={dash.srOnly}> {s.name}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className={styles.cardList}>
            {rows.map((s) => (
              <li key={s.id}>
                <label className={styles.studentCard}>
                  <input type="checkbox" className={styles.check} checked={selected.has(s.id)} onChange={() => toggle(s.id)} />
                  <Avatar student={s} />
                  <div className={styles.studentInfo}>
                    <p className={styles.studentName}>{s.name}</p>
                    <p className={styles.studentId}>ID {s.id}</p>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}

      <Pagination page={page} total={pool.length} onPage={setPage} />

      <div className={styles.formActions}>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="button" className={dash.btn} onClick={submit}>
          Promote Selected{selected.size ? ` (${selected.size})` : ''}
        </button>
      </div>
    </section>
  );
}

/* ---------- admission: parts ---------- */

function PhotoUpload({ file, onChange }) {
  const ref = useRef(null);
  const [error, setError] = useState('');
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const pick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const msg = checkFile(f, PHOTO_TYPES);
    setError(msg);
    if (!msg) onChange(f);
  };

  return (
    <div className={styles.field}>
      <span className={styles.label}>Student Photo</span>
      <button type="button" className={styles.photoBox} onClick={() => ref.current?.click()}>
        {url ? <img src={url} alt="Student preview" /> : 'Click to upload photo'}
      </button>
      <input ref={ref} type="file" accept="image/jpeg,image/png" hidden onChange={pick} />
      {error && <span className={styles.error} role="alert">{error}</span>}
    </div>
  );
}

function ParentFields({ title, group, who, values, setIn, errors }) {
  const digits = (v) => setIn(group, 'mobile')(v.replace(/\D/g, ''));
  return (
    <section className={styles.group}>
      <h3 className={styles.groupTitle}>{title}</h3>
      <div className={styles.grid}>
        <Input label={`${who} Name`} required placeholder="Enter full name" value={values.name} onChange={setIn(group, 'name')} error={errors[`${group}.name`]} />
        <Input label="Mobile Number" required inputMode="numeric" maxLength={10} placeholder="Enter mobile number" value={values.mobile} onChange={digits} error={errors[`${group}.mobile`]} />
        <Input label="Email Address" type="email" placeholder="Enter email address" value={values.email} onChange={setIn(group, 'email')} error={errors[`${group}.email`]} />
        <Input label="Occupation" placeholder="Enter Occupation" value={values.occupation} onChange={setIn(group, 'occupation')} />
      </div>
    </section>
  );
}

function AddressFields({ title, group, values, setIn, errors, disabled, aside }) {
  return (
    <section className={styles.group}>
      <div className={styles.groupHead}>
        <h3 className={styles.groupTitle}>{title}</h3>
        {aside}
      </div>
      <div className={styles.grid}>
        <Input label="Address line 1" required disabled={disabled} placeholder="House no. , Street" value={values.line1} onChange={setIn(group, 'line1')} error={errors[`${group}.line1`]} />
        <Input label="Address line 2" required disabled={disabled} placeholder="Locality, Landmark" value={values.line2} onChange={setIn(group, 'line2')} error={errors[`${group}.line2`]} />
      </div>
      <div className={`${styles.grid} ${styles.grid4}`}>
        <Input label="City" required disabled={disabled} placeholder="Enter city" value={values.city} onChange={setIn(group, 'city')} error={errors[`${group}.city`]} />
        <Dropdown label="State" required disabled={disabled} placeholder="Select state" options={STATES} value={values.state} onChange={setIn(group, 'state')} error={errors[`${group}.state`]} />
        <Input label="Pin-code" required disabled={disabled} inputMode="numeric" maxLength={6} placeholder="Enter Pin-code" value={values.pin} onChange={(v) => setIn(group, 'pin')(v.replace(/\D/g, ''))} error={errors[`${group}.pin`]} />
        <Input label="Country" required disabled={disabled} value={values.country} onChange={setIn(group, 'country')} error={errors[`${group}.country`]} />
      </div>
    </section>
  );
}

function DocCard({ label, file, onPick, onRemove }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const accept = (f) => {
    if (!f) return;
    const msg = checkFile(f, DOC_TYPES);
    setError(msg);
    if (!msg) onPick(f);
  };

  return (
    <div className={styles.docCard}>
      <h3 className={styles.groupTitle}>{label}</h3>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dropActive : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files?.[0]); }}
      >
        <p className={styles.dropText}>Drag and drop files here</p>
        <p className={styles.dropHint}>PDF, JPEG, PNG (max 5mb)</p>
        <button type="button" className={`${dash.btn} ${styles.browse}`} onClick={() => ref.current?.click()}>Browse files</button>
        <input
          ref={ref}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          hidden
          onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ''; }}
        />
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}

      {file && (
        <div className={styles.fileRow}>
          <FileText size={28} aria-hidden="true" />
          <div className={styles.fileInfo}>
            <p className={styles.fileName}>{file.name}</p>
            <p className={styles.fileSize}>{formatSize(file.size)}</p>
          </div>
          <button type="button" className={styles.iconBtn} onClick={() => ref.current?.click()} aria-label={`Replace ${label}`}><Pencil size={20} /></button>
          <button type="button" className={styles.iconBtn} onClick={onRemove} aria-label={`Remove ${label}`}><Trash2 size={20} /></button>
          <div className={styles.progress} aria-hidden="true"><span style={{ width: '100%' }} /></div>
          <p className={styles.progressText}>Ready to upload on submit</p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ title, rows, onEdit }) {
  return (
    <section className={styles.reviewCard}>
      <header className={styles.reviewHead}>
        <h3 className={styles.groupTitle}>{title}</h3>
        <button type="button" className={styles.editLink} onClick={onEdit}>Edit</button>
      </header>
      <dl className={styles.reviewList}>
        {rows.map(([k, v]) => (
          <div key={k} className={styles.reviewRow}>
            <dt>{k}</dt>
            <dd>{v || '—'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- admission: wizard ---------- */

function AdmissionForm({ onCancel, onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [docs, setDocs] = useState({ aadhaar: null, birth: null, tc: null, other: null });
  const [errors, setErrors] = useState({});
  const topRef = useRef(null);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [step]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const setIn = (group, key) => (val) => setForm((f) => ({ ...f, [group]: { ...f[group], [key]: val } }));
  const perm = form.sameAddr ? form.cur : form.perm;

  const next = () => {
    const e = validateStep(step, form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => s + 1);
  };
  const back = () => { setErrors({}); setStep((s) => s - 1); };
  const jump = (i) => { setErrors({}); setStep(i); };
  const submit = () => onSubmit({ ...form, perm }, docs);

  const address = (a) => [a.line1, a.line2, a.city, a.state, a.pin, a.country].filter(Boolean).join(', ');
  const uploaded = (f) => (f ? 'Uploaded' : 'Not uploaded');

  return (
    <section className={`${dash.card} ${styles.formCard}`} ref={topRef}>
      <h2 className={dash.sectionTitle}>New Student Admission</h2>

      <ol className={styles.stepper}>
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? styles.stepActive : ''}>
            <button type="button" disabled={i >= step} onClick={() => jump(i)} aria-current={i === step ? 'step' : undefined}>
              <span className={styles.stepBar} />
              <span className={styles.stepLabel}>{label}</span>
            </button>
          </li>
        ))}
      </ol>

      <p className={styles.stepCount}>Step {step + 1} of {STEPS.length}</p>

      {step === 0 && (
        <>
          <h3 className={styles.stepTitle}>Basic Information</h3>
          <p className={styles.stepHint}>Enter the personal details of the student</p>
          <div className={styles.grid}>
            <Input label="Student Name" required placeholder="Enter Full Name" value={form.name} onChange={set('name')} error={errors.name} />
            <DateInput label="Date of Birth" required max={todayLocal()} value={form.dob} onChange={set('dob')} error={errors.dob} />
            <Dropdown label="Gender" options={GENDERS} placeholder="Select Gender" value={form.gender} onChange={set('gender')} />
            <Dropdown label="Blood Group" options={BLOOD_GROUPS} placeholder="Select Blood Group" value={form.blood} onChange={set('blood')} />
          </div>
          <PhotoUpload file={form.photo} onChange={set('photo')} />
        </>
      )}

      {step === 1 && (
        <>
          <h3 className={styles.stepTitle}>Academic Information</h3>
          <p className={styles.stepHint}>Enter the academic details of the student</p>
          <div className={styles.grid}>
            <Input label="Admission Number" required placeholder="Enter Admission Number" value={form.admissionNo} onChange={set('admissionNo')} error={errors.admissionNo} />
            <Dropdown label="Class" required options={CLASSES} placeholder="Select Class" value={form.cls} onChange={set('cls')} error={errors.cls} />
            <Dropdown label="Section" required options={SECTIONS} placeholder="Select Section" value={form.section} onChange={set('section')} error={errors.section} />
            <DateInput label="Admission Date" required value={form.admissionDate} onChange={set('admissionDate')} error={errors.admissionDate} />
            <Input className={styles.span2} label="Previous School" placeholder="Enter previous school name" value={form.prevSchool} onChange={set('prevSchool')} />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className={styles.stepTitle}>Parent Details</h3>
          <p className={styles.stepHint}>Enter the parents details of the student</p>
          <ParentFields title="Father’s Details" group="father" who="Father’s" values={form.father} setIn={setIn} errors={errors} />
          <ParentFields title="Mother’s Details" group="mother" who="Mother’s" values={form.mother} setIn={setIn} errors={errors} />
          <AddressFields title="Current Address" group="cur" values={form.cur} setIn={setIn} errors={errors} />
          <AddressFields
            title="Permanent Address"
            group="perm"
            values={perm}
            setIn={setIn}
            errors={errors}
            disabled={form.sameAddr}
            aside={(
              <label className={styles.checkRow}>
                <input type="checkbox" className={styles.check} checked={form.sameAddr} onChange={(e) => set('sameAddr')(e.target.checked)} />
                Same as current address
              </label>
            )}
          />
        </>
      )}

      {step === 3 && (
        <>
          <h3 className={styles.stepTitle}>Upload Documents</h3>
          <p className={styles.stepHint}>Upload the necessary documents</p>
          <div className={styles.docGrid}>
            {DOC_FIELDS.map((d) => (
              <DocCard
                key={d.key}
                label={d.label}
                file={docs[d.key]}
                onPick={(f) => setDocs((p) => ({ ...p, [d.key]: f }))}
                onRemove={() => setDocs((p) => ({ ...p, [d.key]: null }))}
              />
            ))}
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h3 className={styles.stepTitle}>Review Details</h3>
          <p className={styles.stepHint}>Recheck the given details</p>
          <ReviewCard title="Basic Information" onEdit={() => jump(0)} rows={[
            ['Student name', form.name], ['Gender', form.gender], ['Blood group', form.blood],
            ['DOB', formatDate(form.dob)], ['Passport size photo', uploaded(form.photo)],
          ]} />
          <ReviewCard title="Academic Information" onEdit={() => jump(1)} rows={[
            ['Admission number', form.admissionNo], ['Class', form.cls], ['Section', form.section],
            ['Admission date', formatDate(form.admissionDate)], ['Previous school', form.prevSchool],
          ]} />
          <ReviewCard title="Parent Details" onEdit={() => jump(2)} rows={[
            ['Father name', form.father.name], ['Mobile number', form.father.mobile], ['Email ID', form.father.email], ['Occupation', form.father.occupation],
            ['Mother name', form.mother.name], ['Mobile number ', form.mother.mobile], ['Email ID ', form.mother.email], ['Occupation ', form.mother.occupation],
            ['Current address', address(form.cur)], ['Permanent address', address(perm)],
          ]} />
          <ReviewCard title="Documents" onEdit={() => jump(3)} rows={DOC_FIELDS.map((d) => [d.label, uploaded(docs[d.key])])} />
        </>
      )}

      <div className={styles.formActions}>
        {step === 0
          ? <button type="button" className={dash.btn} onClick={onCancel}>Cancel</button>
          : <button type="button" className={dash.btn} onClick={back}>Previous</button>}
        {step < STEPS.length - 1
          ? <button type="button" className={dash.btn} onClick={next}>Save &amp; Next</button>
          : <button type="button" className={dash.btn} onClick={submit}>Submit Admission</button>}
      </div>
    </section>
  );
}

/* ---------- profile views: dummy data (replace with API data) ---------- */

const DEMO_PROFILE = (id) => ({
  id, name: 'Aarav Sharma', roll: 1, admissionNo: `2025/${id}`, cls: 'X', section: 'A',
  teacher: 'Ms. Priya Kapoor', blood: 'O+', phone: '9876543210', email: 'aarav.sharma@example.com',
  address: '123 Green Avenue, Delhi, India', photo: '', active: true,
  stats: { avg: '82%', rank: '5/40', subjects: '6', high: '95%', highSub: 'Mathematics', att: '92%' },
  parent: { father: 'Mr. Rajesh Sharma', mother: 'Mrs. Neha Sharma', phone: '9876543210', email: 'rajesh.sharma@example.com', rel: 'Father' },
  history: { dob: 'Apr 12, 2010', admitted: 'Apr 5, 2025', prev: "St. John's School", rte: 'No', category: 'General' },
  present: 83, absent: 7,
});

// merges the clicked list row into the demo profile
const buildStudent = (b) => {
  const d = DEMO_PROFILE(b.id);
  return {
    ...d, name: b.name, cls: b.cls, section: b.section, teacher: b.teacher, phone: b.phone, photo: b.photo,
    parent: { ...d.parent, father: `Mr. ${b.parent}`, phone: b.phone },
  };
};

const SUBJECTS = [
  ['Mathematics', 88, 92, 90, 95], ['Science', 70, 75, 65, 62], ['English', 85, 80, 78, 82],
  ['Social Studies', 90, 88, 85, 92], ['Hindi', 78, 82, 80, 85], ['Computer', 95, 92, 90, 93],
];
const average = (r) => Math.round(r.slice(1).reduce((a, b) => a + b, 0) / 4);
const grade = (n) => (n >= 85 ? 'A+' : n >= 75 ? 'A' : n >= 60 ? 'B' : 'C');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  .map((m, i) => (i < 7 ? { m: `${m}, 2026`, p: 28, a: 2, l: 1, pct: '95%' } : { m: `${m}, 2026`, p: '00', a: '00', l: '00', pct: '00' }));

const FEES = Array.from({ length: 12 }, (_, i) => ({
  date: `05.${String(i + 1).padStart(2, '0')}.2026`, amount: i < 4 ? '10,000' : '00', paid: i < 4,
}));

const ACTIVITY = [
  ...Array(4).fill({ t: 'Attendance Marked Present', d: 'Attendance was marked', hi: true }),
  ...Array(4).fill({ t: 'Assignment Submitted', d: 'Science project report uploaded' }),
  ...Array(4).fill({ t: 'Quiz Completed', d: 'Scored 18/20' }),
].map((a, i) => ({ ...a, id: i, date: '08/21/2026' }));

const DOCS = [
  { key: 'birth', label: 'Birth Certificate', file: 'birth-certificate.pdf', size: '1.5 mb' },
  { key: 'aadhaar', label: 'Aadhar card', file: 'aadhar.pdf', size: '1.5 mb' },
  { key: 'other', label: 'Other Documents', file: 'other-docs.pdf', size: '1.5 mb' },
  { key: 'tc', label: 'Transfer Certificate (TC)', file: 'TC.pdf', size: '1.5 mb' },
];

const PROFILE_TITLES = { profile: 'Student Profile', attendance: 'Student Attendance', documents: 'Student Documents', activity: 'Student Activity Log' };

function useMedia(q) {
  const [v, setV] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const f = () => setV(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [q]);
  return v;
}

/* ---------- small blocks ---------- */

const Row = ({ k, v }) => <p className={pf.row}><span>{k}</span><span className={pf.colon}>:</span><span>{v}</span></p>;

function Card({ title, action, children, className = '' }) {
  return (
    <section className={`${dash.card} ${pf.card} ${className}`}>
      <header className={pf.cardHead}>
        <h2 className={dash.sectionTitle}>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

const Btn = ({ children, ...p }) => <button type="button" className={dash.btn} {...p}>{children}</button>;

/* ---------- profile ---------- */

function Profile({ st, go }) {
  const [opts, setOpts] = useState(false);
  const actions = [
    { label: 'Promote Student', run: () => go('promote') },
    { label: 'Message Parent', run: () => { /* TODO */ } },
    { label: 'View Legal Documents', run: () => go('documents') },
  ];
  const stat = [
    ['Overall Average', st.stats.avg, 'This term.'], ['Class Rank', st.stats.rank, 'This Term.'],
    ['Total Subjects', st.stats.subjects, 'This Term.'], ['Highest Score', st.stats.high, st.stats.highSub],
    ['Attendance', st.stats.att, 'This Term.'],
  ];
  const pct = Math.round((st.present / (st.present + st.absent)) * 100);

  return (
    <>
      <div className={pf.actionsRow}>
        <div className={pf.actionsWide}>{actions.map((a) => <Btn key={a.label} onClick={a.run}>{a.label}</Btn>)}</div>
        <div className={`${dash.optionsWrap} ${pf.actionsNarrow}`}>
          <button type="button" className={`${dash.btn} ${dash.btnIcon}`} aria-expanded={opts} onClick={() => setOpts((o) => !o)}>
            Options <ChevronDown size={18} aria-hidden="true" />
          </button>
          {opts && (
            <div className={dash.menu} role="menu">
              {actions.map((a) => <button key={a.label} role="menuitem" onClick={() => { setOpts(false); a.run(); }}>{a.label}</button>)}
            </div>
          )}
        </div>
      </div>

      <section className={`${dash.card} ${pf.hero}`}>
        {st.photo ? <img className={pf.photo} src={st.photo} alt="" /> : <span className={pf.photo} aria-hidden="true" />}
        <div className={pf.heroBody}>
          <h2 className={pf.name}>{st.name}{st.active && <i className={pf.dot} title="Active" />}</h2>
          <div className={pf.info}>
            <div><Row k="Roll No." v={st.roll} /><Row k="Admission No." v={st.admissionNo} /><Row k="Class" v={st.cls} /></div>
            <div><Row k="Section" v={st.section} /><Row k="Class Teacher" v={st.teacher} /><Row k="Blood Group" v={st.blood} /></div>
            <div className={pf.contact}>
              <p className={pf.contactLabel}>Contact</p>
              <p>{st.phone}</p><p>{st.email}</p><p>{st.address}</p>
            </div>
          </div>
        </div>
      </section>

      <div className={pf.stats}>
        {stat.map(([k, v, n]) => (
          <div key={k} className={`${dash.card} ${pf.stat}`}>
            <p className={pf.statLabel}>{k}</p><p className={pf.statValue}>{v}</p><p className={pf.statNote}>{n}</p>
          </div>
        ))}
      </div>

      <div className={pf.trio}>
        <Card title="Parent / Guardian Details">
          <Row k="Father Name" v={st.parent.father} /><Row k="Mother Name" v={st.parent.mother} />
          <Row k="Parent Phone" v={st.parent.phone} /><Row k="Parent Email" v={st.parent.email} /><Row k="Relationship" v={st.parent.rel} />
        </Card>
        <Card title={<><span className={pf.deskOnly}>Student History</span><span className={pf.mobOnly}>Academic Details</span></>}>
          <Row k="Date of Birth" v={st.history.dob} /><Row k="Admission Date" v={st.history.admitted} />
          <Row k="Previous School" v={st.history.prev} /><Row k="RTE" v={st.history.rte} /><Row k="Student Category" v={st.history.category} />
        </Card>
        <Card title="Attendance Summary" className={pf.attCard} action={<Btn onClick={() => go('attendance')}>View Details</Btn>}>
          <div className={pf.attBody}>
            <div className={pf.donut} style={{ background: `conic-gradient(var(--lime) 0 ${pct}%, var(--mint-400) 0)` }}>
              <span>{pct}%</span>
            </div>
            <ul className={pf.legend}>
              <li><i style={{ background: 'var(--lime)' }} />Present <b>{st.present} Days ({pct}%)</b></li>
              <li><i style={{ background: 'var(--mint-400)' }} />Absent <b>{st.absent} Days ({100 - pct}%)</b></li>
            </ul>
          </div>
        </Card>
      </div>

      <Card title="Academic Report" action={<Btn>Export</Btn>}>
        <div className={pf.tableWrap}>
          <table className={pf.table}>
            <thead><tr>{['Subject', 'Assessment 1', 'Assessment 2', 'Mid Term', 'Final Term', 'Average', 'Grade'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {SUBJECTS.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>{r.slice(1).map((n, i) => <td key={i}>{n}%</td>)}
                  <td>{average(r)}%</td><td>{grade(average(r))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className={pf.pair}>
        <Card title="Activity Log" action={<Btn onClick={() => go('activity')}>View More</Btn>} />
        <Card title="Assignment" action={<Btn>View More</Btn>} />
      </div>
    </>
  );
}

/* ---------- attendance ---------- */

function AttendanceView() {
  const wide = useMedia('(min-width: 1024px)');
  const now = new Date();
  const [cur, setCur] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const start = wide ? 1 : 0;
  const names = (wide ? ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
  const lead = (new Date(cur.y, cur.m, 1).getDay() - start + 7) % 7;
  const count = new Date(cur.y, cur.m + 1, 0).getDate();
  const move = (n) => setCur((c) => { const d = new Date(c.y, c.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });

  // TODO: replace with API attendance for this month
  const status = (d) => {
    const date = new Date(cur.y, cur.m, d);
    if (date.getDay() % 6 === 0 || date > now) return '';
    if (date.toDateString() === now.toDateString()) return 'today';
    if (d % 13 === 5) return 'absent';
    if (d % 9 === 4) return 'leave';
    return 'present';
  };

  return (
    <div className={pf.attGrid}>
      <Card title="Calendar">
        <div className={pf.cal}>
          <div className={pf.calNav}>
            <button type="button" onClick={() => move(-1)} aria-label="Previous month"><ChevronLeft size={20} /></button>
            <span>{MONTHS[cur.m].slice(0, 20)}, {cur.y}</span>
            <button type="button" onClick={() => move(1)} aria-label="Next month"><ChevronRight size={20} /></button>
          </div>
          <div className={pf.calGrid}>
            {names.map((n) => <span key={n} className={pf.calHead}>{n}</span>)}
            {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: count }, (_, i) => <span key={i} className={`${pf.day} ${pf[status(i + 1)] || ''}`}>{i + 1}</span>)}
          </div>
          <ul className={pf.calLegend}>
            {[['present', 'Present'], ['absent', 'Absent'], ['leave', 'Leave'], ['today', 'Today']].map(([k, l]) => <li key={k}><i className={pf[k]} />{l}</li>)}
          </ul>
        </div>
      </Card>
      <Card title={<><span className={pf.deskOnly}>Academic Report</span><span className={pf.mobOnly}>Attendance Report</span></>} action={<Btn>Download</Btn>}>
        <div className={pf.tableWrap}>
          <table className={pf.table}>
            <thead><tr><th>Month</th><th>Present</th><th>Absent</th><th>Late</th><th>Attendance</th></tr></thead>
            <tbody>{MONTHS.map((r) => <tr key={r.m}><td>{r.m}</td><td>{r.p}</td><td>{r.a}</td><td>{r.l}</td><td>{r.pct}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- documents ---------- */

function DocPreview({ doc, onClose }) {
  const [page, setPage] = useState(0);
  const total = 2; // TODO: page count from file
  useEffect(() => {
    const f = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [onClose]);
  return (
    <div className={pf.overlay} onClick={onClose}>
      <div className={pf.modal} role="dialog" aria-modal="true" aria-label={doc.label} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={pf.close} onClick={onClose} aria-label="Close preview"><X size={20} /></button>
        <div className={pf.slide}>
          <span className={pf.slideCount}>{page + 1}/{total}</span>
          <span>Image</span>
          <div className={pf.dots}>
            {Array.from({ length: total }, (_, i) => (
              <button key={i} type="button" aria-label={`Page ${i + 1}`} className={i === page ? pf.dotOn : ''} onClick={() => setPage(i)} />
            ))}
          </div>
        </div>
        <div className={pf.modalFoot}>
          <FileText size={28} aria-hidden="true" />
          <div className={pf.grow}><p className={pf.fileName}>{doc.file} - 1MB</p><p className={pf.fileSize}>Uploaded on Jun 20,2021</p></div>
          <Btn onClick={() => window.print()}>Print</Btn>
          <Btn>Download</Btn>
        </div>
      </div>
    </div>
  );
}

function DocumentsView() {
  const [open, setOpen] = useState(null);
  return (
    <Card title="Documents">
      <div className={pf.docGrid}>
        {DOCS.map((d) => (
          <div key={d.key} className={pf.docCard}>
            <h3 className={pf.docTitle}>{d.label}</h3>
            <div className={pf.docThumb} />
            <div className={pf.docMeta}>
              <FileText size={28} aria-hidden="true" />
              <div><p className={pf.fileName}>{d.file}</p><p className={pf.fileSize}>{d.size}</p></div>
            </div>
            <div className={pf.docBtns}><Btn onClick={() => setOpen(d)}>Preview</Btn><Btn>Download</Btn></div>
          </div>
        ))}
      </div>
      {open && <DocPreview doc={open} onClose={() => setOpen(null)} />}
    </Card>
  );
}

/* ---------- activity + fees ---------- */

function ActivityView() {
  const [tab, setTab] = useState('log');
  const [range, setRange] = useState('week');
  const paid = FEES.filter((f) => f.paid).length * 10000;
  const total = 120000;
  const sums = [
    ['Total Fees', total.toLocaleString('en-IN'), 'For Academic Year 2026-27'],
    ['Paid', paid.toLocaleString('en-IN'), `${Math.round((paid / total) * 100)}% paid of total fees`],
    ['Pending', (total - paid).toLocaleString('en-IN'), `${Math.round(((total - paid) / total) * 100)}% pending of total fees`],
  ];
  return (
    <>
      <div className={pf.tabs} role="tablist">
        {[['log', 'Activity Log'], ['fees', 'Fees History']].map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? pf.tabOn : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'log' ? (
        <Card title="Activity Log" action={(
          <label className={`${dash.select} ${dash.selectPlain}`}>
            <span className={dash.srOnly}>Period</span>
            <select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="week">Last 1 Week</option><option value="month">Last 1 Month</option><option value="term">This Term</option>
            </select>
            <ChevronDown size={18} aria-hidden="true" />
          </label>
        )}>
          <ul className={pf.log}>
            {ACTIVITY.map((a) => (
              <li key={a.id} className={a.hi ? pf.logHi : ''}>
                <div><p className={pf.logTitle}>{a.t}</p><p className={pf.logDesc}>{a.d}</p></div>
                <time className={pf.logDate}>{a.date}</time>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <>
          <div className={pf.feeSums}>
            {sums.map(([k, v, n]) => (
              <div key={k} className={`${dash.card} ${pf.feeSum}`}>
                <span className={pf.feeIcon} aria-hidden="true" />
                <div><p className={pf.statLabel}>{k}</p><p className={pf.statValue}>{v}</p><p className={pf.statNote}>{n}</p></div>
              </div>
            ))}
          </div>
          <Card title="Fees History">
            <div className={pf.tableWrap + ' ' + pf.feeTable}>
              <table className={pf.table}>
                <thead><tr><th>Date</th><th>Amount</th><th>Status</th><th>Receipt</th></tr></thead>
                <tbody>
                  {FEES.map((f) => (
                    <tr key={f.date}>
                      <td>{f.date}</td><td>{f.amount}</td>
                      <td className={f.paid ? pf.paid : pf.pending}>{f.paid ? 'Paid' : 'Pending'}</td>
                      <td><button type="button" className={pf.viewBtn}>Download</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className={pf.feeList}>
              {FEES.map((f) => (
                <li key={f.date}>
                  <div><p className={pf.logTitle}>{f.date}</p><p className={pf.logDesc}>Amount - {f.amount.replace(',', '')} • <span className={f.paid ? pf.paid : pf.pending}>{f.paid ? 'Paid' : 'Pending'}</span></p></div>
                  <button type="button" className={pf.feeBtn}>Download</button>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </>
  );
}


/* ---------- page ---------- */

const TITLES = { list: 'Student Profile', promote: 'Promote Student', add: 'Student Admission', ...PROFILE_TITLES };
const DETAIL_VIEWS = ['profile', 'attendance', 'documents', 'activity'];

export default function Student() {
  const [params] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState(params.get('view') === 'add' ? 'add' : 'list');
  const [studentId, setStudentId] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(''), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  const show = (v, msg = '') => { setView(v); setNotice(msg); window.scrollTo({ top: 0 }); };
  const openProfile = (id) => { setStudentId(id); show('profile'); };
  const student = STUDENTS.find((x) => x.id === studentId);
  const detailBack = () => show(view === 'profile' ? 'list' : 'profile');

  const promoteAll = () => {
    if (!window.confirm(`Promote all ${STUDENTS.length} students to the next class? This changes every student record.`)) return;
    // TODO: POST /students/promote-all
    setNotice('All students were sent for promotion.');
  };

  const submitAdmission = (form, docs) => {
    // TODO: POST multipart/form-data { ...form, photo: form.photo, documents: docs }
    show('list', `Admission saved for ${form.name}.`);
  };

  return (
    <div className={dash.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={dash.page}>
        <Topbar title={TITLES[view]} subtitle="Academic Year 2025 - 26" onMenuClick={() => setMenuOpen(true)} />

        {notice && <p className={styles.notice} role="status">{notice}</p>}

        {view === 'list' && (
          <StudentList
            initialQuery={params.get('search') || ''}
            onPromoteAll={promoteAll}
            onPromoteManual={() => show('promote')}
            onAdd={() => show('add')}
            onView={openProfile}
          />
        )}

        {view === 'promote' && (
          <PromoteStudents
            onBack={() => show('list')}
            onDone={(count, target) => show('list', `${count} student${count > 1 ? 's' : ''} promoted to Class ${target}.`)}
          />
        )}

        {view === 'add' && (
          <AdmissionForm onCancel={() => show('list')} onSubmit={submitAdmission} />
        )}

        {DETAIL_VIEWS.includes(view) && student && (
          <>
            <button type="button" className={pf.back} onClick={detailBack} aria-label="Back"><ArrowLeft size={24} /></button>
            {view === 'profile' && <Profile st={buildStudent(student)} go={show} />}
            {view === 'attendance' && <AttendanceView />}
            {view === 'documents' && <DocumentsView />}
            {view === 'activity' && <ActivityView />}
          </>
        )}
      </main>
    </div>
  );
}